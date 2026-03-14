import React, {useContext, useEffect, useState} from 'react';
import userIcon from "../assets/user.png"
import "../styles/CabinetComponentStyle/CabinetStyle.css"
import SmallButtonComponent from "../components/SmallButtonComponent.tsx";
import {Context} from "../main.tsx";
import {useNavigate} from "react-router-dom";
import SubscribeModal from "../components/modals/SubscribeModal.tsx";



const UserCabinetPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const {user} = useContext(Context)
    const [subscribeVisible, setSubscribeVisible] = useState<boolean>(false)

    const logoutFunc = () => {
        localStorage.removeItem("token");
        user.setUser({})
        user.setIsAuth(false)
        navigate("/sign")
    }

    useEffect(() => {
        const token = localStorage.getItem("tokenAccess");
        if (!token || !user._isAuth ) {
            navigate("/sign");
        }
        setLoading(false);
    }, [])

    if (loading || !user._user || !user._user.userName) {
        return <div className="loading">Loading profile...</div>;
    }


    return (
        <div className="user-cabinet-container">
            <div className="user-cabinet-main-card">
                <div className="user-cabinet-left">
                    <div className="user-cabinet-avatar">
                        <img src={userIcon} alt="user" className="user-cabinet-img"/>
                        <div className="user-cabinet-name-block">
                            <p className="user-cabinet-name">{user._user.userName}</p>
                            {user._user.subscriber ?
                                <p className="user-cabinet-status">Subscriber</p>
                                :
                                <p className="user-cabinet-status">Not Subscriber</p>

                            }
                        </div>
                    </div>

                    <div className="user-cabinet-info-grid">
                        <div className="info-column">
                            <div className="info-item">
                                <p className="info-label">Email</p>
                                <p className="info-value">{user._user.email}</p>
                            </div>
                            <div className="info-item">
                                <p className="info-label">Password</p>
                                <p className="info-value">*********</p>
                            </div>
                        </div>

                        <div className="info-column-right">
                            <div className="info-item">
                                <p className="info-label">Subscriber since</p>
                                <p className="info-value">24.02.2026</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="user-cabinet-right">
                    <SmallButtonComponent children={"Edit profile"} onClick={() => console.log("")}/>
                    <SmallButtonComponent children={"Buy subscribe"} onClick={() => setSubscribeVisible(true)}/>
                    <SmallButtonComponent children={"Logout"} onClick={logoutFunc}/>

                </div>
            </div>

            <div className="user-cabinet-bottom-cards">
                <div className="user-cabinet-watched-card">
                    <span className="watched-count">24</span>
                    <p className="watched-label">Movies watched</p>
                </div>

                <div className="user-cabinet-subscribe-card">
                    <p className="subscribe-text">The subscription will expire:</p>
                    <p className="subscribe-date">24.02.2027</p>
                </div>
            </div>


            <SubscribeModal
                isOpen={subscribeVisible}
                onClose={() => {setSubscribeVisible(false)}}
            />
        </div>
    );
};

export default UserCabinetPage;