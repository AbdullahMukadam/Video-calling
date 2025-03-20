import React, { FormEvent } from 'react'
import { Link } from 'react-router-dom'

export default function Signup() {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        console.log("submitted")
    }
    return (
        <div className='w-full h-[80%] flex items-center justify-center lg:justify-between '>
            <form onSubmit={handleSubmit} className='w-[90%] p-5 md:w-[60%] lg:w-[40%] lg:ml-16 md:p-8 bg-zinc-900 rounded-3xl flex items-center justify-between flex-col gap-2'>

                <div className='text-4xl text-blue-700'>
                    Logo

                </div>
                <h1 className='font-sans font-bold text-2xl text-white'>Sign up to your account</h1>
                <div className='w-full flex flex-col gap-2 mt-2'>
                    <label htmlFor="email" className='text-gray-600 font-bold'>Email</label>
                    <input id='email' className='text-white p-3' placeholder='email' />
                    <label htmlFor="password" className='text-gray-600 font-bold'>Password</label>
                    <input id='password' className='text-white p-3' placeholder='password' />

                </div>
                <button type='submit' className='p-3 w-full outline-none border-none bg-blue-700 rounded-xl mt-2'>SignUp</button>
                <p className='text-gray-500 mr-2'>have an account?<Link to={'/signin'} className='text-blue-600 ml-2'>Signin</Link></p>
            </form>
            
            <div className='w-[50%] relative h-full hidden lg:block'>
            <div className='absolute w-full h-[100vh] top-0 bg-black z-20 opacity-50 flex items-center justify-center gap-5'>
                <p className='text-white font-bold'>📞 Video Calling</p>
                <p className='text-white font-bold'>💬 Live chatting</p>
            </div>
              <img className='w-full h-[100vh] bg-contain' src='/calling.jpg' />
            </div>
        </div>
    )
}
