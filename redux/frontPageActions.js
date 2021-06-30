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

import { createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify';

import { LoadingState } from './constants';

import { fetchFrontPageAPI } from '../api';

import {
    setFrontpageSubscriptions,
    appendItems,
    setFrontPageLoadingState,
    setMaxPages
} from './frontPageSlice';

export const fetchFrontPage = (viewType, start) => (dispatch, getState) => {

    let state = getState();
    if(start > state.frontPage.maxPages) {
        return;
    }

    dispatch(setFrontPageLoadingState(LoadingState.Loading));

    let size = state.frontPage.pageSize;

    fetchFrontPageAPI(viewType, start, size).then((res) => {
        let items = res.data.data;
        if(items) {
            if(items.length < size) {
                dispatch(setMaxPages(start));
            }
            dispatch(appendItems(items));
        } else {
            dispatch(setMaxPages(start - 1));
        }
        dispatch(setFrontPageLoadingState(LoadingState.Loaded));
    }).catch((err) => {
        console.error(err);
        toast.error("Failed to fetch front page");
        dispatch(setFrontPageLoadingState(LoadingState.Failed));
    });

}

export const fetchFrontPageSubscriptions = () => (dispatch, getState) => {

    fetchFrontPageAPI("subs", 0, 50).then((res) => {
        const state = getState();
        let nextSubs = res.data.data;
        if(nextSubs) {
            //sortFrontpageSubscription(nextSubs, state);
            dispatch(setFrontpageSubscriptions(nextSubs));
        }
    }).catch((err) => {
        console.error(err);
        toast.error("Failed to fetch front page");
        dispatch(setFrontPageLoadingState(LoadingState.Failed));
    });

}

const sortFrontpageSubscription = (nextSubs, state) => {

    switch(state.user.user.subscriptionFetchOrder) {
        case 0: // oldest first
            nextSubs.sort((a, b) => {
                let d1 = new Date(a.lastPostDate).getTime();
                let d2 = new Date(b.lastPostDate).getTime();
                if(d1 > d2) {
                    return 1;
                }
                if(d1 < d2) {
                    return -1;
                }
                return 0;
            });
            break;
        case 1: // newest first
        nextSubs.sort((a, b) => {
            let d1 = new Date(a.lastPostDate).getTime();
            let d2 = new Date(b.lastPostDate).getTime();
            if(d1 > d2) {
                return -1;
            }
            if(d1 < d2) {
                return 1;
            }
            return 0;
        });
        break;
        case 2: // most unread
        nextSubs.sort((a, b) => {
            let d1 = a.postCount - a.lastPostReadCount;
            let d2 = b.postCount - b.lastPostReadCount;
            if(d1 > d2) {
                return -1;
            }
            if(d1 < d2) {
                return 1;
            }
            return 0;
        });
        break;
    }

}

export const mergeFrontpageSubscriptionUpdate = (post) => (dispatch, getState) => {

    const state = getState();

    let nextSubs = state.frontPage.frontpageSubscriptions.map( sub => {
        if(sub.discussionId === post.discussionId) {
            return {...sub, lastPostDate: post.createdDate, lastPostId: post.id, postCount: post.postNum };
        } else {
            return sub;
        }
    });

    //sortFrontpageSubscription(nextSubs, state);

    dispatch(setFrontpageSubscriptions(nextSubs));

}
