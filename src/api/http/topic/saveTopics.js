
import { httpEndpoint } from "..";
import AxiosWrapper from "../AxiosWrapper"; 

export default async (parent, language, topics) => {
    try {
        const creator = JSON.parse(localStorage.getItem('user')).userId;
        const res = await AxiosWrapper.post(`${ httpEndpoint }/topics`, {parent, language, creator, topics});
        return res
    } catch (error) {
        console.log(error)
        throw error
      }
}