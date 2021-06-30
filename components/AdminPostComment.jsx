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
import DialogTitle from '@material-ui/core/DialogTitle';

import { selectUser } from '../redux/userSlice';
import { createAdminComment } from '../redux/adminActions';

export function AdminPostComment({result, open, onClose}) {

    const dispatch = useDispatch();

    const currentUser = useSelector(selectUser);

    const [comment, setComment] = useState("");
    const [commentError, setCommentError] = useState(false);

    const [openState, setOpenState] = useState(false);

    useEffect(() => {
        setComment("");
        setOpenState(open);
    }, [open]);

    const handleClose = () => {
        onClose()
    }

    const onChangeComment = (ev) => {
        setComment(ev.target.value);
    }

    const onSave = () => {

        if(!currentUser) {
            return;
        }

        let isErr = false;

        if(comment.length == 0) {
            setCommentError(true);
            isErr = true;
        } else {
            setCommentError(true);
        }

        if(!isErr) {
            dispatch(createAdminComment({discussionId: result.post.discussionId, postId: result.post.id, vote: result.vote, body: comment}));
            handleClose();
        }

    }

    if(!result) {
        return <></>
    }

    return <Dialog open={openState} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
        <DialogTitle id="form-dialog-title">Admin Comment ({result.vote == 1 ? "Keep" : "Delete"})</DialogTitle>
            <DialogContent>

                <TextField
                    autoFocus
                    margin="dense"
                    id="reportComment"
                    label="Your comment"
                    multiline
                    rows={10}
                    variant="outlined"
                    fullWidth
                    required
                    length={512}
                    error={commentError}
                    value={comment}
                    onChange={onChangeComment}
                />

            </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="secondary" variant="contained" >Cancel</Button>
      <Button onClick={onSave} color="primary" variant="contained" >Save</Button>
    </DialogActions>
  </Dialog>

}