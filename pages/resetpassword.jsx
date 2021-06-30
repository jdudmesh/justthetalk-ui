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

import { FormControl, TextField, Button, Card, Paper, Typography, Link } from "@material-ui/core";

import ReCAPTCHA from "react-google-recaptcha";

import WidePageLayout from "../layouts/widepage";
import { Alert } from "../components/Alert";

import styles from "../styles/Login.module.scss";

import { validatePasswordResetKey, updateUserPassword } from "../redux/userActions";
import { selectUser, selectUserLoadingState, selectUserActionState, selectUserActionError, clearUserActionState } from "../redux/userSlice";

import { LoadingState } from "../redux/constants";

export default function ResetPassword() {

    const router = useRouter();
    const dispatch = useDispatch();

    const { key } = router.query;

    const loadingState = useSelector(selectUserLoadingState);
    const actionError = useSelector(selectUserActionError);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [recaptchaResponse, setRecaptchaResponse] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [errorText, setErrorText] = useState("");

    useEffect(() => {
        if(!key) {
            return;
        }
        dispatch(clearUserActionState());
        dispatch(validatePasswordResetKey(key))
        setErrorText("");
    }, [key]);

    useEffect(() => {
        if((loadingState == LoadingState.Failed || loadingState == LoadingState.Failed) && actionError) {
            setErrorText(actionError);
            dispatch(clearUserActionState());
        } else if(loadingState == LoadingState.Loaded) {
            router.push("/");
        }
    }, [loadingState, actionError]);

    const onChangePassword = (ev) => {
        setPassword(ev.target.value);
    }

    const onChangeConfirmPassword = (ev) => {
        setConfirmPassword(ev.target.value);
    }

    const onSubmit = () => {

        let valid = true;

        if(password.trim().length < 8) {
            setErrorText("Your password must be between at least 8 characters");
            setPasswordError(true);
            valid = false;
        }

        if(password !== confirmPassword) {
            setErrorText("Your password and confirmation do not match");
            setPasswordError(true);
            valid = false;
        }

        if(recaptchaResponse.length === 0) {
            setErrorText("You must tick the 'I am not a robot' box");
            setErrorState("error");
            valid = false;
        }

        if(valid) {
            dispatch(updateUserPassword({resetKey: key, newPassword: password, recaptchaResponse}))
        }

    }

    const onChangeCaptcha = (ev) => {
        setRecaptchaResponse(ev);
    }

    return <WidePageLayout title="JUSTtheTalk - Reset Password">
        <div className={styles.content}>
            <div className={styles.loginFormContainer}>
                <Paper elevation={0} className={styles.profileBlock}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>Reset password</Typography>
                    <form noValidate autoComplete="off">
                        <FormControl fullWidth className={styles.formControl}>
                            <TextField error={passwordError} fullWidth required inputProps={{maxLength:256}} id="password" label="New password" type="password" value={password} onChange={onChangePassword}/>
                        </FormControl>
                        <FormControl fullWidth className={styles.formControl}>
                            <TextField error={passwordError} fullWidth required inputProps={{maxLength:256}} id="confirm-password" label="Confirm password" type="password" value={confirmPassword} onChange={onChangeConfirmPassword}/>
                        </FormControl>
                        <div className={styles.recaptchaControl}>
                            <ReCAPTCHA sitekey="6LdQLO0SAAAAAFelu6xHS8_WRGPs12oJst3WwjNr" onChange={onChangeCaptcha}/>
                        </div>
                        <div className={styles.loginButtonContainer}>
                            <Button variant="contained" type="button" color="primary" disabled={loadingState !== LoadingState.Pending} onClick={onSubmit}>Save</Button>
                        </div>
                        { errorText && errorText.length > 0 ? <Alert severity="error" className={styles.userAlert}>{errorText}</Alert> : <></> }
                    </form>
                </Paper>
            </div>
        </div>
    </WidePageLayout>

}

export async function getStaticProps(context) {
    return {
        props: {},
    }
}