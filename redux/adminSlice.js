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

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        moderationQueue: [],
        moderationHistory: [],
        moderationHistoryFetchComplete: false,
        postReports: [],
        adminComments: [],
        blockedUsers: {},
        fetchModerationHistoryState: LoadingState.Pending,
        fetchReportsState: LoadingState.Pending,
        fetchCommentsState: LoadingState.Pending,
        actionState: LoadingState.Pending,
        actionError: "",
        userSearchResults: [],
    },
    reducers: {
        setModerationQueue: (state, action) => {
            state.moderationQueue = action.payload;
        },
        appendModerationHistory: (state, action) => {
            if(action.payload.length > 0) {
                state.moderationHistory = [...state.moderationHistory, ...action.payload];
            } else {
                state.moderationHistoryFetchComplete = true;
            }
        },
        setModerationHistoryFetchState: (state, action) => {
            state.fetchModerationHistoryState = action.payload
        },
        setReportsFetchState: (state, action) => {
            state.fetchReportsState = action.payload;
        },
        setCommentsFetchState: (state, action) => {
            state.fetchCommentsState = action.payload;
        },
        setPostReports: (state, action) => {
            state.postReports = action.payload;
        },
        setAdminComments: (state, action) => {
            state.adminComments = action.payload;
        },
        setAdminActionState: (state, action) => {
            state.actionState = action.payload;
        },
        setAdminActionError: (state, action) => {
            state.actionError = action.payload;
        },
        setBlockedUsers: (state, action) => {
            state.blockedUsers = action.payload;
        },
        setUserSearchResults: (state, action) => {
            state.userSearchResults = action.payload;
        },
        mergeUserSearchResults: (state, action) => {
            let user = action.payload;
            let nextResults = state.userSearchResults.map( u => {
                if(u.id === user.id) {
                    return user;
                } else {
                    return u;
                }
            });
            state.userSearchResults = [...nextResults];
        },
    },
})

export const {
    setModerationQueue,
    appendModerationHistory,
    setModerationHistoryFetchState,
    setReportsFetchState,
    setCommentsFetchState,
    setPostReports,
    setAdminComments,
    setAdminActionState,
    setAdminActionError,
    setBlockedUsers,
    setUserSearchResults,
    mergeUserSearchResults,
} = adminSlice.actions

export const selectModerationQueue = state => state.admin.moderationQueue;
export const selectModerationHistory = state => state.admin.moderationHistory;
export const selectAdminPostReports = state => state.admin.postReports;
export const selectAdminComments = state => state.admin.adminComments;
export const selectFetchModerationHistoryState = state => state.admin.fetchModerationHistoryState;
export const selectModerationHistoryFetchComplete = state => state.admin.moderationHistoryFetchComplete;
export const selectFetchReportsState = state => state.admin.fetchReportsState;
export const selectFetchCommentsState = state => state.admin.fetchCommentsState;
export const selectAdminActionState = state => state.admin.actionState;
export const selectAdminActionError = state => state.admin.actionError;
export const selectBlockedUsers = state => state.admin.blockedUsers;
export const selectUserSearchResults = state => state.admin.userSearchResults;

export default adminSlice.reducer