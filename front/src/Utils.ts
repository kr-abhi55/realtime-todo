

namespace Utils {
    export const env = {
        SERVER_URL: (import.meta as any).env.VITE_SERVER_URL,
        SOCKET_URL: (import.meta as any).env.VITE_SOCKET_URL,
    }
    const SERVER_URL = env.SERVER_URL
    export async function postJson(url: string, body: {}, token?: string) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        if (token) {
            myHeaders.append("Authorization", "Bearer " + token);
        }
        const options: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(body)
        };
        try {
            const result = await fetch(`${SERVER_URL}${url}`, options)
            return result.json()
        } catch (error) {
            alert(error)
            return {error}
        }

    }
    export async function putJson(url: string, body: {}, token?: string) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        if (token) {
            myHeaders.append("Authorization", "Bearer " + token);
        }
        const options: RequestInit = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(body)
        };
        try {
            const result = await fetch(`${SERVER_URL}${url}`, options)
            return result.json()
        } catch (error) {
            alert(error)
            return { error }
        }

    }
    export async function getJson(url: string, query: string = "", token?: string) {
        var myHeaders = new Headers();
        if (token) {
            myHeaders.append("Authorization", "Bearer " + token);
        }
        var requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        try {
            const result = await fetch(`${SERVER_URL}${url}${query.length == 0 ? '' : ('?' + query)}`, requestOptions)
            return await result.json()
        } catch (error) {
            alert(error)
            return { error }
        }
    }
    export async function deleteJson(url: string, token?: string, query: string = "",) {
        var myHeaders = new Headers();
        if (token) {
            myHeaders.append("Authorization", "Bearer " + token);
        }
        var requestOptions: RequestInit = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };
        try {
            const result = await fetch(`${SERVER_URL}${url}${query.length == 0 ? '' : ('?' + query)}`, requestOptions)
            return await result.json()
        } catch (error) {
            alert(error)
            return { error }
        }
    }
    const TOKEN_KEY = "token___key"
    export function saveToken(token: string) {
        localStorage.setItem(TOKEN_KEY, token)
    }
    export function getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY)
    }
    export function deleteToken() {
        localStorage.removeItem(TOKEN_KEY)
    }


}

export default Utils