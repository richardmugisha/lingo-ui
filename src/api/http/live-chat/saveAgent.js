import { httpEndpoint } from "../../../../serverConfig";
import AxiosWrapper from "../AxiosWrapper";

export default async (formData) => {
    try {
        const response = await AxiosWrapper.post(
            `${httpEndpoint}/live-chat/agents`, 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}
