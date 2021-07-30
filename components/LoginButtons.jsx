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

import { Button } from "@material-ui/core";
import { LoadingState } from "../redux/constants";
export function LoginButtons({user, loadingState}) {

    if(loadingState == LoadingState.Loaded && !user) {
        return <>
            <Button variant="outlined" color="inherit" href="/login" data-test-id="login-button">Login</Button>
            <span> or </span>
            <Button variant="outlined" color="primary" href="/signup" data-test-id="signup-button">Sign up</Button>
        </>
    } else {
        return <></>
    }

}