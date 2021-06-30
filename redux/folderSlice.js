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

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { LoadingState } from "./constants";

const folderSlice = createSlice({
    name: 'folder',
    initialState: {
        loadingState: LoadingState.Pending,
        actionState: LoadingState.Pending,
        items: [],
    },
    reducers: {
        setFolderLoadingState: (state, action) => {
            state.loadingState = action.payload;
        },
        setFolders: (state, action) => {
            state.items = action.payload;
        },
    },
});

export const { setFolderLoadingState, setFolders } = folderSlice.actions;

export const selectFolderForKey = (state, key) => {
    return state.folder.items.find(x => x.key == key)
}

export const selectFolderLoadState = state => state.folder.loadingState;
export const selectFolders = state => state.folder.items;

export default folderSlice.reducer