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

import { fetchUserAPI,
    updateUserViewTypeAPI,
    updateUserAutoSubscribeAPI,
    updateUserBioAPI,
    markUserFolderSubsReadAPI,
    markUserDiscussionSubsReadAPI,
    deleteUserFolderSubsAPI,
    deleteUserDiscussionSubsAPI,
    setDiscussionUnreadAPI,
    loginUserAPI,
    logoutUserAPI,
    updateUserPasswordAPI,
    validatePasswordResetKeyAPI,
    ignoreUserAPI,
    setFolderSubscriptionStatusAPI,
    unsetFolderSubscriptionStatusAPI,
    setDiscussionSubscriptionStatusAPI,
    unsetDiscussionSubscriptionStatusAPI,
    updateFolderSubscriptionStatusAPI,
    updateUserSortFoldersAPI,
    updateUserSubscriptionFetchOrderAPI,
    createReportAPI,
    fetchDiscussionAPI,
    openWebsocketAPI,
    closeWebsocketAPI,
    createUserAPI,
    fetchIgnoredUsersAPI,
    fetchDiscussionSubscriptionsAPI,
    fetchFolderSubscriptionsAPI,
    fetchFolderSubscriptionExceptionsAPI,
    fetchOtherUserAPI,
    sendForgotPasswordRequestAPI,
    confirmUserAccountKeyAPI,
    updateCurrentBookmarkAPI,
} from "../api";

import {
    setUserLoadingState,
    setUserActionState,
    setActionError,
    clearUser,
    setUser,
    mergeUser,
    setCurrentFolder,
    setCurrentDiscussion,
    incrementCurrentFolderNewMessages,
    mergeCurrentFolder,
    mergeCurrentDiscussion,
    enqueueMessage,
    clearQueuedMessages,
    setMergeQueuedMessages,
    setDiscussionSubscriptions,
    setFolderSubscriptions,
    setFolderSubscriptionExceptions,
    setOtherUser,
    updateCurrentDiscussionFromLastPost,
    setCurrentBookmark,
} from "./userSlice";

import {
    clearDiscussions
} from "./discussionSlice";

import {
    mergePosts,
    clearPosts,
} from "./postSlice"

import {
    fetchFolders
} from "./folderActions";

import {
    clearFrontPageItems,
    updateFrontPageItemsFromBookmark,
    updateFrontPageItemsFromPost,
} from "./frontPageSlice";

import {
    fetchFrontPageSubscriptions,
    mergeFrontpageSubscriptionUpdate,
} from "./frontPageActions";

import {
    setBlockedUsers
} from "./adminSlice";

import {
    updateDiscussionItemsFromPost
} from "./discussionSlice";

import { LoadingState } from './constants';

export const createWebsocket = () => (dispatch, getState) => {

    const eventListener = (message) => {

        let state = getState();

        let post = JSON.parse(message);

        if(state.user.currentDiscussion && post.discussionId === state.user.currentDiscussion.id) {

            if(post.createdByUserId !== state.user.user.id) {
                if(state.user.mergeQueuedMessages) {
                    dispatch(updateCurrentDiscussionFromLastPost(post));
                    dispatch(mergePosts([post]));

                    dispatch(setCurrentDiscussionBookmark({
                        lastPostId: post.id,
                        lastPostCount: post.postNum,
                        lastPostDate: post.createdDate,
                    }));

                } else {
                    dispatch(enqueueMessage(post));
                }
            }

        } else if(state.user.currentFolder && post.url.startsWith(`/${state.user.currentFolder.key}`)) {
            dispatch(incrementCurrentFolderNewMessages());
        }

        dispatch(updateFrontPageItemsFromPost(post));
        dispatch(updateDiscussionItemsFromPost(post));

        const exists = state.frontPage.frontpageSubscriptions.some(x => x.discussionId == post.discussionId);
        if(exists) {
            dispatch(mergeFrontpageSubscriptionUpdate(post));
        } else {
            dispatch(fetchFrontPageSubscriptions());
        }

    }

    openWebsocketAPI(eventListener);

}

export const startMergingNewMessages = () => (dispatch, getState) => {
    let state = getState();
    if(state.user.messageQueue.length > 0) {
        dispatch(updateCurrentDiscussionFromLastPost(state.user.messageQueue[state.user.messageQueue.length - 1]));
    }
    dispatch(mergePosts(state.user.messageQueue));
    dispatch(setMergeQueuedMessages(true));
    dispatch(clearQueuedMessages());
}

const handleUserDetailsSuccess = (dispatch) => (user) => {
    dispatch(setUser(user));
    dispatch(createWebsocket());
    dispatch(setUserLoadingState(LoadingState.Loaded));
    dispatch(fetchFolders());
};

const handleUserDetailsFailure = (dispatch) => (err) => {
    dispatch(clearUser());
    dispatch(setActionError(err.response.data.message));
    dispatch(setUserLoadingState(LoadingState.Failed));
}

export const loginUser = (credentials) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    loginUserAPI(credentials)
        .then(handleUserDetailsSuccess(dispatch))
        .catch(handleUserDetailsFailure(dispatch));

}

export const logoutUser = (credentials) => (dispatch) => {

    dispatch(setUserLoadingState(LoadingState.Loading));

    logoutUserAPI().then((res) => {
        dispatch(clearUser());
        closeWebsocketAPI();
        dispatch(fetchFolders());
    }).catch((err) => {
        dispatch(clearUser());
        dispatch(setUserLoadingState(LoadingState.Failed));
        console.error(err);
        toast.error("Logout failed");
    });

}

export const sendForgotPasswordRequest = (credentials) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    sendForgotPasswordRequestAPI(credentials).then((user) => {
        dispatch(setUserActionState(LoadingState.Loaded));
    }).catch((err) => {
        dispatch(setUserActionState(LoadingState.Failed));
    });

}


export const fetchUser = () => (dispatch) => {

    dispatch(setUserLoadingState(LoadingState.Loading));

    fetchUserAPI().then((res) => {
        if(res) {
            dispatch(setUser(res.data.data));
            dispatch(createWebsocket());
        } else {
            dispatch(clearUser());
            closeWebsocketAPI();
        }
        dispatch(setUserLoadingState(LoadingState.Loaded));
        dispatch(fetchFolders());
    }).catch((err) => {
        dispatch(clearUser());
        dispatch(setUserLoadingState(LoadingState.Loaded));
        console.error(err);
    });

}

export const updateUserViewType = (viewType) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    updateUserViewTypeAPI(viewType).then((res) => {
        dispatch(mergeUser(res.data.data));
        dispatch(clearFrontPageItems());
        dispatch(setUserActionState(LoadingState.Loaded));
    }).catch((err) => {
        toast.error("Update failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}

export const updateUserAutoSubscribe = (autoSubscribe) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    updateUserAutoSubscribeAPI(autoSubscribe).then((res) => {
        dispatch(mergeUser(res.data.data));
        dispatch(setUserActionState(LoadingState.Loaded));
        toast.success("Auto-subscribe updated");
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}

export const updateUserSortFolders = (sortFoldersByActivity) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    updateUserSortFoldersAPI(sortFoldersByActivity).then((res) => {
        dispatch(mergeUser(res.data.data));
        dispatch(setUserActionState(LoadingState.Loaded));
        toast.success("Folder sorting updated");
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}

export const updateUserSubscriptionFetchOrder = (subscriptionFetchOrder) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    updateUserSubscriptionFetchOrderAPI(subscriptionFetchOrder).then((res) => {
        dispatch(mergeUser(res.data.data));
        dispatch(setUserActionState(LoadingState.Loaded));
        toast.success("Folder sorting updated");
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}

export const updateUserBio = (bio) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    updateUserBioAPI(bio).then((res) => {
        dispatch(mergeUser(res.data.data));
        dispatch(setUserActionState(LoadingState.Loaded));
        toast.success("Profile saved");
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}

export const markUserFolderSubsRead = (subs) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    markUserFolderSubsReadAPI(subs).then((res) => {
        dispatch(setFolderSubscriptions(res.data.data));
        dispatch(setUserActionState(LoadingState.Loaded));
        toast.success("Subscriptions updated");
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}

export const markUserDiscussionSubsRead = (subs) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    markUserDiscussionSubsReadAPI(subs).then((res) => {
        dispatch(setDiscussionSubscriptions(res.data.data));
        dispatch(setUserActionState(LoadingState.Loaded));
        toast.success("Subscriptions updated");
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}


export const deleteUserFolderSubs = (subs) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    deleteUserFolderSubsAPI(subs).then((res) => {
        dispatch(setFolderSubscriptions(res.data.data));
        dispatch(setUserActionState(LoadingState.Loaded));
        toast.success("Subscriptions saved");
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}

export const deleteUserDiscussionSubs = (subs) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    deleteUserDiscussionSubsAPI(subs).then((res) => {
        dispatch(setDiscussionSubscriptions(res.data.data));
        dispatch(setUserActionState(LoadingState.Loaded));
        toast.success("Subscriptions saved");
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}

export const updateUserPassword = (credentials) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    updateUserPasswordAPI(credentials).then((res) => {
        dispatch(setUserActionState(LoadingState.Loaded));
        toast.success("Password updated");
    }).catch((err) => {
        dispatch(setUserActionState(LoadingState.Failed));
        dispatch(setActionError(err.response.data.message));
    });

}

export const setDiscussionUnread = (discussion) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    setDiscussionUnreadAPI(discussion).then((res) => {
        let posts = res.data.data;
        dispatch(setUserActionState(LoadingState.Loaded));
        toast.success("Discussion marked unread");
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}

export const ignoreUser = (ignoreUserId, shouldIgnore) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));
    dispatch(setActionError(null));

    ignoreUserAPI(ignoreUserId, shouldIgnore).then((res) => {
        dispatch(mergeUser(res.data.data));
        dispatch(setUserActionState(LoadingState.Loaded));
        toast.success("Ignored users list updated");
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}

export const setFolderSubscriptionStatus = (folder, subscriptionStatus) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    let action = subscriptionStatus ? setFolderSubscriptionStatusAPI(folder) : unsetFolderSubscriptionStatusAPI(folder);
    action.then((res) => {
        dispatch(mergeCurrentFolder(res.data.data));
        dispatch(setUserActionState(LoadingState.Loaded));
        toast.success("Folder subscription status updated");
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}

export const setDiscussionSubscriptionStatus = (folder, subscriptionStatus) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    let action = subscriptionStatus ? setDiscussionSubscriptionStatusAPI(folder) : unsetDiscussionSubscriptionStatusAPI(folder);
    action.then((res) => {
        dispatch(mergeCurrentDiscussion(res.data.data));
        dispatch(setUserActionState(LoadingState.Loaded));
        toast.success(subscriptionStatus ? "Subscription added" : "Subscription removed");
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}

export const updateFolderSubscriptionStatus = (subscriptions) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    updateFolderSubscriptionStatusAPI(subscriptions).then((res) => {
        dispatch(setFolderSubscriptions(res.data.data));
        dispatch(setUserActionState(LoadingState.Loaded));
        toast.success("Folder subscription list updated");
    }).catch((err) => {
        console.error(err);
        toast.error("Update failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}


export const createReport = (postId, name, email, body) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    createReportAPI(postId, name, email, body).then((res) => {
        dispatch(setUserActionState(LoadingState.Loaded));
        toast.success("Report submitted");
    }).catch((err) => {
        console.error(err);
        toast.error("Submission failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}

export const fetchCurrentDiscussion = (folder, discussionId) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));
    dispatch(setCurrentDiscussion(null));
    dispatch(setBlockedUsers({}));

    fetchDiscussionAPI(folder, discussionId).then((res) => {
        dispatch(setCurrentDiscussion(res.data.data));
        dispatch(setUserActionState(LoadingState.Loaded));
    }).catch((err) => {
        console.error(err);
        toast.error("Action failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}

export const createUser = (credentials) => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    createUserAPI(credentials)
        .then(handleUserDetailsSuccess(dispatch))
        .catch(handleUserDetailsFailure(dispatch));

}

export const fetchIgnoredUsers = () => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    fetchIgnoredUsersAPI().then((res) => {
        let ignoredUsers = {};
        res.data.data.forEach(u => ignoredUsers[u.ignoredUserId] = u);
        dispatch(mergeUser({ignoredUsers: ignoredUsers}));
    }).catch((err) => {
        console.error(err);
        toast.error("Action failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}

export const fetchDiscussionSubscriptions = () => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    fetchDiscussionSubscriptionsAPI().then((res) => {
        dispatch(setDiscussionSubscriptions(res.data.data));
    }).catch((err) => {
        console.error(err);
        toast.error("Action failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}

export const fetchFolderSubscriptions = () => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    fetchFolderSubscriptionsAPI().then((res) => {
        dispatch(setFolderSubscriptions(res.data.data));
    }).catch((err) => {
        console.error(err);
        toast.error("Action failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}

export const fetchFolderSubscriptionExceptions = () => (dispatch) => {

    dispatch(setUserActionState(LoadingState.Loading));

    fetchFolderSubscriptionExceptionsAPI().then((res) => {
        dispatch(setFolderSubscriptionExceptions(res.data.data));
    }).catch((err) => {
        console.error(err);
        toast.error("Action failed");
        dispatch(setUserActionState(LoadingState.Failed));
    });

}

const pendingOtherUserFetches = {};

export const fetchOtherUser = (userId) => (dispatch, getState) => {

    if(!pendingOtherUserFetches[userId]) {

        pendingOtherUserFetches[userId] = true

        fetchOtherUserAPI(userId).then((res) => {
            dispatch(setOtherUser(res.data.data));
        }).catch((err) => {
            console.error(err);
        });

    }

}

export const validatePasswordResetKey = (key) => (dispatch) => {

    dispatch(setUserLoadingState(LoadingState.Loading));

    validatePasswordResetKeyAPI(credentials)
        .then(handleUserDetailsSuccess(dispatch))
        .catch(handleUserDetailsFailure(dispatch));

}

export const confirmUserAccountKey = (key) => (dispatch) => {

    dispatch(setUserLoadingState(LoadingState.Loading));

    confirmUserAccountKeyAPI(key)
        .then(handleUserDetailsSuccess(dispatch))
        .catch(handleUserDetailsFailure(dispatch));

}

const setFolderLocation = (dispatch, state, nextFolder, discussionId) => {

    if(nextFolder) {
        if(state.user.currentFolder) {
            if(state.user.currentFolder.key !== nextFolder.key) {
                dispatch(setCurrentFolder(nextFolder));
            }
        } else {
            dispatch(setCurrentFolder(nextFolder));
        }
    }

    if(nextFolder && discussionId) {
        setDiscussionLocation(dispatch, state, nextFolder, discussionId);
    } else {
        dispatch(setCurrentDiscussion(null));
        dispatch(clearDiscussions());
        dispatch(clearPosts());
    }

}

const setDiscussionLocation = (dispatch, state, nextFolder, discussionId) => {

    if(state.user.currentDiscussion) {
        if(state.user.currentDiscussion.id !== parseInt(discussionId)) {
            dispatch(fetchCurrentDiscussion(nextFolder, discussionId));
            dispatch(clearPosts());
        }
    } else {
        dispatch(fetchCurrentDiscussion(nextFolder, discussionId));
        dispatch(clearPosts());
    }

}

export const setUserLocation = (folderKey, discussionId, postNum) => (dispatch, getState) => {

    const state = getState();

    if(folderKey) {
        const nextFolder = state.folder.items.find(x => x.key === folderKey);
        setFolderLocation(dispatch, state, nextFolder, discussionId);
    } else {
        setFolderLocation(dispatch, state, null);
    }

    // dispatch(setCurrentFolder(null));
    // dispatch(setCurrentDiscussion(null));
    // dispatch(clearPosts());

}

export const setCurrentDiscussionBookmark = (nextBookmark) => (dispatch, getState) => {

    const state = getState();

    let currentBookmark = state.user.currentBookmark
    if(!currentBookmark || (currentBookmark && nextBookmark.lastPostCount > currentBookmark.lastPostCount)) {
        updateCurrentBookmarkAPI(state.user.currentDiscussion, nextBookmark).then((res) => {
            let bookmark = res.data.data;
            dispatch(setCurrentBookmark(bookmark));
            dispatch(updateFrontPageItemsFromBookmark(bookmark));
        }).catch((err) => {
            console.error(err);
        });

    }

}

