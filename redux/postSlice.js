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

import { createSlice } from '@reduxjs/toolkit'
import { LoadingState } from './constants';

const postSlice = createSlice({
    name: 'post',
    initialState: {
        loadingState: LoadingState.Pending,
        actionState: LoadingState.Pending,
        actionError: "",
        state: 0,
        pageSize: 20,
        items: [],
        highlightedPost: null,
    },
    reducers: {

        clearPosts: (state) => {
            state.loadingState = LoadingState.Pending;
            state.items = [];
        },

        mergePosts: (state, action) => {

            let posts = action.payload;

            if(posts.length === 0) {
                return
            }

            let lastPosts = [...state.items];
            let nextPosts = [...posts];

            while(lastPosts.length > 0 && nextPosts.length > 0) {
                if(lastPosts[lastPosts.length-1].postNum === (nextPosts[0].postNum)) {
                    lastPosts.pop()
                } else if(lastPosts[lastPosts.length-1].postNum === (nextPosts[0].postNum - 1)) {
                    nextPosts.unshift(lastPosts.pop());
                } else if(lastPosts[0].postNum === nextPosts[nextPosts.length-1].postNum + 1) {
                    nextPosts.push(lastPosts.shift());
                } else {
                    lastPosts.shift();
                    lastPosts.pop();
                }
            }

            state.items = nextPosts;

        },

        setPostLoadingState: (state, action) => {
            state.loadingState = action.payload;
        },
        setPostActionState: (state, action) => {
            state.actionState = action.payload;
        },
        setPostActionError: (state, action) => {
            state.actionError = action.payload;
        },

        setHighlightedPost: (state, action) => {
            state.highlightedPost = action.payload;
        },

    },
})

export const { clearPosts, mergePosts, setPostActionError, setPostLoadingState, setPostActionState, setHighlightedPost } = postSlice.actions

export const selectPosts = state => state.post.items;
export const selectPostsPageStart = state => state.post.pageStart;
export const selectPostsPageSize = state => state.post.pageSize;
export const selectPostActionError = state => state.post.actionError;

export const selectPostLoadingState = state => state.post.loadingState;
export const selectPostActionState = state => state.post.actionState;

export const selectHighlightedPost = state => state.post.highlightedPost;

export default postSlice.reducer