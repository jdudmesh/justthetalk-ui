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

import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import Link from 'next/link'

import { selectFolders } from '../redux/folderSlice'
import { selectUser } from "../redux/userSlice";

import styles from '../styles/FolderList.module.scss'

export const FolderList = ({folderType}) => {

    const [sortedFolders, setSortedFolders] = useState([]);

    const folders = useSelector(selectFolders);
    const currentUser = useSelector(selectUser);

    useEffect(() => {
        if(!folders) {
            return;
        }
        if(currentUser && currentUser.sortFoldersByActivity) {
            const toBeSorted = [...folders];
            let f = toBeSorted.sort((a, b) => {
                if(a.activity < b.activity) {
                    return 1;
                } else if(b.activity < a.activity) {
                    return -1;
                } else {
                    if(a.description > b.description) {
                        return 1;
                    } else if(b.description > a.description) {
                            return -1;
                    } else {
                        return 0;
                    }
                }
            });
            setSortedFolders(f)
        } else {
            setSortedFolders(folders);
        }
    }, [folders, currentUser]);

    return (<ul className={styles.folderList}>
        {sortedFolders.filter(x => x.type == folderType).map( (folder, ix) => {
            return <li className={styles.entry} key={ix} data-test-id={`folder_${folder.key}`}>
                <Link href={`/${folder.key}`} passHref><a className="folder-link">{folder.description}</a></Link>
            </li>
        })}
    </ul>);

}