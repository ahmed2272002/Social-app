import axios from 'axios'
import { useEffect, useState } from 'react'

export default function useGet(apiLink : string) {

    const [myData, setmyData] = useState(null)


    useEffect(()=>{
        async function getData(apiLink : string){
        try {
            const {data} = await axios.get(apiLink , {
                headers: {
                    "Authorization" : `Bearer ${localStorage.getItem("userToken")}`
                }
            })

            setmyData(data)


        } catch (error) {
            console.log(error)
        }
    }


        getData(apiLink)
    },[apiLink])


  return myData;
}
