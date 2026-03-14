import React, {useContext, useState} from 'react';
import "../../styles/MovieModalStyle/MovieModalStyle.css";
import {Context} from "../../main.tsx";
import DefaultButtonComponent from "../DefaultButtonComponent.tsx";
import ButtonSubmitComponent from "../ButtonSubmitComponent.tsx";
import type {subscribeReqInterface} from "../../http/data interfaces/subscribe/subscribeReqInterface.ts";
import {subscribe} from "../../http/subscribeApi.ts";

const SubscribePanel = ({ isOpen, onClose }) => {

    const [month, setMonth] = useState(1);
    const [sum, setSum] = useState<number>(month * 5);
    const {user} = useContext(Context)


    const getExpiryDate = () => {
        const date = new Date();
        date.setMonth(date.getMonth() + month);
        return date;
    };

    const formatDate = (date: Date, locale = 'ru-RU') => {
        return date.toLocaleDateString(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setMonth(value);
        setSum(value * 5);
        e.target.style.background = `linear-gradient(90deg, rgb(230, 0, 11) 0%, rgb(230, 0, 11) ${(value-1)*20}%, #444 ${(value-1)*20}%)`;
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const date = new Date();
        date.setMonth(date.getMonth() + month);
        const toIso = date.toISOString();

        const data: subscribeReqInterface = {
            userId: user._user.id,
            expiredAt: toIso
        }

        await subscribe(data);

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content subscribe-modal">
                <div className="modal-header">
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="subscribe-content">
                        <div className="slider-container">
                            <div className="slider-labels">
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="6"
                                value={month}
                                onChange={handleMonthChange}
                                className="month-slider"
                            />
                            <div className="selected-duration">
                                <span className="duration-text">{month} Month</span>
                            </div>
                        </div>

                        <div className="price-section">
                            <div className="price-label">Expires:</div>
                            <div className="price-value">{formatDate(getExpiryDate())}</div>
                        </div>

                        <div className="total-section">
                            <span>Total:</span>
                            <span className="total-price">({month * 5}$)</span>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <DefaultButtonComponent onClick={onClose} children = {"Cancel"}/>
                        <ButtonSubmitComponent children={"Subscribe"} onClick={() => handleSubmit} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubscribePanel;