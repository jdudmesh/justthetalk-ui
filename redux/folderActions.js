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

import { fetchFoldersAPI } from "../api";

import {
    setFolderLoadingState,
    setFolders,
} from "./folderSlice";

import { LoadingState } from "./constants";
import { compareFolders } from "../lib/utils";

export const fetchFolders = () => (dispatch, getState) => {

    let state = getState();
    if(state.folder.loadingState !== LoadingState.Pending) {
        return;
    }

    dispatch(setFolderLoadingState(LoadingState.Loading));

    fetchFoldersAPI().then((res) => {
        dispatch(setFolders(res.data.data.sort(compareFolders)));
        dispatch(setFolderLoadingState(LoadingState.Loaded));
    }).catch((err) => {
        console.error(err);
        toast.error("Fetch failed");
        dispatch(setFolderLoadingState(LoadingState.Failed));
    });

}

