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