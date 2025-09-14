import { httpEndpoint } from "..";
import AxiosWrapper from "../AxiosWrapper";

export default async (topicLearnChunk) => {
    const userId = JSON.parse(localStorage.getItem('user')).userId;
    try {
        const performData = await AxiosWrapper.patch(`${ httpEndpoint }/topic?user=${userId}`, { topicLearnChunk });
        return performData.data;
    } catch (error) {
        throw error
      }
}

export const updateTopic = async (update) => {
    try {
        const res = await AxiosWrapper.patch(`${ httpEndpoint }/topics/${update._id}`, update)
        return res.data
    } catch (error) {
        throw error
    }
}