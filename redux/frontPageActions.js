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

import { fetchFrontPageAPI, fetchFrontPageBeforeAPI, fetchFrontPageSinceAPI } from '../api';

import {
    setFrontPageItems,
    setFrontpageSubscriptions,
    appendFrontPageItems,
    prependFrontPageItems,
    setFrontPageLoadingState,
    setLastLoadCount,
} from './frontPageSlice';

export const fetchFrontPage = (viewType, beforeDate) => (dispatch, getState) => {

    let state = getState();

    dispatch(setFrontPageLoadingState(LoadingState.Loading));

    beforeDate = beforeDate || new Date().toISOString();
    const size = 50;

    fetchFrontPageBeforeAPI(viewType, beforeDate, size).then((res) => {
        localStorage.setItem("reloadCount", "0");
        let items = res.data.data;
        dispatch(setLastLoadCount(items.length));
        dispatch(appendFrontPageItems(items));
        dispatch(setFrontPageLoadingState(LoadingState.Loaded));
    }).catch((err) => {
        console.error(err);
        let reloadCount = parseInt(localStorage.getItem("reloadCount") || 0);
        if(reloadCount === 0) {
            localStorage.setItem("reloadCount", (reloadCount + 1).toString());
            window.location.reload()
        } else {
            toast.error("Failed to fetch front page");
            dispatch(setFrontPageLoadingState(LoadingState.Failed));
        }
    });

}

export const fetchFrontPageSince = (viewType, sinceDate) => (dispatch, getState) => {

    let state = getState();

    dispatch(setFrontPageLoadingState(LoadingState.Loading));

    sinceDate = sinceDate || new Date().toISOString();
    const size = 50;

    fetchFrontPageSinceAPI(viewType, sinceDate, size).then((res) => {
        localStorage.setItem("reloadCount", "0");
        let items = res.data.data;
        dispatch(prependFrontPageItems(items));
        dispatch(setFrontPageLoadingState(LoadingState.Loaded));
    }).catch((err) => {
        console.error(err);
        let reloadCount = parseInt(localStorage.getItem("reloadCount") || 0);
        if(reloadCount === 0) {
            localStorage.setItem("reloadCount", (reloadCount + 1).toString());
            window.location.reload()
        } else {
            toast.error("Failed to fetch front page");
            dispatch(setFrontPageLoadingState(LoadingState.Failed));
        }
    });

}

export const fetchFrontPageSubscriptions = () => (dispatch, getState) => {

    fetchFrontPageAPI("subs", 0, 50).then((res) => {
        const state = getState();
        let nextSubs = res.data.data;
        if(nextSubs) {
            dispatch(setFrontpageSubscriptions(nextSubs));
        }
    }).catch((err) => {
        console.error(err);
        toast.error("Failed to fetch front page");
        dispatch(setFrontPageLoadingState(LoadingState.Failed));
    });

}

export const updateFrontPageItemsFromBookmark = (bookmark) => (dispatch, getState) => {

    let state = getState();

    let nextItems = [...getNextFrontPageItemsFromBookmark(bookmark, state.frontPage.items)];
    sortFrontpageItems(nextItems);
    dispatch(setFrontPageItems(nextItems));

    let nextSubs = [...getNextFrontPageItemsFromBookmark(bookmark, state.frontPage.frontpageSubscriptions)];
    sortFrontpageSubscription(nextSubs, state);
    dispatch(setFrontpageSubscriptions(nextSubs));

}

export const updateFrontPageItemsFromPost = (post) => (dispatch, getState) => {

    let state = getState();

    let nextItems = [...getNextFrontPageItemsFromPost(post, state.frontPage.items)];
    sortFrontpageItems(nextItems);
    dispatch(setFrontPageItems(nextItems));

    let nextSubs = [...getNextFrontPageItemsFromPost(post, state.frontPage.frontpageSubscriptions)];
    sortFrontpageSubscription(nextSubs, state);
    dispatch(setFrontpageSubscriptions(nextSubs));

}

export const updateFrontPageFromFrontPageEntry = (entry) => (dispatch, getState) => {

    let state = getState();

    let nextItems = state.frontPage.items.map( item => {
        if(item.discussionId === entry.discussionId) {
            foundSubs = true
            return {...item, lastPostDate: entry.lastPostDate, lastPostId: entry.lastPostId, postCount: entry.postCount };
        } else {
            return item;
        }
    });
    sortFrontpageItems(nextItems);
    dispatch(setFrontPageItems(nextItems));

    let foundSubs = false;
    let nextSubs = state.frontPage.frontpageSubscriptions.map( sub => {
        if(sub.discussionId === entry.discussionId) {
            foundSubs = true
            return {...sub, lastPostDate: entry.lastPostDate, lastPostId: entry.lastPostId, postCount: entry.postCount };
        } else {
            return sub;
        }
    });
    sortFrontpageSubscription(nextSubs, state);
    dispatch(setFrontpageSubscriptions(nextSubs));

}


export const sortFrontpageSubscription = (nextSubs, state) => {

    switch(state.user.user.subscriptionFetchOrder) {
        case 0: // oldest first
            nextSubs.sort((a, b) => {
                if(a.lastPostId > b.lastPostId) {
                    return 1;
                }
                if(a.lastPostId < b.lastPostId) {
                    return -1;
                }
                return 0;
            });
            break;
        case 1: // newest first
        nextSubs.sort((a, b) => {
            if(a.lastPostId > b.lastPostId) {
                return -1;
            }
            if(a.lastPostId < b.lastPostId) {
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

export const sortFrontpageItems = (nextItems) => {

    nextItems.sort((a, b) => {
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

}

const getNextFrontPageItemsFromBookmark = (bookmark, currentItems) => {
    return currentItems.map( item => {
        if(item.discussionId === bookmark.discussionId) {
            return {
                ...item,
                lastPostReadCount: bookmark.lastPostCount,
                lastPostReadDate: bookmark.lastPostRead,
                lastPostReadId: bookmark.lastPostId
            }
        } else {
            return item;
        }
    });
}

const getNextFrontPageItemsFromPost = (post, currentItems) => {
    return currentItems.map( item => {
        if(item.discussionId === post.discussionId && post.postNum > item.postCount) {
            return {
                ...item,
                postCount: post.postNum,
                lastPostDate: post.createdDate,
                lastPostId: post.Id,
                lastPostReadCount: post.postNum,
                lastPostReadDate: post.createdDate,
                lastPostReadId: post.id
            }
        } else {
            return item;
        }
    });
}
