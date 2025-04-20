import { httpEndpoint } from "..";
import AxiosWrapper from "../AxiosWrapper";

export default async (language, words) => {
    try {
        const res = await AxiosWrapper.get(`${ httpEndpoint }/words?language=${language}&words=${words}`);
        return res.data;
    } catch (error) {
        //console.log(error)
        throw error
      }
}