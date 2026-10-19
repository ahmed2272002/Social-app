import axios from "axios"

const BaseUrl = import.meta.env.VITE_BASE_URL

export async function getSinglePost(postId : string){

    const data = await axios.get(`${BaseUrl}/posts/${postId}` ,
        {
            headers : {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${localStorage.getItem("userToken")}`
            }
        }
    )


    return data
}

export async function togglePostBookmark(postId: string) {
    return axios.put(
        `${BaseUrl}/posts/${postId}/bookmark`,
        {},
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("userToken")}`,
            },
        },
    )
}

export async function togglePostLike(postId: string) {
    return axios.put(
        `${BaseUrl}/posts/${postId}/like`,
        {},
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("userToken")}`,
            },
        },
    )
}


export async function createPost(formData : FormData){

    const data = await axios.post(`${BaseUrl}/posts` ,
        formData,
        {
            headers : {
                "Authorization": `Bearer ${localStorage.getItem("userToken")}`
            }
        }
    )


    return data
}



export async function createPosts(formData : FormData){

    const data = await axios.post(`${BaseUrl}/posts` ,
        formData ,
        {
            headers : {
                "Authorization": `Bearer ${localStorage.getItem("userToken")}`
            }
        }
    )


    return data
}



export async function updatePost(postId : string, formData : FormData){

    const data = await axios.put(`${BaseUrl}/posts/${postId}` ,
        formData ,
        {
            headers : {
                "Authorization": `Bearer ${localStorage.getItem("userToken")}`
            }
        }
    )


    return data
}


export async function deletePost(postId : string){

    const data = await axios.delete(`${BaseUrl}/posts/${postId}` ,
        {
            headers : {
                "Authorization": `Bearer ${localStorage.getItem("userToken")}`
            }
        }
    )


    return data
}