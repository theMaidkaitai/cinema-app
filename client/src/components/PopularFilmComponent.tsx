import React, {useEffect, useState} from 'react';
import star from "../assets/star.png";
import "../styles/PopularFilmComponentStyle/PopularFilmStyle.css"
import type {FilmData} from "../store/FilmStore.ts";
import LoadingComponent from "./LoadingComponent.tsx";
import {fetchCoverMovie} from "../http/movieApi.ts";
import {useNavigate} from "react-router-dom";

interface PopularFilmComponentProps {
    movie?: FilmData
}

const PopularFilmComponent = ({movie}: PopularFilmComponentProps) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [cover, setCover] = useState<string>();
    const navigate = useNavigate();


    useEffect(() => {
        const getCover = async () => {
            const coverBlob = await fetchCoverMovie(movie?.path_cover_fileName)
            const coverUrl = URL.createObjectURL(coverBlob);

            setCover(coverUrl)
            setLoading(false);
        }

        getCover();
    }, []);

    if (loading) {
        return <LoadingComponent children={"Loading..."}/>
    }
    const handleClick = () => {
        if (movie?.id) {
            navigate(`/movies/watch/${movie.id}`);
        }
    };
    return (
        <div className="popular-film-container-general" >
            <div className="popular-film-container" onClick={handleClick}>
                <div>
                    <img src={star} alt="" className="star-icon"/>
                    <p className="popular-film-rating">{movie?.rating}</p>
                </div>

                <img src={cover} alt="" className="popular-film-cover-icon"/>

                <div className="popular-film-text-content">
                    <p className="popular-film-title">{movie?.title}</p>
                    <div className="popular-film-genre-time">
                        • {movie?.genre}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopularFilmComponent;