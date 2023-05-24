import Utils from "../Utils";

namespace Api {
    export function getAllTodos() {
        const token = Utils.getToken()
        if (token) {
            return Utils.getJson("/todos", "", token)
        }
        return { error: "not valid token" }
    }
    export function postTodo(todo: any) {
        const token = Utils.getToken()
        if (token) {
            return Utils.postJson("/todos", todo, token)
        }
        return { error: "not valid token" }
    }
    export function updateTodo(todo: any) {
        const token = Utils.getToken()
        if (token) {
            return Utils.putJson("/todos", todo, token)
        }
        return { error: "not valid token" }
    }
    export function deleteTodo(id: string) {
        const token = Utils.getToken()
        if (token) {
            return Utils.deleteJson("/todos/" + id, token)
        }
        return { error: "not valid token" }
    }
}
export default Api