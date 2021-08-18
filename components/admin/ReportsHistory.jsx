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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Paper, Button } from "@material-ui/core";

import PulseLoader from 'react-spinners/PulseLoader';

import { Post } from "../Post";

import { fetchModerationHistory } from "../../redux/adminActions";
import { selectModerationHistory, selectFetchModerationHistoryState, selectModerationHistoryFetchComplete } from "../../redux/adminSlice";

import { LoadingState } from '../../redux/constants';

import styles from "../../styles/Admin.module.scss";

export function ReportsHistory({}) {

    const dispatch = useDispatch();

    const [pageNum, setPageNum] = useState(0);

    const moderationHistory = useSelector(selectModerationHistory);
    const moderationHistoryFetchComplete = useSelector(selectModerationHistoryFetchComplete);
    const loadingState = useSelector(selectFetchModerationHistoryState);

    useEffect(() => {
        dispatch(fetchModerationHistory(pageNum));
    }, []);

    useEffect(() => {

        if(!IntersectionObserver) {
            return;
        }

        let observer = new IntersectionObserver((entries) => {
            for(let i = 0; i < entries.length; i++) {
                let entry = entries[i];
                if(entry.intersectionRatio > 0) {
                    if(loadingState === LoadingState.Loaded && !moderationHistoryFetchComplete) {
                        let nextPageNum = pageNum + 1;
                        dispatch(fetchModerationHistory(nextPageNum));
                        setPageNum(nextPageNum);
                    }
                    break;
                }
            }
        });

        let el = document.getElementById("endOfListIndicator");
        if(el) {
            observer.observe(el);
        }

        return () => {
            observer.disconnect();
        }

    }, [loadingState]);

    const renderPosts = () => {
        return moderationHistory.map((post, ix) => {
            return <Paper key={ix} className={styles.post}>
                <Post post={post} />
            </Paper>
        })
    }

    const renderLoadingSpinner = () => {
        return <div className="loadingSpinner">
            <PulseLoader color="#2A5880"></PulseLoader>
        </div>
    }

    return <div className={styles.postContainer}>
        <div>
            <div className="discussionList">
                { renderPosts() }
                <div id="endOfListIndicator"></div>
                { loadingState === LoadingState.Loading ? renderLoadingSpinner() : <></> }
            </div>
        </div>
    </div>

}