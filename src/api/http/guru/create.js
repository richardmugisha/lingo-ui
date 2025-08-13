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

export const chatWithAI = async ({userID, chatID, title, summary, messages, userMessage}) => {
    try {
        const response = await AxiosWrapper.post(`${httpEndpoint}/guru/chat`, { userID, chatID, title, summary, messages, userMessage });
        return [response.data, null];
    } catch (error) {
        return [null, error];
    }
}

export const createTitle = async (messages) => {
    try {
        const response = await AxiosWrapper.post(`${httpEndpoint}/guru/chats/title`, { messages });
        return [response.data, null];
    } catch (error) {
        return [null, error];
    }
}
