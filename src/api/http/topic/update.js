import { httpEndpoint } from "..";
import AxiosWrapper from "../AxiosWrapper";

export default async (topicLearnChunk) => {
    const userId = JSON.parse(localStorage.getItem('user')).userId;
    try {
        const performData = await AxiosWrapper.patch(`${ httpEndpoint }/cards/topic?user=${userId}`, { topicLearnChunk });
        return performData.data;
    } catch (error) {
        throw error
      }
}