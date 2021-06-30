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

import { toast } from "react-toastify";

import { LoadingState } from "./constants";

import {
    fetchModerationQueueAPI,
    lockDiscussionAPI,
    premoderateDiscussionAPI,
    adminDeleteDiscussionAPI,
    moveDiscussionAPI,
    eraseDiscussionAPI,
    adminDeletePostAPI,
    adminUndeletePostAPI,
    blockUserFromDiscussionAPI,
    unblockUserFromDiscussionAPI,
    fetchBlockedUsersAPI,
} from "../api";

import { setModerationQueue, setReportsFetchState, setPostReports, setCommentsFetchState, setAdminComments, setAdminActionState, setBlockedUsers } from "./adminSlice";
import {setCurrentDiscussion} from "./userSlice";
import {mergePosts} from "./postSlice";

export const lockDiscussion = (discussion, mutateState) => (dispatch) => {

    dispatch(setAdminActionState(LoadingState.Loading));

    lockDiscussionAPI(discussion, mutateState).then((res) => {
        dispatch(setCurrentDiscussion(res.data.data));
        dispatch(setAdminActionState(LoadingState.Loaded));
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setAdminActionState(LoadingState.Failed));
    });

}

export const premoderateDiscussion = (discussion, mutateState) => (dispatch) => {

    dispatch(setAdminActionState(LoadingState.Loading));

    premoderateDiscussionAPI(discussion, mutateState).then((res) => {
        dispatch(setCurrentDiscussion(res.data.data));
        dispatch(setAdminActionState(LoadingState.Loaded));
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setAdminActionState(LoadingState.Failed));
    });

}

export const adminDeleteDiscussion = (discussion, mutateState) => (dispatch) => {

    dispatch(setAdminActionState(LoadingState.Loading));

    adminDeleteDiscussionAPI(discussion, mutateState).then((res) => {
        dispatch(setCurrentDiscussion(res.data.data));
        dispatch(setAdminActionState(LoadingState.Loaded));
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setAdminActionState(LoadingState.Failed));
    });

}

export const moveDiscussion = (discussion, mutateState) => (dispatch, getState) => {

    dispatch(setAdminActionState(LoadingState.Loading));

    moveDiscussionAPI(discussion, mutateState).then((res) => {
        let updated = res.data.data;
        dispatch(setCurrentDiscussion(updated));
        dispatch(setAdminActionState(LoadingState.Loaded));
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setAdminActionState(LoadingState.Failed));
    });

}

export const eraseDiscussion = (discussion, mutateState) => (dispatch) => {

    dispatch(setAdminActionState(LoadingState.Loading));

    eraseDiscussionAPI(discussion, mutateState).then((res) => {
        dispatch(setAdminActionState(LoadingState.Loaded));
        window.location.href = "/";
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setAdminActionState(LoadingState.Failed));
    });

}

export const fetchBlockedUsers = (discussion) => (dispatch) => {

    dispatch(setAdminActionState(LoadingState.Loading));

    fetchBlockedUsersAPI(discussion).then((res) => {
        dispatch(setBlockedUsers(res.data.data));
        dispatch(setAdminActionState(LoadingState.Loaded));
    }).catch((err) => {
        console.error(err);
        dispatch(setAdminActionState(LoadingState.Failed));
    });

}

export const blockUserFromDiscussion = (discussion, userId, mutateState) => (dispatch) => {

    dispatch(setAdminActionState(LoadingState.Loading));

    let actionFn = mutateState ? blockUserFromDiscussionAPI : unblockUserFromDiscussionAPI;
    actionFn(discussion, userId).then((res) => {
        dispatch(setBlockedUsers(res.data.data));
        dispatch(setAdminActionState(LoadingState.Loaded));
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setAdminActionState(LoadingState.Failed));
    });

}

export const adminDeletePost = (post, mutateState) => (dispatch) => {

    dispatch(setAdminActionState(LoadingState.Loading));

    let actionFn = mutateState ? adminDeletePostAPI : adminUndeletePostAPI;
    actionFn(post).then((res) => {
        dispatch(mergePosts([res.data.data]));
        dispatch(setAdminActionState(LoadingState.Loaded));
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setAdminActionState(LoadingState.Failed));
    });

}

export const fetchModerationQueue = () => (dispatch) => {
    fetchModerationQueueAPI().then((res) => {
        dispatch(setModerationQueue(res.data.data));
        dispatch(setAdminActionState(LoadingState.Loaded));
    }).catch((err) => {
        console.error(err);
        dispatch(setAdminActionState(LoadingState.Failed));
    });
}
