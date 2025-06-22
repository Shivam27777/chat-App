import {WebSocketServer, WebSocket} from "ws";

const wss = new WebSocketServer({port : 8080});

let userCount = 0;

let allSockets : Map<String,WebSocket[]>  = new Map() ;
let socketRooms : Map<WebSocket, String>  = new Map();

wss.on("connection", (socket)=>{
    userCount+=1;
    console.log('user connected #' + userCount );

    socket.on("message",(message)=>{
        // @ts-ignore
        const parsedMessage = JSON.parse(message);
        if(parsedMessage.type === "join"){
            const roomId : String = parsedMessage.payload.roomId;
            let exists : boolean = false;
            if(allSockets.has(roomId)) exists = true;
            console.log("joining a room")
            if(exists){
                allSockets.get(roomId)?.push(socket);
                socketRooms.set(socket, roomId);
            }
            else {
                allSockets.set(roomId, [socket])
                socketRooms.set(socket, roomId);
            }
        }
        if( parsedMessage.type === "message"){
            const currentRoom = parsedMessage.payload.roomId;
            const socketsToBroadcast: WebSocket[] = allSockets.get(currentRoom) || [];
            if(socketsToBroadcast.length == 0 || !socketsToBroadcast.includes(socket)){
                // need to decide the flow of 
                return 
            }
                
            
            for(let sameRoomSocket of  socketsToBroadcast){
                sameRoomSocket.send(parsedMessage.payload.message);
            }
        }

    })

    socket.on("close", ()=>{
        // @ts-ignore
        const roomId : string = socketRooms.get(socket);
        socketRooms.delete(socket);
        const webSocketsInRoom : WebSocket[] | any  = allSockets.get(roomId);
        const index = webSocketsInRoom.indexOf(socket);
        webSocketsInRoom.splice(index,1);
        allSockets.set(roomId, webSocketsInRoom);
        if(webSocketsInRoom.length === 0){
            allSockets.delete(roomId);
        }
        console.log("disconnected !")
    })
    
})