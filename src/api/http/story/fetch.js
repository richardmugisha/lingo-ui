
import { httpEndpoint } from "../../../../serverConfig";
import AxiosWrapper from "../AxiosWrapper";

export const fetchChapter = async ({ index, storyID }) => {
    try {
        const response = await AxiosWrapper.get(`${httpEndpoint}/story/chapter`, { params: {index, storyID }})
        return response.data

    } catch (error) {
        console.error(error.message)
    }
}

export const fetchStories = async(filters) => {
    try {
        const response = await AxiosWrapper.get(`${httpEndpoint}/story`, { params: filters })
        return response.data

    } catch (error) {
        console.error(error.message)
    }
}

export const fetchStory = async(id, page) => {
    console.log(page)
    try {
        const response = await AxiosWrapper.get(`${httpEndpoint}/story/${id}`, { params: { page } })
        return response.data
    } catch (error) {
        console.error(error.message)
    }
}

export const fetchScene = async(id) => {
    try {
        const response = await AxiosWrapper.get(`${httpEndpoint}/story/scene/${id}`)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(error.message)
    }
}

export const fetchUserContribution = async(userID, year) => {
    try {
        const response = await AxiosWrapper.get(`${httpEndpoint}/story/contributions`, { params: {userID, year}})
        return response.data
    } catch (error) {
        console.error(error.message)
    }
}

export const fetchUserGoal = async(userID) => {
    try {
        const response = await AxiosWrapper.get(`${httpEndpoint}/story/goal`, { params: { userID }})
        return response.data
    } catch (error) {
        console.error(error.message)
    }
}