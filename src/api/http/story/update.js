
import { httpEndpoint } from "../../../../serverConfig";
import AxiosWrapper from "../AxiosWrapper";

export const patchStory = async ({ id, item, update }) => {
    try {
        const response = await AxiosWrapper.patch(`${httpEndpoint}/story`, { id, item, update })
        return response.data

    } catch (error) {
        console.log(error.message)
    }
}

export const patchChapter = async ({ id, item, update }) => {
    try {
        const response = await AxiosWrapper.patch(`${httpEndpoint}/story/chapter`, { id, item, update })
        return response.data

    } catch (error) {
        console.log(error.message)
    }
}