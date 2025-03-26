import React, { useState } from 'react';
import { useAuth } from '../../Context/userContextProvider';
import { Video, Users, Calendar, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { CustomDialog } from '../Shadcn/Dialog';
import { v4 as uuidv4 } from 'uuid';

function Home() {
  const { auth, user } = useAuth();
  const navigate = useNavigate();
  const [open, setopen] = useState(false)
  const [roomId, setroomId] = useState("")
  const [dialogmethod, setdialogmethod] = useState("")

  const handleCreateRoom = (): void => {
    const callId = uuidv4();


  }

  const handleJoinRoom = () : void =>{

  }

  const handleDialogOpen = (method: string): void => {
    setopen(true)
    setdialogmethod(method)
  }
  if (auth) {
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

          <CustomDialog open={open} setopen={setopen} dialogmethod={dialogmethod} roomId={roomId} setroomId={setroomId} handleCreateRoom={handleCreateRoom} handleJoinRoom={handleJoinRoom}/>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <Calendar className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">Scheduled Meetings</h3>
                    <p className="mt-1 text-sm text-gray-500">You have 2 upcoming meetings</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">View all meetings</a>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">Recent Contacts</h3>
                    <p className="mt-1 text-sm text-gray-500">Connect with your team</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">View all contacts</a>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <Settings className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">Settings</h3>
                    <p className="mt-1 text-sm text-gray-500">Configure your preferences</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Manage settings</a>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {[1, 2, 3].map((item) => (
                  <li key={item}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">Video Call with Team Alpha</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            5 participants
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p>
                            Today at 2:30 PM
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
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