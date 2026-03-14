import React, {useEffect, useState} from 'react';

import star from "../assets/star.png"
import "../styles/FilmComponentStyle/FilmStyle.css"
import {useNavigate} from "react-router-dom";
import type {MovieProps} from "../http/data interfaces/movie/MovieProps.ts";
import {fetchCoverMovie} from "../http/movieApi.ts";
import LoadingComponent from "./LoadingComponent.tsx";



const MovieComponent = ({
                            id,
                            title,
                            description,
                            video_name,
                            genre,
                            duration,
                            rating,
                            path_cover_fileName,
                            onClick
                        }: MovieProps) => {

    const [cover, setCover] = useState();
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const getCover = async () => {
            const coverBlob = await fetchCoverMovie(path_cover_fileName)
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
        if (onClick) {
            onClick();
        } else {
            navigate(`/movies/watch/${id}`);
        }
    };

    return (
        <div className="film-component-container-general" onClick={handleClick}>
            <div className={"film-component-container"}>
                <div>
                    <img src={star} alt="" className={"star-icon"} />
                    <p className={"film-component-rating"}>{rating}</p>
                </div>
                <img src={cover} alt="" className={"film-component-cover-icon"} />
                <p className={"film-component-title"}>{title}</p>
                <div className={"film-component-genre-time"}>
                    • {genre}
                </div>
            </div>
        </div>
    );
};

export default MovieComponent;