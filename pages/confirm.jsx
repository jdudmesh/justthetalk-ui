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

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import PulseLoader from "react-spinners/PulseLoader";

import { FormControl, TextField, Button, Card, Paper, Typography, Link } from "@material-ui/core";

import ReCAPTCHA from "react-google-recaptcha";

import WidePageLayout from "../layouts/widepage";
import { Alert } from "../components/Alert";

import styles from "../styles/Login.module.scss";

import { confirmUserAccountKey } from "../redux/userActions";
import { selectUser, selectUserLoadingState, selectUserActionState, selectUserActionError, clearUserActionState } from "../redux/userSlice";

import { LoadingState } from "../redux/constants";

export default function ConfirmSignup() {

    const router = useRouter();
    const dispatch = useDispatch();

    const { key } = router.query;

    const currentUser = useSelector(selectUser);
    const loadingState = useSelector(selectUserLoadingState);
    const actionError = useSelector(selectUserActionError);
    const [errorText, setErrorText] = useState("");

    useEffect(() => {
        if(!key) {
            return;
        }
        setErrorText("");
        dispatch(confirmUserAccountKey(key));
    }, [key]);

    useEffect(() => {
        if(loadingState == LoadingState.Failed && actionError) {
            setErrorText(actionError);
        }
    }, [loadingState, actionError]);

    const onSubmit = () => {
        router.push("/");
    }

    return <WidePageLayout title="JUSTtheTalk - Account Confirmation">
        <div className={styles.content}>
            <div className={styles.loginFormContainer}>
                { (loadingState == LoadingState.Loading || loadingState == LoadingState.Pending)
                    ? <div className="loadingSpinner">
                            <PulseLoader color="#2A5880"></PulseLoader>
                        </div>
                    : <></>
                }
                { errorText && errorText.length > 0 ? <Alert severity="error" className={styles.userAlert}>{errorText}</Alert> : <></> }

                { loadingState === LoadingState.Loaded
                    ? <Paper elevation={0} className={styles.profileBlock}>
                        <Typography variant="h6" color="textSecondary" gutterBottom>Account confirmed</Typography>
                        <Typography variant="body1" color="textSecondary" gutterBottom>Congratulations, you have successfully confirmed your account details. Click the button below to start posting...</Typography>
                        <div className={styles.loginButtonContainer}>
                            <Button variant="contained" type="button" color="primary" onClick={onSubmit}>Start posting!</Button>
                        </div>
                    </Paper>
                    : <></>
                }
            </div>
        </div>
    </WidePageLayout>

}

export async function getStaticProps(context) {
    return {
        props: {},
    }
}