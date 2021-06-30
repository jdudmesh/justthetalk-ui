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

import { Paper, Typography, Button } from "@material-ui/core";
import { DataGrid, GridToolbarContainer } from "@material-ui/data-grid";

import DeleteIcon from "@material-ui/icons/Delete";
import MarkunreadIcon from '@material-ui/icons/Markunread';

import { selectDiscussionSubscriptions } from "../../redux/userSlice";
import { fetchDiscussionSubscriptions, deleteUserDiscussionSubs, markUserDiscussionSubsRead } from "../../redux/userActions";

import { htmlDecode } from "../../lib/utils";

import styles from "../../styles/DiscussionSubscriptions.module.scss";

export function DiscussionSubscriptions() {

    const dispatch = useDispatch();

    const discussionSubscriptions = useSelector(selectDiscussionSubscriptions);

    const [selectedItems, setSelectedItems] = useState([]);

    const columns = [
        { field: 'id', hide: true, valueGetter: (params) => params.row.discussionId },
        { field: 'folderTitle', headerName: 'Folder', width: 180 },
        {
            field: 'title',
            headerName: 'Discussion',
            flex: 1,
            renderCell: (params) => <Link href={params.row.url} passHref><a className="discussion-link">{htmlDecode(params.row.discussionTitle)}</a></Link>
        },
        {
            field: 'unreadCount',
            headerName: 'Unread',
            width: 180,
            valueGetter: (params) => `${params.row.postCount - params.row.lastPostReadCount}`
        },
      ];

    useEffect(() => {
        dispatch(fetchDiscussionSubscriptions());
    }, [dispatch]);

    const onSelect = (ev) => {
        setSelectedItems(ev.selectionModel);
    }

    const onMarkRead = () => {
        dispatch(markUserDiscussionSubsRead(selectedItems));
    }

    const onDelete = () => {
        dispatch(deleteUserDiscussionSubs(selectedItems));
    }

    const toolbar = () => {
        return <GridToolbarContainer className={styles.tableToolbar}>
            <Button onClick={onMarkRead} color="primary" startIcon={<MarkunreadIcon />}>Mark selected as read</Button>
            <Button onClick={onDelete} color="primary" startIcon={<DeleteIcon />}>Delete selected</Button>
        </GridToolbarContainer>
    }

    return <Paper elevation={0} className={styles.container}>
        <Typography variant="h6" color="textSecondary" gutterBottom>Discussion Subscriptions</Typography>
        <DataGrid
            onSelectionModelChange={onSelect}
            rows={discussionSubscriptions}
            getRowId={x => x.discussionId}
            columns={columns}
            pageSize={10}
            components={{
                Toolbar: toolbar
            }}
            checkboxSelection />
    </Paper>

}