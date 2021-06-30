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


import React, { useState } from "react";
import { useRouter } from "next/router";

import { Tooltip, IconButton, Grid, TextField, Button } from "@material-ui/core";

import SearchIcon from "@material-ui/icons/Search";

import styles from "../styles/SearchBar.module.scss";

export function SearchBar({isNarrowWindow}) {

    const router = useRouter();

    const { searchText } = router.query;

    const [search, setSearch] = useState(searchText || "");

    const onSearch = () => {
        if(search.length > 0) {
            router.push({ pathname: "/search", query: { searchText: search } });
        }
    }

    const onKeyDown = (ev) => {
        if(ev.keyCode === 13) {
            onSearch();
        }
    }

    return <div className={styles.searchBar}>
        <Grid container spacing={1} alignItems="flex-end">
            <Grid item xs={10}>
                <TextField id="input-with-icon-grid" label="Search JUSTtheTalk" fullWidth value={search} onChange={(ev) => setSearch(ev.target.value)} onKeyDown={onKeyDown}/>
            </Grid>
            <Grid item xs={1}>
                <Tooltip title="Search" aria-label="search posts"><IconButton size={isNarrowWindow ? "large" : "small"} color="primary" onClick={onSearch}><SearchIcon/></IconButton></Tooltip>
            </Grid>
        </Grid>
    </div>
}