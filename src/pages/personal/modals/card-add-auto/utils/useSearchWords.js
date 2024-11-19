import axios from "axios";
import { useEffect, useState } from "react";

import API_BASE_URL from '../../../../../../serverConfig'

export const useSearchWords = ( searchValue, deckLang, delay=1000) => {
    const [searchWords, setSearchWords] = useState([])
    const [debouncedValue, setDebouncedValue] = useState(searchValue)
    const [loading, setLoading] = useState(false)

    console.log(deckLang)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(searchValue)
        }, delay)

        return () => clearTimeout(timeout)
    }, [searchValue]);

    useEffect(() => {
        if (debouncedValue)  {
            console.log(deckLang)
            setLoading(true)
            axios.get(`${API_BASE_URL}/words/search?language=${deckLang}&word=${debouncedValue}`)
                .then(res => {
                console.log(res.data.searchWords)
                setSearchWords(res.data.searchWords)
                setLoading(false)      
            }) 
        }
        else {
            setSearchWords([])
            setLoading(false)  
        }    
        
    }, [debouncedValue, deckLang])

    return [debouncedValue, searchWords, loading]

}