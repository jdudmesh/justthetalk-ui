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

import { useDispatch, useSelector } from "react-redux";

import Link from "next/link";

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Button, Grid, TextField, Tooltip, IconButton, Menu, MenuItem } from "@material-ui/core";
import { DataGrid, GridToolbarContainer } from "@material-ui/data-grid";

import { format, formatDistanceToNow, parseISO, add, isFuture, isAfter } from 'date-fns'

import { selectAllBlockedUsers  } from "../../redux/adminSlice";
import { fetchAllBlockedUsers } from "../../redux/adminActions";

import { UserHistory } from "./UserHistory";

import styles from "../../styles/UsersDetail.module.scss";

import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import LockIcon from '@material-ui/icons/Lock';
import PauseIcon from '@material-ui/icons/Pause';
import PolicyIcon from '@material-ui/icons/Policy';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

const useStyles = makeStyles({
    gridRoot: {
        '&.MuiDataGrid-root .MuiDataGrid-cell:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
            outline: 'none',
        },
    },
    buttonRoot: {
        '&.MuiButtonBase-root:focus': {
            outline: 'none',
        },
    }
});

export function UsersBlocked({}) {

    const dispatch = useDispatch();
    const muiStyles = useStyles();

    const users = useSelector(selectAllBlockedUsers);

    const [showHistoryUserId, setShowHistoryUserId] = useState(0);
    const [showHistoryUserName, setShowHistoryUserName] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        dispatch(fetchAllBlockedUsers());
    }, []);

    const showUserHistory = (detail) => {
        setShowHistoryUserId(detail.id);
        setShowHistoryUserName(detail.username);
    }

    const onCloseHistory = () => {
        setShowHistoryUserId(0);
        setShowHistoryUserName("");
    }

    const onDelete = () => {
        console.log(selectedItems);
    }

    const onSelect = (ev) => {
        setSelectedItems(ev.selectionModel);
    }

    const columns = [
        { field: 'id', hide: true },
        {
            field: 'username',
            headerName: 'Name',
            flex: 0,
            width: 200,
            renderCell: (params) => <a className={styles.usernameLink} onClick={() => showUserHistory(params.row)}>{params.row.username}</a>,
        },
        {
            field: 'discussion',
            headerName: 'Discussion',
            flex: 1,
            renderCell: (params) => <Link href={params.row.url}><a>{`${params.row.folderTitle} - ${params.row.discussionTitle}`}</a></Link>,
        },
    ]

    const toolbar = () => {
        return <GridToolbarContainer className={styles.tableToolbar}>
            <Button onClick={onDelete} color="primary" startIcon={<DeleteIcon />}>Delete selected</Button>
        </GridToolbarContainer>
    }

    console.log(users);
    return <Paper elevation={0} className={styles.container}>
        <Typography variant="h6" color="textSecondary" size="small" gutterBottom>Users</Typography>

        <DataGrid
            className={muiStyles.gridRoot}
            rows={users}
            columns={columns}
            isRowSelectable={false}
            onSelectionModelChange={onSelect}
            components={{
                Toolbar: toolbar
            }}
            checkboxSelection
            density="compact"
             />

        <UserHistory open={showHistoryUserId > 0} userId={showHistoryUserId} username={showHistoryUserName} onClose={onCloseHistory} />

    </Paper>

}