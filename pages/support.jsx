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


export default function Support(props) {

    return <MasterLayout title="JUSTtheTalk - Support Us" >
        <div className="container">

            <Paper variant="outlined" className="breadcrumb">
                <div className="breadcrumb-item"><Link href="/"><a><HomeIcon color="primary" /></a></Link></div>
                <div className="breadcrumb-item"><PlayArrowIcon color="action" /></div>
                <div className="breadcrumb-item">Support JUSTtheTalk</div>
            </Paper>

            <Paper variant="outlined" className="discussionList">
                <Typography variant="h5" color="textSecondary" gutterBottom>Support JUSTtheTalk</Typography>
                <p>JUSTtheTalk is operated on a not for profit basis for the benefit of its community of users. While both I and the admin teams freely give our time to keep the site up and running, it is not without costs.</p>
                <p>In particular the site runs on a dedicated server which incurs a monthly charge. Without your support it would not be possible to keep the site up and running.</p>


                <Typography variant="h6" color="textSecondary" gutterBottom>How you can help</Typography>
                <p>JUSTtheTalk always has been and always will be free to use. We will never use adverts to generate revenue. Don't worry if you can't afford to make a donation and in any case, all donations are anonymous. There is no recommended amount, just whatever you are able to donate and whatever you think is fair.</p>
                <p>You can make either a one off or regular donations via Paypal using the button below.</p>
                <div className={styles.donateButton}>
                    <form action="https://www.paypal.com/donate" method="post" target="_top">
                        <input type="hidden" name="hosted_button_id" value="ES8NZXVEVFRE4" />
                        <input type="image" src="https://www.paypalobjects.com/en_GB/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                        <img alt="" border="0" src="https://www.paypal.com/en_GB/i/scr/pixel.gif" width="1" height="1" />
                    </form>
                </div>
                <p>You can also make a donation direct to a bank account if you prefer. Please contact <a href="mailto:help@justthetalk.com">help@justthetalk.com</a> for details.</p>
                <p>many thanks,</p>
                <p>JohnnyTheSailor</p>
            </Paper>
        </div>
    </MasterLayout>

}

export async function getStaticProps(context) {
    return {
        props: {},
    }
}
