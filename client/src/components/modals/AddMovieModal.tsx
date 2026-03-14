import React, {useContext, useState} from 'react';
import "../../styles/MovieModalStyle/MovieModalStyle.css";
import {Context} from "../../main.tsx";
import {addMovie} from "../../http/movieApi.ts";
import DefaultButtonComponent from "../DefaultButtonComponent.tsx";
import ButtonSubmitComponent from "../ButtonSubmitComponent.tsx";


const AddMovieModal = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [filmFile, setFilmFile] = useState("");
    const [coverFile, setCoverFile] = useState("");
    const [genre, setGenre] = useState("");
    const [type, setType] = useState('');

    const {genres} = useContext(Context);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData()

        // if (type === "RELEASE") {
        // }
        formData.append("filmFile", filmFile)

        formData.append("coverFile", coverFile)
        formData.append("title", title)
        formData.append("description", description)
        formData.append("genre", genre)
        formData.append("type", type)

        await addMovie(formData)
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add Film</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter film title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter film description"
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Movie File</label>
                        <input
                            type="file"
                            accept="video/mp4,video/avi,video/mkv"
                            onChange={(e) => setFilmFile(e.target.files[0])}
                            required
                        />
                        {/*{movieFile && (*/}
                        {/*    <small className="file-name">{movieFile.name}</small>*/}
                        {/*)}*/}
                    </div>

                    <div className="form-group">
                        <label>Cover File</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCoverFile(e.target.files[0])}
                            required
                        />
                        {/*{coverFile && (*/}
                        {/*    <small className="file-name">{coverFile.name}</small>*/}
                        {/*)}*/}
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Status</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="">• Select a type •</option>

                                <option value="RELEASE">Release</option>
                                <option value="SOON">Soon</option>
                            </select>
                        </div>

                        <div className="form-group half">
                            <label>Genres</label>
                            <select
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                            >
                                <option value="">• Select a genre •</option>
                                {genres.getGenres().map((genre) => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}

                            </select>
                        </div>

                        {/*<div className="form-group half">*/}
                        {/*    <label>Release</label>*/}
                        {/*    <input*/}
                        {/*        type="date"*/}
                        {/*        value={releaseDate}*/}
                        {/*        onChange={(e) => setReleaseDate(e.target.value)}*/}
                        {/*    />*/}
                        {/*</div>*/}
                    </div>

                    <div className="modal-footer">
                        <DefaultButtonComponent onClick={onClose} children = {"Cancel"}/>
                        <ButtonSubmitComponent children={"Add film"} onClick={() => handleSubmit} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMovieModal;