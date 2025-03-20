import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from "framer-motion"

function Navbar() {
    const [Open, setOpen] = useState<boolean>(false)

    const navItems = [
        {
            name: "Login",
            status: true,
            url: "/Login"
        },
        {
            name: "Signup",
            status: true,
            url: "/signup"
        },
        {
            name: "Support",
            status: false,
            url: "/support"
        }
    ]
    return (
        <div className='w-full'>
            <div className='w-full p-4 flex items-center justify-between'>
                <div className='w-[20%]'>
                    Logo
                </div>
                <div className='lg:hidden' onClick={() => setOpen((prev) => !prev)}>
                    <label >
                        <div
                            className="w-9 h-10 cursor-pointer flex flex-col items-center justify-center"

                        >
                            <input className="hidden peer" type="checkbox" onChange={() => setOpen((prev) => !prev)} />
                            <div
                                className="w-[50%] h-[2px] bg-black rounded-sm transition-all duration-300 origin-left translate-y-[0.45rem] peer-checked:rotate-[-45deg]"

                            ></div>
                            <div
                                className="w-[50%] h-[2px] bg-black rounded-md transition-all duration-300 origin-center peer-checked:hidden"

                            ></div>
                            <div
                                className="w-[50%] h-[2px] bg-black rounded-md transition-all duration-300 origin-left -translate-y-[0.45rem] peer-checked:rotate-[45deg]"

                            ></div>
                        </div>
                    </label>
                </div>
                <div className='hidden lg:block p-2'>
                    {navItems.map((item, index) => (
                        item?.status && (

                            <Link className=' font-sans mr-4' key={index} to={item.url}>{item.name}</Link>

                        )
                    ))}
                </div>
            </div>

            {Open && <motion.div className='w-full h-fit p-5 bg-white/80 border-t-2 border-b-2' initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.4,
                    scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                }}>
                {navItems.map((item, index) => (
                    item?.status && (
                        <div className='flex gap-2 flex-col'>
                            <Link className='text-xl font-sans font-bold border-b-2' key={index} to={item.url}>{item.name}</Link>
                        </div>
                    )
                ))}
            </motion.div>}
        </div>
    )
}

export default Navbar