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
import Link from "next/link";
import { useRouter } from "next/router";

import { FormControl, FormControlLabel, Checkbox, TextField, Button, Card, Paper, Typography } from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";

import { sendForgotPasswordRequest } from "../redux/userActions";
import { selectUser, selectUserActionState, selectUserActionError, clearUserActionState } from "../redux/userSlice";

import ReCAPTCHA from "react-google-recaptcha";

import WidePageLayout from "../layouts/widepage";
import { Alert } from "../components/Alert";

import styles from "../styles/Login.module.scss";

import { LoadingState } from "../redux/constants";

const EmailRe = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export default function ForgotPassword() {

    const dispatch = useDispatch();

    const actionState = useSelector(selectUserActionState);

    const [email, setEmail] = useState("");
    const [recaptchaResponse, setRecaptchaResponse] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [errorState, setErrorState] = useState("");

    useEffect(() => {
        dispatch(clearUserActionState());
    }, []);

    useEffect(() => {
        switch(actionState) {
            case LoadingState.Pending:
                setErrorText("");
                break;
            case LoadingState.Loading:
                setErrorText("");
                break;
            case LoadingState.Loaded:
                setErrorText("Request sent");
                setErrorState("info");
                break;
            case LoadingState.Failed:
                setErrorText("Request failed");
                setErrorState("error");
                break;
        }
    }, [actionState]);

    const onSubmit = () => {

        let valid = true;

        if(!EmailRe.test(email)) {
            setErrorText("You must enter a valid e-mail address");
            setErrorState("error");
            setEmailError(true);
            valid = false;
        }

        if(recaptchaResponse.length === 0) {
            setErrorText("You must tick the 'I am not a robot' box");
            setErrorState("error");
            valid = false;
        }

        if(valid) {
            dispatch(sendForgotPasswordRequest({email, recaptchaResponse}))
        }

    }

    const onChangeEmail = (ev) => {
        setEmail(ev.target.value.trim());
    }

    const onChangeCaptcha = (ev) => {
        setRecaptchaResponse(ev);
    }

    return <WidePageLayout title="JUSTtheTalk - Forgotten Password">
        <div className={styles.content}>
            <div className={styles.loginFormContainer}>
                <Paper variant="outlined" className={styles.loginForm}>
                    <form noValidate autoComplete="off">
                        <Typography variant="h5" color="textSecondary" gutterBottom>Forgotten password</Typography>
                        <div>
                            <p>Enter your e-mail address and we'll send you a password reset request.</p>
                        </div>
                        <FormControl fullWidth className={styles.formControl}>
                            <TextField error={emailError} fullWidth required inputProps={{maxLength:64}} id="email" label="E-Mail Address" value={email} onChange={onChangeEmail}/>
                        </FormControl>
                        <div className={styles.recaptchaControl}>
                            <ReCAPTCHA sitekey="6LdQLO0SAAAAAFelu6xHS8_WRGPs12oJst3WwjNr" onChange={onChangeCaptcha}/>
                        </div>
                        <div className={styles.loginButtonContainer}>
                            <Button variant="contained" type="button" color="primary" onClick={onSubmit} disabled={actionState > 0}>Send</Button>
                        </div>
                        { errorText && errorText.length > 0 ? <Alert severity={errorState} className={styles.userAlert}>{errorText}</Alert> : <></> }
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