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
import ReportIcon from '@material-ui/icons/Report';
import HistoryIcon from '@material-ui/icons/History';

import { useDispatch, useSelector } from "react-redux";
import { clearUserActionState, selectUser, selectUserLoadingState } from "../redux/userSlice";
import { updateUserBio } from "../redux/userActions";

import WidePageLayout from "../layouts/widepage";

import { ReportsHistory } from "../components/admin/ReportsHistory";
import { ModerationQueue } from "../components/admin/ModerationQueue";
import { UsersBlocked } from "../components/admin/UsersBlocked";
import { UsersDetail } from "../components/admin/UsersDetail";
import { UsersLocked } from "../components/admin/UsersLocked";
import { UsersPremod } from "../components/admin/UsersPremod";
import { UsersRecent } from "../components/admin/UsersRecent";
import { UsersWatch } from "../components/admin/UsersWatch";

import styles from "../styles/Admin.module.scss";
import { LoadingState } from "../redux/constants";

const useStyles = makeStyles({
    root: {
        minWidth: 30,
    },
});

export default function Admin(props) {

    const router = useRouter();
    const dispatch = useDispatch();
    const classes = useStyles();

    const currentUser = useSelector(selectUser);
    const userLoadingState = useSelector(selectUserLoadingState);

    useEffect(() => {
        if(userLoadingState == LoadingState.Loaded && !currentUser && !currentUser.isAdmin) {
            window.location.href = "/";
        }
    }, [userLoadingState, currentUser]);

    const [viewType, setViewType] = useState("moderation-queue");

    if(!currentUser || !currentUser.isAdmin) {
        return <></>;
    }

    const renderDrawerContent = () => {
        return <List>
            <ListItem button onClick={() => setViewType("moderation-queue")} data-test-id="admin-moderation-queue">
                <ListItemIcon className={classes.root}><ReportIcon /></ListItemIcon>
                <ListItemText primary="Moderation Queue" />
            </ListItem>
            <ListItem button onClick={() => setViewType("reports-history")} data-test-id="admin-reports-history">
                <ListItemIcon className={classes.root}><HistoryIcon /></ListItemIcon>
                <ListItemText primary="Moderation History" />
            </ListItem>
            <ListItem button onClick={() => setViewType("users-detail")} data-test-id="admin-users-detail">
                <ListItemIcon className={classes.root}><PersonIcon /></ListItemIcon>
                <ListItemText primary="Users" />
            </ListItem>
            <ListItem button onClick={() => setViewType("users-premod")} data-test-id="admin-users-premod">
                <ListItemIcon className={classes.root}><PersonIcon /></ListItemIcon>
                <ListItemText primary="Users - Pre-Mod" />
            </ListItem>
            <ListItem button onClick={() => setViewType("users-watch")} data-test-id="admin-users-watch">
                <ListItemIcon className={classes.root}><PersonIcon /></ListItemIcon>
                <ListItemText primary="Users - On Watch" />
            </ListItem>
            <ListItem button onClick={() => setViewType("users-locked")} data-test-id="admin-users-locked">
                <ListItemIcon className={classes.root}><PersonIcon /></ListItemIcon>
                <ListItemText primary="Users - Locked" />
            </ListItem>
            <ListItem button onClick={() => setViewType("users-blocked")} data-test-id="admin-users-blocked">
                <ListItemIcon className={classes.root}><PersonIcon /></ListItemIcon>
                <ListItemText primary="Users - Thread blocks" />
            </ListItem>
            <ListItem button onClick={() => setViewType("users-recent")} data-test-id="admin-users-recent">
                <ListItemIcon className={classes.root}><PersonIcon /></ListItemIcon>
                <ListItemText primary="Users - Recent Signups" />
            </ListItem>
        </List>
    }

    const renderCurrentView = () => {
        switch(viewType) {
            case "moderation-queue":
                return <ModerationQueue />
            case "reports-history":
                return <ReportsHistory />;
            case "users-detail":
                return <UsersDetail />
            case "users-premod":
                return <UsersPremod />
            case "users-watch":
                return <UsersWatch />
            case "users-locked":
                return <UsersLocked />
            case "users-blocked":
                return <UsersBlocked />
            case "users-recent":
                return <UsersRecent />
            }
    }

    return <>
        <WidePageLayout user={currentUser} initialDrawerState={true} drawerContent={renderDrawerContent()} title="JUSTtheTalk - Admin">
            { currentUser
                ? renderCurrentView()
                : <></>
            }
        </WidePageLayout>
    </>
}