import type {MovieIdsData} from "../http/data interfaces/movie/MovieIdsData.ts";
import {likeMovie} from "../http/movieApi.ts";

async function convertToNumber(movieId: number | string | undefined, userId: number | string | undefined) {
    try {
        const convertedMovieId = typeof movieId === 'string' ? parseInt(movieId) : movieId;
        const convertedUserId = typeof userId === 'string' ? parseInt(userId) : userId;

        // if (isNaN(<number>convertedMovieId) || isNaN(convertedUserId)) {
        //     console.error("Invalid id format");
        //     return;
        // }

        const dataLike: MovieIdsData = {
            movieId: convertedMovieId,
            userId: convertedUserId
        };

        return dataLike;

    } catch (error) {
        console.error("Error liking movie:", error);
        throw error;
    }
}

export default convertToNumber;