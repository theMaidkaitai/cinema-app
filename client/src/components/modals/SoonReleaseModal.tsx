import React from 'react';
import "../../styles/MovieModalStyle/MovieModalStyle.css";
import gif from "../../assets/bleh.gif"

const SoonReleaseModal = ({ isOpen, onClose }) => {


    const handleSubmit = (e) => {
        e.preventDefault();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>This movie will be released soon!</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <p>Or not bleehhh :/</p> <img src={gif} alt="" style={{ width: 100 }} />
                </form>
            </div>
        </div>
    );

};

export default SoonReleaseModal;