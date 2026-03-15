import  {useContext, useEffect, useState} from 'react';
import "../styles/HomePageStyle/HomeStyle.css"
import {Context} from "../main.tsx";
import {getFavoritesByUser, getLikesByUser, getRecommendationsByUser} from "../http/movieApi.ts";
import {jwtDecode} from "jwt-decode";
import type {CustomJwtPayload} from "../http/data interfaces/jwt/CustomJwtPayload.ts";
import MovieComponent from "../components/MovieComponent.tsx";
import type {FilmData} from "../store/FilmStore.ts";
import LoadingComponent from "../components/LoadingComponent.tsx";
import CentredWarningComponent from "../components/CentredWarningComponent.tsx";


const HomePage = () => {
    const {user, films} = useContext(Context);

    const [likedMovies, setLikedMovies] = useState<FilmData[]>([]);
    const [favoritedMovies, setFavoritedMovies] = useState<FilmData[]>([]);
    const [recommedations, setRecommedations] = useState<FilmData[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkFavsLikesRecs = async () => {
            try {
                const token = localStorage.getItem("tokenAccess");
                if (token) {
                    const decoded: CustomJwtPayload = jwtDecode(token);

                    const dataLikes = await getLikesByUser(decoded.id);
                    const dataFavs = await getFavoritesByUser(decoded.id);
                    const dataRecs = await getRecommendationsByUser(decoded.id);

                    setRecommedations(dataRecs);
                    setLikedMovies(dataLikes);
                    setFavoritedMovies(dataFavs);
                }
            } catch (error) {
                console.error("Error fetching liked movies:", error);
            } finally {
                setLoading(false);
            }
        };

        checkFavsLikesRecs();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="home-page-container">
                <div className="home-page-likes">
                    <p className="home-page-v">Likes:</p>
                    <div className="home-page-likes-components">
                        {likedMovies.length > 0 ? (
                            likedMovies.map((movie: FilmData) => (
                                <MovieComponent
                                    key={movie.id}
                                    id={movie.id}
                                    rating={movie.rating}
                                    title={movie.title}
                                    genre={movie.genre}
                                    path_cover_fileName={movie.path_cover_fileName}
                                />
                            ))
                        ) : (
                            <CentredWarningComponent
                                child={
                                    <LoadingComponent children={"You haven't liked anything :/"}/>
                                }
                            />
                        )}
                    </div>
                </div>

                <div className="home-page-recommend">
                    <p className="home-page-v">Recommendations:</p>
                    <div className="home-page-likes-components">
                        {recommedations.length > 0 ? (
                            recommedations.map((movie: FilmData) => (
                                <MovieComponent
                                    key={movie.id}
                                    id={movie.id}
                                    rating={movie.rating}
                                    title={movie.title}
                                    genre={movie.genre}
                                    path_cover_fileName={movie.path_cover_fileName}
                                />
                            ))
                        ) : (
                            <CentredWarningComponent
                                child={
                                    <LoadingComponent children={`Not enough data to make recommendations ;> srry`}/>
                        }
                            />
                        )}
                    </div>
                </div>

                <div className="home-page-favorites">
                    <p className="home-page-v">Favorite movies:</p>
                    <div className="home-page-likes-components">
                        {favoritedMovies.length > 0 ? (
                            favoritedMovies.map((movie: FilmData) => (
                                <MovieComponent
                                    key={movie.id}
                                    id={movie.id}
                                    rating={movie.rating}
                                    title={movie.title}
                                    genre={movie.genre}
                                    path_cover_fileName={movie.path_cover_fileName}
                                />
                            ))
                        ) : (
                            <CentredWarningComponent
                                child={
                                <LoadingComponent children={"You haven't added anything to your favorites yet :/"}/>
                            }
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;