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

import { createSlice } from "@reduxjs/toolkit";

import { LoadingState } from "./constants";

const searchSlice = createSlice({
    name: "user",
    initialState: {
        loadingState: LoadingState.Pending,
        results: [],
    },
    reducers: {
        setSearchActionState: (state, action) => {
            state.loadingState = action.payload;
        },
        setSearchResults: (state, action) => {
            state.results = action.payload;
        },
    }
});


export const {
    setSearchActionState,
    setSearchResults,
} = searchSlice.actions;

export const selectSearchLoadingState = state => state.search.loadingState;
export const selectSearchResults = state => state.search.results;

export default searchSlice.reducer