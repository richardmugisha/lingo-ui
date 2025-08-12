import { httpEndpoint } from "../../../../serverConfig";
import AxiosWrapper from "../AxiosWrapper";

export const createStructure = async (userID) => {
    try {
        const response = await AxiosWrapper.post(`${httpEndpoint}/guru`, { userID });
        return [response.data, null];
    } catch (error) {
        return [null, error];
    }
}

export const createChat = async (userID) => {
    try {
        const response = await AxiosWrapper.post(`${httpEndpoint}/guru/chats`, { userID });
        return [response.data, null];
    } catch (error) {
        return [null, error];
    }
}

export const chatWithAI = async ({userID, title, summary, messages, userMessage}) => {
    try {
        const response = await AxiosWrapper.post(`${httpEndpoint}/guru/chat`, { userID, title, summary, messages, userMessage });
        return [response.data, null];
    } catch (error) {
        return [null, error];
    }
}