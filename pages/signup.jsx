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

import { createUser } from "../redux/userActions";
import { selectUser, selectUserActionState, selectUserActionError, clearUserActionState } from "../redux/userSlice";

import ReCAPTCHA from "react-google-recaptcha";

import WidePageLayout from "../layouts/widepage";
import { Alert } from "../components/Alert";

import styles from "../styles/Login.module.scss";

import { LoadingState } from "../redux/constants";

const EmailRe = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export default function Signup() {

    const dispatch = useDispatch();
    const router = useRouter();

    const currentUser = useSelector(selectUser);
    const actionState = useSelector(selectUserActionState);
    const actionError = useSelector(selectUserActionError);

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [recaptchaResponse, setRecaptchaResponse] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [agreeTermsError, setAgreeTermsError] = useState("");
    const [errorText, setErrorText] = useState("");

    useEffect(() => {
        dispatch(clearUserActionState());
    }, []);

    useEffect(() => {
        switch(actionState) {
            case LoadingState.Failed:
                setErrorText(actionError);
                break;
            case LoadingState.Loaded:
                router.push("/");
                break;
            }
    }, [actionState, actionError]);

    const onSubmit = () => {

        let valid = true;

        if(username.trim().length < 4) {
            setErrorText("You must enter a user name of at least 4 characters")
            setUsernameError(true);
            valid = false;
        } else {
            if(/\W/.test(username)) {
                setErrorText("A user name can only contain the characters A-Z, a-z, 0-9 or _");
                setUsernameError(true);
                valid = false;
            }
        }

        if(password.length < 8) {
            setErrorText("Your password must be between at least 8 characters");
            setPasswordError(true);
            valid = false;
        }

        if(password !== confirmPassword) {
            setErrorText("Your password and confirmation do not match");
            setPasswordError(true);
            valid = false;
        }

        if(!EmailRe.test(email)) {
            setErrorText("You must enter a valid e-mail address");
            setEmailError(true);
            valid = false;
        }

        if(!agreeTerms) {
            setAgreeTermsError("You must accept the terms and conditions");
            valid = false;
        }

        if(recaptchaResponse.length === 0) {
            setAgreeTermsError("You must tick the 'I am not a robot' box");
            valid = false;
        }

        if(valid) {
            dispatch(createUser({email, username, password, agreeTerms, recaptchaResponse}))
        }

    }

    const onChangeEmail = (ev) => {
        setEmail(ev.target.value.trim());
    }

    const onChangeUsername = (ev) => {
        setUsername(ev.target.value.trim());
    }

    const onChangePassword = (ev) => {
        setPassword(ev.target.value.trim());
    }

    const onChangeConfirmPassword = (ev) => {
        setConfirmPassword(ev.target.value.trim());
    }

    const onChangeAgreeTerms = (ev) => {
        setAgreeTerms(ev.target.checked);
    }

    const onChangeCaptcha = (ev) => {
        setRecaptchaResponse(ev);
    }

    const renderSignup = () => {
        return <WidePageLayout title="JUSTtheTalk - Sign up">
            <div className={styles.content}>
                <div className={styles.loginFormContainer}>
                    <div>
                        <p>Welcome to JUSTtheTalk, the home of the Guardian Talk community. We are a community of individuals who enjoy discussing anything and everything. There are no limits to what can be talked about here but we recommend that you read our <Link href="/terms"><a>terms and conditions</a></Link> before you sign up. </p>
                    </div>
                    <Paper variant="outlined" className={styles.loginForm}>
                        <form noValidate autoComplete="off">
                            <Typography variant="h5" color="textSecondary" gutterBottom>Sign up</Typography>
                            <FormControl fullWidth className={styles.formControl}>
                                <TextField error={emailError} fullWidth required inputProps={{maxLength:64}} id="email" label="E-Mail Address" value={email} onChange={onChangeEmail}/>
                            </FormControl>
                            <FormControl fullWidth className={styles.formControl}>
                                <TextField error={usernameError} fullWidth required inputProps={{maxLength:24}} id="username" label="Username" value={username} onChange={onChangeUsername}/>
                            </FormControl>
                            <FormControl fullWidth className={styles.formControl}>
                                <TextField error={passwordError} fullWidth required inputProps={{maxLength:256}} id="password" label="Password" type="password" value={password} onChange={onChangePassword}/>
                            </FormControl>
                            <FormControl fullWidth className={styles.formControl}>
                                <TextField error={passwordError} fullWidth required inputProps={{maxLength:256}} id="confirm-password" label="Confirm Password" type="password" value={confirmPassword} onChange={onChangeConfirmPassword}/>
                            </FormControl>
                            <div>
                                <FormControlLabel label="I accept the Terms &amp; Conditions" control={<Checkbox color="primary" checked={agreeTerms} onChange={onChangeAgreeTerms}></Checkbox>} />
                            </div>
                            <div className={styles.recaptchaControl}>
                                <ReCAPTCHA sitekey="6LdQLO0SAAAAAFelu6xHS8_WRGPs12oJst3WwjNr" onChange={onChangeCaptcha}/>
                            </div>
                            <div className={styles.loginButtonContainer}>
                                <Button variant="contained" type="button" color="primary" onClick={onSubmit}>Sign up</Button>
                            </div>
                            { errorText && errorText.length > 0 ? <Alert severity="error" className={styles.userAlert}>{errorText}</Alert> : <></> }
                            { agreeTermsError && agreeTermsError.length > 0 ? <Alert severity="error" className={styles.userAlert}>{agreeTermsError}</Alert> : <></> }
                        </form>
                    </Paper>
                    <div>
                    <Typography variant="h6">Your Data Privacy</Typography>
                    <p>
                        On May 25th 2018 the EU's General Data Protection Regulation (GDPR) comes into force. This new legislation gives you more control and greater protections around how your personal data can be stored and used. For more information about how this relates to your use of JUSTtheTalk please refere to our <Link href="/privacy"><a>privacy policy</a></Link>.
                    </p>
                </div>
                </div>
            </div>
        </WidePageLayout>

    }

    if(currentUser && actionState === LoadingState.Pending) {
        return <Alert severity="error" className={styles.userAlert}>You are already logged in. You cannot sign up while you're logged in.</Alert>
    } else {
        return renderSignup();
    }

}

export async function getStaticProps(context) {
    return {
        props: {},
    }
}