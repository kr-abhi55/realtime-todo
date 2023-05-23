
import WebSocket, { WebSocketServer } from 'ws';


export default class WebSocketServerHandler {
    wss: WebSocket.Server<WebSocket.WebSocket>
    private _connect() {
        this.wss.on('connection', (ws) => {
            console.log("client connected")
            ws.on('message', (message) => {
                console.log('Received message:', message.toString('ascii'));

                ws.send('Received: ' + "hello client");
            });

            ws.on('close', () => {
                console.log('client disconnected');
            });
        });
    }
    constructor(port: number) {
        this.wss = new WebSocketServer({ port: port });
        this._connect()
    }
}