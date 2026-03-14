import React, {useContext, useState} from 'react';
import "../styles/InputSearchComponentStyle/InputSearchStyle.css"
import searchIcon from "../assets/searchIcon.png"
import {Context} from "../main.tsx";
import {useNavigate} from "react-router-dom";

const InputSearchComponent = () => {
    const {search, films} = useContext(Context)
    const [input, setInput] = useState<string>('')
    const navigate = useNavigate();

    const handleSearch = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if (input.trim()) {
            const results = films.films.filter(film => film.title?.toLowerCase().includes(input.toLowerCase()))
            search.setSearchQuery(input);
            search.setSearchResults(results);
            navigate(`/search?q=${encodeURIComponent(input)}`);
        }

    }

    return (
        <div className="search-component-container">
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                type="text"
                placeholder={"Search..."}
                className={"search-component-input"}/>
            <img src={searchIcon} alt="" className={"search-icon"} onClick={handleSearch}/>
        </div>
    );
};

export default InputSearchComponent;