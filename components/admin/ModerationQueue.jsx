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

import { selectModerationQueue } from "../../redux/adminSlice";
import { fetchModerationQueue } from "../../redux/adminActions";

import { Paper, Button } from "@material-ui/core";

import { Post } from "../Post";

import styles from "../../styles/Admin.module.scss";

export function ModerationQueue({}) {

    const dispatch = useDispatch();

    const moderationQueue = useSelector(selectModerationQueue);

    useEffect(() => {
        dispatch(fetchModerationQueue());
    }, []);

    const renderPosts = () => {
        return moderationQueue.map((post, ix) => {
            return <Paper key={ix} className={styles.post}>
                <Post post={post} />
            </Paper>
        })
    }

    return <div className={styles.postContainer}>
        <div>
            <div className="discussionList">
                { renderPosts() }
            </div>
        </div>
    </div>

}