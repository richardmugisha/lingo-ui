import { httpEndpoint } from "..";
import AxiosWrapper from "../AxiosWrapper"; 

export default async (personalSelectedItem) => {
    try {
        const res = await AxiosWrapper.delete(`${ httpEndpoint }/topics?topicIds=${personalSelectedItem}`);
        return res.data;
      } catch (error) {
        throw error;
      }
}
