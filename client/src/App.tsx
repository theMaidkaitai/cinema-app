import './styles/App.css'
import SidePanelComponent from "./components/SidePanelComponent.tsx";
import {BrowserRouter, useLocation, useNavigate} from "react-router-dom";
import AppRouterComponent from "./components/AppRouterComponent.tsx";
import {useContext, useEffect} from "react";
import {jwtDecode} from "jwt-decode";
import {Context} from "./main.tsx";
import {refreshAccessToken} from "./http/userApi.ts";
import {fetchAllGenres} from "./http/movieApi.ts";
import type {CustomJwtPayload} from "./http/data interfaces/jwt/CustomJwtPayload.ts";

function AppContent() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/sign' || location.pathname === '/registration';
    const navigate = useNavigate();

    const {user, genres} = useContext(Context)

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('tokenAccess');
            console.log(token);
            if (!token) {
                user.setIsAuth(false);
                user.setUser({});
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp && decoded.exp < currentTime) {
                    try {
                        const newToken = await refreshAccessToken();
                        const newDecoded: CustomJwtPayload = jwtDecode(newToken);
                        console.log("!!!!!!", newDecoded);
                        user.setUser({
                            id: newDecoded.id,
                            userName: newDecoded.userName,
                            email: newDecoded.email,
                            role: newDecoded.role,
                            subscriber: newDecoded.subscriber
                        });
                        user.setIsAuth(true);
                    } catch {
                        localStorage.removeItem('tokenAccess');
                        user.setIsAuth(false);
                        user.setUser({});
                        navigate('/sign');
                    }
                } else {
                    user.setUser(decoded);
                    user.setIsAuth(true);
                }
            } catch (e) {
                localStorage.removeItem('tokenAccess');
                user.setIsAuth(false);
                user.setUser({});
            }
        };
        checkAuth();
    }, []);





    return (
        <div style={{ display: "flex" }}>
            {!isAuthPage && <SidePanelComponent/>}

            <div style={{
                marginLeft: isAuthPage ? "0" : "170px",
                width: isAuthPage ? "100%" : "calc(100% - 170px)",
                minHeight: "100vh",
                transition: 'margin-left 0.3s ease'
            }}>
                <AppRouterComponent/>
            </div>
        </div>
    );
}



function App() {
    return (
        <BrowserRouter>
            <AppContent/>
        </BrowserRouter>
    )
}

export default App