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

export default function Terms() {

    return <MasterLayout title="JUSTtheTalk - Community Standards, Terms &amp; Conditions" >
        <div className="container">

            <Paper variant="outlined" className="breadcrumb">
                <div className="breadcrumb-item"><Link href="/"><a><HomeIcon color="primary" /></a></Link></div>
                <div className="breadcrumb-item"><PlayArrowIcon color="action" /></div>
                <div className="breadcrumb-item">Community Standards, Terms &amp; Conditions</div>
            </Paper>

            <Paper variant="outlined" className="discussionList">

                <Typography variant="h5" color="textSecondary" gutterBottom>Community standards</Typography>

                <Typography variant="h6" color="textSecondary" gutterBottom>Our site principles</Typography>
<p>JUSTtheTalk relies on users to make it an enjoyable and interesting place for everyone. We want everyone to demonstrate and share intelligence, wisdom and humour and take responsibility for the quality of the conversations. Help make the site an intelligent place for discussion, and it will be.</p>
<p>JUSTtheTalk follows these principles to keep a positive atmosphere and to promote constructive discussion:</p>
<ul>
<li>Respect other posters and their views, opinions and beliefs, and consider your impact on others</li>
<li>Do not be discriminatory on the basis of age, disability, gender reassignment, race, religion or belief, sex, sexual orientation, marriage and civil partnership and pregnancy and maternity</li>
<li>Recognise the difference between criticising a particular government, organisation, community or belief and attacking individuals</li>
<li>Maintain a reasonable tone even in unreasonable circumstances</li>
<li>Keep it relevant and try not to veer too far off-topic</li>
<li>Stay safe and never post personal and/or identifying information about yourself, family members, your place of work, etc.</li>
<li>Understand that the conversation belongs to everybody so make the admin team aware of potential problems</li>
<li>Help each other to keep conversations inviting and appropriate.</li>
</ul>

<Typography variant="h5" color="textSecondary" gutterBottom>What we expect from users</Typography>

<Typography variant="h6" color="textSecondary" gutterBottom>Usernames</Typography>
<ul>
<li>You can register under any name you want, providing that name is not offensive or an attempt to mimic another user</li>
<li>Please be aware of personal safety when registering - we strongly discourage using an ID or email that is identifiable as your real world self</li>
<li>It is not possible to change your username and keep the same posting account – in order to change you must re-register with a different email address</li>
<li>Sockpuppet accounts are not prohibited as a general policy; however you cannot create a sockpuppet if you are banned or to avoid a sanction.</li>
</ul>

<Typography variant="h6" color="textSecondary" gutterBottom>Posting guidelines</Typography>
<p>Anyone can start a thread anywhere on the site; however we ask that you:</p>
<ul>
<li>start the thread in an appropriate folder</li>
<li>check that there isn’t already a thread that covers the topic – avoid duplication</li>
<li>don’t start the same thread in several folders</li>
<li>try to make the title descriptive of the content; ‘Hey, look at what’s happened!’ is not a useful title</li>
<li>keep thread headers reasonably short</li>
<li>use links in the thread header, rather than a lot of copied text.</li>
</ul>

<p>Your posts should:</p>
<ul>
<li>be accurate (where they state facts)</li>
<li>be genuinely held (where they state opinions)</li>
<li>be civil and respectful.</li>
</ul>

<p>When posting, all comments you make should follow the site principles. This means you should not:</p>
<ul>
<li>promote violence or be gratuitously violent</li>
<li>be pornographic, sexually explicit, obscene or lewd</li>
<li>be discriminatory or abusive:
    <ul>
    <li>we do not tolerate racism, sexism, misogyny, homophobia, transphobia or hate-speech</li>
    <li>we don’t allow discrimination, name-calling or insults based on the protected characteristics of the UK Equality Act 2010 e.g. age, disability, gender reassignment, race, religion or belief, sex, sexual orientation, marriage and civil partnership and pregnancy and maternity</li>
    <li>we consider disparaging people’s mental health and using terms suggesting mental disability as abuse</li>
    <li>we have a specific policy on discussions around gender identity and sex</li>
    <li>we will not tolerate cyber-bullying</li>
    </ul>
</li>
<li>impersonate any person or organisation or misrepresent your identity</li>
<li>promote any commercial activity or venture, including spamming links and/or advertising</li>
<li>spam the same comment across numerous threads.</li>
</ul>

<p>All comments you make should also be civil and respectful. This means you should not:</p>
<ul>
<li>make personal attacks on other posters or their family members</li>
<li>post mindless abuse</li>
<li>threaten other posters or the site</li>
<li>post posters’ names, personal information, information about another poster’s family or employer, or other information that could identify them</li>
<li>troll persistently, including baiting other posters</li>
<li>engage in harassment, or continue arguments or old feuds across threads</li>
<li>denounce trolls or suspected sock-puppets of banned users in-thread</li>
<li>criticise other posters for reporting, or suspected reporting, of posts</li>
<li>publicly name or identify the admins of the site, regardless of accuracy.</li>
</ul>

<Typography variant="h6" color="textSecondary" gutterBottom>Keeping legal when posting</Typography>
<p>Your posts must comply with applicable law in the EU and in the country that you’re posting from, and must not:</p>
<ul>
<li>infringe any copyright, database right, trade mark or any other intellectual property, registered design, confidentiality or privacy rights of any person or organisation</li>
<li>be libellous or defamatory</li>
<li>be in contempt of court (i.e. your contribution must not contain anything that risks prejudicing current or forthcoming court proceedings, or be in breach of any injunctions, superinjunctions or NDAs)</li>
<li>abuse another poster’s anonymity, by deliberate and malicious gathering and use of personal information</li>
<li>contain unlawful material (i.e. that condones or encourages unlawful acts or encourages others to do so, hacks or causes technical disruption to online services or describes how to conduct an unlawful act)</li>
<li>include a link to a website that contains, or directly links to, material that contravenes any of these standards</li>
<li>otherwise violate any law.</li>
</ul>
<p><span className={styles.importantText}>We do not proactively moderate the site, and admins only respond to users’ reports, so we strongly encourage you to report posts which break our guidelines.</span></p>

<Typography variant="h5" color="textSecondary" gutterBottom>How the admin of this site works</Typography>

<Typography variant="h6" color="textSecondary" gutterBottom>Reporting posts and getting in touch</Typography>

<p>The admin team does not monitor threads proactively.</p>
<p>If you feel that a post is against the community standards or terms and conditions, you can:</p>
<ul>
<li>ignore it</li>
<li>use the report function to let the admin team know - with enough information to let the team know what the issue is if it is not obvious.</li>
</ul>
<p>If you have wider concerns about a user's behaviour or pattern of posting you can:</p>
<ul>
<li>ignore that poster using the ignore function</li>
<li>report the post with further information.</li>
</ul>

<p>If you make a report, please do so promptly, and without engaging in threats or other escalation with other posters first.</p>
<p>To contact the admins, email <a href="mailto:help@justthetalk.com">help@justthetalk.com</a></p>

<Typography variant="h6" color="textSecondary" gutterBottom>What happens to a reported post</Typography>
<p>If you report a post:</p>
<ul>
<li>you receive email notification that your report has been received</li>
<li>admins review your report, as quickly as possible</li>
<li>a majority of two from three admins make a decision on the report</li>
<li>admins take action (see below)</li>
<li>you will not be notified of action taken</li>
<li>admins may occasionally make a comment in-thread about the action, when necessary.</li>
</ul>

<Typography variant="h6" color="textSecondary" gutterBottom>Admin action on reported posts</Typography>
<p>Admins can take several actions if we find that a post and/or poster has broken guidelines.</p>
<p>We can’t edit user posts to change the meaning, spelling, or anything else. This means that even if only part of a post breaches the community standards, the whole thing may be removed.</p>
<p>Sometimes we also delete subsequent posts which references or quotes from an original (removed) post.</p>

<p>Sanctions can be applied, depending on the severity and frequency of offences:</p>
<ul>
<li>deleting a post</li>
<li>blocking a user from a particular thread</li>
<li>automatically reviewing a user’s  posts</li>
<li>imposing a ban from posting, temporary or permanent</li>
</ul>
<p>If we do take action against a poster, we do not enter into discussion of that action after the fact. The administrators' decision is final.</p>

<Typography variant="h6" color="textSecondary" gutterBottom>Other moderation principles and actions</Typography>
<p>General</p>
<ul>
<li>Administration decisions are taken after discussion, except in urgent circumstances</li>
<li>No decision is taken without the agreement of at least two of three admins (from a larger team)</li>
<li>In emergencies, such as when a post may present a risk of legal liability, a single admin may take action</li>
<li>Because admins discuss and agree on actions, it can sometimes take up to 48 hours before anything happens.   Please be patient.</li>
<li>If a report is from or about an admin, they do not take any part in the moderation</li>
<li>Where a series of reports requires admins to consider patterns of behaviour and scrutinise context, this will take longer than looking at an individual post, and action may not be immediate</li>
<li>We aim to provide notice and warnings of user sanctions by email, however this doesn’t always happen. In the email, we will state how long any sanction will last</li>
<li>We may extend the length of sanctions if a user attempts to avoid them, for instance by the use of a sockpuppet</li>
<li>There is a small team of volunteer admins, who are also JtT users. It is JtT policy that admins retain their anonymity</li>
<li>In line with the Data Protection Act, admin discussions are not held for longer than the period necessary to allow decisions to be taken and recent decisions reviewed.</li>
</ul>

<p>User accounts</p>
<ul>
<li>Admins can refuse to register a username at their discretion, particularly if it is offensive or an attempt to mimic another user</li>
<li>JtT does allow the use of sockpuppet accounts as a general policy, but sometimes we may restrict a user to posting from a single account, either temporarily or permanently</li>
<li>JtT has the right to modify or delete any or all information relating to a user, including deletion of a user’s account without prior notice or reason</li>
<li>Any banning of a user is binding and the decision final</li>
<li>We are reluctant to do so, but we will consider requests from a user for the 'locking' of their account, effectively preventing them from posting further</li>
<li>In exceptional circumstances, where a user would otherwise be demonstrably at personal risk, we will consider requests to delete all posts made by a particular user.</li>
</ul>

<p>Threads</p>
<ul>
<li>A thread may be deleted, where the original premise, content, or a significant number of posts break the guidelines or terms and conditions. In most cases we prefer to lock a thread, rather than delete, if possible</li>
<li>Where an active thread already exists on a subject, we may decide to close any duplicate threads and ask posters to continue on the original or more active thread.</li>
</ul>

<p>Anonymity</p>
<ul>
<li>All posters have a right to anonymity, and we will not pass on your email address or other details to any third party, except in the cases below</li>
<li>If a poster takes malicious real-world action against another poster,  including harassment,  we will cooperate fully with any action that is brought</li>
<li>A post which contains evidence of criminal activity may be reported to the relevant authorities, and we will cooperate if required to by relevant law enforcement authorities.</li>
</ul>

<p>If you have suggestions or questions about any aspect of community participation on JUSTtheTalk.com, you can write to <a href="mailto:help@justthetalk.com">help@justthetalk.com</a></p>
<p>These guidelines should be followed in the context of the Terms and Conditions.</p>
<p>Our privacy policy and cookie policy can be found in the terms and conditions.</p>

<Typography variant="h5" color="textSecondary" gutterBottom>Terms and Conditions</Typography>
<p>By accessing and using this website you will automatically be taken to have read, understood and accepted these terms and conditions and the community standards. If you do not agree to be bound by these, please cease to access this website.</p>
<p>If you fail to observe any of the provisions of these terms and conditions, we reserve the right, at our discretion and without notice, to remove any messages and/or to exclude you from the discussion forums.</p>


<Typography variant="h6" color="textSecondary" gutterBottom>Content Standards</Typography>
<p>When posting contributions to the Forum, you must comply with the spirit of the community standards as well as the letter. These standards apply to each part of any contribution as well as to its whole. JUSTtheTalk has the right to remove, edit, move or close any posts when in breach of the terms and conditions and/or community standards.</p>
<p>By submitting your contribution to JUSTtheTalk you warrant that such contribution fulfils the community standards. You also agree to indemnify us against all legal fees, damages and other expenses that may be named by us as a result of your breach of this warranty.</p>
<p>All posts are the responsibility of the user, and users should be aware that their posts are visible to the public, and act accordingly.</p>

<Typography variant="h6" color="textSecondary" gutterBottom>Privacy Policy</Typography>
<p>This site is community run and funded. As a consequence your personal information will never be passed on to a third party without your explicit permission (unless required to by relevant law enforcement authorities)  and at present there are no foreseeable circumstances under which this permission might be sought.</p>
<p>In line with the Data Protection Act, admin discussions are not held for longer than the period necessary to allow decisions to be taken and recent decisions reviewed.</p>

<Typography variant="h6" color="textSecondary" gutterBottom>Cookie Policy</Typography>
<p>The site uses a small number of cookies solely in order to keep you logged into the site. These cookies do not store any personal information about you.  By continuing to use our site, you agree to the placement of these cookies on the devices that you use to access the site.</p>
<p>If you click on the 'Remember me' button on the login page then the cookies will contain a link to your user name.</p>
<p>There are no third-party cookies and the cookies which are employed have no commercial purpose whatsoever.</p>

<Typography variant="h6" color="textSecondary" gutterBottom>General</Typography>
<p>Opinions expressed within these forums are not necessarily the opinions of the site owner(s) or any individuals directly or indirectly involved in this website or the companies and individuals associated with it. We therefore do not endorse any opinions expressed by any site users in any comments.</p>
<p>No liability or responsibility is accepted, taken or assumed for any comments or statements made on this or any associated or related website, including the accuracy or truthfulness of any such comments or any responsibility for the consequences of your acting in reliance on such comments.</p>
<p>This site is not proactively moderated. If you feel that a message breaks site rules you can report it to us immediately using the 'Report' function outlined in the Help section of the site, and in the Community Standards. You do not need to be a member of the site to do this. We will make every effort to remove posts within a reasonable time frame, if we determine that removal is appropriate. We may also terminate access for users if found repeatedly posting offensive content.</p>

<Typography variant="h6" color="textSecondary" gutterBottom>Limitation of Liability</Typography>
<p>In no event will JUSTtheTalk be liable for any loss or damage whatsoever (including without limitation damages relating to reputation, lost revenues or profits, lost data, work stoppage, computer failure or malfunction) resulting from or in any way related to the use of any materials posted on or made available in the forums or any other web site to which a link is provided, even if JUSTtheTalk has been advised of the possibility of such damages and regardless of the legal theory or jurisdiction on which such damages are based.</p>
<p>JUSTtheTalk is not the source of the information on this site, and therefore cannot guarantee the accuracy of any information provided by any user, which may be incorrect, incomplete or condensed.</p>

<p>These Terms and Conditions may be amended by us at our discretion from time to time, and any such amendments shall take effect as soon as they are posted on JUSTtheTalk. We therefore suggest that you review it periodically. Notification of changes will also be posted as an announcement by the admins.</p>

            </Paper>

        </div>
    </MasterLayout>

}

export async function getStaticProps(context) {
    return {
        props: {},
    }
}
