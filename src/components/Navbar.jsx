
import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='fixed w-full flex justify-between px-3 sm:px-5 py-5 bg-neutral-300 t
    ext-neutral-900 items-center mx-auto font-serif '>
      <div className='font-bold text-2xl tracking-widest'>
        Lounge
      </div>
      <div>
        <Link to='/login' className='text-gray-400 px-5 py-2 border-2 bg-neutral-900 rounded-lg
        hover:bg-neutral-700 hover:text-gray-100 duration-300 cursor-pointer'>
            Login
        </Link>
      </div>
    </div>
  )
}

export default Navbar
