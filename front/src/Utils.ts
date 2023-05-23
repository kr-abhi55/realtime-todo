
namespace Utils {
    const SERVER_URL = "http://localhost:3000"
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
        const result = await fetch(`${SERVER_URL}${url}`, options)
        return result.json()

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
        const result = await fetch(`${SERVER_URL}${url}${query.length == 0 ? '' : ('?' + query)}`, requestOptions)
        return await result.json()
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