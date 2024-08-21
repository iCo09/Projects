// import { useRef, useState } from "react";
// import FirstComponent from "./Components/FirstComponent";

// const App = () => {


//   //USESTATE
//   // const [x, setx] = useState(0);
//   // const btnClick = () => {
//   //   console.log("Clicked");
//   //   setx(x+1);
//   //   console.log(x);
//   // }

//   //USEREF

//   const [data,setData] = useState([]);
//   const inputRef = useRef(null);


//   return (
//     <div>
//       {/* <button onClick={()=>{btnClick()}} >Click me</button>
//       <FirstComponent data={x} fn={setx} /> */}

//         <input ref={inputRef} type="text" />
//         {/* <button onClick={()=>{console.log(inputRef.current.value);
//         }} >Submit</button> */}

//         <button onClick={()=>{setData([...data,inputRef.current.value])}} >Submit</button>
//         {data.map((item,index) => {return <h2 key={index} >{item}</h2>})}

//     </div>
//   )
// }

// export default App


import React from 'react'
import Todo from './Components/Todo'

const App = () => {
  return (
    <div>
      <Todo />
    </div>
  )
}

export default App
