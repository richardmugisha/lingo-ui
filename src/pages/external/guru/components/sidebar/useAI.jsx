import { useEffect } from "react"
import { createTitle } from "../../../../../api/http"

export default (currentChat, setCurrentChat) => {
    useEffect(() => {
        if ([4, 10].includes(currentChat?.messages?.length)) {
            createTitle(currentChat.messages).
            then(([res, err]) => {
                if (res) setCurrentChat(prev => ({...prev, title: res.title}))
            })
        }
    }, [currentChat?.messages?.length])

    // useEffect(() => {
    //     if (!currentChat) return;
    //     createSummary(currentChat.summary, currentChat.messages).
    //     then(([res, err]) => {
    //         if (res) setCurrentChat(prev => ({...prev, summary: res.summary}))
    //     })

    // }, [currentChat?.messages?.length > 0 && currentChat?.messages?.length % 6 === 0])

}