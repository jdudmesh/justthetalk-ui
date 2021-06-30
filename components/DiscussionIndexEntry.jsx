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

import { useMemo } from "react";
import Link from "next/link";
import Typography from "@material-ui/core/Typography";
import { formatDistanceToNow } from "date-fns";

import styles from "../styles/DiscussionIndexEntry.module.scss";

export function DiscussionIndexEntry({discussion, folder}) {

    const discussionTitle = () => {
        return { __html: discussion.discussionTitle }
    }

    return (<div className={styles.entry}>
        <div className={styles.body}>
            <div data-test-id={discussion.discussionId} className="discussion-item">
                <Link href={discussion.url + (discussion.lastPostRead > 0 ? `/${discussion.lastPostRead}` : "")} passHref><a className="discussion-link" dangerouslySetInnerHTML={discussionTitle()}></a></Link>
                {folder
                    ? <><span> - </span><Link href={`/${folder.key}`} passHref><a className="folder-link" data-test-folder={folder.key}>{folder.description}</a></Link></>
                    : <></>
                }
            </div>
            <Typography variant="overline" display="block" gutterBottom>{formatDistanceToNow(new Date(discussion.lastPostDate))} ago ({discussion.postCount - discussion.lastPostReadCount} new of {discussion.postCount} posts)</Typography>
        </div>
    </div>);


}