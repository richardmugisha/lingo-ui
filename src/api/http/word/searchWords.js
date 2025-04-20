import { httpEndpoint } from "..";
import AxiosWrapper from "../AxiosWrapper";

export default async (language, word) => {
    try {
        const res = await AxiosWrapper.get(`${ httpEndpoint }/words/search?language=${language}&word=${word}`);
        return res.data;
    } catch (error) {
        //console.log(error)
        throw error
      }
}