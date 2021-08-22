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

import { toast } from 'react-toastify';

import { LoadingState } from './constants';

import { fetchDiscussionsBeforeAPI, createDiscussionAPI, editDiscussionAPI, deleteDiscussionAPI } from '../api';

import { appendDiscussions, setDiscussionLoadingState, setDiscussionActionState, setDiscussionActionError, setLastLoadCount } from './discussionSlice'
import { setCurrentDiscussion } from './userSlice';

export const fetchDiscussions = (folder, beforeDate) => (dispatch, getState) => {

    let state = getState();

    dispatch(setDiscussionLoadingState(LoadingState.Loading));

    beforeDate = beforeDate || new Date().toISOString();
    const pageSize = 50;

    fetchDiscussionsBeforeAPI(folder, beforeDate, pageSize).then((res) => {
        let items = res.data.data;
        dispatch(setLastLoadCount(items.length));
        dispatch(appendDiscussions(items));
        dispatch(setDiscussionLoadingState(LoadingState.Loaded));
    }).catch((err) => {
        console.error(err);
        toast.error("Failed to fetch discussions");
        dispatch(setDiscussionLoadingState(LoadingState.Failed));
    });

}

export const createDiscussion = (folder, title, header, subscribed) => (dispatch, getState) => {

    let state = getState();

    dispatch(setDiscussionActionState(LoadingState.Loading));

    createDiscussionAPI(folder, title, header, subscribed).then((res) => {
        let discussion = res.data.data;
        dispatch(setCurrentDiscussion(discussion));
        dispatch(setDiscussionActionError(""));
        dispatch(setDiscussionActionState(LoadingState.Loaded));
    }).catch((err) => {
        console.error(err);
        dispatch(setDiscussionActionError(err.response.data.message));
        dispatch(setDiscussionActionState(LoadingState.Failed));
    });

}

export const editDiscussion = (discussion, title, header) => (dispatch, getState) => {

    let state = getState();

    dispatch(setDiscussionActionState(LoadingState.Loading));

    editDiscussionAPI(discussion, title, header).then((res) => {
        let discussion = res.data.data;
        dispatch(setCurrentDiscussion(discussion));
        dispatch(setDiscussionActionError(""));
        dispatch(setDiscussionActionState(LoadingState.Loaded));
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
