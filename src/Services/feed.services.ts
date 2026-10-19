import axios from "axios"

const BaseUrl = import.meta.env.VITE_BASE_URL

export async function getUSerFeed(){

    const {data} = await axios.get(`${BaseUrl}/posts?limit=10` ,
        {
            headers : {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${localStorage.getItem("userToken")}`
            }
        }
    )


    return data
}