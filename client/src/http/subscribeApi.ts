import {$authHost} from "./config/http-client.ts";
import type {subscribeReqInterface} from "./data interfaces/subscribe/subscribeReqInterface.ts";


export const subscribe = async (dataReq: subscribeReqInterface) => {
    try {
        const {data} = await $authHost.post("subscribe/api/create", dataReq);
        return data;
    }
    catch (error) {
        console.error("Ошибка при запросе API fetchFilms:", error);
        throw error;
    }
}
