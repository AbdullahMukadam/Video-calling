import { initializeSocket } from '@/Socket'
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
    const socketInstance = useRef<Socket | null>(null);

    
    useEffect(() => {
        socketInstance.current = initializeSocket();

       
        console.log('Socket initialized:', socketInstance.current?.id);

        return () => {
           
        };
    }, []);

  
    const handleUserRoomJoined = useCallback((data: JoinedUserData) => {
        //console.log("UserJoined event received:", data);
        const { joinerEmail, joinerId, joinerSocketId } = data;

        if (joinerEmail && joinerId && joinerSocketId) {
            setIsParticipantPresent(true);
            console.log(`User joined room, email:${joinerEmail}, id:${joinerId}, socketId:${joinerSocketId}`);
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