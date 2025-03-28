import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from '../../Context/userContextProvider'

// Add types for navItems
interface NavItem {
    name: string;
    status: boolean;
    url: string;
    icon?: React.ReactNode; // Optional icon for each nav item
}

function Navbar() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const { auth, handleLogout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [isAuth, setisAuth] = useState(false)

    useEffect(() => {
        let authStatus = localStorage.getItem("jwt")
        if (authStatus === "true") {
            setisAuth(true)
        } else {
            setisAuth(false)
        }
    }, [isAuth, navigate])

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false)
    }, [location.pathname])

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (isOpen && !target.closest('.navbar-container')) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    const navItems: NavItem[] = [
        {
            name: "Login",
            status: !isAuth,
            url: "/Login"
        },
        {
            name: "Signup",
            status: !isAuth,
            url: "/signup"
        },
        {
            name: "Support",
            status: isAuth,
            url: "/support"
        },

    ]

    const LogOut = async () => {
        await handleLogout()

        navigate("/Login")
    }

    return (
        <nav className="w-full sticky top-0 z-50 bg-white shadow-sm navbar-container">
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-16'>
                    {/* Logo */}
                    <div className='flex-shrink-0 flex items-center'>
                        <Link to="/" className='text-indigo-600 font-bold text-xl'>Logo</Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className='hidden lg:block'>
                        <div className='ml-10 flex items-center space-x-4'>
                            {navItems.map((item, index) => (
                                item?.status && (
                                    <Link
                                        key={index}
                                        to={item.url}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out
                                            ${location.pathname === item.url
                                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            ))}
                            {isAuth && <button onClick={LogOut} className='px-4 py-2 bg-red-500 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out'>Logout</button>}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className='lg:hidden'>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className='inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition duration-150 ease-in-out'
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            <div className="relative w-6 h-6">
                                <span
                                    className={`absolute block h-0.5 w-6 bg-gray-700 transform transition duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-1.5' : 'translate-y-0'
                                        }`}
                                    style={{ top: '35%' }}
                                />
                                <span
                                    className={`absolute block h-0.5 w-6 bg-gray-700 transform transition duration-300 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'
                                        }`}
                                    style={{ top: '50%' }}
                                />
                                <span
                                    className={`absolute block h-0.5 w-6 bg-gray-700 transform transition duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-0'
                                        }`}
                                    style={{ top: '65%' }}
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="lg:hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 bg-white shadow-lg">
                            {navItems.map((item, index) => (
                                item?.status && (
                                    <Link
                                        key={index}
                                        to={item.url}
                                        className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ease-in-out
                                            ${location.pathname === item.url
                                                ? 'bg-indigo-100 text-indigo-800'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar