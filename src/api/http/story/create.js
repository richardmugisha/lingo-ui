
import { httpEndpoint } from "../../../../serverConfig";
import AxiosWrapper from "../AxiosWrapper";

export default async ({ outline }) => {
    try {
        const response = await AxiosWrapper.post(`${httpEndpoint}/story`, { outline })
        return response.data

    } catch (error) {
        console.log(error)
    }
};

export const createChapter = async ({ storyID }) => {
    try {
        const response = await AxiosWrapper.post(`${httpEndpoint}/story/chapter`, { storyID })
        return response.data
    } catch (error) {
        console.log(error)
    }
}