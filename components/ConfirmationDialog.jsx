import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export function ConfirmationDialog({ params }) {

    const handleClose = (state) => {
        params.onClose(state);
    };

    return <Dialog
        open={params.open}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{params.title}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {params.text}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => handleClose(true)} color="primary">
                YES
            </Button>
            <Button onClick={() => handleClose(false)} color="primary" autoFocus>
                NO
            </Button>
        </DialogActions>
    </Dialog>

}
