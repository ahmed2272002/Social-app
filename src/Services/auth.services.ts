// calling api for auth (login, register)

import axios from "axios";
import type { loginSchemaType, RegisterSchemaType } from "../lib/Schemas/Auth.Schema";


const BaseUrl = import.meta.env.VITE_BASE_URL

export async function registerUser(formData : RegisterSchemaType){

    const data = await axios.post(`${BaseUrl}/users/signup` , formData ,
        {
            headers : {
                "Content-Type" : "application/json",
            }
        }
    )


    return data
}

// login

export async function loginUser(formData : loginSchemaType){

    const data = await axios.post(`${BaseUrl}/users/signin` , formData ,
        {
            headers : {
                "Content-Type" : "application/json",
            }
        }
    )


    return data
}