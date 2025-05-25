import { httpEndpoint } from "../../../../serverConfig";
import AxiosWrapper from "../AxiosWrapper";

export default async () => {
    try {
        const response = await AxiosWrapper.get(`${httpEndpoint}/cards/live-chat/agent-pairs`);
        return response.data.agentPairs;
    } catch (error) {
        throw error;
    }
} 