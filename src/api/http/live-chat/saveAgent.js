import { httpEndpoint } from "../../../../serverConfig";
import AxiosWrapper from "../AxiosWrapper";

export default async (agentData) => {
    try {
        const response = await AxiosWrapper.post(`${httpEndpoint}/cards/live-chat/agents`, agentData);
        return response.data;
    } catch (error) {
        throw error;
    }
}
