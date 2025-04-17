import axios from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context/userContextProvider';
import api from '../../API/CustomApi';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { Config } from '../../API/Config';

interface User {
    email: string;
    password: string;
}

interface FormError {
    general?: string;
}

export default function Signup() {
    const { setAuth, CheckAuth, loading } = useAuth();
    const [user, setUser] = useState<User>({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState<FormError>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const User = await api.post(`${import.meta.env.VITE_COMMON_URL}/user/sign-up-with-credentials`, {
                email: user.email,
                password: user.password
            });

            if (User.status === 200) {
                setAuth(true);
                await CheckAuth();
                navigate("/");
            }
        } catch (error: any) {
            console.log("An error occurred:", error);
            setErrors({
                general: error.response?.data?.message || "Failed to sign up. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleGoogleLoginSuccess = async (tokenresponse: any) => {
        try {
            setIsSubmitting(true)
            const userInfoResponse = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                {
                    headers: {
                        Authorization: `Bearer ${tokenresponse.access_token}`
                    }
                }
            );

            const googleUser = userInfoResponse.data;

            const response = await api.post(`${Config.baseUrl}/user/google-auth/signup`, {
                email: googleUser.email,
                googleId: googleUser.sub,
                name: googleUser.name,
                picture: googleUser.picture
            })

            if (response.status === 200) {
                setAuth(true)
                await CheckAuth()

                navigate("/")
            }

        } catch (error) {
            setErrors({
                general: "Google signup failed. Please try again."
            })
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: (error) => {
            console.error("Google login error:", error);
            setErrors({
                general: "Google signup failed. Please try again."
            })
        }
    })

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-6xl flex rounded-lg overflow-hidden shadow-xl">
                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full lg:w-1/2 p-8 md:p-12"
                >
                    <div className="mb-8">
                        <div className="text-3xl font-bold text-indigo-600 mb-2">
                            Logo
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Create your account
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Join us and start connecting with others
                        </p>
                    </div>

                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                            <AlertCircle size={18} className="mr-2" />
                            {errors.general}
                        </div>
                    )}



                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex gap-4 mb-6">
                            <button className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleGoogleLogin}>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                                    <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                                    <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                                    <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
                                </svg>
                                <span className="text-sm font-medium">Google</span>
                            </button>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={user.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting || loading}
                                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 flex items-center justify-center"
                            >
                                {(isSubmitting || loading) ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </>
                                ) : "Sign Up"}
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200">
                            Sign in instead
                        </Link>
                    </p>
                </motion.div>

                {/* Image Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:block lg:w-1/2 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-indigo-700/80 z-10 flex flex-col items-center justify-center text-white p-12">
                        <h2 className="text-3xl font-bold mb-6">Connect Seamlessly</h2>
                        <div className="flex flex-col space-y-4 mt-6">
                            <div className="flex items-center bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                                <div className="p-2 bg-indigo-500 rounded-full mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium">Video Calling</p>
                                    <p className="text-sm text-white/70">HD quality calls with anyone</p>
                                </div>
                            </div>
                            <div className="flex items-center bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                                <div className="p-2 bg-indigo-500 rounded-full mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium">Live Chatting</p>
                                    <p className="text-sm text-white/70">Real-time messaging with friends</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <img className="absolute inset-0 w-full h-full object-cover" src="/calling.jpg" alt="Video calling" />
                </motion.div>
            </div>
        </div>
    );
}