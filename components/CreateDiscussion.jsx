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

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/router";

import { Paper, Typography, TextField, Button, FormControlLabel, Checkbox } from "@material-ui/core";

import { selectUser, selectCurrentDiscussion } from "../redux/userSlice";
import { selectDiscussionActionState, selectDiscussionActionError, clearDiscussionActionState } from "../redux/discussionSlice";
import { createDiscussion, editDiscussion } from "../redux/discussionActions";

import { LoadingState } from "../redux/constants";

import styles from "../styles/CreateDiscussion.module.scss"

import { htmlDecode } from "../lib/utils";

export function CreateDiscussion({folder, discussion, onEditedDiscussion, onCancelCreateDiscussion}) {

    const dispatch = useDispatch();
    const router = useRouter();

    const currentUser = useSelector(selectUser);
    const currentDiscussion = useSelector(selectCurrentDiscussion);
    const creationError = useSelector(selectDiscussionActionError);
    const actionState = useSelector(selectDiscussionActionState);

    const [titleError, setTitleError] = useState("");
    const [headerError, setHeaderError] = useState("");

    const [title, setTitle] = useState("");
    const [header, setHeader] = useState("");

    const [subscribe, setSubscribe] = useState(false);

    useEffect(() => {
        setSubscribe(currentUser && currentUser.autoSubscribe);
    }, [currentUser]);

    useEffect(() => {
        let parser = new DOMParser();
        if(discussion) {
            setTitle(htmlDecode(discussion.title));
            setHeader(htmlDecode(discussion.header));
        }
    }, [discussion]);

    useEffect(() => {
        if(actionState === LoadingState.Loaded) {
            if(discussion && onEditedDiscussion) {
                onEditedDiscussion();
            } else if(currentDiscussion) {
                router.push(currentDiscussion.url);
            }
            dispatch(clearDiscussionActionState());
        }
    }, [actionState, currentDiscussion]);

    const onChangeTitle = (ev) => {
        setTitle(ev.target.value);
        if(ev.target.value.length > 0) {
            setTitleError("");
        }
    }

    const onChangeHeader = (ev) => {
        setHeader(ev.target.value);
        if(ev.target.value.length > 0) {
            setHeaderError("");
        }
    }

    const onChangeSubscribe = (ev) => {
        setSubscribe(ev.target.checked);
    }

    const onCreate = () => {

        let isError = false;

        if(title.trim().length == 0) {
            setTitleError("You must provide a title for the discussion");
            isError = true;
        }

        if(header.trim().length == 0) {
            setHeaderError("You must explain your point");
            isError = true;
        }

        if(!isError && folder) {
            if(discussion) {
                dispatch(editDiscussion(discussion, title, header, subscribe));
            } else {
                dispatch(createDiscussion(folder, title, header, subscribe));
            }
        }

    }

    const onCancel = () => {
        dispatch(clearDiscussionActionState());
        onCancelCreateDiscussion();
    }

    return <div className="container">
        <Paper variant="outlined" className="discussionList">
            <div className={styles.formControl}>
                <Typography variant="h5" color="textSecondary" gutterBottom>{discussion ? "Edit Discussion" : "Create Discussion"}</Typography>
            </div>
            <div className={styles.formControl} data-test-id="discussion-title">
                <TextField variant="outlined" required className={styles.titleText} fullWidth error={Boolean(titleError.length)} label="Title" length={128} value={title} onChange={onChangeTitle}></TextField>
                { titleError.length > 0 ? (<div className={styles.messageError}>{titleError}</div>) : (<></>) }
            </div>
            <div className={styles.formControl} data-test-id="discussion-header">
                <TextField multiline rows={10} required variant="outlined" fullWidth error={Boolean(headerError.length)} label="Your point..." length={1024} value={header} onChange={onChangeHeader}></TextField>
                { headerError.length > 0 ? (<div className={styles.messageError}>{headerError}</div>) : (<></>) }
            </div>
            { !discussion
                ? <div className={styles.formControl}>
                    <FormControlLabel label="Subscribe to this discussion" control={<Checkbox color="primary" checked={subscribe} onChange={onChangeSubscribe} data-test-id="autosubscribe-discussion"></Checkbox>} />
                </div>
                : <></>
            }
            <div className={styles.postButton}>
                <Button variant="contained" color="primary" onClick={onCreate} data-test-id="create-discussion">{discussion ? "Save" : "Create"}&#8230;</Button>
                <Button variant="contained" color="secondary" onClick={onCancel}>Cancel</Button>
            </div>
            { creationError.length > 0
                ? <div className={styles.formControl}><div className={styles.messageError}>{creationError}</div></div>
                : (<></>)
            }
        </Paper>
    </div>
}