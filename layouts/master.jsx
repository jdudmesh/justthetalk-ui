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

import { useDispatch, useSelector } from "react-redux";

import { Toolbar, Tooltip, IconButton, Grid, TextField, Button } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";

import { FolderList } from "../components/FolderList";

import { selectFolderLoadState } from "../redux/folderSlice";
import { fetchFolders } from "../redux/folderActions";
import { selectUserLoadingState, selectUser, selectCurrentFolder, selectCurrentDiscussion } from "../redux/userSlice";

import Drawer from "@material-ui/core/Drawer";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
import PersonIcon from "@material-ui/icons/Person";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import { Router } from "@material-ui/icons";

import { ToastContainer } from "react-toastify";
import { useMediaQuery } from "react-responsive";

import { LoadingState } from "../redux/constants";

import { PageTop } from "../components/PageTop";
import { LoginButtons } from "../components/LoginButtons";
import { SearchBar } from "../components/SearchBar";

import styles from "../styles/MasterLayout.module.scss";

export default function MasterLayout({title, leftContent, children}) {

    const router = useRouter();

    const userLoadingState = useSelector(selectUserLoadingState);
    const currentUser = useSelector(selectUser);

    const [drawOpenState, setDrawOpenState] = useState(false);

    const [isNarrowWindow, setIsNarrowWindow] = useState(true);

    const isWidth800 = useMediaQuery({ query: "(min-width: 800px)" });

    useEffect(() => {
        setIsNarrowWindow(!isWidth800);
    }, [isWidth800]);

    const onShowFolderView = () => {
        setDrawOpenState(true);
    }

    const renderRightColumn = () => {

        return <div className={isNarrowWindow ? styles.bigContent : styles.standardContent}>
            <div className={styles.rightColumnContent} id="search">
                { currentUser
                    ? <div className={styles.searchBar}>
                        <SearchBar isNarrowWindow={isNarrowWindow}/>
                    </div>
                    : <></>
                }
            </div>

            <div className={styles.rightColumnContent} id="folders">
                <Typography variant="h5" color="textSecondary" gutterBottom>
                    Folders
                </Typography>
                { currentUser && currentUser.isAdmin ? (<FolderList folderType={3}></FolderList>) : (<></>)}
                <FolderList folderType={0}></FolderList>
            </div>

            <div className={styles.rightColumnContent} id="links">
                    <Typography variant="h5" color="textSecondary" gutterBottom>
                        Links
                    </Typography>
                    <ul className={styles.linksList}>
                        <li><Link href="/about"><a>About Us</a></Link></li>
                        <li><Link href="/support"><a>Support JUSTtheTalk</a></Link></li>
                        <li><Link href="/help"><a>Help</a></Link></li>
                        <li><Link href="/terms"><a>Terms &amp; Conditions</a></Link></li>
                    </ul>
            </div>

        </div>

    }

    const renderMainContent = () => {
        return <div className={styles.mainContent}>
            <div className={styles.leftColumn}>
                { !isNarrowWindow && currentUser ? leftContent : <></> }
            </div>
            <div className={styles.centreColumn}>
                { isNarrowWindow && router.pathname !== "/login"
                    ? <div className={styles.narrowWidthLoginButtons}>
                        <LoginButtons user={currentUser} />
                    </div>
                    : <></>
                }
                {children}
            </div>
            <div className={styles.rightColumn}>
                { !isNarrowWindow ? renderRightColumn() : <></> }
            </div>
        </div>
    }

    return <>
        <PageTop title={title} onShowFolderView={onShowFolderView}></PageTop>

        { isNarrowWindow
            ?  <Drawer anchor="right" open={drawOpenState} onClose={() => setDrawOpenState(false)}>
                <div className={styles.drawerContent}>
                    <div className={styles.drawerClose}>
                        <IconButton aria-label="close folder list" color="inherit" size={isNarrowWindow ? "large" : "small"} onClick={() => setDrawOpenState(false)}><CloseIcon></CloseIcon></IconButton>
                    </div>
                    {renderRightColumn()}
                </div>
            </Drawer>
            : <></>
        }

        { userLoadingState === LoadingState.Loaded ? renderMainContent() : <></> }

        <ToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            />

    </>;

}