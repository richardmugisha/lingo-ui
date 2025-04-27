
import { httpEndpoint } from "../../../../serverConfig";
import AxiosWrapper from "../AxiosWrapper";

export default async(title, summary, words, players, topic, userID) => {
    const user = JSON.parse(localStorage.getItem('user')).userId;
    const writer = userID || user
    const res = await AxiosWrapper.post(httpEndpoint + '/cards/chat-time/' + topic, { title, summary, words, players, writer })
    return res.data.script
}