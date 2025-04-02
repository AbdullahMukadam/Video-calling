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



}

export { SocketEvents }