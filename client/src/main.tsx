import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {createContext} from "react";
import UserStore from "./store/UserStore.ts";
import  FilmStore from "./store/FilmStore.ts";
import  GenresStore from "./store/GenresStore.ts";
import SearchStore from "./store/SearchStore.ts";
import type { IValueMap } from 'mobx-react/src/types/IValueMap.ts';

interface ContextValue {
    user: UserStore,
    films: FilmStore,
    genres: GenresStore,
    search: SearchStore
}


export const Context = createContext<ContextValue>({} as ContextValue)


createRoot(document.getElementById('root')!).render(
    <Context.Provider value={{
        user: new UserStore(),
        films: new FilmStore(),
        genres: new GenresStore(),
        search: new SearchStore()
    }}>
        <App />
    </Context.Provider>
)
