import React, {useContext, useState} from 'react';
import "../styles/AuthPageStyle/AuthStyle.css"
import arrow from "../assets/arrow.png"
import {useNavigate} from "react-router-dom";
import {Context} from "../main.tsx";
import {loginUser, registerUser} from "../http/userApi.ts";

const AuthPage = () => {
    const {user} = useContext(Context)
    const host: string = window.location.pathname;

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!email.includes("@") || email.length < 8 || /[А-Яа-я]/.test(email)) {
                alert("Please enter a valid email");
                return
            }
            if (/[А-Яа-я]/.test(password) || password.length < 6) {
                alert("Please enter a valid password or your password smaller than 6 symbols");
                return;
            }





            if (location.pathname === "/registration") {
                if (username.length < 3) {
                    alert("Please enter a password longer than 3 characters");
                    return
                }
                const data = {
                    email: email,
                    userName: username,
                    password: password,
                }

                const userData = await registerUser(data);
                user.setIsAuth(true)
                user.setUser(userData)
                navigate("/home")
            }
            else if (location.pathname === "/sign") {
                const data = {
                    email: email,
                    password: password,
                };

                const userData = await loginUser(data);
                user.setUser(userData);
                user.setIsAuth(true);
                navigate("/home");
            }

        }
        catch (e) {
            console.log(e)
        }

        console.log('Register page:', { email, username, password });
    };


    return (
        <div className="auth-page-container">
            <div className="auth-page-input-container">
                <img src={arrow} alt="" className={"auth-page-img"} onClick={() => navigate("/movies")}/>

                {
                    host === "/registration"
                        ?
                        <>

                            <h2 className="auth-title">Регистрация</h2>

                            <div className="auth-input-group">
                                <label className="auth-label">Почта</label>
                                <input
                                    type="email"
                                    className="auth-input"
                                    placeholder="Введите email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="auth-input-group">
                                <label className="auth-label">Юзернейм</label>
                                <input
                                    type="text"
                                    className="auth-input"
                                    placeholder="Введите имя пользователя"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="auth-input-group">
                                <label className="auth-label">Пароль</label>
                                <input
                                    type="password"
                                    className="auth-input"
                                    placeholder="Введите пароль"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button
                                className="auth-button"
                                onClick={handleAuth}
                            >
                                Зарегистрироваться
                            </button>

                            <p className="auth-login-link">
                                Уже есть аккаунт? <a href="#" onClick={() => navigate("/sign")}>Войти</a>
                            </p>
                        </>



                        :
                        <>
                            <h2 className="auth-title">Авторизация</h2>

                            <div className="auth-input-group">
                                <label className="auth-label">Почта</label>
                                <input
                                    type="email"
                                    className="auth-input"
                                    placeholder="Введите email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="auth-input-group">
                                <label className="auth-label">Пароль</label>
                                <input
                                    type="password"
                                    className="auth-input"
                                    placeholder="Введите пароль"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button
                                className="auth-button"
                                onClick={handleAuth}
                            >
                                Авторзироваться
                            </button>

                            <p className="auth-login-link">
                                Нет аккаунта? <a href="#" onClick={() => navigate("/registration")}>Зарегестрироваться</a>
                            </p>
                        </>
                }


            </div>
        </div>
    );
};

export default AuthPage;