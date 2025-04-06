
import { httpEndpoint } from "../../../../serverConfig";
import axios from "axios";

export default async(title, summary, words, players) => {
    const res = await axios.post(httpEndpoint + '/cards/chat-time', { title, summary, words, players })
    return res.data.script
}