import { useEffect, useState } from "react";
import { searchWords as searchWordsRequest } from "../../../../../api/http";

export const useSearchWords = (trackedSearchValue, topicLang, delay=2000) => {
    const [searchWords, setSearchWords] = useState([])
    // const [debouncedValue, setDebouncedValue] = useState(searchValue)
    const [status, setStatus] = useState('idle') // idle  | loading | success | error

    // ////console.log(topicLang)

    useEffect(() => {
        const timeout = setTimeout(() => {
            // setDebouncedValue(searchValue)
            if (!trackedSearchValue) setSearchWords([])
        }, delay)
        if (! (status === 'loading')) setStatus('idle')
        return () => clearTimeout(timeout)
    }, [trackedSearchValue]);

    const fetching = (searchValue) => {
        //console.log(searchValue)
        if (searchValue)  {
            setStatus('loading')
            searchWordsRequest(topicLang, searchValue)
                .then(data => {
                    // //console.log(res.data.searchWords)
                    setSearchWords(data.searchWords)
                    setStatus('success')      
                }) 
        }
        else {
            setSearchWords([])
            setStatus('error')  
        }    
    }

    // useEffect(() => {
    //     if (debouncedValue)  {
    //         //console.log(topicLang)
    //         setLoading(true)
    //         axios.get(`${ httpEndpoint }/words/search?language=${topicLang}&word=${debouncedValue}`)
    //             .then(res => {
    //             // ////console.log(res.data.searchWords)
    //             setSearchWords(res.data.searchWords)
    //             setLoading(false)      
    //         }) 
    //     }
    //     else {
    //         setSearchWords([])
    //         setLoading(false)  
    //     }    
        
    // }, [debouncedValue, topicLang])

    return [fetching, searchWords, status, setStatus]

}