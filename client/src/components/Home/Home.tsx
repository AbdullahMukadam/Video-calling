import { useEffect, useState } from 'react';
import { useAuth } from '../../Context/userContextProvider';
import { Video } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { CustomDialog } from '../Shadcn/Dialog';
import axios from 'axios';
import { Config } from '@/API/Config';

interface callHistory {
  callId: string | number;
  createdAt: string | number
}

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setopen] = useState(false)
  const [dialogmethod, setdialogmethod] = useState("")
  const [isAuth, setisAuth] = useState(false)
  const [calls, setcalls] = useState<Array<callHistory>>([])
  const location = useLocation()

  useEffect(() => {
    const authStatus = localStorage.getItem("jwt")
    if (authStatus === "true") {
      setisAuth(true)
    } else {
      setisAuth(false)
    }
  }, [isAuth, navigate])

  const getCallHistory = async () => {
    try {
      const calls = await axios.post(`${Config.baseUrl}/call/get-all-calls`, {
        userId: user?.id
      })
      if (calls.status === 200) {
        setcalls(calls.data.callHistory)
      }
    } catch (err: unknown) {
      console.log("An Error Occured in getting Calls History", err)

    }
  }

  useEffect(() => {
    if (calls.length === 0 || location.state === "success") {
      getCallHistory()
    }
  })


  const handleDialogOpen = (method: string): void => {
    setopen(true)
    setdialogmethod(method)
  }
  if (isAuth) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <Video className="h-8 w-8 text-indigo-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">ConnectNow</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-900">{user?.email}</span>
                    <span className="text-xs text-gray-500">Online</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg bg-white shadow px-5 py-6 sm:px-6">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
              <p className="mt-1 text-gray-600">Ready to connect with someone today?</p>

              <div className="mt-6">
                <Button onClick={() => handleDialogOpen("start")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <Video className="h-5 w-5 mr-2" />
                  Start New Meeting
                </Button>
                <button onClick={() => handleDialogOpen("join")} className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Join a Meeting
                </button>

              </div>
            </div>
          </div>

          <CustomDialog open={open} setopen={setopen} dialogmethod={dialogmethod} userId={user?.id} userEmail={user?.email} />


          <div className="mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Call History</h3>
              </div>
              <ul className="space-y-4">
                {calls.length > 0 ? (
                  calls.map((callHistory) => (
                    <li
                      key={callHistory?.callId}
                      className="w-full p-4 rounded-lg border border-gray-300 hover:border-blue-500 transition-colors duration-200 bg-white shadow-sm hover:shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Call ID: {callHistory?.callId}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(callHistory?.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                          View Details
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-center p-6">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <p className="text-lg font-medium text-gray-500">No Previous Calls</p>
                      <p className="text-sm text-gray-400">Your call history will appear here</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Video className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          ConnectNow
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connect with anyone, anywhere through seamless video calls
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Please Login to Use the Services</h3>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to access all features and start your video meetings
            </p>
            <div className="mt-6">
              <button onClick={() => navigate("/Login")} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Sign In
              </button>
              <div className="mt-4 text-sm">
                <Link to={"/signup"} className="font-medium text-indigo-600 hover:text-indigo-500">
                  Don't have an account? Sign up now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;