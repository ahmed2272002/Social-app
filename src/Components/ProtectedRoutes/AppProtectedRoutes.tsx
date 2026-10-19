import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { TokenContext } from '../Context/tokenContext'


function AppProtectedRoutes({children} : {children : React.ReactNode}) {

    const {token} = useContext(TokenContext)
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