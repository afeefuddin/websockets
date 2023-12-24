const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8802 });

const map = new Map()
// uuid --> [connection id] //pair in this case

let counter = 0;

wss.on("connection", async(ws,req) => {
    const connectId = counter++;
    console.log(connectId)
    const params = new URLSearchParams(req.url.split('?')[1]);
    const id=  params?.get('id')
    console.log(params)
    console.log(params?.get('id'))
    if(map.has(id)){
        map.get(id).push({connectId,ws})
    }
    else{
        let arr = [{connectId,ws}]
        map.set(id,arr)
    }
    console.log("New Client Connected");

    ws.on('message', (data,isBinary) => {
        const arr = map.get(id)
        console.log(arr)
        
        for(let i=0;i<arr.length;i++){
            // console.log(arr)
            console.log(arr[i]?.connectId + "here")
            if(connectId!==arr[i]?.connectId)
            arr[i]?.ws?.send(data,{binary : isBinary})
        }
        
    });

    ws.on('close', () => {
        console.log("Client disconnected");
    });
});
