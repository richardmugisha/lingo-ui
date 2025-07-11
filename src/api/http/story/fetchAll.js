import { httpEndpoint } from "..";
import AxiosWrapper from "../AxiosWrapper";

export default async (topicId, type) => {
    try {
        const response = type === "story" ?
                          await AxiosWrapper.get(`${ httpEndpoint }/story`):
                           await AxiosWrapper.get(`${ httpEndpoint }/chat-time/${topicId}`)
        const { stories } = response.data;
        // console.log(stories, response.data)
        return stories
      } catch (error) {
        //console.log(error)
        throw new Error(error.message === 'Network Error' ? 'Network Error!' : 'Error. Try again!');
      }
}
