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

import { useRouter } from "next/router";

import { useDispatch, useSelector } from "react-redux";

import { Paper, Typography, TextField, Button, FormControlLabel, Checkbox, FormControl, Select, MenuItem, InputLabel} from '@material-ui/core';

import { selectUser, selectUserLoadingState } from "../../redux/userSlice";
import { updateUserBio, updateUserAutoSubscribe, updateUserSortFolders, updateUserSubscriptionFetchOrder } from "../../redux/userActions";

import styles from "../../styles/UserProfile.module.scss";

export function UserProfile() {


    const router = useRouter();
    const dispatch = useDispatch();

    const currentUser = useSelector(selectUser);
    const userLoadingState = useSelector(selectUserLoadingState);

    const [profileText, setProfileText] = useState();
    const [autoSubscribe, setAutoSubscribe] = useState(false);
    const [sortFolders, setSortFolders] = useState(false);
    const [subscriptionFetchOrder, setSubscriptionFetchOrder] = useState(0);

    useEffect(() => {
        if(currentUser) {
            setProfileText(currentUser.bio);
            setAutoSubscribe(currentUser.autoSubscribe);
            setSortFolders(currentUser.sortFoldersByActivity);
            setSubscriptionFetchOrder(currentUser.subscriptionFetchOrder);
        }
    }, [currentUser]);

    const onChangeProfileText = (ev) => {
        setProfileText(ev.target.value);
    }

    const onChangeAutoSubscribe = (ev) => {
        dispatch(updateUserAutoSubscribe(ev.target.checked));
    }

    const onChangeSortFolders = (ev) => {
        dispatch(updateUserSortFolders(ev.target.checked));
    }

    const onSaveProfile = () => {
        dispatch(updateUserBio(profileText));
    }

    const onChangeSubscriptionFetchOrder = (ev) => {
        dispatch(updateUserSubscriptionFetchOrder(ev.target.value));
    }

    return <Paper elevation={0} className={styles.container}>
        <Typography variant="h6" color="textSecondary" gutterBottom>Username: {currentUser.username}</Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>Say something about yourself:</Typography>
        <TextField multiline rows={5} variant="outlined" fullWidth label="My profile..." value={profileText} onChange={onChangeProfileText} inputProps={{maxLength: "1024"}}></TextField>
        <div className={styles.footer}>
            <Button variant="contained" color="primary" onClick={onSaveProfile}>Save Profile</Button>
        </div>
        <FormControlLabel label="Subscribe to discussions automatically" control={<Checkbox color="primary" checked={autoSubscribe} onChange={onChangeAutoSubscribe}></Checkbox>} />
        <FormControlLabel label="Sort folders by activity" control={<Checkbox color="primary" checked={sortFolders} onChange={onChangeSortFolders}></Checkbox>} />

            <FormControl variant="outlined" className={styles.subscriptionFetchOrder}>
                <InputLabel id="substype-label">Subscriptions reading order</InputLabel>
                <Select
                labelId="substype-label"
                id="substype"
                value={subscriptionFetchOrder}
                onChange={onChangeSubscriptionFetchOrder}
                label="Subscriptions reading order"
                >
            <MenuItem value={0}>Oldest First</MenuItem>
            <MenuItem value={1}>Newest First</MenuItem>
            <MenuItem value={2}>Most Unread</MenuItem>
            </Select>
        </FormControl>

    </Paper>

}