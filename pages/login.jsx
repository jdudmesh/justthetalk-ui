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

import WidePageLayout from "../layouts/widepage";
import { Alert } from "../components/Alert";

import { FormControl, TextField, Button, Card, Paper, Typography, Link } from "@material-ui/core";
import styles from "../styles/Login.module.scss";

import { loginUser } from "../redux/userActions";
import { selectUser, selectUserActionError } from "../redux/userSlice";

export default function Login() {

    const router = useRouter();
    const dispatch = useDispatch();

    const currentUser = useSelector(selectUser);
    const actionError = useSelector(selectUserActionError);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    useEffect(() => {
        if(currentUser != null) {
            router.push("/");
        }
    }, [currentUser]);

    useEffect(() => {
        if(actionError != null) {
            setLoginError(actionError);
        }
    }, [actionError]);

    const onSubmit = () => {
        setUsernameError(username.length === 0);
        setPasswordError(password.length === 0);
        if(!(username.length === 0 || password.length === 0)) {
            dispatch(loginUser({username, password}));
        } else {
            setLoginError("You must enter a username and password");
        }
    }

    const onChangeUsername = (ev) => {
        setUsername(ev.target.value);
        if(ev.target.value.length > 0) {
            setUsernameError(false);
            setLoginError("");
        }
    }

    const onChangePassword = (ev) => {
        setPassword(ev.target.value);
        if(ev.target.value.length > 0) {
            setPasswordError(false);
            setLoginError("");
        }
    }

    const onCheckForEnterKey = (ev) => {
        if(ev.keyCode === 13) {
            onSubmit();
        }
    }

    return <WidePageLayout title="JUSTtheTalk - Login">
        <div className={styles.content}>
            <div className={styles.loginFormContainer}>
                <Paper variant="outlined" className={styles.loginForm}>
                    <form noValidate autoComplete="off">
                        <Typography variant="h5" color="textSecondary" gutterBottom>Login</Typography>
                        <FormControl fullWidth className={styles.formControl}>
                            <TextField error={usernameError} fullWidth required id="username" label="Username" value={username} onChange={onChangeUsername} inputProps={{"data-test-id":"username"}} onKeyDown={onCheckForEnterKey}/>
                        </FormControl>
                        <FormControl fullWidth className={styles.formControl}>
                            <TextField error={passwordError} fullWidth required id="password" label="Password" type="password" value={password} onChange={onChangePassword} inputProps={{"data-test-id":"password"}} onKeyDown={onCheckForEnterKey}/>
                        </FormControl>
                        <div className={styles.loginButtonContainer}>
                            <Button variant="contained" type="button" color="primary" disabled={Boolean(currentUser)} onClick={onSubmit} data-test-id="login-button">Login</Button>
                        </div>
                        <div className={styles.errorContainer}>
                            { loginError ? (<Alert severity="error">{loginError}</Alert>) : (<></>)}
                        </div>
                        <div>
                            <Link href="/forgotpassword">I've forgotten my password...</Link>
                        </div>
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