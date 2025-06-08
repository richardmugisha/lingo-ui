import { httpEndpoint } from "../../../../serverConfig";
import AxiosWrapper from "../AxiosWrapper";

export default async (agentPair) => {
    try {
        const response = await AxiosWrapper.post(`${httpEndpoint}/live-chat/agent-pairs`, agentPair);
        return response.data;
    } catch (error) {
        throw error;
    }
} 