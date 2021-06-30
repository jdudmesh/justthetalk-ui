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
import Link from "next/link";

import { Paper, Typography } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import MasterLayout from "../layouts/master";

import styles from "../styles/Support.module.scss";


export default function About(props) {

    return <MasterLayout title="JUSTtheTalk - About Us" >
        <div className="container">

            <Paper variant="outlined" className="breadcrumb">
                <div className="breadcrumb-item"><Link href="/"><a><HomeIcon color="primary" /></a></Link></div>
                <div className="breadcrumb-item"><PlayArrowIcon color="action" /></div>
                <div className="breadcrumb-item">About Us</div>
            </Paper>

            <Paper variant="outlined" className="discussionList">
                <Typography variant="h5" color="textSecondary" gutterBottom>A Brief History of JUSTtheTalk</Typography>
                <Typography variant="h6" color="textSecondary" gutterBottom>The Guardian</Typography>
                <Typography variant="h6" color="textSecondary" gutterBottom>NOTtheTalk</Typography>
                <Typography variant="h6" color="textSecondary" gutterBottom>JUSTtheTalk</Typography>
                <Typography variant="h6" color="textSecondary" gutterBottom>The Future</Typography>
                <p>JUSTtheTalk is owned any operated by:</p>
            </Paper>
        </div>
    </MasterLayout>

}

export async function getStaticProps(context) {
    return {
        props: {},
    }
}
