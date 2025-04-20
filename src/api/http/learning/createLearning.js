import { httpEndpoint } from "..";
import AxiosWrapper from "../AxiosWrapper";

export default async (topic, words) => {
    const user = JSON.parse(localStorage.getItem('user')).userId;
    try {
        const res = await AxiosWrapper.post(`${ httpEndpoint }/cards/topic`, { user, topic, words});
        return res.data;
    } catch (error) {
        //console.log(error)
        throw error
      }
}