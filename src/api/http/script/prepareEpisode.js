
import { httpEndpoint } from "..";
import AxiosWrapper from "../AxiosWrapper";

export default async (scriptID, epIdx) => {
    try {
        const response =  await AxiosWrapper.patch(`${ httpEndpoint }/chat-time/episode`, { scriptID, epIdx })
        return response.data
      } catch (error) {
        //console.log(error)
        throw new Error(error.message === 'Network Error' ? 'Network Error!' : 'Error. Try again!');
      }
}
