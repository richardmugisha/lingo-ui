
import { httpEndpoint } from "../../../../serverConfig";
import axios from "axios";

export default async(title, summary, words, players, deck, writer) => {
    const res = await axios.post(httpEndpoint + '/cards/chat-time/' + deck, { title, summary, words, players, writer })
    return res.data.script
}