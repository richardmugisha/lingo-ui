
import { httpEndpoint } from "../../../../serverConfig";
import AxiosWrapper from "../AxiosWrapper";

export default async ({ outline }) => {
    try {
        const response = await AxiosWrapper.post(`${httpEndpoint}/story`, { outline })
        return response.data

    } catch (error) {
        console.log(error.message)
    }
};

export const createChapter = async ({ storyID }) => {
    try {
        const response = await AxiosWrapper.post(`${httpEndpoint}/story/chapter`, { storyID })
        return response.data
    } catch (error) {
        console.log(error.message)
    }
}

export const createScene = async () => {
    try {
        const response = await AxiosWrapper.post(`${httpEndpoint}/story/scene`)
        return response.data
    } catch (error) {
        console.log(error.message)
    }
}

export const createCover = async (id, formData) => {
    try {
        const response = await AxiosWrapper.post(
            `${httpEndpoint}/story/scene/cover/${id}`, 
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

export const createStoryCover = async (id, formData) => {
    try {
        const response = await AxiosWrapper.post(
            `${httpEndpoint}/story/cover/${id}`, 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.log(error.message)
        throw error;
    }
}
