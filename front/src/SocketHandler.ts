export default class SocketHandler {
    private wSocket: WebSocket
    private _onAuthFun: () => void
    private _onMsgFun: (type, data) => void
    private auth() {
        this.sendMessage("auth", this.token)
    }
    setOnAuth(fun: () => void) {
        this._onAuthFun = fun
    }
    setOnMessage(fun: (type, data) => void) {
        this._onMsgFun = fun
    }
    private addObserver() {
        this.wSocket.addEventListener('open', () => {
            console.log('Socket connected');
            this.auth()

        });
        this.wSocket.addEventListener('message', (e) => {
            const { type, data } = JSON.parse(e.data);
            const { result, error } = data
            console.log(type, result)
            switch (type) {
                case "auth":
                    if (result == "success") {
                        this._onAuthFun()
                    }
                    break
                default:
                    this._onMsgFun(type, data)
                    break;
            }
        })
        this.wSocket.addEventListener('close', () => {
            console.log('Socket closed');
        });
    }
    constructor(public token: string, public port: number) {
        this.wSocket = new WebSocket('ws://localhost:' + port)
        this.addObserver()
    }
    sendMessage(type: string, data: any) {
        this.wSocket.send(JSON.stringify({ type, data }))
    }

    close() {
        this.wSocket.close()
    }
}