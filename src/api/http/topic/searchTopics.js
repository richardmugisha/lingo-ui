import { httpEndpoint } from "..";
import AxiosWrapper from "../AxiosWrapper";

export default async (searchTerm) => {
    try {
        const res = await AxiosWrapper.get(`${httpEndpoint}/cards/topics/search`, { 
            params: { searchTerm }
        });
        return res.data.topics;
    } catch (error) {   
        console.error('Error searching topics:', error);
        throw error;
    }
} 