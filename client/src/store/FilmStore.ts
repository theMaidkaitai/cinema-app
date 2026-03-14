import {action, makeAutoObservable, makeObservable, observable} from "mobx";

export interface FilmData {
    id?: number;
    title?: string,
    description?: string,
    video_name?: string,
    genre?: string,
    duration?: number,
    path_cover_fileName?: string
    rating?: number,
    type?: "RELEASE" | "SOON"
}



export default class FilmStore {
    private _films: FilmData[];

    constructor() {
        this._films = [{}]
        makeAutoObservable(this)
    }



    get films() {
        return this._films;
    }


    setFilms(films: FilmData[]) {
        this._films = films;
    }
}