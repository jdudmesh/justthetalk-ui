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
import { sortFrontpageSubscription, sortFrontpageItems } from "./frontPageActions";

const frontPageSlice = createSlice({
    name: 'frontPage',
    initialState: {
        loadingState: LoadingState.Pending,
        actionState: LoadingState.Pending,
        items: [],
        frontpageSubscriptions: [],
        pageSize: 50,
        maxPages: 9999,
    },
    reducers: {
        setFrontPageItems: (state, action) => {
            state.items = [...action.payload];
        },
        appendFrontPageItems: (state, action) => {
            state.items = [...state.items, ...action.payload];
        },
        clearFrontPageItems: (state) => {
            state.items = [];
            state.maxPages = 9999;
            state.loadingState = LoadingState.Pending;
        },
        setFrontPageLoadingState: (state, action) => {
            state.loadingState = action.payload;
        },
        setFrontPageActionState: (state, action) => {
            state.actionState = action.payload;
        },
        setMaxPages: (state, action) => {
            state.maxPages = action.payload;
        },
        setFrontpageSubscriptions: (state, action) => {
            state.frontpageSubscriptions = [...action.payload];
        },
        mergeFrontPageEntry: (state, action) => {

            let entry = action.payload;

            let foundSubs = false;
            let nextSubs = state.frontpageSubscriptions.map( sub => {
                if(sub.discussionId === entry.discussionId) {
                    foundSubs = true
                    return {...sub, lastPostDate: entry.lastPostDate, lastPostId: entry.lastPostId, postCount: entry.postCount };
                } else {
                    return sub;
                }
            });
            sortFrontpageSubscription(nextSubs, state);
            state.frontpageSubscriptions = [...nextSubs];

            let nextItems = state.items.map( item => {
                if(item.discussionId === entry.discussionId) {
                    foundSubs = true
                    return {...item, lastPostDate: entry.lastPostDate, lastPostId: entry.lastPostId, postCount: entry.postCount };
                } else {
                    return item;
                }
            });
            state.items = [...nextItems];
        },
    },
});

export const {
    setFrontPageItems,
    setFrontpageSubscriptions,
    appendFrontPageItems,
    clearFrontPageItems,
    setFrontPageLoadingState,
    setFrontPageActionState,
    setMaxPages,
} = frontPageSlice.actions

export const selectFrontPageLoadingState = state => state.frontPage.loadingState;
export const selectFrontPageItems = state => state.frontPage.items;
export const selectFrontPageMaxPages = state => state.frontPage.maxPages;
export const selectFrontpageSubscriptions = state => state.frontPage.frontpageSubscriptions;

export default frontPageSlice.reducer