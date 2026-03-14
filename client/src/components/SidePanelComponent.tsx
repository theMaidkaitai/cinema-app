import React, {useContext, useEffect, useState} from 'react';
import "../styles/SidePanelComponentStyle/SidePanel.css"
import ButtonComponent from "./ButtonComponent.tsx";
import InputSearchComponent from "./InputSearchComponent.tsx";
import {useNavigate, useParams} from "react-router-dom";
import SmallButtonComponent from "./SmallButtonComponent.tsx";
import userIcon from  "../assets/user.png"
import nonUserIcon from  "../assets/nonAuthUser.png"
import {Context} from "../main.tsx";
import {observer} from "mobx-react-lite"
import {fetchAllGenres} from "../http/movieApi.ts";
import LoadingComponent from "./LoadingComponent.tsx";


const SidePanelComponent = observer(() => {

    // TODO: сделать скрытия панели (для мобилок)
    const navigate = useNavigate();
    const { user, genres } = useContext(Context)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const checkGenres = async () => {
            const data = await fetchAllGenres()
            genres.setGenres(data)
            setLoading(false)
        }
        checkGenres()
    }, []);

    if (loading) {
        return <LoadingComponent children={"Loading..."} />
    }

    const genreHandle = (genre: string) => {
        navigate(`/search/${genre}`);

    }

    return (
            <div className="side-panel-container">

                <div className="side-panel-buttons">
                    <div className={"side-panel-container-header"}>
                        <p className={"side-panel-name"}>Filmix</p>
                        <p className={"side-panel-desc"}>Premium films experience</p>
                    </div>

                    <InputSearchComponent/>

                    <div className="side-panel-base">
                        {
                            user._isAuth
                            ?
                                <ButtonComponent onClick={() => navigate("/home")} children={"Home"}/>
                                :
                                <ButtonComponent onClick={() => navigate("/sign")} children={"Home"}/>
                        }

                        <ButtonComponent onClick={() => navigate("/movies")} children={"Movies"}/>

                        {

                            user._isAuth
                                ?
                                <ButtonComponent onClick={() => navigate("/profile")} children={"Profile"}/>
                                :
                                <ButtonComponent onClick={() => navigate("/sign")} children={"Profile"}/>
                        }
                        <ButtonComponent onClick={() => navigate("/settings")} children={"Settings"}/>
                    </div>

                    <div className={"divider"}></div>

                    <div className="side-panel-genres">
                        <p className={"side-panel-bottom-genres-name"}>Genres</p>
                        {genres.getGenres().map((genre, index) => (
                            <ButtonComponent
                                key={index}
                                onClick={() => genreHandle(genre)}
                                children={`${genre}`}

                            />
                        ))}
                    </div>


                    <div className={"side-panel-user-plash"}>
                        {
                            user._isAuth
                                ?
                                <>
                                    <div className={"side-panel-user-info"} onClick={() => navigate("/profile")}>
                                        <img src={userIcon} alt="" className={"user-info-icon"}/>
                                        <div style={{display: "flex", flexDirection: "column", lineHeight: 1.2}}>
                                            <p className={"side-panel-plash-info-user-name"}>{user._user.userName}</p>
                                            {
                                                user._user.subscriber ?

                                                <p className={"side-panel-plash-info-user-status"}>Subscriber</p>
                                                :
                                                    <p className={"side-panel-plash-info-user-status"}>Not Subscriber</p>

                                            }

                                        </div>
                                    </div>


                                </>

                                :
                                <>
                                    <div className={"side-panel-user-info"}>
                                        <img src={nonUserIcon} alt="" className={"user-info-icon"}/>
                                        <div style={{display: "flex", flexDirection: "column", lineHeight: 1.2}}>
                                            <p className={"side-panel-plash-info-user-name"}>************</p>
                                            <p className={"side-panel-plash-info-user-status"}>*******</p>
                                        </div>
                                    </div>

                                    <div className={"side-panel-user-button-container"}>
                                        <SmallButtonComponent onClick={() => navigate("/sign")} children={"Sign"}/>
                                    </div>
                                </>
                        }
                    </div>

                </div>
            </div>
    );
});

export default SidePanelComponent;