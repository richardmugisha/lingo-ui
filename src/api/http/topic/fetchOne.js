import { httpEndpoint } from "..";
import AxiosWrapper from "../AxiosWrapper";

export default async (topicId) => {
    const userId = JSON.parse(localStorage.getItem('user')).userId;
    try {
        const res = await AxiosWrapper.get(`${ httpEndpoint }/cards/topic?id=${topicId}&userId=${userId}`);
        const topic = res.data.topic;
        return topic;
    } catch (error) {
        //console.log(error)
        throw error
      }
}