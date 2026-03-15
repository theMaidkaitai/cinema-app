import type {UserInterface} from "./data interfaces/user/userInterface.ts";
import {$nonAuthHost} from "./config/http-client.ts";
import {jwtDecode} from "jwt-decode";
import type {UserLoginInterface} from "./data interfaces/user/userLoginInterface.ts";

export const registerUser = async (dataInterface: UserInterface) => {
    try {
        const response = await $nonAuthHost.post("api/auth/register", dataInterface);

        const responseData = response.data;
        console.log("Response from server:", responseData);

        if (!responseData.tokenAccess && !responseData.tokenRefresh) {
            console.error("Token not found in response:", responseData);
            throw new Error("Invalid token format");
        }

        if (responseData.tokenAccess) {
            localStorage.setItem("tokenAccess", responseData.tokenAccess);
            const userData = jwtDecode(responseData.tokenAccess);
            console.log("ACCESS TOKEN SET:", userData);
            return userData;
        }

    }
    catch (error) {
        console.error("Ошибка при запросе API registerUser:", error);
        throw error;
    }
}


export const loginUser = async (dataInterface: UserLoginInterface) => {
    try {
        const response = await $nonAuthHost.post("api/auth/login", dataInterface);

        const responseData = response.data;
        console.log("Response from server:", responseData);

        if (!responseData.tokenAccess && !responseData.tokenRefresh) {
            console.error("Token not found in response:", responseData);
            throw new Error("Invalid token format");
        }

        if (responseData.tokenAccess) {
            localStorage.setItem("tokenAccess", responseData.tokenAccess);
            const userData = jwtDecode(responseData.tokenAccess);
            console.log("ACCESS TOKEN SET:", userData);
            return userData;
        }

    }
    catch (error) {
        console.error("Ошибка при запросе API loginUser:", error);
        throw error;
    }
}



export const refreshAccessToken = async () => {
    try {
        const response = await $nonAuthHost.post("api/auth/refresh", {});

        const responseData = response.data;

        if (!responseData.tokenAccess) {
            console.error("Token not found in response:", responseData);
            throw new Error("Invalid token format");
        }

        if (responseData.tokenAccess) {
            localStorage.setItem("tokenAccess", responseData.tokenAccess);
            return responseData.tokenAccess;
        }

    }
    catch (error) {
        console.error("Ошибка при запросе API loginUser:", error);
        throw error;
    }
}