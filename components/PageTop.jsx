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

import { useSelector } from "react-redux";

import { Toolbar, IconButton, Divider } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";

import { selectUser, selectUserLoadingState } from "../redux/userSlice";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
import PersonIcon from "@material-ui/icons/Person";

import { useMediaQuery } from "react-responsive";

import { LoginButtons } from "./LoginButtons";

import styles from "../styles/PageTop.module.scss";

export function PageTop({title, onShowFolderView, hasLeftDrawer, leftDrawerState}) {

    const router = useRouter();

    const currentUser = useSelector(selectUser);
    const userLoadingState = useSelector(selectUserLoadingState);

    const [anchorEl, setAnchorEl] = useState();

    const [isNarrowWindow, setIsNarrowWindow] = useState(true);

    const isWidth800 = useMediaQuery({ query: "(min-width: 800px)" });
    const isWidth980 = useMediaQuery({ query: "(min-width: 980px)" });

    useEffect(() => {
        setIsNarrowWindow(!isWidth800);
    }, [isWidth800]);

    const onOpenMenu = (ev) => {
        setAnchorEl(ev.target);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const onProfile = () => {
        router.push("/profile");
    }

    const onLogout = () => {
        router.push("/logout");
    }

    const onAdmin = () => {
        router.push("/admin");
    }

    const renderProfileButton = () => {

        if(!currentUser) {
            return <></>
        }

        let menuItems = [
            <MenuItem key={0} disabled data-test-id="user-menu-username">{currentUser.username}</MenuItem>,
            <Divider key={1} />,
            <MenuItem key={2} onClick={onProfile} data-test-id="user-menu-profile">Profile</MenuItem>,
            <MenuItem key={3} onClick={onLogout}>Logout</MenuItem>,
        ];

        if(currentUser.isAdmin) {
            menuItems = [
                ...menuItems,
                <Divider key={4} />,
                <MenuItem key={5} onClick={onAdmin}>Admin</MenuItem>,
            ]
        }

        return <>
            <IconButton aria-label="user" color="inherit" onClick={onOpenMenu} data-test-id="user-menu"><PersonIcon></PersonIcon></IconButton>
            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                >

                { menuItems }

            </Menu>
        </>

    }

    const renderFolderButton = () => {
        if(isNarrowWindow) {
            return <IconButton aria-label="show folder list" color="inherit" onClick={onShowFolderView}><MenuIcon></MenuIcon></IconButton>
        } else {
            return <></>
        }
    }

    return <>
        <Head>
            <title>{title}</title>
            <meta property="og:site_name" content="JUSTtheTalk" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:image" content="https://justthetalk.com/justthetalk_new.png" />
        </Head>
        <AppBar
            position={hasLeftDrawer ? "fixed" : "static"}
            className={[styles.appBar, (hasLeftDrawer ? (leftDrawerState ? styles.leftDrawerOpen : styles.leftDrawerClosed) : styles.noLeftDrawer)].join(" ")}>

            <Toolbar className={styles.toolbar}>
                    <div className={styles.logo}>
                        <Link href="/" aria-label="Go Home">
                            <a><img src="/justthetalk_new.png" alt="Just The Talk Logo" /></a>
                        </Link>
                    </div>

                    <div className={styles.strapline}>{!isNarrowWindow ? "Discuss the issues of the day in depth; from what you're watching, to football, science and philosophy via everything in-between." : ""}</div>

                    <div className={styles.appButtons}>
                        { !isNarrowWindow
                            ? <LoginButtons user={currentUser} loadingState={userLoadingState}/>
                            : <></>
                        }
                        { renderProfileButton() }
                        { renderFolderButton() }
                    </div>
            </Toolbar>
        </AppBar>
    </>
}