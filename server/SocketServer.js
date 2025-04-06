import { v4 as uuidv4 } from 'uuid';
const calls = {};

const SocketEvents = (socket, io) => {
    socket.on("CreateCall", (data) => {
        const { callerId, callerEmail } = data;

        const callId = uuidv4()
        calls[callId] = {
            callerId: callerId,
            callerEmail: callerEmail,
            callersocketId: socket.id
        }

        socket.join(callId)

        socket.emit('callCreated', { callersocketId: socket.id, roomId: callId, callerId: callerId, });
    })

    socket.on("JoinCall", (data) => {
        const { callId, joinerId, joinerEmail } = data;

        const keysInCalls = Object.keys(calls[callId]).length
        if (keysInCalls === 6) {
            socket.emit("roomFull", {
                message: "The room is Full"
            })
            return
        }

        if (calls[callId]) {
            calls[callId].joinerId = joinerId
            calls[callId].joinerEmail = joinerEmail
            calls[callId].joinerSocketId = socket.id


            socket.join(callId)
            console.log(calls)

            socket.emit("CallReady", {
                callerId: calls[callId].callerId,
                callerEmail: calls[callId].callerEmail,
                callerSocketId: calls[callId].callersocketId,
                joinerId: joinerId,
                joinerEmail: joinerEmail,
                joinerSocketId: socket.id,
                callId: callId
            })

            io.to(callId).emit("UserJoined", {
                joinerEmail: joinerEmail,
                joinerId: joinerId,
                joinerSocketId: socket.id
            })
            console.log("Send the userjoined event")

        } else {
            socket.emit('error', { message: 'Call not found' });
        }
    })

    socket.on("sendOffer", (data) => {
        const { from, to, offer } = data;
        console.log(`Received Offer from ${from} to ${to} and offer:${offer}`)
        io.to(to).emit("receivedOfferFromServer", {
            offer: offer,
            from: from,
            me: to
        })
    })


    socket.on("sendAnswer", (data) => {
        const { answer, from, to, roomId } = data;
        console.log(`Received Answer from ${from} to ${to} and answer:${answer}`)
        io.to(to).emit("receivedAnswerFromServer", {
            answer: answer,
            from: calls[roomId].joinerEmail,
            to: calls[roomId].callerEmail
        })
    })

    socket.on("iceCandidate", (data) => {
        const { candidate, from, to } = data;
        io.to(to).emit("ice-candidate", {
            candidate,
            from
        })
    })


    socket.on("nego-needed", (data) => {
        const { offer, from, to } = data;
        console.log("received nego-offer:", offer, "from this:", from, "to this:", to)
        io.to(to).emit("nego-needed-offer-server", {
            offer, from, to
        })
    })

    socket.on("nego-needed-done", (data) => {
        const { answer, from, to } = data;
        console.log("received nego-answer:", answer, "from this:", from, "to this:", to)
        io.to(to).emit("nego-done-final", {
            answer,
            from,
            to
        })
    })
}

export { SocketEvents }