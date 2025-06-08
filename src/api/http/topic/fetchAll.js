import { httpEndpoint } from "../../../../serverConfig";
import AxiosWrapper from "../AxiosWrapper";

export default async (userId, myCardsOnly, language, parent, myLearning) => {
    try {
        const query = {}
        if (userId) query['user'] = userId
        if (myCardsOnly) query['creator'] = userId
        if (language) query["language"] = language
        if (parent) query["parent"] = parent
        if (myLearning) query["myLearning"] = true
        const response = await AxiosWrapper.get(`${ httpEndpoint }/topics`, { params: query});
        return response.data;
      } catch (error) {
        //console.log(error)
        throw new Error(error.message === 'Network Error' ? 'Network Error!' : 'Error. Try again!');
      }
}