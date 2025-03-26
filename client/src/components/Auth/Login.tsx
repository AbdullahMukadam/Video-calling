import React, { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import api from '../../API/CustomApi';
import { useAuth } from '../../Context/userContextProvider';
import { useGoogleLogin } from '@react-oauth/google';
import { Config } from '../../API/Config';
import axios from 'axios';

interface User {
  email: string;
  password: string
}
const Login = () => {
  const [user, setUser] = useState<User>({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { CheckAuth, setAuth } = useAuth();
  const navigate = useNavigate()
  const [FormError, setFormError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("")

    try {
      const response = await api.post(`${import.meta.env.VITE_COMMON_URL}/user/sign-in-with-credentials`, {
        email: user.email,
        password: user.password
      })
      if (response.status === 200) {
        setAuth(true)
        await CheckAuth()

        navigate("/")
      }
    } catch (error: any) {
      console.log("An error occured in Login", error)
      setFormError(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [id]: value
    }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLoginSuccess = async (tokenresponse: any) => {
    try {
      setIsLoading(true)
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
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: (error) => {
      console.error("Google login error:", error);
    }
  })

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Logo and Welcome */}
          <div className="text-center mb-8">
            <div className="text-3xl font-bold text-indigo-600 mb-2">Logo</div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-600 mt-1">Sign in to your account to continue</p>
          </div>

          {/* Social Login Buttons */}


          {/* Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-gray-300 flex-grow"></div>
            <span className="mx-4 text-sm text-gray-500">or continue with email</span>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4 mb-6">
              <button className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={handleGoogleLogin}>
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
                  value={user.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
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

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me for 30 days
              </label>
            </div>
            {FormError && <p className='text-red-500'>{FormError}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200">
              Create a free account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Image/Banner */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-indigo-700/80 z-10 flex flex-col items-center justify-center p-12">
          <div className="max-w-md text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-4">Welcome to our platform</h2>
              <p className="text-white/80 mb-8">
                Connect with friends and the world around you with our video calling and messaging platform.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm text-left">
                  <h3 className="text-white font-medium mb-1">Real-time Calling</h3>
                  <p className="text-white/70 text-sm">HD quality video and voice calls</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm text-left">
                  <h3 className="text-white font-medium mb-1">Secure Chats</h3>
                  <p className="text-white/70 text-sm">End-to-end encrypted messaging</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm text-left">
                  <h3 className="text-white font-medium mb-1">Screen Sharing</h3>
                  <p className="text-white/70 text-sm">Share your screen with anyone</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm text-left">
                  <h3 className="text-white font-medium mb-1">Group Calls</h3>
                  <p className="text-white/70 text-sm">Call with up to 100 people at once</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src="/calling.jpg"
          alt="Video calling platform"
        />
      </div>
    </div>
  );
};

export default Login;