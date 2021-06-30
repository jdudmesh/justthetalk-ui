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

import { useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { toast } from "react-toastify";


import { selectUser } from "../redux/userSlice";

import { checkSubscriptionAPI } from "../api";

import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";

import HomeIcon from "@material-ui/icons/Home";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";

import { useMediaQuery } from "react-responsive";

import styles from "../styles/Paging.module.scss";

export function Paging({onNavigate}) {

    const router = useRouter();

    const currentUser = useSelector(selectUser);

    const rootElement = useRef();

    const isWidth980 = useMediaQuery({ query: "(min-width: 980px)" });

    const onFirstPage = () => {
        onNavigate("first");
    }

    const onLastPage = () => {
        onNavigate("last");
    }

    const onPrevPage = () => {
        onNavigate("prev");
    }

    const onNextPage = () => {
        onNavigate("next");
    }

    const onNavigateUp = () => {
        onNavigate("up");
    }

    const onHome = () => {
        router.push("/");
    }

    const onCheckSubscriptions = () => {
        checkSubscriptionAPI().then((res) => {
            if(res.status == 200 && res.data.data) {
                if(router.asPath.startsWith(res.data.data)) {
                    onNavigate("check");
                } else {
                    router.push(res.data.data);
                }
            } else if(res.status === 204) {
                toast.success("No new posts to read");
                router.push("/");
            }
        });
    }

    const homeButton = () => {
        return <Tooltip title="Home" aria-label="go to home page">
            <Fab onClick={onHome} color="primary" size="small">
                <HomeIcon />
            </Fab>
        </Tooltip>
    }

    const upButton = () => {
        return <Tooltip title="Up to folder" aria-label="go to folder">
            <Fab onClick={onNavigateUp} color="primary" size="small">
                <ArrowUpwardIcon />
            </Fab>
        </Tooltip>
    }

    const checkButton = () => {
        return <Tooltip title="Check Subscriptions" aria-label="check subscriptions">
            <Fab onClick={onCheckSubscriptions} color="primary" size="small" component={currentUser ? undefined : "div"}>
                <NotificationsActiveIcon />
            </Fab>
        </Tooltip>
    }

    const firstButton = () => {
        return <Tooltip title="First page" aria-label="go to first page">
            <Fab onClick={onFirstPage} color="primary" size="small">
                <SkipPreviousIcon />
            </Fab>
        </Tooltip>
    }

    const lastButton = () => {
        return <Tooltip title="Last page" aria-label="go to last page">
            <Fab onClick={onLastPage} color="primary" size="small">
                <SkipNextIcon />
            </Fab>
        </Tooltip>
    }

    const prevButton = () => {
        return <Tooltip title="Previous page" aria-label="go to previous page">
            <Fab onClick={onPrevPage} color="primary" size="small">
                <ArrowLeftIcon />
            </Fab>
        </Tooltip>
    }

    const nextButton = () => {
        return <Tooltip title="Next page" aria-label="go to next page">
            <Fab onClick={onNextPage} color="primary" size="small">
                <ArrowRightIcon />
            </Fab>
        </Tooltip>
    }

    return (<div className={styles.container} ref={rootElement}>
        <div className={styles.pagingButtons}>
            { isWidth980
                ? <>
                    { homeButton() }
                    { upButton() }
                    { checkButton() }
                    { firstButton() }
                    { lastButton() }
                    { prevButton() }
                    { nextButton() }
                </>
                : <>
                    { checkButton() }
                    { lastButton() }
                    { prevButton() }
                    { nextButton() }
                </>
            }
        </div>
    </div>);

}
