import React, {useContext, useState} from 'react';
import "../../styles/MovieModalStyle/MovieModalStyle.css";
import {Context} from "../../main.tsx";
import {releaseMovie} from "../../http/movieApi.ts";


const ReleaseMovieModal = ({ isOpen, onClose }) => {
    const [movieFile, setMovieFile] = useState<File | null>(null);
    const [movieReleaseId, setMovieReleaseId] = useState<number | string>("");

    const {films} = useContext(Context)

    const handleSubmit = (e) => {
        e.preventDefault();

        // TODO: не забыть сделать чтобы на беке ставился статус release
        const formData = new FormData();
        formData.append("filmFile", movieFile);
        releaseMovie(formData, movieReleaseId)

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Release Movie</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Choose Movie</label>
                            <select
                                value={movieReleaseId}
                                onChange={(e) => setMovieReleaseId(e.target.value)}
                                required
                            >
                                <option value="">• Select a movie •</option>
                                {films?.films?.map((movie) => (
                                    <option key={movie.id} value={movie.id}>
                                        {movie.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Movie File</label>
                        <input
                            type="file"
                            accept="video/mp4,video/avi,video/mkv"
                            onChange={(e) => setMovieFile(e.target.files[0])}
                            required
                        />

                        {/*{movieFile && (*/}
                        {/*    <small className="file-name">{movieFile.name}</small>*/}
                        {/*)}*/}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            Release Movie
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default ReleaseMovieModal;