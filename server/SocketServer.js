
const calls = {};

const SocketEvents = (socket, io) => {
    socket.on("CreateCall", (data) => {
        const { callId, callerId, callerName } = data;

        calls[callId] = {
            callerId: callerId,
            callerName: callerName,
            callersocketId: socket.id
        }

        socket.join(callerId)

        socket.emit('callCreated', { callId });
    })

    socket.on("JoinCall", (data) => {
        const { callId, joinerId, joinerName } = data;

        if (calls[callId]) {
            calls[callId].joinerId = joinerId
            calls[callId].joinerName = joinerName
            calls[callId].joinerSocketId = socket.id


            socket.join(callId)

            io.to(callId).emit("CallReady", {
                callerId: calls[callId].callerId,
                callerName: calls[callId].callerName,
                joinerId: joinerId,
                joinerName: joinerName,
                callId: callId
            })
        } else {
            socket.emit('error', { message: 'Call not found' });
        }
    })
}

export { SocketEvents }