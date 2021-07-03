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

                <Typography variant="h6" color="textSecondary" gutterBottom>Our Charter</Typography>
<p>Welcome to our site!</p>
<p>The aim of JUSTtheTalk is to promote discussion of ideas at all levels.
We support free speech, even for people we don't agree with or like. We don't support hatred or discrimination.
We believe the quality of discussion on this site to be its key strength and so we will never clutter the site with useless junk, or with adverts.
We guarantee that this site will remain free at the point of use. </p>

<Typography variant="h6" color="textSecondary" gutterBottom>A Brief History of JUSTtheTalk</Typography>
<p>This site was designed and built in the days after the demise of the discussion forums run by The Guardian newspaper, Guardian Unlimited Talkboard (GU Talk). GU Talk was a community of individuals from a wide variety of ages, backgrounds and places, and had several specialist boards, such as Football All Talk (FAT) and Film Unlimited (FU). The GU Talk boards were closed on February 25th  2011. This is what they said about it (from <a href="https://www.theguardian.com/help/insideguardian/2011/feb/28/guardian-unlimited-talkboards">https://www.theguardian.com/help/insideguardian/2011/feb/28/guardian-unlimited-talkboards</a>):</p>

<div className={styles.guardianQuote}>
<p>We know that the ending of the Guardian Unlimited Talkboards on Friday was an abrupt shock for the community that used them, and we are sorry for that. We didn't support them for over a decade lightly or casually, and we didn't close them suddenly in that vein either.</p>
<p>We also know how much they meant to the community - and over the weekend we've seen them described on Twitter as "Web 2.0 social networking before Zuckerberg was a Harvard freshman" and been reading blog posts about how people met their partners through the boards.</p>
<p>We can't discuss the reasons behind it, save to say that it wasn't possible to give you advance notice of the closure on Friday, but we hope you'll be able to use the comment thread underneath this blog post to find each other and regroup. There are already several sites we have found where GUTalkers are gathering together like thegraun, Guardian Talk on Proboards, an Ancientsofgraun Yahoo! Group, and an Exiles from GUTalk group on Facebook.</p>
</div>

<p>The first version of this forum was called NOTtheTalk, and the design reflected our origins at the Guardian. It was one of several quickly produced by members of the community to provide somewhere for GU Talk forum members to gather, and soon became the alternative of choice.</p>
<p>Over the years new features were added, and as it took on a life of its own, and  GU Talk faded in memory, the site was rebranded to JUSTtheTalk (JtT).</p>
<p>In 2021, with the underlying platform ageing, the site was redesigned to what you see today. </p>

<div className={styles.oldSiteImages}>
    <img src="/gut.jpg"></img>
    <img src="/notthetalk-old-site.png"></img>
    <img src="/justthetalk-old-site.png"></img>
</div>

<Typography variant="h6" color="textSecondary" gutterBottom>A word from the site owner</Typography>
<p>I was a member of the GU Talk community for over 10 years and I built this site because I couldn't imagine not having it in my life. I will never do anything to harm it.
I believe that this site has to evolve so that the community can grow and flourish. Any changes will be made sensitively and with the consent of the users. </p>

<p>I'm a freelance software developer with over 25 years commercial experience. Want to hire me? Send a message to help@justthetalk.com.</p>


            </Paper>
        </div>
    </MasterLayout>

}

export async function getStaticProps(context) {
    return {
        props: {},
    }
}
