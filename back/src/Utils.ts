
namespace Utils {
    const SERVER_URL = "http://localhost:3000"
    export async function postJson(url: string, body: {}) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };
        const result = await fetch(`${SERVER_URL}${url}`, options)
        return result.json()
    }

}
export default Utils