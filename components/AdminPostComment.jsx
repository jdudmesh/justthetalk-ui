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
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';

import { Post } from './Post.jsx';

import { selectUser } from '../redux/userSlice';
import { createAdminComment } from '../redux/adminActions';

import styles from '../styles/AdminPostComment.module.scss';


export function AdminPostComment({post, open, onClose}) {

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
            dispatch(createAdminComment({discussionId: post.post.discussionId, postId: post.post.id, vote: post.vote, body: comment}));
            handleClose();
        }

    }

    if(!post) {
        return <></>
    }

    return <Dialog open={openState} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
        <DialogTitle id="form-dialog-title">Admin Comment ({post.vote == 1 ? "Keep" : "Delete"})</DialogTitle>
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