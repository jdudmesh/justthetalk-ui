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

import { fetchPostsAPI, createPostAPI, editPostAPI, deletePostAPI } from "../api";
import { mergeCurrentDiscussion, clearQueuedMessages, setMergeQueuedMessages } from "./userSlice";
import { mergePosts, setPostActionError, setPostLoadingState, setPostActionState } from "./postSlice";
import { updateDiscussionItemsFromPost } from "./discussionSlice";
import { updateFrontPageItemsFromPost } from "./frontPageSlice";

export const fetchPosts = (discussion, postNum, customPageSize) => (dispatch, getState) => {

    dispatch(setPostLoadingState(LoadingState.Loading));
    dispatch(clearQueuedMessages());
    dispatch(setMergeQueuedMessages(false));

    let state = getState();
    let pageSize = customPageSize ? customPageSize : state.post.pageSize;

    fetchPostsAPI(discussion, postNum, pageSize).then((res) => {
        if(res.status === 200) {
            let posts = res.data.data;
            dispatch(mergePosts(posts));
            dispatch(setPostLoadingState(LoadingState.Loaded));
        } else {
            dispatch(setPostLoadingState(LoadingState.Failed));
            console.error(res);
            toast.error("Failed to fetch posts");
        }
    }).catch((err) => {
        console.error(err);
        toast.error("Failed to fetch posts");
        dispatch(setPostLoadingState(LoadingState.Failed));
    });

}

export const createPost = (discussion, text, postAsAdmin, subscribeToDiscussion) => (dispatch, getState) => {

    dispatch(setPostActionState(LoadingState.Loading));

    createPostAPI(discussion, text, postAsAdmin, subscribeToDiscussion)
        .then((res) => {
            if(res.status === 200) {
                let state = getState();
                let posts = res.data.data;
                let lastPost = posts[posts.length - 1];
                if(lastPost.postNum > state.user.currentDiscussion.postCount) {
                    dispatch(mergeCurrentDiscussion({
                        postCount: lastPost.postNum,
                        isSubscribed: state.user.currentDiscussion.isSubscribed || state.user.user.autoSubscribe,
                    }));
                }
                dispatch(mergePosts(posts));
                dispatch(setPostActionError(""));
                dispatch(setPostActionState(LoadingState.Loaded));
                dispatch(updateFrontPageItemsFromPost(lastPost));
                dispatch(updateDiscussionItemsFromPost(lastPost));

            } else {
                dispatch(setPostActionError("Failed to save comment"));
                dispatch(setPostActionState(LoadingState.Failed));
            }
        }).catch((err) => {
            console.error(err);
            if(err.response) {
                dispatch(setPostActionError(err.response.data.message));
            } else {
                dispatch(setPostActionError("Request failed"));
            }
            dispatch(setPostActionState(LoadingState.Failed));
        });

}

export const editPost = (discussion, post) => (dispatch) => {

    dispatch(setPostActionState(LoadingState.Loading));

    editPostAPI(discussion, post).then((res) => {
        if(res.status === 200) {
            let post = res.data.data;
            dispatch(mergePosts([post]));
            dispatch(setPostActionError(""));
            dispatch(setPostActionState(LoadingState.Loaded));
        } else {
            dispatch(setPostActionError("Failed to save comment"));
            dispatch(setPostActionState(LoadingState.Failed));
        }
    }).catch((err) => {
        console.error(err);
        dispatch(setPostActionError(err.response.data.message));
        dispatch(setPostActionState(LoadingState.Failed));
    });

}

export const deletePost =(discussion, post) => (dispatch, getState) => {

    dispatch(setPostActionState(LoadingState.Loading));

    deletePostAPI(discussion, post).then((res) => {
        if(res.status === 200) {
            let post = res.data.data;
            dispatch(mergePosts([post]));
            dispatch(setPostActionError(""));
            dispatch(setPostActionState(LoadingState.Loaded));
        } else {
            dispatch(setPostActionError("Failed to delete comment"));
            dispatch(setPostActionState(LoadingState.Failed));
        }
    }).catch((err) => {
        console.error(err);
        dispatch(setPostActionError(err.response.data.message));
        dispatch(setPostActionState(LoadingState.Failed));
    });

}
