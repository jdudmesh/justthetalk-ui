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

import { useSelector, useDispatch } from "react-redux";

import { FormControl, TextField, Button, Paper, Typography } from "@material-ui/core";
import ReCAPTCHA from "react-google-recaptcha";

import { updateUserPassword } from "../../redux/userActions";
import { selectUser, selectUserActionState, selectUserActionError, clearUserActionState } from "../../redux/userSlice";

import { Alert } from "../Alert";

import styles from "../../styles/ChangePassword.module.scss";

import { LoadingState } from "../../redux/constants";

export function ChangePassword() {

    const dispatch = useDispatch();

    const currentUser = useSelector(selectUser);
    const actionState = useSelector(selectUserActionState);
    const actionError = useSelector(selectUserActionError);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [oldPasswordError, setOldPasswordError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [recaptchaResponse, setRecaptchaResponse] = useState("");

    useEffect(() => {
        dispatch(clearUserActionState());
    }, []);

    useEffect(() => {
        if (actionState == LoadingState.Failed && actionError) {
            setErrorText(actionError);
            dispatch(clearUserActionState());
        }
    }, [actionState, actionError]);

    const onChangeOldPassword = (ev) => {
        setOldPassword(ev.target.value);
    }

    const onChangePassword = (ev) => {
        setNewPassword(ev.target.value);
    }

    const onChangeConfirmPassword = (ev) => {
        setConfirmPassword(ev.target.value);
    }

    const onSubmit = () => {

        let valid = true;

        if (oldPassword.length === 0) {
            setErrorText("You must enter your old passeord")
            setOldPasswordError(true);
            valid = false;
        }

        if (newPassword.length < 8) {
            setErrorText("Your password must be between at least 8 characters");
            setPasswordError(true);
            valid = false;
        }

        if (newPassword !== confirmPassword) {
            setErrorText("Your password and confirmation do not match");
            setPasswordError(true);
            valid = false;
        }

        if (recaptchaResponse.length === 0 && publicRuntimeConfig.environment == "PRODUCTION") {
            setErrorText("You must tick the 'I am not a robot' box");
            setErrorState("error");
            valid = false;
        }

        if (valid) {
            dispatch(updateUserPassword({ oldPassword, newPassword, recaptchaResponse }))
        }

    }

    const onChangeCaptcha = (ev) => {
        setRecaptchaResponse(ev);
    }

    return <Paper elevation={0} className={styles.profileBlock}>
        <Typography variant="h6" color="textSecondary" gutterBottom>Change password</Typography>
        <form noValidate autoComplete="off">
            <FormControl fullWidth className={styles.formControl}>
                <TextField error={oldPasswordError} fullWidth required inputProps={{ maxLength: 256 }} id="oldPassword" label="Old password" type="password" value={oldPassword} onChange={onChangeOldPassword} />
            </FormControl>
            <FormControl fullWidth className={styles.formControl}>
                <TextField error={passwordError} fullWidth required inputProps={{ maxLength: 256 }} id="password" label="Password" type="password" value={newPassword} onChange={onChangePassword} />
            </FormControl>
            <FormControl fullWidth className={styles.formControl}>
                <TextField error={passwordError} fullWidth required inputProps={{ maxLength: 256 }} id="confirm-password" label="Confirm Password" type="password" value={confirmPassword} onChange={onChangeConfirmPassword} />
            </FormControl>
            <div className={styles.loginButtonContainer}>
                <Button variant="contained" type="button" color="primary" disabled={actionState !== LoadingState.Pending} onClick={onSubmit}>Change password</Button>
            </div>
            {errorText && errorText.length > 0 ? <Alert severity="error" className={styles.userAlert}>{errorText}</Alert> : <></>}
        </form>
        <div className={styles.recaptchaControl}>
            <ReCAPTCHA sitekey="6LdQLO0SAAAAAFelu6xHS8_WRGPs12oJst3WwjNr" onChange={onChangeCaptcha} />
        </div>
    </Paper>

}