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

import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, ListItemSecondaryAction, IconButton, Typography } from '@material-ui/core';

import PersonIcon from "@material-ui/icons/Person";
import DeleteIcon from '@material-ui/icons/Delete';

import { selectUser } from "../../redux/userSlice";
import { fetchIgnoredUsers, ignoreUser } from "../../redux/userActions";

import { compareIgnoredUsers } from "../../lib/utils";

import styles from "../../styles/IgnoredUsers.module.scss";

export function IgnoredUsers() {

    const dispatch = useDispatch();

    const currentUser = useSelector(selectUser);

    if(!currentUser) {
        return <></>
    }

    useEffect(() => {
        dispatch(fetchIgnoredUsers());
    }, [dispatch]);

    const onDelete = (user) => {
        dispatch(ignoreUser(user.ignoredUserId, false));
    }

    return <Paper elevation={0} className={styles.profileBlock}>
        <Typography variant="h6" color="textSecondary" gutterBottom>Ignored Users</Typography>
        <List>
            {Object.entries(currentUser.ignoredUsers).sort(([k1, u1], [k2, u2]) => compareIgnoredUsers(u1, u2)).map(([key, user], ix) => {
                return <ListItem key={ix} className={styles.item}>
                    <ListItemAvatar><Avatar><PersonIcon /></Avatar></ListItemAvatar>
                    <ListItemText>{user.ignoredUserName}</ListItemText>
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => onDelete(user)} data-test-id="delete-ignored-user">
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            })}
        </List>
    </Paper>

}