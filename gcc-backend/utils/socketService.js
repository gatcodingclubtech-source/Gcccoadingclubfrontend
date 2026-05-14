let io;
const userSockets = new Map();

const init = (socketIo) => {
    io = socketIo;
    
    io.on('connection', (socket) => {
        socket.on('register', (userId) => {
            userSockets.set(userId, socket.id);
        });

        socket.on('disconnect', () => {
            for (const [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    userSockets.delete(userId);
                    break;
                }
            }
        });
    });
};

const sendToUser = (userId, event, data) => {
    const socketId = userSockets.get(userId.toString());
    if (socketId && io) {
        io.to(socketId).emit(event, data);
        return true;
    }
    return false;
};

const broadcast = (event, data) => {
    if (io) io.emit(event, data);
};

module.exports = { init, sendToUser, broadcast };
