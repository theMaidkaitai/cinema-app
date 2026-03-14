import React, {useContext, useEffect, useState} from 'react';
import type {FilmData} from "../store/FilmStore.ts";
import MovieComponent from "../components/MovieComponent.tsx";
import {Context} from "../main.tsx";
import {useParams, useSearchParams} from "react-router-dom";
import "../styles/MoviesPageStyle/MoviesStyle.css"
import LoadingComponent from "../components/LoadingComponent.tsx";
import {observer} from "mobx-react/src";


const GenreFilterPage = observer(() => {
    const {search, films} = useContext(Context)
    const {genre} = useParams()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {

        if (genre) {
            const results = films.films.filter(film =>
                film.genre?.toLowerCase().includes(genre.toLowerCase()) ?? false
            );
            console.log(results);
            console.log(genre)
            search.setSearchResults(results);
            setLoading(false)
        }
        else {
            search.setSearchResults([]);
        }
    }, [genre]);

    if (loading) {
        return <LoadingComponent children={"Loading..."} />
    }

    return (
        <div>
            <div className="movies-page-container">

                <div className="movies-page-likes">
                    <p className={"movies-page-v"}>Now watching:</p>
                    <div className={"movies-page-likes-components"}>
                        {search.searchResults.map((filmData: FilmData) => (
                            <MovieComponent
                                key={filmData.id}
                                id={filmData.id}
                                rating={filmData.rating}
                                title={filmData.title}
                                genre={filmData.genre}
                                path_cover_fileName={filmData.path_cover_fileName}
                            />
                        ))}
                        {search.searchResults.length === 0 && (
                            <p>No movies available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default GenreFilterPage;