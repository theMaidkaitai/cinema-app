import React, {useContext, useEffect, useState} from 'react';
import "../styles/SettingsPageStyle/SettingsStyle.css"
import SmallButtonComponent from "../components/SmallButtonComponent.tsx";
import {Context} from "../main.tsx";
import AddMovieModal from "../components/modals/AddMovieModal.tsx";
import LoadingComponent from "../components/LoadingComponent.tsx";
import DeleteMovieModal from "../components/modals/DeleteMovieModal.tsx";
import {fetchFilms} from "../http/movieApi.ts";
import ReleaseMovieModal from "../components/modals/ReleaseMovieModal.tsx";

const SettingsPage = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [language, setLanguage] = useState('en');

    const [addMovieVisibility, setAddMovieVisibility] = useState(false);
    const [deleteMovieVisibility, setDeleteMovieVisibility] = useState(false);
    const [addAdminVisibility, setAddAdminVisibility] = useState(false);
    const [releaseMovieVisibility, setReleaseMovieVisibility] = useState(false);


    const [loading, setLoading] = useState(true);

    const {user, films} = useContext(Context)

    useEffect(() => {
        setLoading(false);
        fetchFilms().then(data => {
            films.setFilms(data);
        });
    }, [])

    if (loading) {
        return <LoadingComponent children={"Loading settings..."}/>
    }

    const handleAddFilm = async () => {

    }

    return (
        <div className="settings-page-container">
            <div className="settings-page-plash">
                <p className="setting-label-title">Notifications</p>
                <div className="settings-page-plash-points">
                    <div className="setting-item">
                        <div className="setting-info">
                            <p className="setting-label-title-point">Email</p>
                            <p className="setting-desc-point">
                                We'll send you notifications about new releases!
                            </p>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={(e) => setEmailNotifications(e.target.checked)}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="settings-page-plash">
                <p className="setting-label-title">Appearance</p>
                <div className="settings-page-plash-points">
                    <div className="setting-item">
                        <div className="setting-info">
                            <p className="setting-label-title-point">Dark Mode</p>
                            <p className="setting-desc-point">
                                Use dark theme across the app
                            </p>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={(e) => setDarkMode(e.target.checked)}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="settings-page-plash">
                <p className="setting-label-title">Language</p>
                <div className="settings-page-plash-points">
                    <div className="setting-item">
                        <div className="setting-info">
                            <p className="setting-label-title-point">Language</p>
                            <p className="setting-desc-point">
                                {language === 'en' ? 'English' :
                                    language === 'ru' ? 'Русский' : 'Spanish'}
                            </p>
                        </div>
                        <select
                            className="language-select"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <option value="en">English</option>
                            <option value="ru">Русский</option>
                            <option value="es">Español</option>
                        </select>
                    </div>
                </div>
            </div>

            {
                user._user.role?.toLowerCase() === "admin" || "senior"
                ?
                    <>
                        <div className="settings-page-plash">
                            <p className="setting-label-title">Admin panel</p>
                            <div className="settings-page-plash-points">
                                <div className="setting-item">

                                    <div className="setting-info">
                                        <p className="setting-label-title-point">Add new movie</p>
                                        <p className="setting-desc-point">
                                            alt + f4 to add new movie!!! (true)
                                        </p>
                                    </div>

                                    <SmallButtonComponent children={"Release movie"}  onClick={() => setAddMovieVisibility(true)}/>
                                </div>

                                <div className="setting-item">
                                    <div className="setting-info">
                                        <p className="setting-label-title-point">Delete movie</p>
                                        <p className="setting-desc-point">
                                            delete all movie and u get subscribe FOREVER (not lie)
                                        </p>
                                    </div>

                                    <SmallButtonComponent children={"Delete movie"} onClick={() => setDeleteMovieVisibility(true)}/>
                                </div>

                                <div className="setting-item">
                                    <div className="setting-info">
                                        <p className="setting-label-title-point">Release movie</p>
                                        <p className="setting-desc-point">
                                            How about release your life and go outside touch grass?
                                        </p>
                                    </div>

                                    <SmallButtonComponent children={"Release movie"}  onClick={() => setReleaseMovieVisibility(true)}/>
                                </div>


                                {user._user.role?.toLowerCase() === "senior"
                                ?
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <p className="setting-label-title-point">Add admin</p>
                                            <p className="setting-desc-point">
                                                No!!!!!!11
                                            </p>
                                        </div>

                                        <SmallButtonComponent children={"Add admin"} onClick={() => console.log('wdwd')}/> // TODO: later
                                    </div>
                                    :
                                    null
                                }


                            </div>
                        </div>
                    </>
                    :
                    null
            }

            <AddMovieModal
                isOpen={addMovieVisibility}
                onClose={() => setAddMovieVisibility(false)}
            />

            <DeleteMovieModal
                isOpen={deleteMovieVisibility}
                onClose={() => setDeleteMovieVisibility(false)}
            />

            <ReleaseMovieModal
                isOpen={releaseMovieVisibility}
                onClose={() => setReleaseMovieVisibility(false)}
            />

        </div>
    );
};

export default SettingsPage;