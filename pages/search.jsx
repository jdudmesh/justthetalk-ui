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

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { useRouter } from 'next/router';
import Link from 'next/link'

import Typography from '@material-ui/core/Typography';

import { Paper, Card, CardContent } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import PulseLoader from 'react-spinners/PulseLoader';

import MasterLayout from '../layouts/master'

import { selectSearchLoadingState, selectSearchResults } from '../redux/searchSlice'
import { fetchSearchResults } from '../redux/searchActions'
import { Alert } from "../components/Alert";
import { LoadingState } from '../redux/constants';
import { Post } from "../components/Post";

import styles from '../styles/Search.module.scss'


export default function Home(props) {

    const router = useRouter();
    const dispatch = useDispatch();

    const { searchText } = router.query;

    const loadingState = useSelector(selectSearchLoadingState);
    const searchResults = useSelector(selectSearchResults);

    useEffect(() => {
        if(searchText) {
            dispatch(fetchSearchResults(searchText));
        }
    }, [searchText]);

    const renderResults = () => {
        return searchResults.map((result, ix) => {
            return <Card variant="outlined" className={styles.searchResult}>
                <CardContent>
                    <Typography variant="subtitle1" gutterBottom><Link href={result.post.url}>{`${result.folder.description} - ${result.discussion.title}`}</Link></Typography>
                    <Post
                        post={result.post}
                        discussion={result.discussion}
                        blockedUsers={{}}
                        key={ix}/>
                        </CardContent>
            </Card>
        });
    }

    const renderNoResults = () => {
        return <Alert severity="info" className={styles.userAlert}>Your search returned no results.</Alert>
    }

    const renderLoadingSpinner = () => {
        return <div className="loadingSpinner">
            <PulseLoader color="#2A5880"></PulseLoader>
        </div>
    }

    return <MasterLayout title="JUSTtheTalk - Search Results">

        <div className="container">

            <Paper variant="outlined" className="breadcrumb">
                <div className="breadcrumb-item"><Link href="/"><a><HomeIcon color="primary" /></a></Link></div>
                <div className="breadcrumb-item"><PlayArrowIcon color="action" /></div>
                <div className="breadcrumb-item">Search Results</div>
            </Paper>


            <Paper variant="outlined" className="discussionList">
                <Typography variant="h5"  color="textSecondary" gutterBottom>Search Results</Typography>
                { loadingState === LoadingState.Loading ? renderLoadingSpinner() : <></> }
                { loadingState === LoadingState.Loaded && searchResults.length === 0 ? renderNoResults() : <></> }
                { loadingState === LoadingState.Loaded && searchResults.length > 0 ? renderResults() : <></> }
            </Paper>

        </div>

    </MasterLayout>

}