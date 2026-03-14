import React from 'react';
import {Route, Routes} from "react-router-dom";
import HomePage from "../pages/HomePage.tsx";
import MoviesPage from "../pages/MoviesPage.tsx";
import UserCabinetPage from "../pages/UserCabinetPage.tsx";
import SettingsPage from "../pages/SettingsPage.tsx";
import AuthPage from "../pages/AuthPage.tsx";
import MoviePage from "../pages/MoviePage.tsx";
import SearchResultsPage from "../pages/SearchResultsPage.tsx";
import GenreFilterPage from "../pages/GenreFilterPage.tsx";

const AppRouterComponent = () => {




    return (
        <Routes>
            <Route path="/home" element={<HomePage/>}/>
            <Route path="/movies" element={<MoviesPage/>}/>
            <Route path="/movies/watch/:id" element={<MoviePage/>} />
            <Route path="/profile" element={<UserCabinetPage/>}/>
            <Route path="/settings" element={<SettingsPage/>}/>
            <Route path="/sign" element={<AuthPage/>}/>
            <Route path="/search" element={<SearchResultsPage/>}/>
            <Route path="/search/:genre" element={<GenreFilterPage/>}/>
            <Route path="/registration" element={<AuthPage/>}/>
            <Route path="*" element={<HomePage/>} />
        </Routes>
    );
};

export default AppRouterComponent;