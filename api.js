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

import axios from "axios";

const baseURL = `${process.env.NEXT_PUBLIC_API_SCHEMA}://${process.env.NEXT_PUBLIC_API_HOST}`;

let accessToken;
let accessTokenRefreshTimer;
let sock = null;

const initiateAccessTokenRefreshTimer = () => {
    accessTokenRefreshTimer = setInterval(async () => {
        Api.Post(`/user/refresh-token`).then((res) => {
            accessToken = res.data.data.accessToken;
        }).catch(() => {
            window.location.href = "/";
        });
    }, 300000);
}

const Api = {
    Get: (url) => {
        let headers = {};
        if(accessToken) {
            headers["Authorization"] = "Bearer " + accessToken;
        }
        return axios.get(url, {baseURL, withCredentials: true, headers});
    },
    Put: (url, data) => {
        let headers = {};
        if(accessToken) {
            headers["Authorization"] = "Bearer " + accessToken;
        }
        return axios.put(url, data, {baseURL, withCredentials: true, headers});
    },
    Post: (url, data) => {
        let headers = {};
        if(accessToken) {
            headers["Authorization"] = "Bearer " + accessToken;
        }
        return axios.post(url, data, {baseURL, withCredentials: true, headers});
    },
    Delete: (url, data) => {
        let headers = {};
        if(accessToken) {
            headers["Authorization"] = "Bearer " + accessToken;
        }
        return axios.delete(url, {baseURL, withCredentials: true, headers, data});
    },
}

export const fetchUserAPI = () => {
    if(!accessToken) {
        return new Promise(async (resolve, reject) => {
            Api.Post(`/user/refresh-token`).then((res) => {
                accessToken = res.data.data.accessToken;
                initiateAccessTokenRefreshTimer();
                Api.Get(`/user`).then(resolve).catch(reject);
            }).catch(() => {
                resolve(null);
            });
        });
    } else {
        return Api.Get(`/user`);
    }
}

export const loginUserAPI = (credentials) => {
    return new Promise(async (resolve, reject) => {
        let response = await Api.Post(`/user/login`, credentials).catch(reject);
        if(response) {
            accessToken = response.data.data.accessToken;
            initiateAccessTokenRefreshTimer();
            resolve(response.data.data.user);
        }
    });
}

export const logoutUserAPI = () => {
    return new Promise(async (resolve, reject) => {
        await Api.Post(`/user/logout`).catch(reject);
        accessToken = null;
        if(accessTokenRefreshTimer) {
            clearInterval(accessTokenRefreshTimer);
            accessTokenRefreshTimer = null;
        }
        resolve();
    });
}

export const validatePasswordResetKeyAPI = (key) => {
    return new Promise(async (resolve, reject) => {
        let response = await Api.Get(`/user/password/validatekey?key=${key}`).catch(reject);
        if(response) {
            accessToken = response.data.data.accessToken;
            initiateAccessTokenRefreshTimer();
            resolve(response.data.data.user);
        }
    });
}

export const confirmUserAccountKeyAPI = (key) => {
    return new Promise(async (resolve, reject) => {
        let response = await Api.Get(`/user/account/confirm?key=${key}`).catch(reject);
        if(response) {
            accessToken = response.data.data.accessToken;
            initiateAccessTokenRefreshTimer();
            resolve(response.data.data.user);
        }
    });
}

export const createUserAPI = (credentials) => {
    return new Promise(async (resolve, reject) => {
        let response = await Api.Post(`/user`, credentials).catch(reject);
        if(response) {
            accessToken = response.data.data.accessToken;
            initiateAccessTokenRefreshTimer();
            resolve(response.data.data.user);
        }
    });
}


export const fetchPostsAPI = (discussion, start, size) => {
    let fetchUrl = `/folder/${discussion.folderId}/discussion/${discussion.id}/post?size=${size}`;
    if (start) {
        fetchUrl += `&start=${start}`;
    }
    return Api.Get(fetchUrl);
}

export const createPostAPI = (discussion, text, postAsAdmin, subscribeToDiscussion) => Api.Post(`/folder/${discussion.folderId}/discussion/${discussion.id}/post`, { text, postAsAdmin, subscribeToDiscussion });
export const editPostAPI = (discussion, post) => Api.Put(`/folder/${discussion.folderId}/discussion/${discussion.id}/post/${post.id}`, { text: post.text });
export const deletePostAPI = (discussion, post) => Api.Delete(`/folder/${discussion.folderId}/discussion/${discussion.id}/post/${post.id}`);

export const fetchFoldersAPI = () => Api.Get(`/folder`);

export const fetchDiscussionsAPI = (folder, start, size) => Api.Get(`/folder/${folder.id}/discussion?start=${start}&size=${size}`);
export const fetchDiscussionAPI = (folder, discussionId) => Api.Get(`/folder/${folder.id}/discussion/${discussionId}`);
export const createDiscussionAPI = (folder, title, header, isSubscribed) => Api.Post(`/folder/${folder.id}/discussion`, { title, header, isSubscribed });
export const editDiscussionAPI = (discussion, title, header) => Api.Put(`/folder/${discussion.folderId}/discussion/${discussion.id}`, { title, header });
export const deleteDiscussionAPI = (discussion) => Api.Delete(`/folder/${discussion.folderId}/discussion/${discussion.id}`);


export const fetchFrontPageAPI = (viewType, start, size) => Api.Get(`/frontpage/${viewType}?start=${start}&size=${size}`);

export const fetchUserHistoryAPI = (userId) => Api.Get(`/admin/user/${userId}/history`);
export const toggleUserStatusAPI = (field, user) => Api.Put(`/admin/user/${user.id}/status`, { [field] : !user[field] });
export const searchUsersAPI = (searchTerm) => Api.Get(`/admin/user/search?term=${encodeURIComponent(searchTerm)}`);
export const filterUsersAPI = (filterKey) => Api.Get(`/admin/user/search?filter=${encodeURIComponent(filterKey)}`);
export const fetchModerationQueueAPI = () => Api.Get("/admin/moderation/queue");
export const fetchModerationHistoryAPI = (start, size) => Api.Get(`/admin/moderation/history?start=${start}&size=${size}`);

export const fetchPostReportsAPI = (discussion, post) => Api.Get(`/admin/discussion/${discussion.id}/post/${post.id}/report`);
export const fetchPostCommentsAPI = (discussion, post) => Api.Get(`/admin/discussion/${discussion.id}/post/${post.id}/comment`);
export const createAdminCommentAPI = ({discussionId, postId, vote, body}) => Api.Post(`/admin/discussion/${discussionId}/post/${postId}/report`, { vote, body });

export const lockDiscussionAPI = (discussion, lockState) => Api.Post(`/admin/discussion/${discussion.id}/lock?state=${lockState ? 1 : 0}`);
export const premoderateDiscussionAPI = (discussion, premodState) => Api.Post(`/admin/discussion/${discussion.id}/premoderate?state=${premodState ? 1 : 0}`);
export const adminDeleteDiscussionAPI = (discussion, deleteState) => Api.Post(`/admin/discussion/${discussion.id}/delete?state=${deleteState ? 1 : 0}`);
export const moveDiscussionAPI = (discussion, targetFolder) => Api.Post(`/admin/discussion/${discussion.id}/move?targetFolderId=${targetFolder.id}`);
export const eraseDiscussionAPI = (discussion) => Api.Delete(`/admin/discussion/${discussion.id}`);

export const blockUserFromDiscussionAPI = (discussion, userId) => Api.Post(`/admin/discussion/${discussion.id}/user/block/${userId}`);
export const unblockUserFromDiscussionAPI = (discussion, userId) => Api.Delete(`/admin/discussion/${discussion.id}/user/block/${userId}`);
export const fetchBlockedUsersAPI = (discussion) => Api.Get(`/admin/discussion/${discussion.id}/user/block`);
export const fetchAllBlockedUsersAPI = (discussion) => Api.Get(`/admin/users/discussion/block`);

export const adminDeletePostAPI = (post) => Api.Post(`/admin/discussion/${post.discussionId}/post/${post.id}/delete`);
export const adminUndeletePostAPI = (post) => Api.Delete(`/admin/discussion/${post.discussionId}/post/${post.id}/delete`);

export const ignoreUserAPI = (ignoreUserId, shouldIgnore) => Api.Put(`/user/ignore/${ignoreUserId}?state=${shouldIgnore ? 1 : 0}`);

export const setDiscussionUnreadAPI = (discussion) => Api.Delete(`/user/discussion/${discussion.id}/bookmark`);
export const updateCurrentBookmarkAPI = (discussion, bookmarkedPost) => Api.Put(`/user/discussion/${discussion.id}/bookmark`, bookmarkedPost);
export const setFolderSubscriptionStatusAPI = (folder) => Api.Post(`/folder/${folder.id}/subscription`);
export const unsetFolderSubscriptionStatusAPI = (folder) => Api.Delete(`/folder/${folder.id}/subscription`);
export const setDiscussionSubscriptionStatusAPI = (discussion) => Api.Post(`/folder/${discussion.folderId}/discussion/${discussion.id}/subscription`);
export const unsetDiscussionSubscriptionStatusAPI = (discussion) => Api.Delete(`/folder/${discussion.folderId}/discussion/${discussion.id}/subscription`);

export const checkSubscriptionAPI = () => Api.Get(`/user/subscriptions/check`);
export const createReportAPI = (postId, name, email, body) => Api.Post(`/user/report`, {postId, name, email, body});

export const updateUserViewTypeAPI = (viewType) => Api.Put(`/user/viewtype`, {viewType});
export const updateUserAutoSubscribeAPI = (autoSubscribe) => Api.Put(`/user/autosubscribe`, {autoSubscribe});
export const updateUserSortFoldersAPI = (sortFoldersByActivity) => Api.Put(`/user/sortfolders`, {sortFoldersByActivity});
export const updateUserSubscriptionFetchOrderAPI = (subscriptionFetchOrder) => Api.Put(`/user/subscriptions/fetchorder`, {subscriptionFetchOrder});
export const updateUserBioAPI = (bio) => Api.Put(`/user/bio`, {bio});

export const markUserFolderSubsReadAPI = (subs) => Api.Post(`/user/subscriptions/folder/read`, subs);
export const markUserDiscussionSubsReadAPI = (subs) => Api.Post(`/user/subscriptions/discussion/read`, subs);
export const deleteUserFolderSubsAPI = (subs) => Api.Delete(`/user/subscriptions/folder`, subs);
export const fetchDiscussionSubscriptionsAPI = () => Api.Get(`/user/subscriptions/discussion`);
export const deleteUserDiscussionSubsAPI = (subs) => Api.Delete(`/user/subscriptions/discussion`, subs);
export const updateUserPasswordAPI = (credentials) => Api.Put(`/user/password`, credentials);
export const fetchIgnoredUsersAPI = () => Api.Get(`/user/ignore/list`);
export const fetchFolderSubscriptionsAPI = () => Api.Get(`/user/subscriptions/folder`);
export const fetchFolderSubscriptionExceptionsAPI = () => Api.Get(`/user/subscriptions/folder/exceptions`);
export const updateFolderSubscriptionStatusAPI = (subscriptions) => Api.Post(`/user/subscriptions/folder`, subscriptions);


export const fetchOtherUserAPI = (userId) => Api.Get(`/user/${userId}`);
export const sendForgotPasswordRequestAPI = (credentials) => Api.Post(`/user/forgotpassword`, credentials);
export const fetchSearchResultsAPI = (searchText) => Api.Get(`/search?q=${encodeURIComponent(searchText)}`);


let lastMessageTime = null;
let pingCount = 0;
let pingTimer = null;
let timeoutSentinelTimer = null;

const retryWebsocket = (eventListener) => {
    let p = new Promise((resolve) => setTimeout(resolve, 5000));
    p.then(() => {
        openWebsocketAPI(eventListener);
    });
}

export const openWebsocketAPI = (eventListener) => {

    if(pingTimer) {
        clearInterval(pingTimer);
        pingTimer = null;
    }

    if(timeoutSentinelTimer) {
        clearInterval(timeoutSentinelTimer);
        timeoutSentinelTimer = null;
    }

    let schema = process.env.NEXT_PUBLIC_API_SCHEMA === 'https' ? 'wss' : 'ws';
    sock = new WebSocket(`${schema}://${process.env.NEXT_PUBLIC_API_HOST}/ws`);

    sock.addEventListener("message", (event) => {

        lastMessageTime = new Date();

        switch(event.data) {
        case "ping!":
            console.debug("got ping", new Date());
            event.target.send("pong!");
            break;
        case "pong!":
            console.debug("got pong");
            break;
        case "ack!":
            console.info("websocket connected");
            break;
        case "nack!":
            console.error("websocket hello failed");
            break;
        default:
            eventListener(event.data);
        }

    });

    sock.addEventListener("open", function (event) {
        console.info("websocket open")
        event.target.send(`hello!${accessToken}`);
        pingTimer = setInterval(() => {
            if(pingCount % 2 === 0) {
                console.debug("ping", pingCount);
                event.target.send("ping!");
            }
            pingCount++;
        }, 30000);
    });

    sock.addEventListener("error", (err) => {
        console.error(err);
        retryWebsocket(eventListener);
    });

    timeoutSentinelTimer = setInterval(() => {
        let now = new Date()
        if(!lastMessageTime || now.getTime() - lastMessageTime.getTime() > 90000) {
            console.warn("websocket timeout", lastMessageTime, now);
            retryWebsocket(eventListener);
        }
    }, 30000);


}

export const closeWebsocketAPI = () => {
    console.warn("closing websocket");
    if(sock) {
        sock.close();
        sock = null;
    }
}
