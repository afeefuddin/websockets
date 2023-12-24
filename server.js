const express = require('express')
const WebSocket = require('ws')
const cors = require('cors')
const app = express();


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors({
    origin:'*'
  }));

app.get('/',(req,res)=>{
    const number =  Math.floor(Math.random()*100)
    res.status(200).send({'uuid':number})
    const wss = new WebSocket(`ws://localhost:8802?id=${number}&server=true`)
    wss.onopen= (event) =>{
        console.log('Server Connected with a websocket')
        wss.addEventListener('message',(event)=>{
            if (event.data instanceof Blob) {
                // If the message is a Blob, convert it to text
                const reader = new FileReader();
                
                reader.onload = function () {
                    const text = reader.result;
                    console.log('Message from server:', text);
                };
        
                reader.readAsText(event.data);
            } else {
                // If the message is not a Blob, log it as is
                console.log('Message from server:', event.data);
            }
        })
    }
    setInterval(()=>{
        wss.send(`Polling after 20 seconds from uuid ${number}`)
    },1000*10)
})

app.listen(6969,()=>{
    console.log("Server started")
})

