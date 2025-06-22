# ChatApp Backend
node | websockets 


```bash
npm run build
npm run dev
```

## Functions

```javascript
1. Join room
2. Send message in room
3. Rooms and sockets are stored in maps for easy filter and updates
```
## Join room
```Json
{
    "type" : "json",
    "payload" : {
        "roomId" :"123"
    }
}
```
## Chat
```Json
{
    "type" : "message",
    "payload" : {
        "roomId" :"123",
        "message":"Hi from postman"
    }
}
```