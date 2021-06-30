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

import { useState, useRef } from 'react';

import Fab from '@material-ui/core/Fab';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { useMediaQuery } from "react-responsive";

import styles from '../styles/ActionButton.module.scss'

export function ActionButton({icon, label, menu, onClick, testId}) {

    const anchorRef = useRef();
    const [shouldOpen, setShouldOpen] = useState(false);

    const isWidth800 = useMediaQuery({ query: "(min-width: 800px)" });

    const onClickButton = (event) => {
        if(menu) {
            setShouldOpen(true);
        } else {
            onClick();
        }
    }

    const onClickMenu = (key) => {
        setShouldOpen(false);
        onClick(key);
    }

    const handleClose = () => {
        setShouldOpen(false);
    }

    const renderMenu = () => {

        return (<Menu
            id="simple-menu"
            anchorEl={anchorRef.current}
            keepMounted
            open={shouldOpen}
            onClose={handleClose}
        >
            {
                menu.map((item, ix) => {
                    return <MenuItem key={ix} dense={true} onClick={() => onClickMenu(item.key)} data-test-id={item.key}>{item.label}</MenuItem>;
                })
            }
        </Menu>);

    }
    return <div className={styles.buttonContainer} data-test-id={testId}>
        <div className={styles.buttonContainerInner} onClick={onClickButton}>
            <div className={styles.fabContainer}>
                <Fab size="small" color="primary">{icon}</Fab>
            </div>
            { isWidth800
                ? <div className={styles.labelContainer}>{label}</div>
                : <></>
            }
        </div>
        <div className={styles.menuContainer} ref={anchorRef}>
            { menu ? renderMenu() : <></> }
        </div>
    </div>

}