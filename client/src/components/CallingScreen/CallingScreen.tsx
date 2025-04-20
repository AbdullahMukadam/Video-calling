import { useCall } from '@/Context/callContextProvider';
import { disconnectSocket, initializeSocket } from '@/Socket'
import peerService from '@/utils/peerService/peerService';
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Socket } from 'socket.io-client'
import { Button } from '../ui/button';
import ReactPlayer from "react-player"
import axios from 'axios';
import { Config } from '@/API/Config';
import { toast } from 'sonner';
import { useAuth } from '@/Context/userContextProvider';

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

interface AnswerData {
    answer: RTCSessionDescriptionInit;
    from: string | number;
    to: string | number;
    roomId?: string;
}

interface IceCandidateData {
    candidate: RTCIceCandidate;
    from: string | number;
    to: string | number;
    roomId?: string;
}

interface ReceivedNegoOffer {
    offer: RTCSessionDescriptionInit;
    from: string;
    to: string | number
}

interface ReceivedNegoAnswer {
    answer: RTCSessionDescriptionInit;
    from: string;
    to: string | number
}

function CallingScreen() {
    const params = useParams();
    // const [isParticipantPresent, setIsParticipantPresent] = useState(false);
    const { user } = useAuth()
    const { MyId, MySocketId } = useCall()
    const socketInstance = useRef<Socket | null>(null);
    const [myStream, setmyStream] = useState<MediaStream | null>(null)
    const [remoteStream, setremoteStream] = useState<MediaStream | null>(null)
    const [joinersocketId, setjoinerSocketId] = useState<string | null>(null)
    const [joinerId, setjoinerId] = useState<string | null | number>(null)
    const navigate = useNavigate()

    const handleSendOffertoServer = useCallback(async (offer: RTCSessionDescriptionInit, joinerSocketId: string | number) => {
        try {
            socketInstance.current?.emit("sendOffer", {
                from: MySocketId,
                to: joinerSocketId,
                offer: offer
            })
        } catch (error) {
            console.error("Error sending offer:", error)
        }
    }, [MySocketId])

    const handleStartCall = useCallback(async (joinerSocketId: string | number) => {
        try {
            const streams = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            setmyStream(streams)
            peerService.sendStream(streams)

            await peerService.iceCandidate((candidate) => {
                socketInstance.current?.emit("iceCandidate", {
                    candidate,
                    from: MySocketId,
                    to: joinerSocketId
                })
            })

            const offer = await peerService.getOffer()
            if (offer) {
                await handleSendOffertoServer(offer, joinerSocketId)

            }
        } catch (error) {
            console.error("Error in handleStartCall:", error)
        }
    }, [MySocketId, handleSendOffertoServer])



    useEffect(() => {
        if (peerService.peer) {
            const trackHandler = async (ev: RTCTrackEvent) => {
                const remoteStream = ev.streams;
                console.log("GOT TRACKS!!", remoteStream[0]);
                if (remoteStream && remoteStream[0]) {
                    setremoteStream(remoteStream[0]);
                }
            };

            peerService.peer.addEventListener("track", trackHandler);

            return () => {
                peerService.peer?.removeEventListener("track", trackHandler);
            };
        }
    }, []);

    const handleReceivedOfferFromServer = useCallback(async (data: ReceivedOffer) => {
        try {
            const { offer, from, me } = data
            console.log("Received the Offer from The Server:", offer, "from this user:", from, "to me:", me)

            const streams = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            setmyStream(streams)
            peerService.sendStream(streams)

            await peerService.iceCandidate((candidate) => {
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

        } catch (error) {
            console.error("Error handling received offer:", error)
        }
    }, [params.id])

    const handlesendstream = useCallback(async () => {
        if (myStream) {
            peerService.sendStream(myStream!)
        } else {
            console.error("Stream is not Present")
        }

    }, [myStream])

    const handleReceiveAnswerFromServer = useCallback(async (data: AnswerData) => {
        try {
            const { answer } = data;
            await peerService.setAnswer(answer)
            handlesendstream()
        } catch (error) {
            console.error("Error handling received answer:", error)
        }
    }, [handlesendstream])



    const handleUserRoomJoined = useCallback((data: JoinedUserData) => {
        try {
            const { joinerEmail, joinerId, joinerSocketId } = data;

            if (joinerEmail && joinerId && joinerSocketId) {
                setjoinerSocketId(joinerSocketId.toString())
                setjoinerId(joinerId)
                //setIsParticipantPresent(true);
                console.log(`User joined room, email:${joinerEmail}, id:${joinerId}, socketId:${joinerSocketId}`);
                handleStartCall(joinerSocketId)
            }
        } catch (error) {
            console.error("Error handling user joined:", error)
        }
    }, [handleStartCall])

    const handleIceCandidates = useCallback(async (data: IceCandidateData) => {
        try {
            const { candidate } = data;
            await peerService.addIceCandidate(candidate)
        } catch (error) {
            console.error("Error handling ICE candidate:", error)
        }
    }, [])



    const handleHandleNegoNeeded = useCallback(async () => {
        try {
            const offer = await peerService.getOffer();
            console.log("mysocketId:", MySocketId, "joinersocketid:", joinersocketId)
            socketInstance.current?.emit("nego-needed", {
                offer,
                from: MySocketId,
                to: joinersocketId
            })

        } catch (error) {
            console.error("Error in handleHandleNegoNeeded:", error)
        }

    }, [MySocketId, joinersocketId],)

    const handleNegoOffer = useCallback(async (data: ReceivedNegoOffer) => {
        try {
            const { offer, from, to } = data;
            const answer = await peerService.generateAnswer(offer)
            socketInstance.current?.emit("nego-needed-done", {
                answer,
                from: to,
                to: from
            })
        } catch (error) {
            console.error("Error in handleNegoOffer:", error)
        }

    }, [],)

    const handleNegoAnswer = useCallback(async (data: ReceivedNegoAnswer) => {
        try {
            const { answer } = data
            await peerService.setAnswer(answer)

        } catch (error) {
            console.error("Error in handleNegoAnswer:", error)
        }

    }, [],)



    useEffect(() => {
        peerService.peer?.addEventListener("negotiationneeded", handleHandleNegoNeeded)

        return () => {
            peerService.peer?.removeEventListener("negotiationneeded", handleHandleNegoNeeded)
        }
    }, [handleHandleNegoNeeded])

    useEffect(() => {
        const socket = initializeSocket();
        socketInstance.current = socket;

        console.log('Socket initialized:', socket.id);

        const getMedia = async () => {
            try {
                const streams = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                setmyStream(streams)
                console.log("my streams:", streams)

            } catch (error) {
                console.error("Error getting user media:", error)
            }
        }

        getMedia()

        return () => {
            if (myStream) {
                myStream.getTracks().forEach(track => {
                    track.stop();
                });
            }

            if (remoteStream) {
                remoteStream.getTracks().forEach(track => {
                    track.stop();
                });
            }

            if (peerService.peer) {
                peerService.cleanup()
            }

            socket.disconnect()
            socketInstance.current = null
        }

    }, []);

    const handleEndCall = useCallback(async () => {
        if (myStream) {
            myStream.getTracks().forEach(track => {
                track.stop();
                myStream.removeTrack(track)
            });
        }

        if (remoteStream) {
            remoteStream.getTracks().forEach(track => {
                track.stop();
                remoteStream.removeTrack(track)
            });
        }


        peerService.cleanup()


        //setIsParticipantPresent(false)
        setmyStream(null)
        setremoteStream(null)
        setjoinerSocketId(null)

        if (socketInstance.current) {
            disconnectSocket()
            socketInstance.current?.disconnect()
            socketInstance.current = null
        }


        console.log("My Id :", user?.id)
        const callEnded = await axios.post(`${Config.baseUrl}/call/add-call-history`, {
            callId: params.id,
            callerId: MyId || user?.id || "",
            joinerId: joinerId || ""
        })
        if (callEnded.status === 201) {
            navigate("/", { state: "success" })
        } else if (callEnded.status === 200) {
            toast("Call History Saved")
            navigate("/", { state: "success" })
        }


    }, [joinerId, myStream, navigate, params.id, remoteStream, user?.id],)




    useEffect(() => {
        const socket = socketInstance.current;

        if (socket) {
            socket.on("UserJoined", handleUserRoomJoined);
            socket.on("receivedOfferFromServer", handleReceivedOfferFromServer);
            socket.on("receivedAnswerFromServer", handleReceiveAnswerFromServer);
            socket.on("ice-candidate", handleIceCandidates);
            socket.on("nego-needed-offer-server", handleNegoOffer)
            socket.on("nego-done-final", handleNegoAnswer)

            return () => {
                socket.off("UserJoined", handleUserRoomJoined);
                socket.off("receivedOfferFromServer", handleReceivedOfferFromServer);
                socket.off("receivedAnswerFromServer", handleReceiveAnswerFromServer);
                socket.off("ice-candidate", handleIceCandidates);
                socket.off("nego-needed-offer-server", handleNegoOffer);
                socket.off("nego-done-final", handleNegoAnswer)
            };
        }
    }, [handleUserRoomJoined, handleReceivedOfferFromServer, handleReceiveAnswerFromServer, handleIceCandidates, handleNegoOffer, handleNegoAnswer]);

    return (
        <div className="w-full max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md">

            <div className="flex items-center justify-between mb-6 border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800">Room ID: {params.id}</h2>
                <Button onClick={handleEndCall}>End Call</Button>
            </div>


            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="relative rounded-lg overflow-hidden bg-gray-100 ">
                    <ReactPlayer
                        url={myStream!}
                        playing
                        width="100%"
                        height="100%"
                        muted={true}
                        style={{ objectFit: 'cover' }}
                    />
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-md text-sm">
                        You
                    </div>
                </div>


                <div className="relative rounded-lg overflow-hidden bg-gray-100 ">
                    <ReactPlayer
                        url={remoteStream!}
                        playing
                        width="100%"
                        height="100%"
                        muted={false}
                        style={{ objectFit: 'cover' }}
                    />
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-md text-sm">
                        Remote
                    </div>


                </div>
            </div>
        </div>
    );
}

export default CallingScreen;