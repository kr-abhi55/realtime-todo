
import jwt from "jsonwebtoken";
import http from "http";
import WebSocket, { WebSocketServer } from 'ws';
import express from "express";
import User from "./models/User.js";
import Todo from "./models/Todo.js";
import Utils from "./Utils.js";
function verifyToken(token: string): any {
    const secret = Utils.env.AUTH_SECRET_KEY
    try {
        const decoded = jwt.verify(token, secret) as any;
        if (decoded) {
            return { result: decoded }
        }
        return { error: "invalid token" }
    } catch (error) {
        return { error: error }
    }
}
export default class SocketHandler {
    wss: WebSocket.Server<WebSocket.WebSocket>
    clients = new Map<string, WebSocket[]>()
    private addObserver() {
        this.wss.on('connection', (ws) => {
            let user_id: string = ""
            let isAuth = false
            ws.on('message', async (message) => {
                const { type, data } = JSON.parse(message.toString('utf-8'))
                console.log(type, data)
                if (type == "auth" && !isAuth) {
                    const { result, error } = await verifyToken(data)
                    if (error) {
                        return this.sendMessage(ws, "auth", { error: error })
                    }
                    if (result) {
                        user_id = result.sub
                        isAuth = true
                        //add to clients
                        const old = this.clients.get(user_id)
                        this.clients.set(user_id, old ? [...old, ws] : [ws])
                        return this.sendMessage(ws, "auth", { result: "success" })
                    }
                } else {
                    if (!isAuth) {
                        return this.sendMessage(ws, "error", "first auth")
                    }
                    this.onMessage({ ws: ws, userID: user_id, type, data })
                }

            });
            ws.on('close', () => {
                const old = this.clients.get(user_id)
                console.log('client disconnected', user_id);
                isAuth = false
                if (old) {
                    const i = old.findIndex((sock) => sock == ws)
                    if (i != -1) {
                        old.splice(i, 1)
                    }
                }
            });
        });
    }
    private async onMessage({ ws, type, data, userID }: any) {
        switch (type) {
            case "get/todos":
                const todos = await Todo.find({ user: userID })
                console.log(todos)
                this.sendMessage(ws, "get/todos", { result: todos })
                break;
            case "session":
                this.sendMessage(ws, type, { result: this.clients.get(userID)?.length })
                break
            case "post/todos":
                const { text, isCompleted } = data
                if (!text || isCompleted == undefined) {
                    return this.sendMessage(ws, type, { error: "required all input" })
                }
                const todo = new Todo({
                    isCompleted: isCompleted,
                    text: text,
                    user: userID
                })
                await todo.save()
                this.sendMessage(ws, type, { result: todo })
                this.sendMessageToAllSession(userID, ws, type, { result: todo })
                break
            case "delete/todos":
                {
                    const { index, id } = data
                    if (index == undefined || id == undefined) {
                        return this.sendMessage(ws, type, { error: "required all input" })
                    }
                    try {
                        const res = await Todo.deleteOne({ _id: id })
                        this.sendMessage(ws, type, { result: { index: index, others: res } })
                        this.sendMessageToAllSession(userID, ws, type, { result: { index: index, others: res } })
                    } catch (error) {
                        console.log(error)
                        this.sendMessage(ws, type, { error: error })
                    }
                }
                break
            case "put/todos":
                {
                    const index = data.index
                    const { text, isCompleted, _id: todoId } = data.todo
                    if (text == undefined || isCompleted == undefined || todoId == undefined) {
                        return this.sendMessage(ws, type, { error: "required all input" })
                    }
                    try {
                        const todo = await Todo.findById({ _id: todoId })
                        if (todo) {
                            todo.text = text
                            todo.isCompleted = isCompleted
                            await todo.save()
                            this.sendMessage(ws, type, { result: { index, todo } })
                            this.sendMessageToAllSession(userID, ws, type, { result: { index, todo } })

                        } else {
                            this.sendMessage(ws, type, { error: "didn't found any todo with id:" + todoId })
                        }
                    } catch (error) {
                        console.log(error)
                        this.sendMessage(ws, type, { error: error })
                    }
                }
                break
            default:
                break
        }
    }
    constructor(server: http.Server) {
        this.wss = new WebSocketServer({ server});
        this.addObserver()
    }
    sendMessage(ws: WebSocket, type: string, data: any) {
        ws.send(JSON.stringify({ type, data }))
    }
    sendMessageToAllSession(userID: string, sender: WebSocket, type: string, data: any) {
        const msg = JSON.stringify({ type, data })
        const old = this.clients.get(userID)
        old?.forEach((sock) => {
            if (sock.readyState == WebSocket.OPEN && sender != sock) {
                sock.send(msg)
            }
        })

    }

}