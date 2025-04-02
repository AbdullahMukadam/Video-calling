import { useCall } from '@/Context/callContextProvider';
import { initializeSocket } from '@/Socket'
import peerService from '@/utils/peerService/peerService';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Socket } from 'socket.io-client'

interface JoinedUserData {
    joinerEmail: string;
    joinerId: string | number;
    joinerSocketId: string | number;
}

function CallingScreen() {
    const params = useParams();
    const [isParticipantPresent, setIsParticipantPresent] = useState(false);
    const { MyId, MySocketId } = useCall()
    const socketInstance = useRef<Socket | null>(null);
    const mYvideo = useRef<HTMLVideoElement | null>(null)
    const [myStream, setmyStream] = useState<MediaStream | null>(null)
    const [joinerSocketId, setjoinerSocketId] = useState<number | string>("")

    useEffect(() => {
        socketInstance.current = initializeSocket();


        console.log('Socket initialized:', socketInstance.current?.id);

       /*  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((streams) => {
            setmyStream(streams)
            mYvideo.current.srcObject = streams
        }).catch((error) => {
            console.log("An Error Occured in Getting Media", error)
        }) */

        return () => {

        };
    }, []);

    const handleStartCall = useCallback(async () => {
        const offer = await peerService.getOffer()
        if (offer) handleSendOffertoServer(offer)
    }, [],)


    const handleSendOffertoServer = useCallback(async (offer: RTCSessionDescriptionInit) => {

        socketInstance.current?.emit("sendOffer", {
            from: MySocketId,
            to: joinerSocketId,
            offer: offer
        })

    }, [],)

    const handleUserRoomJoined = useCallback((data: JoinedUserData) => {
        //console.log("UserJoined event received:", data);
        const { joinerEmail, joinerId, joinerSocketId } = data;

        if (joinerEmail && joinerId && joinerSocketId) {
            setIsParticipantPresent(true);
            console.log(`User joined room, email:${joinerEmail}, id:${joinerId}, socketId:${joinerSocketId}`);
            setjoinerSocketId(joinerSocketId)
            handleStartCall()
        }
    }, []);

    useEffect(() => {
        if (socketInstance.current) {
            //console.log("Setting up UserJoined listener on room:", params.id);

            socketInstance.current.on("UserJoined", handleUserRoomJoined);

            return () => {
                socketInstance.current?.off("UserJoined", handleUserRoomJoined);
            };
        }
    }, [handleUserRoomJoined, params.id]);

    if (!isParticipantPresent) {
        return (
            <div className='w-full p-2'>
                <h1 className='text-xl font-semibold block'>No Participant is Present, Please share the room Id with the participant to join the room.</h1>
                <h2>Room Id: {params.id}</h2>
                {/* <video ref={mYvideo} playsInline autoPlay ></video> */}
            </div>
        );
    }

    return (
        <div className='w-full p-4'>
            <h2 className='text-xl font-semibold block'>Someone has Joined in the room</h2>

        </div>
    );
}

export default CallingScreen;