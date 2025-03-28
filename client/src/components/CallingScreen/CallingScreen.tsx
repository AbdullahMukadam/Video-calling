import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../ui/button'
import { setSocket } from '@/Socket'

function CallingScreen() {

    const { id } = useParams()
    const [Media, setMedia] = useState<undefined | MediaStream>()
    const MyVideo = useRef<HTMLVideoElement | null>(null)
    const navigate = useNavigate()

    const handleCallCut = () => {
        setSocket()
        navigate("/")
    }

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setMedia(stream)
            if (MyVideo.current) {
                MyVideo.current.srcObject = stream;
            }
        })
    }, [])

    return (
        <div className='w-full p-5'>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold'>Call Id : {id}</h1>
                <Button onClick={handleCallCut}>Cut Call</Button>
            </div>
            <div className='w-full '>
                <video className='w-full h-[100vh]' ref={MyVideo} autoPlay></video>
            </div>
        </div>
    )
}

export default CallingScreen