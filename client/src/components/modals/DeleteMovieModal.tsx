import React, {useContext, useEffect, useState} from 'react';
import "../../styles/MovieModalStyle/MovieModalStyle.css";
import {Context} from "../../main.tsx";
import {deleteMovie} from "../../http/movieApi.ts";
import ButtonSubmitComponent from "../ButtonSubmitComponent.tsx";
import DefaultButtonComponent from "../DefaultButtonComponent.tsx";


const DeleteMovieModal = ({ isOpen, onClose }) => {
    const [id, setId] = useState<number>();
    const {films} = useContext(Context)



    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(id);
        deleteMovie(id)
        onClose();
    };

    if (!isOpen) return null;

    // @ts-ignore
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Delete Movie</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Choose Movie</label>
                            <select
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            >
                                <option value="">• Select a movie •</option>
                                {films.films.map((movie) => (
                                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="modal-footer">

                        <DefaultButtonComponent onClick={onClose} children = {"Cancel"}/>
                        <ButtonSubmitComponent children={"Delete"} onClick={() => handleSubmit} />

                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeleteMovieModal;