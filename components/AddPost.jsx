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
import Button from "@material-ui/core/Button";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";

import { selectUser } from "../redux/userSlice";
import { selectPostActionState, selectPostActionError } from "../redux/postSlice";
import { createPost } from "../redux/postActions";

import { Alert } from "./Alert";

import styles from "../styles/AddPost.module.scss";

export function AddPost({discussion, isEditing}) {

    const dispatch = useDispatch();

    const currentUser = useSelector(selectUser);
    const postActionState = useSelector(selectPostActionState);
    const creationError = useSelector(selectPostActionError);

    const [messageText, setMessageText] = useState("");
    const [postAsAdmin, setPostAsAdmin] = useState(false);
    const [subscribe, setSubscribe] = useState(false);
    const [messageError, setMessageError] = useState("");


    useEffect(() => {
        if(!(discussion && currentUser)) {
            return
        }
        if(discussion.isSubscribed || currentUser.autoSubscribe) {
            setSubscribe(currentUser.autoSubscribe);
        }
    }, [currentUser, discussion])

    useEffect(() => {
        if(!creationError) {
            setMessageText("");
            setMessageError("");
        } else {
            setMessageError(creationError);
        }
    }, [creationError, postActionState]);

    const onPostMessage = () => {
        if(messageText.length == 0) {
            setMessageError("You must enter some text!");
        } else {
            let lastMessage = localStorage.getItem("messageText");
            if(lastMessage && lastMessage == messageText) {
                setMessageError("You've already posted this message!");
            } else {
                localStorage.setItem("messageText", messageText);
                dispatch(createPost(discussion, messageText, postAsAdmin, subscribe));
            }
        }
    }

    const onChangeMessage = (ev) => {
        setMessageText(ev.target.value);
        if(ev.target.value.length > 0) {
            setMessageError("");
        }
    }

    const onChangeSubscribe = (ev) => {
        setSubscribe(ev.target.checked);
    }

    const onChangePostAsAdmin = (ev) => {
        setPostAsAdmin(ev.target.checked);
    }

    const onFocus = () => {
        if(isEditing) {
            isEditing(true);
        }
    }

    const onBlur = () => {
        if(isEditing) {
            isEditing(false);
        }
    }

    if(!currentUser) {
        return <Alert severity="error" className={styles.userAlert}>Create an account or log in to contribute to this discussion.</Alert>
    }

    if(currentUser.accountExpired || currentUser.accountLocked || !currentUser.enabled) {
        return <Alert severity="error" className={styles.userAlert}>Your account is locked. You cannot post on this discussion.</Alert>
    }

    if(discussion.isBlocked) {
        return <Alert severity="warning" className={styles.userAlert}>Your account has been blocked from posting on this discussion.</Alert>
    }

    if(discussion.isLocked) {
        return <Alert severity="info" className={styles.userAlert}>This discussion has been locked.</Alert>
    }

    if(discussion.isDeleted) {
        return <></>
    }

    if(currentUser.isPremoderate) {
        return <Alert severity="warning" className={styles.userAlert}>Your posts on this discussion are suspended pending approval by the admin teams.</Alert>
    }

    return <div className={styles.addPost}>

            <TextField
                multiline
                fullWidth
                rows={10}
                variant="outlined"
                error={Boolean(messageError.length)}
                label="Write your reply here..."
                value={messageText}
                onChange={onChangeMessage}
                onFocus={onFocus}
                onBlur={onBlur}
                inputProps={{maxLength: "8192", "data-test-id": "post-text"}}
                className={styles.postTextInput}>
            </TextField>

            { messageError.length > 0 ? (<div className={styles.messageError}>{messageError}</div>) : (<></>) }
            <div className={styles.postButton}>
                <div className={styles.postButtonContainer}>
                    <Button variant="contained" color={postAsAdmin ? "secondary" : "primary"} onClick={onPostMessage} data-test-id="create-post">Post Reply&#8230;</Button>
                </div>
                <div>
                    {/*
                        <div><FormControlLabel label="Subscribe" control={<Checkbox color="primary" checked={subscribe} onChange={onChangeSubscribe} data-test-id="subscribe-discussion"></Checkbox>} /></div>
                    */}
                    { currentUser.isAdmin
                        ? <div><FormControlLabel label="Post as JUSTtheTalk" control={<Checkbox color="secondary" checked={postAsAdmin} onChange={onChangePostAsAdmin}></Checkbox>} /></div>
                        : <></>
                    }
                </div>
            </div>
            <div>
                You cannot rewrite history, but you will have 30 minutes to make any changes or fixes after you post a message. Just click on Edit in the drop down which appears in your message after you post it.
            </div>
    </div>

}