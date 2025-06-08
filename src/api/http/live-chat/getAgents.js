import { httpEndpoint } from "../../../../serverConfig";
import AxiosWrapper from "../AxiosWrapper";

export default async () => {
    try {
        const response = await AxiosWrapper.get(`${httpEndpoint}/live-chat/agents`);
        return response.data.agents;
    } catch (error) {
        throw error;
    }
} 