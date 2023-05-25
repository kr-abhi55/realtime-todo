import dotenv from 'dotenv'
import fetch from 'node-fetch';
dotenv.config()
namespace Utils {
    export const env = {
        MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/",
        AUTH_SECRET_KEY: process.env.AUTH_SECRET_KEY || "-----***----",
        EXPRESS_PORT: parseInt(process.env.EXPRESS_PORT || "3000") ,
        SOCKET_PORT: parseInt(process.env.SOCKET_PORT || "8080"),
    }
    const SERVER_URL = "http://localhost:" + env.EXPRESS_PORT
    export async function postJson(url: string, body: {}) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };
        const result = await fetch(`${SERVER_URL}${url}`, options)
        return result.json() as any
    }

}
export default Utils