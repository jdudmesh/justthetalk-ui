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

import { selectUserSearchResults  } from "../../redux/adminSlice";
import { searchUsers, filterUsers, toggleUserStatus } from "../../redux/adminActions";

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

export function UsersDetail({}) {

    const dispatch = useDispatch();
    const muiStyles = useStyles();

    const users = useSelector(selectUserSearchResults);

    const [filterType, setFilterType] = useState("search");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterLabel, setFilterLabel] = useState("Filter: Search");
    const [anchorEl, setAnchorEl] = useState(null);
    const [showHistoryUserId, setShowHistoryUserId] = useState(0);
    const [showHistoryUserName, setShowHistoryUserName] = useState("");

    const columns = [
        { field: 'id', hide: true },
        {
            field: 'username',
            headerName: 'Name',
            flex: 1,
            renderCell: (params) => <a onClick={() => showUserHistory(params.row)}>{params.row.username}</a>,
        },
        { field: 'email', headerName: 'EMail', flex: 1 },
        {
            field: 'createdDate',
            headerName: 'Joined',
            flex: 0,
            width: 150,
            headerAlign: 'right',
            align: 'right',
            valueGetter: (params) => format(parseISO(params.row.createdDate), "d/M/yyyy H:mm")
        },
        {
            field: 'lastLoginDate',
            headerName: 'Last Login',
            flex: 0,
            width: 150,
            headerAlign: 'right',
            align: 'right',
            valueGetter: (params) => format(parseISO(params.row.lastLoginDate), "d/M/yyyy H:mm")
        },
        {
            field: 'enabled',
            headerName: 'Deleted',
            editable: false,
            filterable: false,
            disableColumnMenu: true,
            flex: 0,
            width: 50,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => <IconButton className={muiStyles.buttonRoot} size="small" onClick={() => onActionUser(params.field, params.row)}>{params.row.enabled ? <ClearIcon /> : <CheckIcon />}</IconButton>,
            renderHeader: (params) => <Tooltip title="Deleted"><DeleteIcon /></Tooltip>

        },
        {
            field: 'accountLocked',
            headerName: 'Locked',
            editable: false,
            filterable: false,
            disableColumnMenu: true,
            flex: 0,
            width: 50,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => <IconButton className={muiStyles.buttonRoot} size="small" onClick={() => onActionUser(params.field, params.row)}>{params.row.accountLocked ? <CheckIcon /> : <ClearIcon />}</IconButton>,
            renderHeader: (params) => <Tooltip title="Locked"><LockIcon /></Tooltip>
        },
        {
            field: 'isPremoderate',
            headerName: 'Locked',
            editable: false,
            filterable: false,
            disableColumnMenu: true,
            flex: 0,
            width: 50,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => <IconButton className={muiStyles.buttonRoot} size="small" onClick={() => onActionUser(params.field, params.row)}>{params.row.isPremoderate ? <CheckIcon /> : <ClearIcon />}</IconButton>,
            renderHeader: (params) => <Tooltip title="Pre-moderated"><PauseIcon /></Tooltip>
        },
        {
            field: 'isWatch',
            headerName: 'Locked',
            editable: false,
            filterable: false,
            disableColumnMenu: true,
            flex: 0,
            width: 50,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => <IconButton className={muiStyles.buttonRoot} size="small" onClick={() => onActionUser(params.field, params.row)}>{params.row.isWatch ? <CheckIcon /> : <ClearIcon />}</IconButton>,
            renderHeader: (params) => <Tooltip title="Watch"><PolicyIcon /></Tooltip>
        },
        {
            field: 'isAdmin',
            headerName: 'Locked',
            editable: false,
            filterable: false,
            disableColumnMenu: true,
            flex: 0,
            width: 50,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => <IconButton className={muiStyles.buttonRoot} size="small" onClick={() => onActionUser(params.field, params.row)}>{params.row.isAdmin ? <CheckIcon /> : <ClearIcon />}</IconButton>,
            renderHeader: (params) => <Tooltip title="Admin"><SupervisorAccountIcon /></Tooltip>
        },

      ];

    const onActionUser = (field, user) => {
        console.log(field, user);
        dispatch(toggleUserStatus(field, user));
    }

    const onKeyDown = (ev) => {
        if(ev.keyCode === 13) {
            onSearch();
        }
    }

    const onSearch = () => {
        dispatch(searchUsers(searchTerm));
    }

    const onOpenMenu = (ev) => {
        setAnchorEl(ev.currentTarget);
    }

    const onCloseMenu = () => {
        setAnchorEl(null);
    }

    const onSelectFilter = (key) => {
        setFilterType(key);
        switch(key) {
            case "search":
                setFilterLabel("Filter: Search");
                break;
            case "premod":
                setFilterLabel("Filter: On Pre-moderation");
                break;
            case "watch":
                setFilterLabel("Filter: On Watch");
                break;
            case "locked":
                setFilterLabel("Filter: Locked");
                break;
            case "recent":
                setFilterLabel("Filter: Recent");
                break;
        }
        if(key !== "search") {
            dispatch(filterUsers(key));
        }
        onCloseMenu();
    }

    const showUserHistory = (detail) => {
        setShowHistoryUserId(detail.id);
        setShowHistoryUserName(detail.username);
    }

    const onCloseHistory = () => {
        setShowHistoryUserId(0);
        setShowHistoryUserName("");
    }

    return <Paper elevation={0} className={styles.container}>
        <Typography variant="h6" color="textSecondary" size="small" gutterBottom>Users</Typography>

        <div className={styles.tableToolbar}>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={onOpenMenu}>{filterLabel}</Button>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={onCloseMenu}
                >
                <MenuItem onClick={() => onSelectFilter("search")}>Search by name</MenuItem>
                <MenuItem onClick={() => onSelectFilter("premod")}>On Pre-Moderation</MenuItem>
                <MenuItem onClick={() => onSelectFilter("watch")}>On Watch</MenuItem>
                <MenuItem onClick={() => onSelectFilter("locked")}>Locked</MenuItem>
                <MenuItem onClick={() => onSelectFilter("recent")}>Recent Signups</MenuItem>
            </Menu>

            { filterType === "search"
                ?   <div className={styles.searchBar}>
                        <TextField id="input-with-icon-grid" size="small" label="Search JUSTtheTalk" fullWidth value={searchTerm} onChange={(ev) => setSearchTerm(ev.target.value)} onKeyDown={onKeyDown}/>
                        <Tooltip title="Search" aria-label="search posts"><IconButton size="small" color="primary" onClick={onSearch}><SearchIcon/></IconButton></Tooltip>
                    </div>
                : <></>
            }

        </div>

        <DataGrid
            className={muiStyles.gridRoot}
            rows={users}
            columns={columns}
            isRowSelectable={false}
            density="compact"
             />

        <UserHistory open={showHistoryUserId > 0} userId={showHistoryUserId} username={showHistoryUserName} onClose={onCloseHistory} />

    </Paper>

}