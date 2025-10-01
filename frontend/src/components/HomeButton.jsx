import React from 'react'
import { useNavigate } from 'react-router-dom'
const HomeButton = () => {
    const navigate = useNavigate();
  return (
    <div onClick={()=>navigate("/")}
    className='fixed left-5 top-5  cursor-pointer rounded-xl bg-inherit p-2 px-5 border border-2 border-white/20 hover:scale-105
    '>Home</div>
  )
}

export default HomeButton