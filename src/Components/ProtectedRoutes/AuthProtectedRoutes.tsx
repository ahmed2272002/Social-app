import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../Context/tokenContext'


function AuthProtectedRoutes({children} : {children : React.ReactNode}) {

    const {token} = useAuth()
    const navigate = useNavigate()

    // did mount & update
    useEffect(() => {
      if(token){
        navigate('/')
    }
    }, [token])
    

  return (
    <>
    {children}
    </>
  )
}

export default AuthProtectedRoutes