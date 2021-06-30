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
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";

import { makeStyles } from '@material-ui/core/styles';
import { Paper, List, ListItem, ListItemIcon, ListItemText, ListItemAvatar, Avatar, Divider, Typography, TextField, Button, FormControlLabel, Checkbox} from '@material-ui/core';

import PersonIcon from "@material-ui/icons/Person";
import FolderIcon from '@material-ui/icons/Folder';
import SmsIcon from '@material-ui/icons/Sms';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import SnoozeIcon from '@material-ui/icons/Snooze';

import { useDispatch, useSelector } from "react-redux";
import { clearUserActionState, selectUser, selectUserLoadingState } from "../redux/userSlice";
import { updateUserBio } from "../redux/userActions";

import WidePageLayout from "../layouts/widepage";

import { UserProfile } from "../components/profile/UserProfile";
import { FolderSubscriptions } from "../components/profile/FolderSubscriptions";
import { DiscussionSubscriptions } from "../components/profile/DiscussionSubscriptions";
import { IgnoredUsers } from "../components/profile/IgnoredUsers";
import { ChangePassword } from "../components/profile/ChangePassword";


import styles from "../styles/Profile.module.scss";
import { LoadingState } from "../redux/constants";

const useStyles = makeStyles({
    root: {
        minWidth: 30,
    },
});

export default function Profile(props) {

    const router = useRouter();
    const dispatch = useDispatch();
    const classes = useStyles();

    const currentUser = useSelector(selectUser);
    const userLoadingState = useSelector(selectUserLoadingState);

    useEffect(() => {
        if(userLoadingState == LoadingState.Loaded && !currentUser) {
            window.location.href = "/";
        }
    }, [userLoadingState, currentUser]);

    const [viewType, setViewType] = useState("profile");


    if(!currentUser) {
        return <></>;
    }

    const renderDrawerContent = () => {
        return <List>
            <ListItem button onClick={() => setViewType("profile")} data-test-id="user-profile-profile">
                <ListItemIcon className={classes.root}><PersonIcon /></ListItemIcon>
                <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={() => setViewType("foldersubs")} data-test-id="user-profile-foldersubs">
                <ListItemIcon className={classes.root}><FolderIcon /></ListItemIcon>
                <ListItemText primary="Folder subs" />
            </ListItem>
            <ListItem button onClick={() => setViewType("discussionsubs")} data-test-id="user-profile-discussionsubs">
                <ListItemIcon className={classes.root}><SmsIcon /></ListItemIcon>
                <ListItemText primary="Discussion subs" />
            </ListItem>
            <ListItem button onClick={() => setViewType("ignored")} data-test-id="user-profile-ignoredusers">
                <ListItemIcon className={classes.root}><SnoozeIcon /></ListItemIcon>
                <ListItemText primary="Ignored users" />
            </ListItem>
            <ListItem button onClick={() => setViewType("changepassword")}  data-test-id="user-profile-changepassword">
                <ListItemIcon className={classes.root}><VpnKeyIcon /></ListItemIcon>
                <ListItemText primary="Change password" />
            </ListItem>

        </List>
    }

    const renderCurrentView = () => {
        switch(viewType) {
            case "profile":
                return <UserProfile />
            case "foldersubs":
                return <FolderSubscriptions />;
            case "discussionsubs":
                return <DiscussionSubscriptions />
            case "ignored":
                return <IgnoredUsers />
            case "changepassword":
                return <ChangePassword />
        }
    }

    return <>
        <WidePageLayout user={currentUser} initialDrawerState={true} drawerContent={renderDrawerContent()} title="JUSTtheTalk - Profile">
            { currentUser
                ? renderCurrentView()
                : <></>
            }
        </WidePageLayout>
    </>
}