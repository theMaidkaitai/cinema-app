import  {useContext, useEffect, useState} from 'react';
import "../styles/MoviePageStyle/MovieStyle.css"
import starIcon from "../assets/star.png"
import starIconBefore from "../assets/starBefore.png"
import starIconAfter from "../assets/starAfter.png"
import LoadingComponent from "../components/LoadingComponent.tsx";
import {useParams} from "react-router-dom";
import {addFavoriteMovie, checkFavs, checkLiked, fetchFilm, likeMovie} from "../http/movieApi.ts";
import type {MovieData} from "../http/data interfaces/movie/MovieData.ts";
import {Context} from "../main.tsx";
import type {CustomJwtPayload} from "../http/data interfaces/jwt/CustomJwtPayload.ts";
import {jwtDecode} from "jwt-decode";
import convertToNumber from "../utils/convertToNumber.ts";



const MoviePage = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const {id} = useParams();
    const [movie, setMovie] = useState<MovieData>();
    const [video, setVideo] = useState()
    const {user, films} = useContext(Context)


    const [liked, setLiked] = useState<boolean | null>(false)
    const [favorite, setFavorite] = useState<boolean>(false)

    async function handleAddFavorite () {
        try {
            const converted = convertToNumber(id, user._user.id)
            setFavorite(true)
            await addFavoriteMovie(await converted)
        }
        catch (error) {
            console.error(error);
        }
    }

    async function handleLike () {
        try {
            // if (id != null && user._user.id != null) {
            //     const movieId = typeof id === 'string' ? parseInt(id) : id;
            //     const userId = typeof user._user.id === 'string' ? parseInt(user._user.id) : user._user.id;
            //     if (isNaN(movieId) || isNaN(userId)) {
            //         console.error("Invalid id format");
            //         return;
            //     }
            //
            //     const dataLike: MovieIdsData = {
            //         movieId: movieId,
            //         userId: userId
            //     };
            //
            //     await likeMovie(dataLike)
            // }


            const converted = convertToNumber(id, user._user.id)
            setLiked(true)
            await likeMovie(await converted)
        }
        catch (error) {
            console.error(error);
        }

    }

    useEffect(() => {
        const checkLike = async () => {
            const token = localStorage.getItem("tokenAccess");
            if (token) {
                const decoded: CustomJwtPayload = jwtDecode(token);
                const converted = convertToNumber(id, decoded.id)
                const dataLike = await checkLiked(await converted)

                const dataFavs = await checkFavs(await converted)

                setFavorite(dataFavs)
                setLiked(dataLike)
            }
        }

        checkLike();
    }, [id]);

    useEffect(() => {
        const loadMovieAndCheckMovie = async () => {
            try {
                setLoading(true);
                const data = await fetchFilm(id);
                const videoMovie = `${import.meta.env.VITE_API_URL}film/api/stream/movie/${data.path_film_fileName}`;
                console.log(data)
                // @ts-ignore
                setVideo(videoMovie)
                setMovie(data);
            } catch (error) {
                console.error("Error loading movie:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadMovieAndCheckMovie();
        }
    }, [id]);

    if (loading) {
        return <LoadingComponent children={"Loading..."} />
    }

    if (!movie) {
        return <div className="error-message">Movie not found</div>;
    }


    return (
        <div className={"movie-page-container"}>
            <div className={"movie-page-container-mp4"}>
                <video src={video} width={"900"} height={"490"} controls/>
            </div>

            <div className={"movie-page-container-actions"}>
                <p className={"movie-page-action-fav"} onClick={handleAddFavorite}>
                    {!favorite ? (
                        <img src={starIconBefore} alt="" className={"movie-star-icon"}/>
                    ) : (
                        <img src={starIconAfter} alt="" className={"movie-star-icon"}/>
                    )}
                    Add in favorites
                </p>
                <p className={"movie-page-action-like"} onClick={handleLike}>
                    {!liked ? (
                        <img src={starIconBefore} alt="" className={"movie-star-icon"}/>
                    ) : (
                        <img src={starIconAfter} alt="" className={"movie-star-icon"}/>
                    )}
                    Like
                </p>

                <p className={"movie-page-container-rating"}>
                    Rating: {movie.rating} <img src={starIcon} alt="" className={"movie-star-icon"}/>
                </p>
            </div>

            <div className={"movie-page-container-description"}>
                <h2 className={"movie-page-description-label"}>О серии</h2>
                <p className={"movie-page-description-text"}>
                    {movie.description}
                </p>
            </div>
        </div>
    );
}

export default MoviePage