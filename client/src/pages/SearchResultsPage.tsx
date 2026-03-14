import React, {useContext, useEffect} from 'react';
import type {FilmData} from "../store/FilmStore.ts";
import MovieComponent from "../components/MovieComponent.tsx";
import {Context} from "../main.tsx";
import {useSearchParams} from "react-router-dom";
import "../styles/MoviesPageStyle/MoviesStyle.css"


const SearchResultsPage = () => {
    const {search, films} = useContext(Context)
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");


    useEffect(() => {



        if (query) {
            const results = films.films.filter(film =>
                film.title?.toLowerCase().includes(query.toLowerCase())
            );
            search.setSearchQuery(query);
            search.setSearchResults(results);
        }
        else {
            search.setSearchResults([]);
        }
    }, [query]);

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
};

export default SearchResultsPage;