import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../Context/tokenContext'


function AppProtectedRoutes({children} : {children : React.ReactNode}) {

    const {token} = useAuth()
    const navigate = useNavigate()

    // did mount & update
    useEffect(() => {
      if(!token){
        navigate('/auth')
    }
    }, [token])
    

  return (
    <>
    {children}
    </>
  )
}

export default AppProtectedRoutes