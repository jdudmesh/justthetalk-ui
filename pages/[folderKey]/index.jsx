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

import React, { useEffect, useState, useContext, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from "next/head";

import { Paper, Typography, Button } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import AddIcon from '@material-ui/icons/Add';
import AddAlertIcon from '@material-ui/icons/AddAlert';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import SyncIcon from '@material-ui/icons/Sync';

import PulseLoader from 'react-spinners/PulseLoader';
import { useMediaQuery } from "react-responsive";

import { selectFolders } from '../../redux/folderSlice'
import { selectDiscussions, selectDiscussionLoadingState, clearDiscussions, selectLastLoadCount } from '../../redux/discussionSlice'
import { fetchDiscussions } from '../../redux/discussionActions'
import { selectUser, selectCurrentFolder } from '../../redux/userSlice'
import { setUserLocation, setFolderSubscriptionStatus } from '../../redux/userActions'

import { LoadingState } from '../../redux/constants';

import MasterLayout from '../../layouts/master'
import { DiscussionIndexEntry } from '../../components/DiscussionIndexEntry'
import { ActionButton } from "../../components/ActionButton";
import { CreateDiscussion } from "../../components/CreateDiscussion";
import { Alert } from "../../components/Alert";

import styles from '../../styles/FolderView.module.scss'

export default function FolderView(props) {

    const router = useRouter();
    const { folderKey } = router.query

    const dispatch = useDispatch();

    const currentUser = useSelector(selectUser);
    const currentFolder = useSelector(selectCurrentFolder);

    const folders = useSelector(selectFolders);
    const discussions = useSelector(selectDiscussions);
    const loadingState = useSelector(selectDiscussionLoadingState);
    const lastLoadCount = useSelector(selectLastLoadCount);

    const [isCreatingDiscussion, setIsCreatingDiscussion] = useState(false);

    const isWidth800 = useMediaQuery({ query: "(min-width: 800px)" });

    useEffect(() => {
        if(folders.length > 0 && folderKey) {
            dispatch(setUserLocation(folderKey));
        }
    }, [folders, folderKey]);

    useEffect(() => {
        if(currentFolder && currentFolder.key === folderKey) {
            dispatch(fetchDiscussions(currentFolder));
        }
    }, [currentFolder]);

    useEffect(() => {

        if(!(currentFolder && currentFolder.key === folderKey)) {
            return;
        }

        if("undefined" === typeof IntersectionObserver) {
            return;
        }

        let observer = new IntersectionObserver((entries) => {
            for(let i = 0; i < entries.length; i++) {
                let entry = entries[i];
                if(entry.intersectionRatio > 0) {
                    if(loadingState === LoadingState.Loaded && discussions.length > 0 && lastLoadCount > 0) {
                        let lastEntry = discussions[discussions.length - 1];
                        dispatch(fetchDiscussions(currentFolder, lastEntry.lastPostDate));
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

    }, [currentFolder, loadingState]);

    const onCreateDiscussion = () => {
        setIsCreatingDiscussion(true);
    }

    const onCancelCreateDiscussion = () => {
        setIsCreatingDiscussion(false);
    }

    const onSubscribeToFolder = () => {
        dispatch(setFolderSubscriptionStatus(currentFolder, !currentFolder.isSubscribed));
    }

    const onReload = () => {
        if(currentFolder) {
            dispatch(clearDiscussions());
            dispatch(fetchDiscussions(currentFolder));
        }
    }

    const renderLoadingSpinner = () => {
        return <div className="loadingSpinner">
            <PulseLoader color="#2A5880"></PulseLoader>
        </div>
    }

    const renderDiscussions = () => {
        return <Paper variant="outlined" className="discussionList">
            <Typography variant="h5" color="textSecondary" gutterBottom>Discussions</Typography>
            { discussions.map((d, ix) => {
                return <DiscussionIndexEntry key={ix} discussion={d}></DiscussionIndexEntry>
                })
            }
            <div id="endOfListIndicator"></div>
            { loadingState === LoadingState.Loading ? renderLoadingSpinner() : <></> }
        </Paper>
    }

    const renderBreadcrumbs = () => {
        return <Paper variant="outlined" className="breadcrumb">
            <div className="breadcrumb-item"><Link href="/"><a><HomeIcon color="primary" /></a></Link></div>
            <div className="breadcrumb-item"><PlayArrowIcon color="action" /></div>
            <div className="breadcrumb-item">{currentFolder.description}</div>
        </Paper>
    }

    const renderLeftMenu = () => {
        return <div className="leftButtonMenu">
            <div className="leftButtonMenuInner">
                <ActionButton onClick={onReload} icon={<SyncIcon />} label="Refresh" testId="refresh-folder"/>
                <ActionButton onClick={onCreateDiscussion} icon={<AddIcon />} label="Create" testId="create-discussion"/>
                { currentFolder.isSubscribed
                    ? <ActionButton onClick={onSubscribeToFolder} icon={<NotificationsOffIcon />} label="Unsubscribe" testId="unsubscribe-folder"/>
                    : <ActionButton onClick={onSubscribeToFolder} icon={<AddAlertIcon />} label="Subscribe" testId="subscribe-folder"/>
                }
            </div>
        </div>
    }

    if(!currentFolder) {
        return <></>;
    }

    return <MasterLayout title={`JUSTtheTalk - ${currentFolder ? currentFolder.description : "Folder"}`} leftContent={renderLeftMenu()}>
        <Head>
            { currentFolder.key === "admin" || currentFolder.key === "personal" || currentFolder.key === "mod" || currentFolder.key === "userspace"
                ? <meta name="robots" content="noindex,nofollow" />
                : <meta name="robots" content="index,follow" />
            }

            <meta property="og:url" content={`https://justthetalk.com${currentFolder.key}`} />
        </Head>
        <div className="container">

            { currentFolder ? renderBreadcrumbs() : <></> }

            {!isWidth800 && currentUser ? renderLeftMenu() : <></> }

            { isCreatingDiscussion
                ? <CreateDiscussion folder={currentFolder} onCancelCreateDiscussion={onCancelCreateDiscussion}></CreateDiscussion>
                : <></>
            }

            { currentFolder && !isCreatingDiscussion ? renderDiscussions() : <></> }

        </div>

    </MasterLayout>

}