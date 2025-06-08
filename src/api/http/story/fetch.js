
import { httpEndpoint } from "../../../../serverConfig";
import AxiosWrapper from "../AxiosWrapper";

export const fetchChapter = async ({ index, storyID }) => {
    try {
        const response = await AxiosWrapper.get(`${httpEndpoint}/story/chapter`, { params: {index, storyID }})
        return response.data

    } catch (error) {
        console.log(error.message)
    }
}

export const fetchStories = async(filters) => {
    try {
        const response = await AxiosWrapper.get(`${httpEndpoint}/story`, { params: filters })
        return response.data

    } catch (error) {
        console.log(error.message)
    }
}