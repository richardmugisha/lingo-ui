
import { httpEndpoint } from "..";
import AxiosWrapper from "../AxiosWrapper";

export const register = async ({username, email, password}) => {
    try {
        await AxiosWrapper.post(`${ httpEndpoint }/auth/register`, { username, email, password });
        return
    } catch (error) {
        //console.log(error)
        throw error
    }
}

export const login = async ({email, password}) => {
    try {
        const res = await AxiosWrapper.post(`${ httpEndpoint }/auth/login`, { email, password });
        return res;
    } catch (error) {
        //console.log(error)
        throw error
      }
}
