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
import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";

import { Paper, Typography, Button} from '@material-ui/core';
import { DataGrid, GridToolbarContainer } from "@material-ui/data-grid";

import DeleteIcon from "@material-ui/icons/Delete";
import MarkunreadIcon from '@material-ui/icons/Markunread';

import { selectFolders } from '../../redux/folderSlice'
import { selectFolderSubscriptions } from "../../redux/userSlice";
import { fetchFolderSubscriptions, deleteUserFolderSubs, markUserFolderSubsRead } from "../../redux/userActions";

import styles from "../../styles/FolderSubscriptions.module.scss";

export function FolderSubscriptions() {

    const dispatch = useDispatch();

    const folders = useSelector(selectFolders);
    const folderSubscriptions = useSelector(selectFolderSubscriptions);

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        dispatch(fetchFolderSubscriptions());
    }, [dispatch]);

    const columns = [
        {
            field: 'id',
            hide: true,
            valueGetter: (params) => params.row.folderId
        },
        {
            field: 'title',
            headerName: 'Folder',
            flex: 1,
            renderCell: (params) => {
                let f = folders.find(x => x.id === params.row.folderId);
                return <Link href={`/${f.key}`} passHref><a className="discussion-link">{f.description}</a></Link>
            },
        }
    ];

    const onSelect = (ev) => {
        setSelectedItems(ev.selectionModel);
    }

    const onMarkRead = () => {
        dispatch(markUserFolderSubsRead(selectedItems));
    }

    const onDelete = () => {
        dispatch(deleteUserFolderSubs(selectedItems));
    }

    const toolbar = () => {
        return <GridToolbarContainer className={styles.tableToolbar}>
            <Button onClick={onMarkRead} color="primary" startIcon={<MarkunreadIcon />}>Mark selected as read</Button>
            <Button onClick={onDelete} color="primary" startIcon={<DeleteIcon />}>Delete selected</Button>
        </GridToolbarContainer>
    }

    return <Paper elevation={0} className={styles.container}>
        <Typography variant="h6" color="textSecondary" gutterBottom>Folder Subscriptions</Typography>
        <DataGrid
            onSelectionModelChange={onSelect}
            rows={folderSubscriptions}
            getRowId={x => x.id}
            columns={columns}
            pageSize={10}
            components={{
                Toolbar: toolbar
            }}
            checkboxSelection />
    </Paper>

}