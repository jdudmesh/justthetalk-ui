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

export const LoadingState = {
    Pending: 0,
    Loading: 1,
    Loaded: 2,
    Failed: -1,
}

export const STATUS_OK = 0;
export const STATUS_SUSPENDED_BY_ADMIN = 1;
export const STATUS_DELETED_BY_ADMIN = 2;
export const STATUS_POSTED_BY_NOTTHETALK = 3;
export const STATUS_WATCH = 4;

export const STATUS_MAX_DISPLAY = 255;
export const STATUS_DELETED_BY_USER = 256;
export const STATUS_INVISIBLE = 257;
