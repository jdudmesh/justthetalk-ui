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

import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { useSelector, useDispatch } from 'react-redux'

import Link from 'next/link'

import Typography from '@material-ui/core/Typography';

import { Paper, Button } from '@material-ui/core'
import SmsIcon from '@material-ui/icons/Sms';
import HomeIcon from '@material-ui/icons/Home';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SyncIcon from '@material-ui/icons/Sync';
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";

import PulseLoader from 'react-spinners/PulseLoader';
import { useMediaQuery } from "react-responsive";

import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";

import MasterLayout from '../layouts/master'
import { DiscussionIndexEntry } from '../components/DiscussionIndexEntry'
import { ActionButton } from "../components/ActionButton";
import { Alert } from "../components/Alert";

import { toast } from "react-toastify";

import styles from '../styles/Home.module.scss'

import { selectFrontPageLoadingState, selectFrontPageItems, clearFrontPageItems, selectFrontPageMaxPages, selectFrontpageSubscriptions } from '../redux/frontPageSlice'
import { fetchFrontPage, fetchFrontPageSubscriptions } from '../redux/frontPageActions'
import { selectFolders } from '../redux/folderSlice'

import { selectUser, selectUserViewType, selectUserLoadingState } from '../redux/userSlice'
import { updateUserViewType, setUserLocation } from '../redux/userActions'
import { checkSubscriptionAPI } from "../api";
import { LoadingState } from '../redux/constants';

export default function Home(props) {

    const router = useRouter();
    const dispatch = useDispatch();

    const viewType = useSelector(selectUserViewType);
    const folders = useSelector(selectFolders);
    const discussions = useSelector(selectFrontPageItems);
    const loadingState = useSelector(selectFrontPageLoadingState);
    const currentUser = useSelector(selectUser);
    const currentUserLoadingState = useSelector(selectUserLoadingState);
    const maxPages = useSelector(selectFrontPageMaxPages);
    const subs = useSelector(selectFrontpageSubscriptions);

    const [viewTitle, setViewTitle] = useState("Latest Discussions");
    const [pageNum, setPageNum] = useState(0);
    const [showReadSubs, setShowReadSubs] = useState(false);

    const isWidth800 = useMediaQuery({ query: "(min-width: 800px)" });

    const SubscriptionOrder = {
        0: "(Oldest first)",
        1: "(Newest first)",
        2: "(Most unread posts)",
    }

    useEffect(() => {
        dispatch(setUserLocation());
    }, []);

    useEffect(() => {
        if(currentUserLoadingState !== LoadingState.Loaded) {
            return;
        }

        dispatch(fetchFrontPage(viewType, 0));
        if(currentUser) {
            dispatch(fetchFrontPageSubscriptions());
        }

    }, [currentUserLoadingState, currentUser, viewType]);

    useEffect(() => {

        if(loadingState != LoadingState.Loaded) {
            return;
        }

        let observer = new IntersectionObserver((entries) => {
            for(let i = 0; i < entries.length; i++) {
                let entry = entries[i];
                if(entry.intersectionRatio > 0) {
                    let nextPageNum = pageNum + 1;
                    if(nextPageNum <= maxPages) {
                        dispatch(fetchFrontPage(viewType, nextPageNum));
                        setPageNum(nextPageNum);
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
    }, [loadingState]);

    useEffect(() => {
        if(!viewType || currentUserLoadingState !== LoadingState.Loaded) {
            return;
        }
        switch(viewType) {
            case "latest":
            case "subs":
                setViewTitle("Latest discussions");
                break;
            case "mostactive":
                setViewTitle("Most active");
                break;
            case "startedbyme":
                setViewTitle("Started by me");
                break;
        }
    }, [viewType, currentUserLoadingState]);

    const onClickMenu = (key) => {
        setPageNum(0);
        dispatch(updateUserViewType(key));
    }

    const onReload = () => {
        setPageNum(0);
        dispatch(clearFrontPageItems());
        dispatch(fetchFrontPage(viewType, 0));
        dispatch(fetchFrontPageSubscriptions());
    }

    const onCheckSubscriptions = () => {
        checkSubscriptionAPI().then((res) => {
            if(res.status == 200 && res.data.data) {
                if(router.asPath.startsWith(res.data.data)) {
                    onNavigate("next");
                } else {
                    router.push(res.data.data);
                }
            } else if(res.status === 204) {
                toast.success("No new posts to read");
                router.push("/");
            }
        });
    }

    const onSetClickToViewAllSubs = () => {
        setShowReadSubs(!showReadSubs);
    }

    const renderLoadingSpinner = () => {
        return <div className="loadingSpinner">
            <PulseLoader color="#2A5880"></PulseLoader>
        </div>
    }

    const renderSubscriptions = () => {

        let unreadsubs = subs.filter(x => x.postCount - x.lastPostReadCount > 0);

        return <>
            <Typography variant="h5"  color="textSecondary" gutterBottom>{`Subscriptions ${SubscriptionOrder[currentUser.subscriptionFetchOrder]}`}</Typography>
            {unreadsubs.map((d, ix) => {
                return <DiscussionIndexEntry key={ix} discussion={d} folder={folders.find(x => x.id === d.folderId)}></DiscussionIndexEntry>;
            })}
            { unreadsubs.length === 0
                ? <Alert severity="info" className={styles.userAlert} action={<Button color="primary" size="small" onClick={onSetClickToViewAllSubs}>{`${showReadSubs ? "Hide" : "Show"}`} all</Button>}>You're up to date with all your subscriptions</Alert>
                : <Button color="primary" variant="outlined" className={styles.userAlert} size="medium" onClick={onSetClickToViewAllSubs}>{`${showReadSubs ? "Hide" : "Show"}`} all subscriptions...</Button>
            }
            { showReadSubs
                ? subs.filter(x => x.postCount - x.lastPostReadCount === 0).map((d, ix) => {
                    return <DiscussionIndexEntry key={ix} discussion={d} folder={folders.find(x => x.id === d.folderId)}></DiscussionIndexEntry>;
                })
                : <></>
            }
        </>
    }

    const renderDiscussions = () => {
        return <>
            <Typography variant="h5"  color="textSecondary" gutterBottom>{viewTitle}</Typography>
            {discussions.map((d, ix) => {
                return <DiscussionIndexEntry key={ix} discussion={d} folder={folders.find(x => x.id === d.folderId)}></DiscussionIndexEntry>;
            })}
            <div id="endOfListIndicator"></div>
        </>
    }

    const renderLeftMenu = () => {
        return <div className="leftButtonMenu">
            <div className="leftButtonMenuInner">
                <ActionButton onClick={onReload} icon={<SyncIcon />} label="Refresh" testId="reload-threads"/>
                <ActionButton icon={<SmsIcon />} label="View" onClick={(key) => onClickMenu(key)} menu={[
                    {label: `${viewType == "latest" ? "✓ " : ""}Latest`, key: "latest"},
                    {label: `${viewType == "mostactive" ? "✓ " : ""}Most active`, key: "mostactive"},
                    {label: `${viewType == "startedbyme" ? "✓ " : ""}Started by me`, key: "startedbyme"},
                ]} testId="viewtype-button"/>
            </div>
        </div>
    }

    return <MasterLayout title="JUSTtheTalk - Home" leftContent={renderLeftMenu()}>

        <div className="container">

            <Paper variant="outlined" className="breadcrumb">
                <div className="breadcrumb-item"><Link href="/"><a><HomeIcon color="primary" /></a></Link></div>
                <div className="breadcrumb-item"><PlayArrowIcon color="action" /></div>
                <div className="breadcrumb-item">Home</div>
            </Paper>

            {!isWidth800 && currentUser ? renderLeftMenu() : <></> }

            <Paper variant="outlined" className="discussionList">
                { viewType == "latest" && (currentUser && subs && subs.length > 0) ? renderSubscriptions() : <></> }
                { renderDiscussions() }
                { loadingState === LoadingState.Loading ? renderLoadingSpinner() : <></> }
            </Paper>

        </div>

    </MasterLayout>

}