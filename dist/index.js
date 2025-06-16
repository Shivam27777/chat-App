"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let userCount = 0;
let allSockets = new Map();
wss.on("connection", (socket) => {
    userCount += 1;
    console.log('user connected #' + userCount);
    socket.on("message", (message) => {
        var _a;
        // @ts-ignore
        const parsedMessage = JSON.parse(message);
        console.log(parsedMessage);
        console.log(parsedMessage.type);
        if (parsedMessage.type === "join") {
            const roomId = parsedMessage.payload.roomId;
            let exists = false;
            if (allSockets.has(roomId))
                exists = true;
            console.log("joining a web socket connection");
            if (exists) {
                (_a = allSockets.get(roomId)) === null || _a === void 0 ? void 0 : _a.push(socket);
            }
            else {
                allSockets.set(roomId, [socket]);
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
    socket.on("disconnect", (socket) => {
        console.log("disconnected !");
    });
});
