import {WebSocketServer, WebSocket} from "ws";

const wss = new WebSocketServer({port : 8080});

let userCount = 0;

let allSockets : Map<String,WebSocket[]>  = new Map() ;

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
            }
            else {
                allSockets.set(roomId, [socket])
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

    socket.on("disconnect", (socket)=>{
        console.log("disconnected !")
    })
    
})