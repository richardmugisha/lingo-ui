import { useEffect, useState } from "react"
import { liveChat } from "../../../../../api/http"

export default  (messages) => {
    const [{ username, userId: userID}] = useState(JSON.parse(localStorage.getItem("user")))
    const [ title, setTitle ] = useState("")
    const [ summary, setSummary ] = useState("")

    useEffect(() => {
        liveChat({ 
            userID, 
            chat: `Hi. Unrelated matter. I want to find a concise and meaningful title for this chat.
                    The chat: ${messages.map(msg => msg.role + ": " + msg.content + "\n")}
                    Your output should just be the title like:
                    Unraveling the potential of A
                `
        }).then(({ reply }) => setTitle(reply))
        
    }, [messages.length == 4])

    useEffect(() => {
        liveChat({
            userID,
            chat: `Update the summary of this chat. The summary should be an exhaustive summary with highlights.
            Previous summary of previous chat: ${summary || "No summary yet"}

            Last few back-and-forths: ${messages.slice(-6).map(msg => msg.role + ": " + msg.content + "\n")}
            
            `
        }).then(({ reply }) => setSummary(reply))

    }, [messages.length > 0 && messages.length % 6 == 0])

    return { title, summary }
}