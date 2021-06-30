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


import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import { logoutUser } from "../redux/userActions";
import { selectUser, selectUserActionError } from "../redux/userSlice";

export default function Logout(props) {

    const router = useRouter();
    const dispatch = useDispatch();

    const currentUser = useSelector(selectUser);

    useEffect(() => {
        if(!currentUser) {
            router.push("/");
        } else {
            dispatch(logoutUser());
        }
    }, [currentUser])

    return (<></>);
}

export async function getStaticProps(context) {
    return {
        props: {},
    }
}