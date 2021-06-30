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

import { configureStore } from '@reduxjs/toolkit'

import folderReducer from './folderSlice'
import discussionReducer from './discussionSlice'
import postReducer from './postSlice'
import frontPageReducer from './frontPageSlice'
import adminReducer from './adminSlice'
import userReducer from './userSlice'
import searchReducer from './searchSlice'

export default configureStore({
    reducer: {
        'folder': folderReducer,
        'discussion': discussionReducer,
        'post': postReducer,
        'frontPage': frontPageReducer,
        'admin': adminReducer,
        'user': userReducer,
        'search': searchReducer,
    }
})