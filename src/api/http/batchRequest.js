import { httpEndpoint } from "../../../serverConfig";
import AxiosWrapper from "./AxiosWrapper";

export default async (requests) => {
    try {
        console.log("hitting the batch request")
        const response = await AxiosWrapper.post(httpEndpoint + '/batch-request', { requests })
        return response.data
    } catch (error) {
        throw error
    }
}