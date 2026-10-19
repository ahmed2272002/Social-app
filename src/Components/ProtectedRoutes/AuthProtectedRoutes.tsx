import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { TokenContext } from '../Context/tokenContext'


function AuthProtectedRoutes({children} : {children : React.ReactNode}) {

    const {token} = useContext(TokenContext)
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