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

import { Paper, Divider, Drawer, CssBaseline } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { ToastContainer } from "react-toastify";

import { useMediaQuery } from "react-responsive";

import { PageTop } from "../components/PageTop";

import styles from "../styles/WidePageLayout.module.scss";

export default function WidePageLayout({user, initialDrawerState, drawerContent, children, title}) {

    const [isNarrowWindow, setIsNarrowWindow] = useState(true);
    const [drawerState, setDrawerState] = useState(initialDrawerState);

    const isWidth800 = useMediaQuery({ query: "(min-width: 800px)" });

    useEffect(() => {
        setIsNarrowWindow(!isWidth800);
        setDrawerState(isWidth800);
    }, [isWidth800]);



    const onChangeDrawerState = () => {
        setDrawerState(!drawerState);
    }

    const renderDrawer = () => {
        return <Drawer
                className={styles.drawer}
                variant="permanent"
                anchor="left"
                open={true}
            >
                <div className={[styles.drawerContainer, (drawerState ? styles.open : styles.closed )].join(" ")}>
                    <div className={[styles.drawerHeader, (drawerState ? styles.open : styles.closed )].join(" ")}>
                        { drawerState
                            ? <IconButton onClick={onChangeDrawerState} className={styles.drawerButton} aria-label="close menu"><ChevronLeftIcon /></IconButton>
                            : <IconButton onClick={onChangeDrawerState} className={styles.drawerButton}aria-label="open menu"><ChevronRightIcon /></IconButton>
                        }
                    </div>
                    <Divider />
                    <div className={styles.drawerContent}>
                        { drawerContent }
                    </div>
                </div>
            </Drawer>
    }

    return <>

        <PageTop user={user} hasLeftDrawer={Boolean(drawerContent)} leftDrawerState={drawerState}  title={title}/>

        { drawerContent ? renderDrawer() : <></> }

        <div className={[styles.mainContainer, (drawerContent ? (drawerState ? styles.open : styles.closed) : styles.noDrawer )].join(" ")}>
            { children }
        </div>

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

    </>

}