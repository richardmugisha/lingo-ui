
import { httpEndpoint } from "..";
import axios from "axios";

export default async (path, topic, number) => {
    try {
        const res = await axios.post(`${ httpEndpoint }/cards/topic`, { path, topic, number });
        return res.data.suggestions
    } catch (error) {
        console.log(error)
        throw error
      }
}