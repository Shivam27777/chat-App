"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let userCount = 0;
let allSockets = new Map();
let socketRooms = new Map();
wss.on("connection", (socket) => {
    userCount += 1;
    console.log('user connected #' + userCount);
    socket.on("message", (message) => {
        var _a;
        // @ts-ignore
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "join") {
            const roomId = parsedMessage.payload.roomId;
            let exists = false;
            if (allSockets.has(roomId))
                exists = true;
            console.log("joining a room");
            if (exists) {
                (_a = allSockets.get(roomId)) === null || _a === void 0 ? void 0 : _a.push(socket);
                socketRooms.set(socket, roomId);
            }
            else {
                allSockets.set(roomId, [socket]);
                socketRooms.set(socket, roomId);
            }
        }
        if (parsedMessage.type === "message") {
            const currentRoom = parsedMessage.payload.roomId;
            const socketsToBroadcast = allSockets.get(currentRoom) || [];
            if (socketsToBroadcast.length == 0 || !socketsToBroadcast.includes(socket)) {
                // need to decide the flow of 
                return;
            }
            for (let sameRoomSocket of socketsToBroadcast) {
                sameRoomSocket.send(parsedMessage.payload.message);
            }
        }
    });
    socket.on("close", () => {
        console.log("disconnected !");
        // @ts-ignore
        const roomId = socketRooms.get(socket);
        socketRooms.delete(socket);
        const webSocketsInRoom = allSockets.get(roomId);
        const index = webSocketsInRoom.indexOf(socket);
        webSocketsInRoom.splice(index, 1);
        allSockets.set(roomId, webSocketsInRoom);
        if (webSocketsInRoom.length === 0) {
            allSockets.delete(roomId);
        }
        console.log(allSockets);
        console.log(socketRooms);
    });
});
