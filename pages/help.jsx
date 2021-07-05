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


export default function Help(props) {

    return <MasterLayout title="JUSTtheTalk - Help" >
        <div className="container">

            <Paper variant="outlined" className="breadcrumb">
                <div className="breadcrumb-item"><Link href="/"><a><HomeIcon color="primary" /></a></Link></div>
                <div className="breadcrumb-item"><PlayArrowIcon color="action" /></div>
                <div className="breadcrumb-item">Help</div>
            </Paper>

            <Paper variant="outlined" className="discussionList">

                <Typography variant="h5" color="textSecondary" gutterBottom>Help</Typography>

                <p>Welcome to JUSTthetalk.</p>
                <p>This page is about the practicalities of navigating and posting on the site, and  what to do if you have a problem.</p>
                <p>The aim of JUSTtheTalk is to promote discussion of the issues of the day. We support free speech, even for people we don't agree with or like. We don't support hatred or discrimination.  Please read  our <Link href="/terms"><a>Terms and Conditions</a></Link> before posting.  By posting on the site, you agree to abide by these.</p>

                <Typography variant="h6" color="textSecondary" gutterBottom>Getting around the board</Typography>
                <p>The board is organised into topic folders and discussion threads that are created within these topics.</p>

                <p>The front page lists the recent discussions in all topics. Specific topics can be selected from the list on the right-hand side of the front page, or from a drop-down list on mobile devices (☰ button).</p>

                <p>The list of topics in any folder is normally listed by activity, with the most active topics at the top. You can change this list to alphabetical by changing the relevant option on your profile page.</p>

                <p>You will see several links to the home page and to the current topic folder when you are reading a thread - at the top left, and under the last post. There is also an extra link to the home page on the top right.</p>

                <p>View a discussion by clicking on its title either on the front page or in a topic folder.</p>

                <p>On a discussion thread you can take several actions to move about within that discussion: Previous, Next, Top, Bottom, Unread. These are displayed at the top and  bottom of every discussion page. You can also navigate through a discussion using the ‘Page’ button to choose a specific page.</p>

                <Typography variant="h6" color="textSecondary" gutterBottom>Subscriptions</Typography>
                <p>You can subscribe to individual discussion threads or whole topic  folders by clicking on the relevant links on the left hand side of the page.</p>

                <p>Once you have subscribed, clicking on the 'Subscriptions' link under tools on the right hand side of the page will display  unread comments in discussions you have subscribed to. You can also click on ‘Check Subscriptions’ at the end of any discussion page.</p>

                <p>If you subscribe to a folder you will receive all unread comments in all discussions in that folder, including new ones as they are created.</p>

                <p>You can unsubscribe from individual discussions at any time, even if you have subscribed to the folder as a whole. </p>

                <p>If there are no more unread posts then you will be directed to a list of your current subscriptions. This list is also available on your profile page.</p>

                <Typography variant="h6" color="textSecondary" gutterBottom>Search</Typography>
                <p>For simple searches just enter the text your are looking for in the text box and click search.</p>
                <p>It is also possible to search specific bits of a post. For example:</p>

                <table>
                <tr><td>Search on user name:</td><td>username:johnnythesailor</td></tr>
                <tr><td>Search on discussion title:</td><td>title:garden</td></tr>
                <tr><td>Search on discussion header:</td><td>header:gardening</td></tr>
                <tr><td>Search on post date:</td><td>createdDate:20110401</td></tr>
                </table>
                <p>For complete instructions on query syntax see <a href="http://lucene.apache.org/core/2_9_4/queryparsersyntax.html">this article</a>.</p>

                <Typography variant="h6" color="textSecondary" gutterBottom>Posting</Typography>
                <p>You can join in with a discussion by writing your comment in the text box on the last page of comments, and then clicking ‘Post Message’. Once you have posted your comment it will appear straight away.</p>

                <p>Before posting, please read our <Link href="/terms"><a>Terms and Conditions</a></Link> . By posting on the site, you agree to abide by these. </p>

                <p>There are lots of in-jokes on JUSTtheTalk; don't worry, you'll soon pick them up. If you're new to the board then it pays to spend some time getting to know the place before diving in. Don't be intimidated by other posters - they're no better than you - so be prepared to give as good as you get (but please don't resort to ad hominem attacks).</p>

                <p>In the top right hand corner of each comment is a grey square with a downward pointing arrow. Click on this to reveal options for each post.</p>
                <p>Edit: you can edit your comments up to 30 minutes after you post them.</p>
                <p>Delete: you can delete your post at any time.</p>
                <p>You can also share your posts on Facebook or tweet them on Twitter ( once you have set this up via your profile page, see below).</p>

                <Typography variant="h6" color="textSecondary" gutterBottom>Formatting your posts</Typography>
                <p>You can add formatting to your posts by putting a special character at the beginning of a line of text followed by a space and then your text. The codes are as follows:</p>
                <ul className={styles.noMarker}>
                <li>&gt; - quoted/small text</li>
                <li>b - bold text</li>
                <li>i - italic text</li>
                <li>u - underlined text</li>
                <li>c - centered text</li>
                <li>* - bulleted text</li>
                <li>| - spoiler (the text you put on this line will be hidden in a clickable box)</li>
                <li>] - indented text, multiple characters gives multiple indents</li>
                <li>} - force the line to be a paragraph without a blank line following (good for limericks)</li>
                <li>` - quoted text</li>
                </ul>

                <Typography variant="h6" color="textSecondary" gutterBottom>Problems with other posters</Typography>
                <p>It's a sad fact that sometimes discussions get overheated and posters resort to abuse when they can't win their point by other means. This is a site for adults and the expectation is that you will be able to deal with these situations yourself. In the first instance simply do not respond; chances is are they will get bored and move on.</p>
                <p>If this is not  a satisfactory solution,  then you can "ignore" the poster concerned.</p>

                <Typography variant="h6" color="textSecondary" gutterBottom>Ignore a Poster</Typography>
                <p>You can do this by either visiting  the poster's profile page by clicking on their name on any of their posts, or by clicking the down arrow on the right of their post.</p>
                <p>Ignored posters are listed on your profile page and you can remove them from the list whenever you like.</p>

                <Typography variant="h6" color="textSecondary" gutterBottom>Report a Post</Typography>
                <p>Moderation on JUSTthetalk is passive, which means that we do not monitor what is posted and we will not remove posts unless they are reported to us. We rely on our users to keep the site safe and enjoyable for everyone, so please report any posts which you feel  break our posting  and content guidelines.</p>
                <p>Full details of  our moderation approach, posting guidelines and content guidelines can be found in the Policy and Standards  and T&C sections Links please johnny</p>

                <Typography variant="h6" color="textSecondary" gutterBottom>How to Report a Post</Typography>
                <p>Because we do not actively moderate, we rely on users  to bring to our attention any posts which break the guidelines. We have tried to make it as simple as possible to make a report:</p>
                <p>To the left of each post is a dropdown button (grey square with a black triangle). </p>
                <p>Click on this button and select the 'Report' menu option. </p>
                <p>You will be taken to a page where you can provide your username and  e-mail address and outline the nature of your complaint.  </p>
                <p>Please ensure you explain the reason you’ve reported a post, and why you think it breaches the guidelines.</p>
                <p>Complete and submit the form.</p>

                <p>We aim to respond to all reports within 48 hours. It is not necessary to be logged into the site to report a post.</p>
                <p>If you report a post, you will receive notification that your report has been received, but you will not be notified of action taken.</p>
                <p>Please note:</p>
                <p>This site is not actively moderated; ownership and liability for all user-generated content lies with the originating user.</p>
                <p>We are not the source of the information on this site, and therefore cannot guarantee the accuracy of any information provided by any user, which may be incorrect, incomplete or condensed.</p>
                <p>We are not responsible for any damages with respect to the accuracy or use of any information posted on this site.</p>

                <Typography variant="h6" color="textSecondary" gutterBottom>Your Profile</Typography>
                <p>Each user has a profile page, which can be found by clicking the username. On  another poster’s page you can see any information they choose to make public.</p>

                <p>You can see your own page by clicking ‘Profile’ in the column on the right. </p>
                <p>On your own page you will see:</p>
                <p>the email address you used to sign up with, and an option to hide this address from other users.</p>
                <p>a space to add a comment about yourself - NOTE that any email address you put here will be visible to other users, so we suggest that, if you want to let people contact you, you create a free GMail or Hotmail account based on your user name and use that.</p>
                <p>Remember to be safe: do not post personal and/or identifying information, and maintain your privacy and anonymity.</p>

                <p>From your profile you can:</p>
                <p>manage your subscriptions.</p>
                <p>change your password.</p>
                <p>see who you’ve ignored, and un-ignore them.</p>
                <p>link with facebook and twitter (see below).</p>


                <Typography variant="h6" color="textSecondary" gutterBottom>Other Problems</Typography>
                <p>If you have any problems signing in or other problems with the site then please contact us on help@justthetalk.com.</p>

            </Paper>
        </div>
    </MasterLayout>

}

export async function getStaticProps(context) {
    return {
        props: {},
    }
}