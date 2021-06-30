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
        postReports: [],
        adminComments: [],
        blockedUsers: {},
        fetchReportsState: LoadingState.Pending,
        fetchCommentsState: LoadingState.Pending,
        actionState: LoadingState.Pending,
        actionError: "",
    },
    reducers: {
        setModerationQueue: (state, action) => {
            state.moderationQueue = action.payload;
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
        }
    },
})

export const { setModerationQueue, setReportsFetchState, setCommentsFetchState, setPostReports, setAdminComments, setAdminActionState, setAdminActionError, setBlockedUsers } = adminSlice.actions

export const selectModerationQueue = state => state.admin.moderationQueue;
export const selectAdminPostReports = state => state.admin.postReports;
export const selectAdminComments = state => state.admin.adminComments;
export const selectFetchReportsState = state => state.admin.fetchReportsState;
export const selectFetchCommentsState = state => state.admin.fetchCommentsState;
export const selectAdminActionState = state => state.admin.actionState;
export const selectAdminActionError = state => state.admin.actionError;
export const selectBlockedUsers = state => state.admin.blockedUsers;

export default adminSlice.reducer