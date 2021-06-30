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

import React, { useEffect, useMemo, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { Tooltip } from '@material-ui/core'

import Typography from '@material-ui/core/Typography'

import { withStyles } from '@material-ui/core/styles';

import { selectOtherUser } from "../redux/userSlice";
import { fetchOtherUser } from "../redux/userActions";

import { formatDistanceToNow } from "date-fns";

import styles from "../styles/UserLink.module.scss";

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: 'white',
      color: 'rgba(0, 0, 0, 0.87)',
      width: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
      boxShadow: "5px 5px 5px #eee",
    },
  }))(Tooltip);

export function UserLink({userId, username }) {

    const dispatch = useDispatch();

    const user = useSelector(selectOtherUser(userId));

    const [userBio, setUserBio] = useState("This user hasn't shared a profile yet");
    const [joinDate, setJoinDate] = useState("");

    useMemo(() => {
        if(!user) {
            dispatch(fetchOtherUser(userId));
        }
    }, [userId, user]);

    useEffect(() => {
        if(user) {
            setUserBio(user.bio);
            setJoinDate(`since ${formatDistanceToNow(new Date(user.createdDate))}`);
        }
    }, [user])

    return <HtmlTooltip
            title={
            <React.Fragment>
                <Typography variant="subtitle2" color="inherit" gutterBottom>{username}</Typography>
                <Typography variant="body2" color="inherit">{userBio}</Typography>
            </React.Fragment>
            }
        >
        <a className={styles.usernameLink}>{username}</a>
    </HtmlTooltip>

}