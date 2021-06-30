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

import { toast } from "react-toastify";

import { fetchSearchResultsAPI } from "../api";
import { setSearchActionState, setSearchResults } from "./searchSlice";

import { LoadingState } from './constants';

export const fetchSearchResults = (searchText) => (dispatch) => {

    dispatch(setSearchActionState(LoadingState.Loading));

    fetchSearchResultsAPI(searchText).then((res) => {
        dispatch(setSearchResults(res.data.data));
        dispatch(setSearchActionState(LoadingState.Loaded));
    }).catch((err) => {
        console.error(err);
        toast.error("Search failed");
        dispatch(setSearchResults([]));
        dispatch(setSearchActionState(LoadingState.Failed));
    });

}
