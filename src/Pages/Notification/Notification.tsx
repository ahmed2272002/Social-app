import { useMemo, useState } from 'react'

function Notification() {

const [counter1, setCounter1] = useState(0)
const [counter2, setCounter2] = useState(0)

const checkC2 = useMemo(()=>{
  console.log("hello")
  if(counter2 % 2 === 0)
    return true
},[counter2])

function change1(){
  setCounter1(counter1 + 1)
}

function change2(){
  setCounter2(counter2 + 1)
}

// function checkEven(){
//   console.log("hello")

//   if(counter2 % 2 === 0 )
//     return true
// }


  return (
   <>
   <div className="container mx-auto">
    <title>Notification | Social App</title>
    <div className="grid grid-cols-2">
      <div>
        <h2>Counter 1</h2>
        <h2>{counter1}</h2>
        <button onClick={change1} className=' bg-blue-400 font-bold text-white rounded-2xl cursor-pointer p-2 px-4'>counter 1</button>
      </div>
      <div>
        <h2>Counter 2</h2>
        <h2>{counter2}</h2>
        <h2>{checkC2 ? "Even" : "odd"}</h2>
        <button onClick={change2} className=' bg-blue-400 font-bold text-white rounded-2xl cursor-pointer p-2 px-4'>counter 2</button>
      </div>
    </div>
   </div>
   </> 
  )
}

export default Notification