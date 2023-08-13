import React,{ useContext }  from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from "../context/authContext";

export default function Navbar() {
  const { currentUser,logout,setRenderHome} = useContext(AuthContext);
  const handleLogout =()=>{logout();setRenderHome(true)}
return (
    <div className='flex w-full bg-sky-200 justify-between px-2 py-3 shadow-md shadow-slate-800'>
        <Link to='/'>
        <div className='flex gap-1'>
            <span className='text-2xl'>📝</span>
            <span className='text-3xl font-semibold font-signature'>Task Board</span>
        </div>
        </Link>
        <div className='flex gap-4'>
            <span className='text-[22px] font-medium'>{currentUser?`Welcome ${currentUser.username}`:'Hello User'}</span>
            {currentUser ? (
                <button onClick={handleLogout} className="text-base hover:text-violet-500 rounded-md border border-violet-500 px-4 py-1 font-medium">
                  Logout
                </button>
                    ) : (
                <Link className="text-base hover:text-violet-500 rounded-md border border-violet-500 px-4 py-1 font-medium" to="/login">
                  Login
                </Link>
              )}
        </div>
    </div>
  )
}
