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

import React, { useEffect, useState, useContext, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

import Typography from "@material-ui/core/Typography";
import { Paper, Button } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import AddAlertIcon from "@material-ui/icons/AddAlert";
import NotificationsOffIcon from "@material-ui/icons/NotificationsOff";
import Build from "@material-ui/icons/Build";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import MarkunreadMailboxIcon from "@material-ui/icons/MarkunreadMailbox";
import FolderIcon from "@material-ui/icons/Folder";

import { List, ListItem, ListItemIcon, ListItemText, ListItemAvatar, Avatar } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import PulseLoader from "react-spinners/PulseLoader";
import { useMediaQuery } from "react-responsive";

import { formatDistanceToNow } from "date-fns";

import { htmlDecode } from "../../../../lib/utils";

import { selectUser,
    selectCurrentFolder,
    selectCurrentDiscussion,
    selectPendingDiscussionUpdate,
    setMergePendingPosts,
} from "../../../../redux/userSlice";

import {
    setUserLocation,
    setDiscussionSubscriptionStatus,
    setDiscussionUnread,
    setCurrentDiscussionBookmark,
} from "../../../../redux/userActions";

import { selectFolders } from "../../../../redux/folderSlice";

import {
    deleteDiscussion,
} from "../../../../redux/discussionActions";

import {
    selectPostLoadingState,
    selectPostActionState,
    selectPosts,
    selectPostsPageSize,
} from "../../../../redux/postSlice";

import { fetchPosts, } from "../../../../redux/postActions";

import { selectBlockedUsers } from "../../../../redux/adminSlice";

import {
    lockDiscussion,
    premoderateDiscussion,
    adminDeleteDiscussion,
    moveDiscussion,
    fetchBlockedUsers,
} from "../../../../redux/adminActions";

import { LoadingState } from "../../../../redux/constants";

import MasterLayout from "../../../../layouts/master";
import { Post } from "../../../../components/Post";
import { AddPost } from "../../../../components/AddPost";
import { Paging } from "../../../../components/Paging";
import { Alert } from "../../../../components/Alert";
import { ActionButton } from "../../../../components/ActionButton";
import { CreateDiscussion } from "../../../../components/CreateDiscussion";
import { ReportPostDialog } from "../../../../components/ReportPostDialog";
import { UserLink } from "../../../../components/UserLink";

import styles from "../../../../styles/DiscussionView.module.scss";

import { compareFolders } from "../../../../lib/utils";

export default function DiscussionView(props) {

    const router = useRouter();

    const dispatch = useDispatch();

    const { folderKey, discussionId, postNum } = router.query;

    const [editDiscussion, setEditDiscussion] = useState();
    const [openDeleteDiscussionDialog, setOpenDeleteDiscussionDialog] = useState(false);
    const [openMoveDiscussionDialog, setOpenMoveDiscussionDialog] = useState(false);
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [debounceTime, setDebounceTime] = useState(0);

    const [reportedPost, setReportedPost] = useState(null);

    const folders = useSelector(selectFolders);
    const fetchPostsState = useSelector(selectPostLoadingState);
    const fetchPostActionState = useSelector(selectPostActionState);

    const currentUser = useSelector(selectUser);
    const currentFolder = useSelector(selectCurrentFolder);
    const currentDiscussion = useSelector(selectCurrentDiscussion);
    const pendingDicussionUpdateAvailable = useSelector(selectPendingDiscussionUpdate);
    const blockedUsers = useSelector(selectBlockedUsers);
    const pageSize = useSelector(selectPostsPageSize);
    const posts = useSelector(selectPosts);

    const containerRef = useRef();
    const pagingContainerRef = useRef();

    const isWidth800 = useMediaQuery({ query: "(min-width: 800px)" });

    useEffect(() => {
        if(folders.length > 0 && folderKey && discussionId) {
            dispatch(setUserLocation(folderKey, discussionId));
        }
    }, [folders, folderKey, discussionId]);

    useEffect(() => {

        if(currentFolder && currentDiscussion) {

            if(currentFolder.id !== currentDiscussion.folderId) {
                router.push(currentDiscussion.url);
            }

            if(currentUser && currentUser.isAdmin) {
                dispatch(fetchBlockedUsers(currentDiscussion));
            } else {
                if(currentDiscussion.status > 0) {
                    router.push(`/${currentFolder.key}`);
                }
            }

        }

    }, [currentFolder, currentDiscussion]);

    useEffect(() => {

        if(!currentDiscussion) {
            return;
        }

        if(pagingContainerRef.current) {
            pagingContainerRef.current.style.bottom = 0;
        }

        if(fetchPostsState === LoadingState.Pending) {
            if(postNum && postNum.length) {
                dispatch(fetchPosts(currentDiscussion, postNum[0]));
            } else {
                dispatch(fetchPosts(currentDiscussion));
            }
        }

    }, [currentDiscussion, postNum, fetchPostsState]);

    useEffect(() => {

        if(fetchPostsState !== LoadingState.Loaded) {
            return;
        }

        if(!(postNum && postNum.length > 0)) {
            return;
        }

        let nextPostNum = parseInt(postNum[0]);
        let post = posts.find(x => x.postNum === nextPostNum);
        if(!post) {
            dispatch(fetchPosts(currentDiscussion, nextPostNum));
        } else {
            if(!document.body.getAttribute("data-userscrollpending")) {
                let nextPostId = post.id;
                if (router.asPath.endsWith("#last")) {
                    nextPostId = posts[posts.length-1].id;
                }
                let scrollTo = document.getElementById(`post_${nextPostId}`);
                if(scrollTo) {
                    scrollTo.scrollIntoView();
                }
            }
            document.body.removeAttribute("data-userscrollpending");
        }

    }, [postNum, fetchPostsState]);

    useEffect(() => {

        if (fetchPostsState !== LoadingState.Loaded || !currentDiscussion) {
            return;
        }

        if(currentUser && posts && posts.length > 0) {
            let bookmarkPost = posts[0];
            let lastPost = posts[posts.length - 1];
            if(lastPost.id === currentDiscussion.lastPostId) {
                bookmarkPost = lastPost;
            }
            dispatch(setCurrentDiscussionBookmark(bookmarkPost));
        }

        if(!IntersectionObserver) {
            return;
        }

        let observer = new IntersectionObserver((entries) => {

            if(posts.length === 0 || router.asPath.endsWith("#last")) {
                return;
            }

            let nextDebounce = new Date().getTime()
            if (nextDebounce - debounceTime < 1000) {
                return;
            }
            setDebounceTime(nextDebounce);

            for(let i = 0; i < entries.length; i++) {
                let entry = entries[i];
                if(entry.intersectionRatio > 0) {

                    let lastPost = posts[posts.length - 1];
                    if(currentUser) {
                        dispatch(setCurrentDiscussionBookmark(lastPost));
                    }

                    let nextPostNum = lastPost.postNum + 1;
                    if(nextPostNum <= currentDiscussion.postCount) {
                        document.body.setAttribute("data-userscrollpending", true);
                        let nextUrl = `${currentDiscussion.url}/${nextPostNum}`;
                        router.push(nextUrl, undefined, {shallow: true});
                    }
                    break;
                }
            }

        });

        let el = document.getElementById("endOfListIndicator");
        if(el) {
            observer.observe(el);
        }

        return () => {
            observer.disconnect();
        }

    }, [currentDiscussion, posts, fetchPostsState]);

    useEffect(() => {
        if(!pagingContainerRef.current) {
            return;
        }
        pagingContainerRef.current.style.bottom = 0;
        let l = document.addEventListener("scroll", (ev) => {
            if(!containerRef.current) {
                return;
            }
            let rect = containerRef.current.getBoundingClientRect();
            let offset = (rect.y + rect.height + 60) - window.innerHeight;
            if(offset < 0) {
                pagingContainerRef.current.style.bottom = Math.abs(offset) + "px";
            } else {
                pagingContainerRef.current.style.bottom = 0;
            }
        });
        return () => {
            document.removeEventListener("scroll", l);
        }
    }, [containerRef.current]);

    const onReportPost = (post) => {
        setReportedPost(post);
    }

    const onCloseReportDialog = () => {
        setReportedPost(null);
    }

    const onNavigate = (direction) => {

        if(currentDiscussion.postCount == 0) {
            return;
        }

        if(direction === "up") {
            router.push(`/${currentFolder.key}`);
            return;
        }

        // let beginPostNum = posts[0].postNum;
        // let endPostNum = posts[posts.length - 1].postNum;
        let lastPostNum = postNum ? parseInt(postNum[0]) : posts[0].postNum;
        let nextPath = "";
        let fragment = "";

        switch(direction) {
            case "first":
                nextPath = "/1";
                break;
            case "last":
                nextPath = `/${Math.max(1, currentDiscussion.postCount - pageSize + 1)}`;
                fragment = "#last";
                break;
            case "next":
                nextPath = `/${Math.min(currentDiscussion.postCount, lastPostNum + pageSize)}`;
                break;
            case "prev":
                nextPath = `/${Math.max(1, lastPostNum - pageSize)}`;
                break;
            case "check":
                dispatch(fetchPosts(currentDiscussion));
                break;
        }

        let nextUrl = `${currentDiscussion.url}${nextPath}${fragment}`;
        router.push(nextUrl, undefined, {shallow: true});

    }

    const onEditDiscussion = () => {
        setEditDiscussion(!editDiscussion);
    }

    const onCancelEditDiscussion = () => {
        setEditDiscussion(false);
    }

    const onEditedDiscussion = () => {
        setEditDiscussion(false);
    }

    const onDeleteDiscussion = () => {
        setOpenDeleteDiscussionDialog(true);
    }

    const onCloseDeleteDiscussionDialog = () => {
        setOpenDeleteDiscussionDialog(false);
    }

    const onConfirmDeleteDiscussionDialog = () => {
        dispatch(deleteDiscussion(currentDiscussion));
        setOpenDeleteDiscussionDialog(false);
    }

    const onCloseMoveDiscussionDialog = () => {
        setOpenMoveDiscussionDialog(false);
    }

    const onMoveToFolder = (folder) => {
        dispatch(moveDiscussion(currentDiscussion, folder));
        setOpenMoveDiscussionDialog(false);
    }

    const onSubscribe = () => {
        dispatch(setDiscussionSubscriptionStatus(currentDiscussion, !currentDiscussion.isSubscribed));
    }

    const onMarkUnread = () => {
        dispatch(setDiscussionUnread(currentDiscussion));
    }

    const onSetClickToViewNewPosts = () => {
        dispatch(setMergePendingPosts(true));
    }

    const onClickAdminMenu = (key) => {

        switch(key) {
        case "edit":
            setEditDiscussion(!editDiscussion);
            break;
        case "lock":
            dispatch(lockDiscussion(currentDiscussion, !currentDiscussion.isLocked));
            break;
        case "premoderate":
            dispatch(premoderateDiscussion(currentDiscussion, !currentDiscussion.isPremoderate));
            break;
        case "delete":
            dispatch(adminDeleteDiscussion(currentDiscussion, !currentDiscussion.isDeleted));
            break;
        case "move":
            setOpenMoveDiscussionDialog(true);
        }

    }

    const onIsEditingPostChanged = (state) => {
        if(state) {
            setIsEditingPost(state);
        } else {
            setTimeout(() => setIsEditingPost(false), 500);
        }
    }

    const discussionTitle = () => {
        return { __html: currentDiscussion.title }
    }

    const headerMarkup = () => {
        return { __html: currentDiscussion.headerMarkup }
    }

    const renderLoadingSpinner = () => {
        return <div className="loadingSpinner">
            <PulseLoader color="#2A5880"></PulseLoader>
        </div>
    }

    const renderPosts = () => {

        if(currentDiscussion && currentDiscussion.postCount === 0) {
            return <Alert severity="info" className={styles.userAlert}>Nobody has posted on this thread yet.</Alert>
        } else {
            return <>{
                posts.map((post, ix) => {
                    return <Post
                        post={post}
                        discussion={currentDiscussion}
                        blockedUsers={blockedUsers}
                        key={ix}
                        onReport={onReportPost} />
                })}
                <div id="endOfListIndicator"></div>
            </>
        }

    }

    const renderLeftMenu = () => {

        if(!(currentDiscussion && currentUser)) {
            return <></>
        }

        return <div className="leftButtonMenu">
            <div className="leftButtonMenuInner">

                { posts.length === 0 && currentDiscussion.postCount == 0 && currentDiscussion.createdByUserId == currentUser.id
                    ? <>
                        <ActionButton onClick={onEditDiscussion} icon={<EditIcon />} label="Edit" testId="edit-discussion"/>
                        <ActionButton onClick={onDeleteDiscussion} icon={<DeleteIcon />} label="Delete" testId="delete-discussion"/>
                    </>
                    : <></>
                }

                { currentDiscussion.isSubscribed
                    ? <ActionButton onClick={onSubscribe} icon={<NotificationsOffIcon />} label="Unsubscribe" testId="unsubscribe-discussion"/>
                    : <ActionButton onClick={onSubscribe} icon={<AddAlertIcon />} label="Subscribe" testId="subscribe-discussion"/>
                }

                <ActionButton onClick={onMarkUnread} icon={<MarkunreadMailboxIcon />} label="Mark unread" testId="unread-discussion"/>

                { currentUser && currentUser.isAdmin
                    ? <>
                        <ActionButton icon={<Build />} label="Admin" onClick={(key) => onClickAdminMenu(key)} menu={[
                            {label: "Edit discussion", key: "edit"},
                            {label: (currentDiscussion.isLocked ? "Unlock" : "Lock"), key: "lock"},
                            {label: (currentDiscussion.isPremoderate ? "Stop Premoderating" : "Premoderate"), key: "premoderate"},
                            {label: (currentDiscussion.isDeleted ? "Undelete" : "Delete"), key: "delete"},
                            {label: "Move", key: "move"},
                        ]}/>
                    </>
                    : <></>
                }

            </div>
        </div>

    }

    const renderBreadcrumbs = () => {
        return <Paper variant="outlined" className="breadcrumb">
            <div className="breadcrumb-item"><Link href="/"><a><HomeIcon color="primary" /></a></Link></div>
            <div className="breadcrumb-item"><PlayArrowIcon color="action" /></div>
            <div className="breadcrumb-item"><Link href={`/${currentFolder.key}`}><a>{currentFolder.description}</a></Link></div>
        </Paper>
    }

    const renderDiscussion = () => {

        let showAddPosts = !editDiscussion && (currentDiscussion.postCount == 0 || (posts.length > 0 && posts[posts.length - 1].postNum >= currentDiscussion.postCount))
        let showNewPostsAvailable = pendingDicussionUpdateAvailable && (pendingDicussionUpdateAvailable.postCount - currentDiscussion.postCount > 0) && showAddPosts;

        return <Paper variant="outlined" className="discussionList">

            <article className={styles.discussionHeader}>
                <div className={styles.discussionHeaderContent}>
                    <Typography variant="h6" display="block" color="primary" gutterBottom className={"discussionTitle"} dangerouslySetInnerHTML={discussionTitle()}></Typography>
                    <Typography variant="overline" display="block" gutterBottom>
                    <UserLink userId={currentDiscussion.createdByUserId} username={currentDiscussion.createdByUsername} /><span>{` - ${formatDistanceToNow(new Date(currentDiscussion.createdDate))} ago`}</span>
                    </Typography>
                    <Typography variant="body1" display="block" gutterBottom className={"discussionHeader"} dangerouslySetInnerHTML={headerMarkup()}></Typography>
                </div>
            </article>

            <div className={styles.discussionPostList}>

                { currentUser && currentUser.isAdmin && currentDiscussion.isPremoderate
                    ? <Alert severity="warning" className={styles.userAlert}>Premoderate</Alert>
                    : <></>
                }

                { currentDiscussion.status == 0
                    ? renderPosts()
                    : <Alert severity="error" className={styles.userAlert}>This discussion has been deleted.</Alert>
                }

                { fetchPostsState === LoadingState.Loading || fetchPostActionState === LoadingState.Loading
                    ? renderLoadingSpinner()
                    : <></>
                }

                { showNewPostsAvailable
                    ? <Alert severity="info" className={styles.userAlert} action={<Button color="primary" size="small" onClick={onSetClickToViewNewPosts}>Click to view</Button>}>{`${pendingDicussionUpdateAvailable.postCount - currentDiscussion.postCount} new posts available`}</Alert>
                    : <></>
                }

                { showAddPosts
                    ? <AddPost discussion={currentDiscussion} isEditing={onIsEditingPostChanged}/>
                    : <></>
                }

            </div>

        </Paper>

    }

    return <MasterLayout title={`JUSTtheTalk - ${currentDiscussion ? currentDiscussion.title : "Discussion"}`} leftContent={renderLeftMenu()}>

        { currentDiscussion
            ? <Head>
                    <meta name="description" content={currentDiscussion.header}/>
                    <link rel="canonical" href={`https://justthetalk.com${currentDiscussion.url}`} />
                    <meta property="og:description" content={currentDiscussion.header} />
                    <meta property="og:url" content={`https://justthetalk.com${currentDiscussion.url}`} />
                </Head>
            : <></>
        }

        <div className="container" ref={containerRef}>

            <div className={styles.pagingContainer} style={{ visibility: fetchPostsState === LoadingState.Loaded && posts.length > 0 && !isEditingPost ? "visible" : "hidden" }} ref={pagingContainerRef}>
                <Paging onNavigate={onNavigate}></Paging>
            </div>

            { currentFolder ? renderBreadcrumbs() : <></> }

            {!isWidth800 && currentUser ? renderLeftMenu() : <></> }

            { currentDiscussion && editDiscussion
                ? <CreateDiscussion folder={currentFolder} onCancelCreateDiscussion={onCancelEditDiscussion} onEditedDiscussion={onEditedDiscussion} discussion={currentDiscussion}></CreateDiscussion>
                : <></>
            }

            { currentDiscussion && !editDiscussion ? renderDiscussion() : <></> }

        </div>

        <ReportPostDialog open={Boolean(reportedPost)} onClose={onCloseReportDialog} post={reportedPost} discussion={currentDiscussion} folder={currentFolder}></ReportPostDialog>

        <Dialog open={openDeleteDiscussionDialog} onClose={onCloseDeleteDiscussionDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">Delete discussion?</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">Are you sure you want to delete this discussion?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCloseDeleteDiscussionDialog} color="primary">Cancel</Button>
                <Button onClick={onConfirmDeleteDiscussionDialog} color="primary" autoFocus data-test-id="delete-discussion-ok">OK</Button>
            </DialogActions>
        </Dialog>

        { currentUser && currentUser.isAdmin && currentDiscussion
            ? <Dialog open={openMoveDiscussionDialog} onClose={onCloseMoveDiscussionDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Move discussion...</DialogTitle>
                <DialogContent>
                    <List>
                    {
                        folders.filter(x => x.id != currentDiscussion.folderId).sort(compareFolders).map((folder, ix) => {
                            return <ListItem key={ix} button dense onClick={() => onMoveToFolder(folder)}>
                                <ListItemAvatar><Avatar><FolderIcon /></Avatar></ListItemAvatar>
                                <ListItemText primary={folder.description} />
                            </ListItem>
                        })
                    }
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseMoveDiscussionDialog} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
            : <></>
        }

    </MasterLayout>;

}