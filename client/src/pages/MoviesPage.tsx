import {useContext, useEffect, useState} from 'react';
import MovieComponent from "../components/MovieComponent.tsx";
import "../styles/MoviesPageStyle/MoviesStyle.css"
import PopularFilmComponent from "../components/PopularFilmComponent.tsx";
import {Context} from "../main.tsx";
import {fetchFilms} from "../http/movieApi.ts";
import LoadingComponent from "../components/LoadingComponent.tsx";
import type {FilmData} from "../store/FilmStore.ts";
import SoonReleaseModal from "../components/modals/SoonReleaseModal.tsx";
import CentredWarningComponent from "../components/CentredWarningComponent.tsx";


const MoviesPage = () => {
    const {films} = useContext(Context);
    const [loading, setLoading] = useState<boolean>(true);
    const [releaseSoonVisibility, setReleaseSoonVisibility] = useState(false);


    useEffect(() => {
        async function loadMovies(): Promise<void> {
            const data = await fetchFilms();
            films.setFilms(data);
            setLoading(false)

        }
        loadMovies()
    }, []);


    if (loading || !films.films) {
        return <LoadingComponent children={"Loading films..."}/>
    }

    const releaseMovies: FilmData[] = films.films.filter(movie => movie.type === 'RELEASE')

    const highestRatedFilm: FilmData = films.films.reduce((highest, current) => {
        return (highest.rating || 0) > (current.rating || 0) ? highest : current;
    }, films.films[0]);


    const soonMovies: FilmData[] = films.films.filter(movie => movie.type === 'SOON')

    return (
        <div>
            <div className="movies-page-container">
                <div className={"movies-page-popular"}>
                    <PopularFilmComponent
                        movie = {highestRatedFilm}
                    />
                </div>

                <div className="movies-page-likes">
                    <p className={"movies-page-v"}>Now watching:</p>
                    <div className={"movies-page-likes-components"}>
                        {releaseMovies.map((filmData: FilmData) => (
                            <MovieComponent
                                key={filmData.id}
                                id={filmData.id}
                                rating={filmData.rating}
                                title={filmData.title}
                                genre={filmData.genre}
                                path_cover_fileName={filmData.path_cover_fileName}
                            />
                        ))}
                        {releaseMovies.length === 0 && (
                            <CentredWarningComponent
                                child={
                                    <LoadingComponent children={"No movies available."}/>
                                }
                            />
                        )}
                    </div>
                </div>


                <div className="movies-page-likes">
                    <p className={"movies-page-v"}>Soon release:</p>
                    <div className={"movies-page-likes-components"}>
                        {soonMovies.map((filmData) => (
                            <MovieComponent
                                key={filmData.id}
                                id={filmData.id}
                                rating={filmData.rating}
                                title={filmData.title}
                                genre={filmData.genre}
                                path_cover_fileName={filmData.path_cover_fileName}
                                onClick={() => setReleaseSoonVisibility(true)}
                            />
                        ))}
                        {soonMovies.length === 0 && (
                            <CentredWarningComponent
                                child={
                                    <LoadingComponent children={"No upcoming films!"}/>
                                }
                            />
                        )}
                    </div>
                </div>
            </div>

            <SoonReleaseModal
                isOpen={releaseSoonVisibility}
                onClose={() => setReleaseSoonVisibility(false)}
            />
        </div>
    );
};

export default MoviesPage;