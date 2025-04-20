
import { httpEndpoint } from "..";
import AxiosWrapper from "../AxiosWrapper"; 

export default async (parent, language, topics) => {
    try {
        console.log("anything at all")
        const creator = JSON.parse(localStorage.getItem('user')).userId;
        await AxiosWrapper.post(`${ httpEndpoint }/cards/topics`, {parent, language, creator, topics});
        return
    } catch (error) {
        console.log(error)
        throw error
      }
}