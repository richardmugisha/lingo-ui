
import { httpEndpoint } from "../../../../serverConfig";
import AxiosWrapper from "../AxiosWrapper";

export const patchStory = async ({ id, item, update }) => {
    try {
        const response = await AxiosWrapper.patch(`${httpEndpoint}/story`, { id, item, update })
        return response.data
    } catch (error) {
        console.error(error.message)
    }
}

export const patchChapter = async ({ id, item, update }) => {
    try {
        const response = await AxiosWrapper.patch(`${httpEndpoint}/story/chapter`, { id, item, update })
        return response.data

    } catch (error) {
        console.error(error.message)
    }
}

export const patchEditDetails = async({id, list, edit}) => {
    try {
        const response = await AxiosWrapper.patch(`${httpEndpoint}/story/details`, { id, list, edit})
        return response.data
    } catch (error) {
        console.error(error.message)
    }
}

export const patchDeleteDetails = async({id, list}) => {
    try {
        const response = await AxiosWrapper.delete(`${httpEndpoint}/story/details`, { params: {id, list}})
        return response.data
    } catch (error) {
        console.error(error.message)
    }
}

export const patchTypeSettings = async({ id, typeSettings }) => {
    try {
        const response = await AxiosWrapper.patch(`${httpEndpoint}/story/typeSettings`, {id, typeSettings})
        return response.data
    } catch (error) {
        console.error(error.message)
    }
}

export const patchChapterLog = async({ id, chapterLog }) => {
    try {
        const response = await AxiosWrapper.patch(`${httpEndpoint}/story/chapterLog`, { id, chapterLog })
        return response.data
    } catch (error) {
        console.error(error.message)
    }
}

export const patchUserContribution = async(userID, words) => {
    try {
        const response = await AxiosWrapper.patch(`${httpEndpoint}/story/contributions`, { userID, words})
        return response.data
    } catch (error) {
        console.error(error.message)
    }
}