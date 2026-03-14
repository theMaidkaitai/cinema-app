import {$authHost, $nonAuthHost} from "./config/http-client.ts";
import type {MovieIdsData} from "./data interfaces/movie/MovieIdsData.ts";

export const fetchFilms = async () => {
    try {
        const {data} = await $authHost.get("film/api/stream/get/movies");
        return data;
    }
    catch (error) {
        console.error("Ошибка при запросе API fetchFilms:", error);
        throw error;
    }
}

export const fetchFilm = async (id: string | undefined) => {
    try {
        const {data} = await $authHost.get(`film/api/stream/get/movie/${id}`);
        return data;
    }
    catch (error) {
        console.error("Ошибка при запросе API fetchFilm:", error);
        throw error;
    }
}


export const addMovie = async (formData: FormData) => {
    try {

        const {data} = await $authHost.post('film/api/stream/add/movie', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return data;
    }
    catch (error) {
        console.error("Ошибка при запросе API addMovie:", error);
        throw error;
    }
}


export const releaseMovie = async (formData: FormData, id: number | string) => {
    try {

        const {data} = await $authHost.post(`film/api/stream/release/movie/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return data;
    }
    catch (error) {
        console.error("Ошибка при запросе API addMovie:", error);
        throw error;
    }
}


// export const fetchVideoMovie = async (fileName: string) => {
//     // const {data} = await $authHost.get(`film/api/stream/${fileName}`, {
//     //     responseType: "blob",
//     // })
//
//     const {data} = await $authHost.get(`film/api/stream/${fileName}`, {
//         responseType: "blob",
//     })
//     return URL.createObjectURL(data);
// }


export const fetchCoverMovie = async (fileName: string | undefined) => {
    try {
        const response = await $authHost.get(`film/api/stream/cover/${fileName}`, {
            responseType: 'blob',
            headers: {
                'Accept': 'image/*'
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("Ошибка при запросе API fetchCoverMovie:", error);
        throw error;
    }
}

export const fetchAllGenres = async () => {
    try {
        const { data } = await $nonAuthHost.get(`film/api/other/get/genres`);
        return data;
    }
    catch (error) {
        console.error("Ошибка при запросе API fetchCoverMovie:", error);
        throw error;
    }
}

export const deleteMovie = async (id: number | undefined) => {
    try {
        const { data } = await $authHost.delete(`film/api/other/delete/movie/${id}`)
        return data;
    }
    catch (error) {
        console.error("Ошибка при запросе API fetchCoverMovie:", error);
        throw error;
    }
}


export const likeMovie = async (dataI: MovieIdsData) => {
    try {
        const { data } = await $authHost.post(`film/api/action/like/movie`, dataI)
        return data;
    }
    catch (error) {
        console.error("Ошибка при запросе API fetchCoverMovie:", error);
        throw error;
    }
}

export const checkLiked = async (dataI: undefined | MovieIdsData) => {
    try {
        const { data } = await $authHost.get(`film/api/action/check/like/movie`, {
            params: {
                movieId: dataI?.movieId,
                userId: dataI?.userId
            }
        })

        return data;
    }
    catch (error) {
        console.error("Ошибка при запросе API fetchCoverMovie:", error);
        throw error;
    }
}

export const getLikesByUser = async (id: number | undefined) => {
    try {
        const { data } = await $authHost.get(`film/api/other/get/likes/movie/${id}`)
        return data;
    }
    catch (error) {
        console.error("Ошибка при запросе API fetchCoverMovie:", error);
        throw error;
    }
}

export const getRecommendationsByUser = async (id: number | undefined) => {
    try {
        const { data } = await $authHost.get(`film/api/other/get/recs/movie/${id}`)
        return data;
    }
    catch (error) {
        console.error("Ошибка при запросе API fetchCoverMovie:", error);
        throw error;
    }
}



//
// export const getHighestLikesFilm = async (): Promise<FilmData> => {
//     try {
//         const { data } = await $authHost.get(`film/api/other/get/highest/likes/movie`)
//         return data;
//     }
//     catch (error) {
//         console.error("Ошибка при запросе API fetchCoverMovie:", error);
//         throw error;
//     }
// }


export const addFavoriteMovie = async (dataI: MovieIdsData) => {
    try {
        const { data } = await $authHost.post(`film/api/action/add/favorite/movie`, dataI)
        return data;
    }
    catch (error) {
        console.error("Ошибка при запросе API fetchCoverMovie:", error);
        throw error;
    }
}

export const getFavoritesByUser = async (id: number | undefined) => {
    try {
        const { data } = await $authHost.get(`film/api/other/get/favorites/movie/${id}`)
        return data;
    }
    catch (error) {
        console.error("Ошибка при запросе API fetchCoverMovie:", error);
        throw error;
    }
}

export const checkFavs = async (dataI: undefined | MovieIdsData) => {
    try {
        const { data } = await $authHost.get(`film/api/action/check/favorite/movie`, {
            params: {
                movieId: dataI?.movieId,
                userId: dataI?.userId
            }
        })
        return data;
    }
    catch (error) {
        console.error("Ошибка при запросе API fetchCoverMovie:", error);
        throw error;
    }
}
