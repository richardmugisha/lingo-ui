import { httpEndpoint } from "../../../../serverConfig";
import AxiosWrapper from "../AxiosWrapper";

export const updateStructure = async (userID, newStructure) => {
    try {
        const response = await AxiosWrapper.patch(`${httpEndpoint}/guru/${userID}`, { structure: newStructure });
        return [response.data, null];
    } catch (error) {
        return [null, error];
    }
}

export const updateChat = async ({id, title, summary, messages}) => {
    try {
        const response = await AxiosWrapper.put(`${httpEndpoint}/guru/chats/${id}`, { title, summary, messages})
        return [response.data, null];
    } catch (error) {
        return [null, error]
    }
}