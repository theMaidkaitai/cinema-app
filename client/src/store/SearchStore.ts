// store/SearchStore.ts
import {makeAutoObservable} from "mobx";

export default class SearchStore {
    private _searchInput: string = "";
    private _searchResults: any[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    get searchInput() {
        return this._searchInput;
    }

    get searchResults() {
        return this._searchResults;
    }

    setSearchQuery(input: string) {
        this._searchInput = input;
    }

    setSearchResults(results: any[]) {
        this._searchResults = results;
    }
}