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

interface ReceivedOffer {
    offer: RTCSessionDescriptionInit;
    from: string;
    me: string | number
}

function CallingScreen() {
    const params = useParams();
    const [isParticipantPresent, setIsParticipantPresent] = useState(false);
    const { MyId, MySocketId } = useCall()
    const socketInstance = useRef<Socket | null>(null);
    const mYvideo = useRef<HTMLVideoElement | null>(null)
    const [myStream, setmyStream] = useState<MediaStream | null>(null)
    const [joinersocketId, setjoinerSocketId] = useState<string | null>(null)

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

    const handleStartCall = useCallback(async (joinerSocketId: string | number) => {

        await peerService.iceCandidate((candidate) => {
            socketInstance.current?.emit("iceCandidate", {
                candidate,
                from: MySocketId,
                to: joinerSocketId
            })
        })

        const offer = await peerService.getOffer()
        if (offer) handleSendOffertoServer(offer, joinerSocketId)
    }, [],)


    const handleSendOffertoServer = useCallback(async (offer: RTCSessionDescriptionInit, joinerSocketId: string | number) => {

        socketInstance.current?.emit("sendOffer", {
            from: MySocketId,
            to: joinerSocketId,
            offer: offer
        })

    }, [],)

    const handleReceivedOfferFromServer = useCallback(async (data: ReceivedOffer) => {
        const { offer, from, me } = data
        console.log("Received the Offer from The Server:", offer, "from this user:", from, "to me:", me)
        if (offer && from && me) {

            peerService.iceCandidate((candidate) => {
                socketInstance.current?.emit("iceCandidate", {
                    candidate,
                    from: me,
                    to: from,
                    roomId: params.id
                });
            });

            const answer = await peerService.generateAnswer(offer)
            socketInstance.current?.emit("sendAnswer", {
                answer: answer,
                from: me,
                to: from,
                roomId: params.id
            })
        }
    }, [],)

    const handleReceiveAnswerFromServer = useCallback(async (data) => {
        const { answer, from, to } = data;
        await peerService.setAnswer(answer)
    }, [],)


    const handleUserRoomJoined = useCallback((data: JoinedUserData) => {
        //console.log("UserJoined event received:", data);
        const { joinerEmail, joinerId, joinerSocketId } = data;

        if (joinerEmail && joinerId && joinerSocketId) {
            setIsParticipantPresent(true);
            setjoinerSocketId(joinerSocketId.toString())
            console.log(`User joined room, email:${joinerEmail}, id:${joinerId}, socketId:${joinerSocketId}`);
            handleStartCall(joinerSocketId)
        }
    }, []);

    const handleIceCandidates = useCallback(async (data) => {
        const { candidate, from } = data;
        await peerService.addIceCandidate(candidate)

    }, []);

    useEffect(() => {
        if (socketInstance.current) {
            //console.log("Setting up UserJoined listener on room:", params.id);

            socketInstance.current.on("UserJoined", handleUserRoomJoined);
            socketInstance.current.on("receivedOfferFromServer", handleReceivedOfferFromServer)
            socketInstance.current.on("receivedAnswerFromServer", handleReceiveAnswerFromServer)
            socketInstance.current.on("ice-candidate", handleIceCandidates)

            return () => {
                socketInstance.current?.off("UserJoined", handleUserRoomJoined);
                socketInstance.current?.off("receivedOfferFromServer", handleReceivedOfferFromServer)
                socketInstance.current?.off("receivedAnswerFromServer", handleReceiveAnswerFromServer)
                socketInstance.current?.off("ice-candidate", handleIceCandidates)
            };
        }
    }, [handleUserRoomJoined, params.id, handleReceivedOfferFromServer, handleReceiveAnswerFromServer]);

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