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

import { createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify';

import { LoadingState } from './constants';

import { fetchDiscussionsAPI, createDiscussionAPI, editDiscussionAPI, deleteDiscussionAPI } from '../api';

import { appendDiscussions, setDiscussionLoadingState, setDiscussionActionState, setDiscussionActionError } from './discussionSlice'
import { setCurrentDiscussion, clearCurrentFolderNewMessages } from './userSlice';

export const fetchDiscussions = (folder, pageNum) => (dispatch, getState) => {

    dispatch(setDiscussionLoadingState(LoadingState.Loading));

    let state = getState();
    let start = pageNum ? pageNum * state.discussion.pageSize : 0;

    if(start === 0) {
        dispatch(clearCurrentFolderNewMessages());
    }

    fetchDiscussionsAPI(folder, start, state.discussion.pageSize)
        .then((res) => {
            if(res.status === 200) {
                let discussions = res.data.data;
                dispatch(appendDiscussions(discussions));
                dispatch(setDiscussionLoadingState(LoadingState.Loaded));
            } else {
                dispatch(setDiscussionLoadingState(LoadingState.Failed));
                console.error(res);
                toast.error("Failed to fetch posts");
            }
        }).catch((err) => {
            console.error(err);
            toast.error("Failed to fetch posts");
            dispatch(setDiscussionLoadingState(LoadingState.Failed));
        });

}

export const createDiscussion = (folder, title, header, subscribed) => (dispatch, getState) => {

    dispatch(setDiscussionActionState(LoadingState.Loading));

    createDiscussionAPI(folder, title, header, subscribed)
        .then((res) => {
            if(res.status === 200) {
                let state = getState();
                let discussion = res.data.data;
                dispatch(setCurrentDiscussion(discussion));
                dispatch(setDiscussionActionError(""));
                dispatch(setDiscussionActionState(LoadingState.Loaded));
            } else {
                dispatch(setDiscussionActionError("Failed to save comment"));
                dispatch(setDiscussionActionState(LoadingState.Failed));
            }
        }).catch((err) => {
            console.error(err);
            dispatch(setDiscussionActionError(err.response.data.message));
            dispatch(setDiscussionActionState(LoadingState.Failed));
        });

}

export const editDiscussion = (discussion, title, header) => (dispatch, getState) => {

    dispatch(setDiscussionActionState(LoadingState.Loading));

    editDiscussionAPI(discussion, title, header)
        .then((res) => {
            if(res.status === 200) {
                let state = getState();
                let discussion = res.data.data;
                dispatch(setCurrentDiscussion(discussion));
                dispatch(setDiscussionActionError(""));
                dispatch(setDiscussionActionState(LoadingState.Loaded));
            } else {
                dispatch(setDiscussionActionError("Failed to save comment"));
                dispatch(setDiscussionActionState(LoadingState.Failed));
            }
        }).catch((err) => {
            console.error(err);
            dispatch(setDiscussionActionError(err.response.data.message));
            dispatch(setDiscussionActionState(LoadingState.Failed));
        });

}

export const deleteDiscussion = (discussion, mutateState) => (dispatch) => {

    dispatch(setDiscussionActionState(LoadingState.Loading));

    deleteDiscussionAPI(discussion, mutateState).then((res) => {
        dispatch(setCurrentDiscussion(res.data.data));
        dispatch(setDiscussionActionState(LoadingState.Loaded));
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setDiscussionActionState(LoadingState.Failed));
    });

}
