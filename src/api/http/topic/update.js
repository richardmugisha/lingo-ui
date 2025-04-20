import { httpEndpoint } from "..";
import AxiosWrapper from "../AxiosWrapper";

export default async (wordsMasteriesList, topicId, topicLearnChunk) => {
    const userId = JSON.parse(localStorage.getItem('user')).userId;
    console.log(wordsMasteriesList)
    try {
        const performData = await AxiosWrapper.patch(`${ httpEndpoint }/cards/topic?topic=${topicId}&user=${userId}`, { wordsMasteriesList, topicLearnChunk });
        return performData.data;
    } catch (error) {
        throw error
      }
}