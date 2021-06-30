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
import React, { useEffect, useState, useMemo } from 'react'

import { Typography } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { format, formatDistanceToNow, parseISO, add, isFuture, isAfter } from 'date-fns'

import styles from "../styles/Admin.module.scss";

export function PostComment({comment}) {

    return <Card variant="outlined" className={styles.postSubItem}>
        <CardContent>
            <Typography variant="subtitle1">
                {format(parseISO(comment.createdDate), "d/M/yyyy H:mm")} - {comment.name}
            </Typography>
            <div>{comment.body}</div>
        </CardContent>
    </Card>

}
