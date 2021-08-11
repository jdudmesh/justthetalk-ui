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

import { createSlice } from "@reduxjs/toolkit";

import { LoadingState } from "./constants";

const userSlice = createSlice({
    name: "user",
    initialState: {

        loadingState: LoadingState.Pending,
        actionState: LoadingState.Pending,
        actionError: null,

        user: null,

        discussionSubscriptions: [],
        folderSubscriptions: [],
        folderSubscriptionExceptions: [],

        currentFolder: null,
        currentDiscussion: null,
        currentFolderNewMessages: 0,
        currentBookmark: null,

        messageQueue: [],
        mergeQueuedMessages: false,

        otherUserCache: {},

    },
    reducers: {
        setUserLoadingState: (state, action) => {
            state.loadingState = action.payload;
        },
        setUserActionState: (state, action) => {
            state.actionState = action.payload;
            if(action.payload === LoadingState.Loading) {
                state.actionError = null;
            }
        },
        setActionError: (state, action) => {
            state.actionError = action.payload;
        },
        clearUserActionState: (state) => {
            state.actionState = LoadingState.Pending;
            state.actionError = "";
        },

        clearUser: (state) => {
            state.user = null;
            state.autoSubscribe = false;
            state.viewType = "latest";
            state.loadingState = LoadingState.Loaded;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.loadingState = LoadingState.Loaded;
        },
        mergeUser: (state, action) => {
            if(state.user) {
                state.user = {...state.user, ...action.payload};
            }
        },

        setCurrentFolder: (state, action) => {
            state.currentFolder = action.payload;
            state.currentDiscussion = null;
            state.messageQueue = [];
            state.mergeQueuedMessages = false;
            state.currentFolderNewMessages = 0;
        },
        setCurrentDiscussion: (state, action) => {
            state.currentDiscussion = action.payload;
            state.messageQueue = [];
            state.mergeQueuedMessages = false;
            state.currentBookmark =  null;
        },
        mergeCurrentFolder: (state, action) => {
            state.currentFolder = { ...state.currentFolder, ...action.payload };
        },
        mergeCurrentDiscussion: (state, action) => {
            state.currentDiscussion = { ...state.currentDiscussion, ...action.payload };
        },
        updateCurrentDiscussionFromLastPost: (state, action) => {
            state.currentDiscussion = { ...state.currentDiscussion, postCount: action.payload.postNum, lastPostId: action.payload.id, lastPostDate: action.payload.createdDate };
        },

        incrementCurrentFolderNewMessages: (state, action) => {
            state.currentFolderNewMessages = state.currentFolderNewMessages + 1;
        },
        clearCurrentFolderNewMessages: (state, action) => {
            state.currentFolderNewMessages = 0;
        },

        setDiscussionSubscriptions: (state, action) => {
            state.discussionSubscriptions = action.payload;
        },
        setFolderSubscriptions:  (state, action) => {
            state.folderSubscriptions = action.payload;
        },
        setFolderSubscriptionExceptions:  (state, action) => {
            state.folderSubscriptionExceptions = action.payload;
        },
        enqueueMessage: (state, action) => {
            state.messageQueue = [...state.messageQueue, action.payload];
        },
        clearQueuedMessages: (state, action) => {
            state.messageQueue = [];
        },
        setMergeQueuedMessages: (state, action) => {
            state.mergeQueuedMessages = action.payload;
        },
        setOtherUser:  (state, action) => {
            let user = {};
            user[action.payload.userId] = action.payload;
            state.otherUserCache = { ...state.otherUserCache, ...user} ;
        },
        setCurrentBookmark: (state, action) => {
            state.currentBookmark = action.payload;
        },
    },
});

export const {
    setUserLoadingState,
    setUserActionState,
    setActionError,
    clearUserActionState,
    clearUser,
    setUser,
    mergeUser,
    setViewType,
    setAutoSubscribe,
    setCurrentFolder,
    setCurrentDiscussion,
    incrementCurrentFolderNewMessages,
    clearCurrentFolderNewMessages,
    mergeCurrentFolder,
    mergeCurrentDiscussion,
    setDiscussionSubscriptions,
    setFolderSubscriptions,
    setFolderSubscriptionExceptions,
    enqueueMessage,
    setMergeQueuedMessages,
    clearQueuedMessages,
    setOtherUser,
    updateCurrentDiscussionFromLastPost,
    setCurrentBookmark,
} = userSlice.actions;

export const selectUserLoadingState = state => state.user.loadingState;
export const selectUserActionState = state => state.user.actionState;
export const selectUserActionError = state => state.user.actionError;

export const selectUser = state => state.user.user;
export const selectUserViewType = state => state.user.user ? state.user.user.viewType : "latest";

export const selectQueuedMessages = state => state.user.messageQueue;
export const selectMergeQueuedMessages = state => state.user.mergeQueuedMessages;

export const selectCurrentFolder = state => state.user.currentFolder;
export const selectCurrentDiscussion = state => state.user.currentDiscussion;
export const selectCurrentFolderNewMessages = state => state.user.currentFolderNewMessages;

export const selectDiscussionSubscriptions = state => state.user.discussionSubscriptions;
export const selectFolderSubscriptions = state => state.user.folderSubscriptions;
export const selectFolderSubscriptionExceptions = state => state.user.folderSubscriptionExceptions;

export const selectOtherUser = userId => state => state.user.otherUserCache[userId];

export default userSlice.reducer