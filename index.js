const button = document.querySelector('.send');
let id = ''


function messageFromServer(text) {

    const elem = document.querySelector('.messages');
    const chat = document.createElement('div')
    chat.textContent = text;

    
    elem.appendChild(chat);
}



fetch('http://localhost:6969').then((res)=>{
    return res.json()
}).then(data=>{
    id = data.uuid;
    console.log(id)


const socket = new WebSocket(`ws://localhost:8802?id=${id}`);

button.addEventListener('click', () => {
    socket.send(`Hello Server from client with uuid ${id}`);
});

socket.onopen = (event) => {
    console.log('WebSocket connection opened');
};

socket.addEventListener('message', (event) => {
    if (event.data instanceof Blob) {
        // If the message is a Blob, convert it to text
        const reader = new FileReader();
        
        reader.onload = function () {
            const text = reader.result;
            console.log('Message from server:', text);
            messageFromServer(text)
        };

        reader.readAsText(event.data);
    } else {
        // If the message is not a Blob, log it as is
        console.log('Message from server:', event.data);
        messageFromServer(event.data)
    }
});

// Handle WebSocket close event
socket.onclose = (event) => {
    console.log('WebSocket connection closed:', event);
};


})