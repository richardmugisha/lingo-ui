
import { httpEndpoint } from "..";
import AxiosWrapper from "../AxiosWrapper"; 

export default async (path, topic, number, type, excluded) => {
    try {
        const res = await AxiosWrapper.get(`${ httpEndpoint }/cards/topic/suggestions`, { params: { path, topic, number, type, excluded }});
        return res.data.suggestions
    } catch (error) {
        console.log(error)
        throw error
      }
}