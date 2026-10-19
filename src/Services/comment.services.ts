import axios from "axios"

const BaseUrl = import.meta.env.VITE_BASE_URL

export async function getPostComments(postId : string){

    const data = await axios.get(`${BaseUrl}/posts/${postId}/comments` ,
        {
            headers : {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${localStorage.getItem("userToken")}`
            }
        }
    )


    return data
}



export async function createPostComment(postId : string , formData : FormData){

    const data = await axios.post(`${BaseUrl}/posts/${postId}/comments` ,
        formData ,
        {
            headers : {
                "Authorization": `Bearer ${localStorage.getItem("userToken")}`
            }
        }
    )


    return data
}




export async function updateComment( postId: string, commentId: string, formData: FormData) {
  const data =  axios.put(`${BaseUrl}/posts/${postId}/comments/${commentId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );

  return data
}

export async function deleteComment(postId: string, commentId: string) {
  const data =  axios.delete(`${BaseUrl}/posts/${postId}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });

  return data
}
