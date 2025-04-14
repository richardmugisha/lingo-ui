import { httpEndpoint } from "..";
import axios from "axios";

export default async (deckId, type) => {
    try {
        const response = type === "story" ?
                          await axios.get(`${ httpEndpoint }/cards/story-time/${deckId}`):
                           await axios.get(`${ httpEndpoint }/cards/chat-time/${deckId}`)
        const { stories } = response.data;
        console.log(stories, response.data)
        return stories
      } catch (error) {
        //console.log(error)
        throw new Error(error.message === 'Network Error' ? 'Network Error!' : 'Error. Try again!');
      }
}
