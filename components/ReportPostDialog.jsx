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

import React, {useState, useEffect} from 'react';

import { useSelector, useDispatch } from 'react-redux'

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { Post } from './Post.jsx';

import { selectUser } from '../redux/userSlice';
import { createReport } from '../redux/userActions';

import styles from '../styles/ReportPostDialog.module.scss';

export function ReportPostDialog({folder, discussion, post, open, onClose}) {

    const dispatch = useDispatch();

    const currentUser = useSelector(selectUser);

    const [reporterName, setReporterName] = useState("");
    const [reporterEmail, setReporterEmail] = useState("");
    const [reportBody, setReportBody] = useState("");

    const [reporterNameError, setReporterNameError] = useState(false);
    const [reporterEmailError, setReporterEmailError] = useState(false);
    const [reportBodyError, setReportBodyError] = useState(false);

    const [openState, setOpenState] = useState(false);

    useEffect(() => {
        setReportBody("");
        setOpenState(open);
    }, [open]);

    useEffect(() => {
        if(currentUser) {
            setReporterName(currentUser.username);
            setReporterEmail(currentUser.email);
        }
    }, [currentUser]);

    const handleClose = () => {
        onClose()
    }

    const onChangeName = (ev) => {
        setReporterName(ev.target.value);
    }

    const onChangeEmail = (ev) => {
        setReporterEmail(ev.target.value);
    }

    const onChangeBody = (ev) => {
        setReportBody(ev.target.value);
    }

    const onSave = (ev) => {

        let isErr = false;

        if(reporterName.length == 0) {
            setReporterNameError(true);
            isErr = true;
        } else {
            setReporterNameError(false);
        }

        if(reporterEmail.length == 0) {
            setReporterEmailError(true);
            isErr = true;
        } else {
            setReporterEmailError(false);
        }

        if(reportBody.length == 0) {
            setReportBodyError(true);
            isErr = true;
        } else {
            setReportBodyError(false);
        }

        if(!isErr) {
            dispatch(createReport(post.id, reporterName, reporterEmail, reportBody));
            handleClose();
        }
    }

    return <Dialog open={openState} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Report a post</DialogTitle>
            <DialogContent>

                <DialogContentText>
                    <p>We will generally only remove posts that are defamatory, racist, homophobic, misogynistic, incite hatred or are of a commercial nature. The nature of free speech is such that you are free to disagree with other points of view, points of view which you may find offensive but you are not free to curtail them.</p>
                    <p>Occasionally some posters resort to personal abuse. This can be deeply unpleasant and you should use the "Ignore" (see the Help page) feature to block posters who you feel are being abusive towards you. In the event that abuse becomes persistent bullying, please report the posts to us.</p>
                    <p>In all cases the decision of the moderators is final.</p>
                </DialogContentText>

                <Card variant="outlined" className={styles.postCard}>
                    <CardContent>
                        { post && discussion && folder
                            ? <Post post={post} discussion={discussion} folder={folder} readOnly={true} blockedUsers={{}}></Post>
                            : <></>
                        }
                    </CardContent>
                </Card>

                <TextField
                    margin="dense"
                    id="reportUserName"
                    label="Your name"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    length={64}
                    error={reporterNameError}
                    value={reporterName}
                    onChange={onChangeName}
                    inputProps={{"data-test-id": "report-username-text"}}
                />
                <TextField
                    margin="dense"
                    id="reportEmail"
                    label="Your e-mail address"
                    type="email"
                    variant="outlined"
                    fullWidth
                    required
                    length={64}
                    error={reporterEmailError}
                    value={reporterEmail}
                    onChange={onChangeEmail}
                    inputProps={{"data-test-id": "report-email-text"}}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="reportText"
                    label="Please explain why you are reporting this post"
                    multiline
                    rows={10}
                    variant="outlined"
                    fullWidth
                    required
                    length={512}
                    error={reportBodyError}
                    value={reportBody}
                    onChange={onChangeBody}
                    inputProps={{"data-test-id": "report-reporttext-text"}}
                />

            </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="secondary" variant="contained" >
        Cancel
      </Button>
      <Button onClick={onSave} color="primary" variant="contained" data-test-id="save-report">
        Send
      </Button>
    </DialogActions>
  </Dialog>
}