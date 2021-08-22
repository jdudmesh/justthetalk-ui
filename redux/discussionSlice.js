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

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { LoadingState } from './constants';

const discussionSlice = createSlice({
    name: 'discussion',
    initialState: {
        loadingState: LoadingState.Pending,
        actionState: LoadingState.Pending,
        lastLoadCount: 0,
        items: [],
        actionError: "",
        createdDiscussion: null,
        pageSize: 50,
    },
    reducers: {
        appendDiscussions: (state, action) => {
            state.items = [...state.items, ...action.payload];
        },
        clearDiscussions: (state) => {
            state.items = [];
            state.state = LoadingState.Loaded;
        },
        clearCreatedDiscussion: (state) => {
            state.discussionCreationState = 0;
            state.discussionCreationError = "";
            state.createdDiscussion = null;
        },
        setDiscussionLoadingState: (state, action) => {
            state.loadingState = action.payload;
        },
        setDiscussionActionState: (state, action) => {
            state.actionState = action.payload;
        },
        setDiscussionActionError: (state, action) => {
            state.actionError = action.payload;
        },
        clearDiscussionActionState: (state) => {
            state.actionState = LoadingState.Pending;
            state.actionError = "";
        },
        setLastLoadCount: (state, action) => {
            state.lastLoadCount = action.payload;
        },
        updateDiscussionItemsFromFrontPageEntry: (state, action) => {
            let entry = action.payload;
            let nextItems = state.items.map( item => {
                if(item.discussionId === entry.discussionId && entry.postCount > item.postCount) {
                    return { ...item,
                        postCount: entry.postCount,
                        lastPostDate: entry.lastPostDate,
                        lastPostId: entry.lastPostId,
                    }
                } else {
                    return item;
                }
            });
            state.items = [...nextItems];
        },
        updateDiscussionItemsFromPost: (state, action) => {
            let post = action.payload;
            let nextItems = state.items.map( item => {
                if(item.discussionId === post.discussionId && post.postNum > item.postCount) {
                    return { ...item,
                        postCount: post.postNum,
                        lastPostDate: post.createdDate,
                        lastPostId: post.id,
                        lastPostReadCount: post.postNum,
                    }
                } else {
                    return item;
                }
            });
            state.items = [...nextItems];
        },
    },
});

export const {
    appendDiscussions,
    clearDiscussions,
    clearCreatedDiscussion,
    setDiscussionLoadingState,
    setDiscussionActionState,
    setDiscussionActionError,
    clearDiscussionActionState,
    setLastLoadCount,
    updateDiscussionItemsFromPost,
    updateDiscussionItemsFromFrontPageEntry,
} = discussionSlice.actions

export const selectDiscussionLoadingState = state => state.discussion.loadingState;
export const selectDiscussionActionState = state => state.discussion.actionState;
export const selectDiscussions = state => state.discussion.items;
export const selectLastLoadCount = state => state.discussion.lastLoadCount;

export const selectCreatedDiscussion = state => state.discussion.createdDiscussion;
export const selectDiscussionActionError = state => state.discussion.actionError;

export default discussionSlice.reducer