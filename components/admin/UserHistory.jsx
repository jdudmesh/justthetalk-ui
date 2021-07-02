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

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Button } from "@material-ui/core";
import { classnames, DataGrid } from "@material-ui/data-grid";

import { format, formatDistanceToNow, parseISO, add, isFuture, isAfter } from 'date-fns'

import { fetchUserHistoryAPI } from "../../api";

import styles from "../../styles/Admin.module.scss";

export function UserHistory({userId, username, open, onClose}) {

    useEffect(() => {
        if(!(userId > 0 && open)) {
            return;
        }
        fetchUserHistoryAPI(userId).then((res) => {
            setHistory(res.data.data);
        });
    }, [userId, open]);

    const [history, setHistory] = useState([]);
    const [openState, setOpenState] = useState(false);

    const columns = [
        { field: 'id', hide: true },
        {
            field: 'createdDate',
            headerName: 'Date',
            flex: 0,
            width: 150,
            headerAlign: 'right',
            align: 'right',
            valueGetter: (params) => format(parseISO(params.row.createdDate), "d/M/yyyy H:mm")
        },
        {
            field: 'eventType',
            headerName: 'Type',
            flex: 1,
        },
        {
            field: 'eventData',
            headerName: 'Detail',
            flex: 1,
        },
    ];

    useEffect(() => {
        setOpenState(open);
    }, [open]);

    const handleClose = () => {
        onClose()
    }

    return <Dialog open={openState} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth>
        <DialogTitle id="form-dialog-title">User History - {username}</DialogTitle>
        <DialogContent className={styles.historyGridContainer}>

            <DataGrid
                rows={history}
                columns={columns}
                isRowSelectable={false}
                density="compact"
                />


        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="contained" >Close</Button>
        </DialogActions>
  </Dialog>

}