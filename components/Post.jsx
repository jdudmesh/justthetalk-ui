// This file is part of the JUSTtheTalkUI distribution (https://github.com/jdudmesh/justthetalk-ui).
// Copyright (c) 2021 John Dudmesh.

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, version 3.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
// General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'

import { useDispatch, useSelector } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, IconButton, Tooltip, Menu, MenuItem, Divider } from '@material-ui/core'
import ListItemIcon from '@material-ui/core/ListItemIcon';

import Typography from '@material-ui/core/Typography';

import { format, formatDistanceToNow, parseISO, add, isFuture, isAfter } from 'date-fns'

import ReportIcon from '@material-ui/icons/Report';
import EditIcon from '@material-ui/icons/Edit';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import BlockIcon from '@material-ui/icons/Block';
import Build from '@material-ui/icons/Build';
import Chip from '@material-ui/core/Chip';

import { useMediaQuery } from "react-responsive";

import { Alert } from "./Alert";
import { UserLink } from "./UserLink";
import { PostReport } from "./PostReport";
import { PostComment } from "./PostComment";
import { ConfirmationDialog } from "./ConfirmationDialog";


import styles from '../styles/Post.module.scss'

import { selectUser } from '../redux/userSlice';
import { ignoreUser } from '../redux/userActions';
import { blockUserFromDiscussion, adminDeletePost } from '../redux/adminActions';

import { htmlDecode } from "../lib/utils";

import { editPost, deletePost } from "../redux/postActions";
import { selectHighlightedPost, setHighlightedPost } from "../redux/postSlice";

import { fetchPostReportsAPI, fetchPostCommentsAPI, createAdminCommentAPI } from "../api";

import {STATUS_OK, STATUS_SUSPENDED_BY_ADMIN, STATUS_DELETED_BY_ADMIN, STATUS_POSTED_BY_NOTTHETALK, STATUS_DELETED_BY_USER, STATUS_WATCH} from "../redux/constants";

const VOTE_KEEP = 1
const VOTE_DELETE = -1

const useStyles = makeStyles({
    root: {
        minWidth: 30,
    },
});

export function Post({post, discussion, blockedUsers, onReport, readOnly}) {

    const dispatch = useDispatch();
    const classes = useStyles();

    const currentUser = useSelector(selectUser);
    const highlightedPost = useSelector(selectHighlightedPost)

    const [anchorEl, setAnchorEl] = useState(null);
    const [isHighlight, setIsHighlight] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [displayFullDate, setDisplayFullDate] = useState(false);

    const [postReports, setPostReports] = useState([]);
    const [postComments, setPostComments] = useState([]);
    const [moderationComment, setModerationComment] = useState("");

    const [messageText, setMessageText] = useState("");
    const [messageError, setMessageError] = useState("");

    const [confirmationParams, setConfirmationParams] = useState({open: false, title: "", text: "", onClose: null });

    const postDate = useMemo(() => parseISO(post.createdDate), [post]);
    const editDate = useMemo(() => parseISO(post.lastEditDate), [post]);
    const isInEditWindow = useMemo(() => isFuture(add(postDate, {minutes: 30})), [post]);

    const isWidth800 = useMediaQuery({ query: "(min-width: 800px)" });
    const buttonSize = isWidth800 ? "small" : "medium";

    useEffect(() => {
        if(currentUser && currentUser.isAdmin && post && post.moderationScore > 0) {
            fetchPostReportsAPI({ id: post.discussionId }, post).then((res) => {
                setPostReports(res.data.data);
            }).catch(() => {

            })
            fetchPostCommentsAPI({ id: post.discussionId }, post).then((res) => {
                setPostComments(res.data.data);
            }).catch(() => {

            })
        }
    }, [currentUser, post]);

    useEffect(() => {
        if(highlightedPost && highlightedPost.id === post.id) {
            setIsHighlight(true);
        } else {
            setIsHighlight(false);
        }
    }, [highlightedPost]);

    const onEditPost = () => {
        setMessageText(htmlDecode(post.text));
        setMessageError("");
        setEditMode(true);
    }

    const onCancelEdit = () => {
        setMessageText(htmlDecode(post.text));
        setMessageError("");
        setEditMode(false);
    }

    const onEndEdit = () => {
        if(messageText.length == 0) {
            setMessageError("You must enter some text or cancel and delete the post");
        } else {
            dispatch(editPost(discussion, { id: post.id, text: messageText}));
            setEditMode(false);
        }
    }

    const onChangeMessage = (ev) => {
        setMessageText(ev.target.value);
        if(ev.target.value.length > 0) {
            setMessageError("");
        }
    }

    const onDeletePost = () => {
        setConfirmationParams({
            open: true,
            title: "Delete post",
            text: "Are you sure you want to delete this post?",
            onClose: (confirmed) => {
                setConfirmationParams({open: false});
                if(confirmed) {
                    dispatch(deletePost(discussion, post));
                }
            }
        });
    }

    const onIgnoreUser = () => {
        setConfirmationParams({
            open: true,
            title: "Ignore user",
            text: `Are you sure you want to ignore ${post.createdByUsername}?`,
            onClose: (confirmed) => {
                setConfirmationParams({open: false});
                if(confirmed) {
                    dispatch(ignoreUser(post.createdByUserId, true));
                }
            }
        });
    }

    const onAdminBlockUser = () => {
        dispatch(blockUserFromDiscussion(discussion, post.createdByUserId, !blockedUsers[post.createdByUserId]));
        setAnchorEl(null);
    }

    const onAdminDeletePost = () => {
        if(post.status === STATUS_DELETED_BY_ADMIN) {
            dispatch(adminDeletePost(post, false));
        } else {
            dispatch(adminDeletePost(post, true));
        }
        setAnchorEl(null);
    }

    const onMouseOver = () => {
        if(readOnly) {
            return;
        }
        setIsHighlight(true);
    }

    const onMouseOut = () => {
        if(readOnly) {
            return;
        }
        setIsHighlight(false);
    }

    const onTouchStart = () => {
        if(highlightedPost) {
            dispatch(setHighlightedPost(null));
        } else {
            dispatch(setHighlightedPost(post));
        }
    }

    const onClickPostDate = () => {
        setDisplayFullDate(!displayFullDate);
    }

    const onVote = (vote) => {
        let comment = {
            discussionId: post.discussionId,
            postId: post.id,
            vote: vote,
            body: moderationComment
        };
        createAdminCommentAPI(comment).then((res) => {
            setPostComments([...res.data.data]);
            setModerationComment("");
        }).catch(() => {

        });
    }

    const onChangeModerationComment = (ev) => {
        setModerationComment(ev.target.value);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const postBody = () => {
        return { __html: post.markup }
    }

    const renderAdminChips = () => {
        if(currentUser && currentUser.isAdmin) {
            return (<>
                { post.status == STATUS_SUSPENDED_BY_ADMIN ? <Chip label="Premoderate" size="small" color="secondary" className={styles.adminChip}></Chip> : <></> }
                { post.status == STATUS_DELETED_BY_ADMIN ? <Chip label="Deleted by admin" size="small" color="secondary" className={styles.adminChip}></Chip> : <></> }
                { post.status == STATUS_POSTED_BY_NOTTHETALK ? <Chip label="Posted by admin" size="small" color="secondary" className={styles.adminChip}></Chip> : <></> }
                { post.status == STATUS_DELETED_BY_USER ? <Chip label="Deleted by user" size="small" color="secondary" className={styles.adminChip}></Chip> : <></> }
                { post.moderationScore > 0 ? <Chip label={`Mod score: ${post.moderationScore.toFixed(2)}`} size="small" color="secondary" className={styles.adminChip}></Chip> : <></> }

                { post.createdByLocked ? <Chip label="User locked" size="small" color="secondary" className={styles.adminChip}></Chip> : <></> }
                { post.createdByWatch ? <Chip label="Watch user" size="small" color="secondary" className={styles.adminChip}></Chip> : <></> }

                { blockedUsers && blockedUsers[post.createdByUserId] ? <Chip label="Blocked" size="small" color="secondary" className={styles.adminChip}></Chip> : <></> }
                { currentUser.ignoredUsers[post.createdByUserId] ? <Chip label="Ignored" size="small" color="secondary" className={styles.adminChip}></Chip> : <></> }

            </>);
        }
    }

    const renderPostBody = () => {
        return <>
            { renderAdminChips() }
            <Typography component="div" variant="body1" display="block" gutterBottom>
                <div className={[styles.postBody, "postBody"].join(" ")} dangerouslySetInnerHTML={postBody()}></div>
            </Typography>
        </>;
    }

    const renderEditPost = () => {
        return (<div className={styles.editPost}>
                <TextField multiline rows={10} variant="outlined" fullWidth error={Boolean(messageError.length)} label="Write your reply here..." value={messageText} onChange={onChangeMessage} inputProps={{"data-test-id": "edit-post-text"}}></TextField>
                { messageError.length > 0 ? (<div className={styles.messageError}>{messageError}</div>) : (<></>) }
                <div className={styles.postButton}>
                    <Button variant="contained" color="primary" onClick={onEndEdit} data-test-id="edit-post-save">Update</Button>
                    <Button variant="outlined" color="primary" onClick={onCancelEdit}>Cancel</Button>
                </div>
        </div>)
    }

    const ignoreUserButtonDisabled = (currentUser && (currentUser.id === post.createdByUserId || currentUser.ignoredUsers[post.createdByUserId])) || post.createdByUserId == 1;

    const renderLeftButtons = () => {

        return <div className={styles.buttonBarLeft}>

            <Tooltip title="Report post" onClick={() => onReport && onReport(post)} aria-label="report post"><IconButton size={buttonSize} color="primary" data-test-id="report-post"><ReportIcon/></IconButton></Tooltip>

            { currentUser
                ? <>

                    { ignoreUserButtonDisabled
                        ? <IconButton onClick={onIgnoreUser} disabled size={buttonSize} color="primary"><VisibilityIcon/></IconButton>
                        : <Tooltip title="Ignore user" onClick={onIgnoreUser} aria-label="ignore user"><IconButton onClick={onIgnoreUser} size={buttonSize} color="primary" data-test-id="ignore-user"><VisibilityOffIcon/></IconButton></Tooltip>
                    }


                    { currentUser.id == post.createdByUserId && (post.status == STATUS_OK || post.status == STATUS_WATCH)
                        ? <>
                            { isInEditWindow ? <Tooltip title="Edit post" aria-label="Edit post"><IconButton size={buttonSize} color="primary" onClick={onEditPost} data-test-id="edit-post"><EditIcon/></IconButton></Tooltip> : <></> }
                            <Tooltip title="Delete post" aria-label="Delete post"><IconButton size={buttonSize} color="primary" onClick={onDeletePost} data-test-id="delete-post"><DeleteIcon/></IconButton></Tooltip>
                        </>
                        : <></>
                    }

                </>
                : <></> }

        </div>

    }

    const renderRightButtons = () => {

        if(!(currentUser && currentUser.isAdmin)) {
            return <></>
        }

        let menuItems = [
            <MenuItem key={0} dense={true} onClick={onAdminBlockUser}><ListItemIcon className={classes.root}><BlockIcon /></ListItemIcon>{ blockedUsers && blockedUsers[post.createdByUserId] ? "Unblock user" : "Block user"}</MenuItem>,
            <MenuItem key={1} dense={true} onClick={onAdminDeletePost}><ListItemIcon className={classes.root}><DeleteForeverIcon /></ListItemIcon>{ post.status == STATUS_DELETED_BY_ADMIN ? "Admin undelete" : "Admin delete"}</MenuItem>
        ];

        return <div className={styles.buttonBarRight}>
            <Tooltip title="Admin" aria-label="Admin"><IconButton color="primary" size={buttonSize} onClick={handleClick}><Build /></IconButton></Tooltip>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                { menuItems }
            </Menu>
        </div>

    }

    const renderReports = () => {

        if(!(currentUser && currentUser.isAdmin && postReports.length > 0)) {
            return;
        }

        let hasAlreadyCommented = postComments.some(x => x.userId === currentUser.id);

        return <div className={styles.postReports}>

            <div className={styles.postReports}>
                <Typography variant="subtitle2" display="block" gutterBottom>Reports</Typography>
                { postReports.map( (report, ix) => <PostReport report={report} key={ix} />) }
            </div>

            { postComments.length > 0
                ?   <div className={styles.postReports}>
                        <Typography variant="subtitle2" display="block" gutterBottom>Comments</Typography>
                        { postComments.map( (comment, ix) => <PostComment comment={comment} key={ix} />) }
                    </div>
                : <></>
            }

            <div className={styles.postCommentBox}>
                <div className={styles.postCommentText}>
                    <TextField
                        disabled={hasAlreadyCommented}
                        label="Moderation Comment"
                        value={moderationComment}
                        onChange={onChangeModerationComment}
                        variant="outlined"
                        size="small"
                        fullWidth
                    />
                </div>
                <div className={styles.postCommentButtons}>
                    <Button onClick={() => onVote(VOTE_DELETE)} color="secondary" variant="contained" size="medium" disabled={hasAlreadyCommented || moderationComment.length === 0}>Delete</Button>
                    <Button onClick={() => onVote(VOTE_KEEP)} color="primary" variant="contained" size="medium" disabled={hasAlreadyCommented || moderationComment.length === 0}>Keep</Button>
                </div>
            </div>
        </div>

    }

    const renderPost = () => {

        return <div id={`post_${post.id}`} className={[styles.postContainer, "post"].join(" ")} onMouseOver={onMouseOver} onMouseOut={onMouseOut} style={{backgroundColor: isHighlight ? "#f5f5f5" : "inherit"}}>

            <div onTouchStart={onTouchStart}>
                <div className={styles.headerRow}>
                    <Typography variant="overline" display="block" gutterBottom>
                        <UserLink userId={post.createdByUserId} username={post.createdByUsername} />
                        <span onClick={onClickPostDate} className={styles.postDate}>{displayFullDate ? ` - ${format(postDate, "d/M/yyyy H:mm")} ` : ` - ${formatDistanceToNow(postDate)} ago `}</span>
                        (<Link href={`${post.url}`} passHref><a data-test-id="post-num">#{post.postNum}</a></Link> of {discussion ? discussion.postCount : "?"})
                    </Typography>
                    { isAfter(editDate, postDate) ? <Tooltip title="Edited"><EditOutlinedIcon color="primary" className={styles.editedFlag} /></Tooltip> : <></> }
                </div>

                { editMode
                    ? renderEditPost()
                    : renderPostBody()
                }
            </div>

            <div className={styles.buttonBar} style={{visibility: (isHighlight && !editMode && !readOnly) ? "visible" : "hidden"}}>
                { renderLeftButtons() }
                { renderRightButtons() }
            </div>
            { renderReports() }
        </div>;

    }

    const renderByStatus = () => {
        if(currentUser && currentUser.isAdmin) {
            return renderPost();
        } else if(currentUser && currentUser.ignoredUsers[post.createdByUserId] && !currentUser.isAdmin) {
            return <div className={styles.deletedPost}><Alert severity="info" className={styles.userAlert}>Post by ignored user</Alert></div>;
        } else if(!post.createdByEnabled) {
            return <div className={styles.deletedPost}><Alert severity="info" className={styles.userAlert}>Post by deleted user</Alert></div>;
        } else {
            switch(post.status) {
                case STATUS_OK:
                    return renderPost();
                    break;
                case STATUS_SUSPENDED_BY_ADMIN:
                    return <div className={styles.deletedPost}><Alert severity="info" className={styles.userAlert}>Post pending moderation</Alert></div>;
                    break;
                case STATUS_DELETED_BY_ADMIN:
                    return <div className={styles.deletedPost}><Alert severity="info" className={styles.userAlert}>Deleted post</Alert></div>;
                    break;
                case STATUS_POSTED_BY_NOTTHETALK:
                    return renderPost();
                    break;
                case STATUS_WATCH:
                    return renderPost();
                    break;
                case STATUS_DELETED_BY_USER:
                    return <div className={styles.deletedPost}><Alert severity="info" className={styles.userAlert}>Deleted post</Alert></div>;
                    break;
                default:
                    return <div className={styles.deletedPost}><Alert severity="error" className={styles.userAlert}>Umm, you shouldn't be seeing this</Alert></div>;
                    break;

            }
        }
    }

    return <div data-test-id="post">
        {renderByStatus()}
        <ConfirmationDialog params={confirmationParams} />
    </div>

}

