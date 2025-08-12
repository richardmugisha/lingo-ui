import { httpEndpoint } from "../../../../serverConfig";
import AxiosWrapper from "../AxiosWrapper";

export const fetchStructure = async (userID) => {
    try {
        const response = await AxiosWrapper.get(`${httpEndpoint}/guru/${userID}`);
        return [response.data, null];
    } catch (error) {
        return [null, error];
    }
}
