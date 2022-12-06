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
import getConfig from "next/config";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import { FormControl, TextField, Button, Card, Paper, Typography, Link } from "@material-ui/core";

import ReCAPTCHA from "react-google-recaptcha";

import WidePageLayout from "../layouts/widepage";
import { Alert } from "../components/Alert";

import styles from "../styles/Login.module.scss";

import { validatePasswordResetKey, updateUserPasswordFromKey } from "../redux/userActions";
import { selectUser, selectUserLoadingState, selectPasswordResetKeyValid, selectUserActionError, clearUserActionState } from "../redux/userSlice";

import { LoadingState } from "../redux/constants";

export default function ResetPassword() {

    const { publicRuntimeConfig } = getConfig();
    const router = useRouter();
    const dispatch = useDispatch();
    const currentUser = useSelector(selectUser);

    const { key } = router.query;

    const loadingState = useSelector(selectUserLoadingState);
    const actionError = useSelector(selectUserActionError);
    const passwordResetKeyValid = useSelector(selectPasswordResetKeyValid);

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
    }, [key]);

    useEffect(() => {
        console.log(loadingState, actionError)
        if(loadingState == LoadingState.Failed && actionError) {
            setErrorText(actionError || "");
            dispatch(clearUserActionState());
        } else if(loadingState == LoadingState.Loaded && currentUser) {
            router.push("/");
        }
    }, [loadingState, actionError]);

    useEffect(() => {
        setErrorText(actionError || "");
    }, [passwordResetKeyValid, actionError]);

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

        if(recaptchaResponse.length === 0 && publicRuntimeConfig.environment == "PRODUCTION") {
            setErrorText("You must tick the 'I am not a robot' box");
            setErrorState("error");
            valid = false;
        }

        if(valid) {
            dispatch(updateUserPasswordFromKey({resetKey: key, newPassword: password, recaptchaResponse}))
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
                    { passwordResetKeyValid && <form noValidate autoComplete="off">
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
                            <Button variant="contained" type="button" color="primary" disabled={errorText.length > 0} onClick={onSubmit}>Save</Button>
                        </div>                        
                    </form> }
                    { errorText && errorText.length > 0 ? <Alert severity="error" className={styles.userAlert}>{errorText}</Alert> : <></> }
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