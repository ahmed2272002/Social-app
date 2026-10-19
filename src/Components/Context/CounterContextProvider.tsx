import React, { useState } from 'react'
import { CounterContext } from './CounterContext'


function CounterContextProvider({children} : {children: React.ReactNode}) {

  const [counter, setCounter] = useState(0)

  return (
    <>
    <CounterContext.Provider value={{counter , setCounter}}>
      {children}
    </CounterContext.Provider>
    </>
  )
}

export default CounterContextProvider