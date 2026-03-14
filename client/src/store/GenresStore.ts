import {makeAutoObservable } from "mobx";



export default class GenresStore {
    private _genres: string[];

    constructor() {
        this._genres = []
        makeAutoObservable(this)
    }



    getGenres() {
        return this._genres;
    }

    setGenres(genres: string[]) {
        this._genres = genres;
    }


}