import { useEffect, useRef, useState } from 'react'
import TodoList from '../components/TodoList'
import Utils from '../Utils'
import Api from '../api/Api'
import SocketHandler from '../SocketHandler'
import Header from '../components/Header'
import AddTask from '../components/AddTask'
export default function MainPage({ onSignIn }) {
    const [items, setItems] = useState([])
    const [userInfo, setUserInfo] = useState({ name: undefined, age: undefined, email: undefined, _id: undefined })
    const [socket, setSocket] = useState()
    const itemsRef = useRef()

    useEffect(() => {
        itemsRef.current = items
    }, [items])

    function handleSignOut() {
        Utils.deleteToken()
        onSignIn()
    }
    useEffect(() => {
        let socketHandler; // Declare the socketHandler variable
        let isCreate = true
        async function fetchData() {
            const token = Utils.getToken();
            if (token) {
                const { error, result } = await Utils.getJson("/user/info", "", token);
                setUserInfo(result);
                loadAllTodos();
                if (isCreate) {
                    socketHandler = new SocketHandler(token, 8080);
                    socketHandler.setOnAuth(() => {

                        setSocket(socketHandler);
                    })
                }
            } else {
                onSignIn();
            }
        }

        fetchData();

        return () => {
            if (socketHandler) {
                socketHandler.close(); // Call the close method on the socketHandler
            }
            isCreate = false
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.sendMessage("session", {})
            socket.setOnMessage((type, data) => {
                const { result, error } = data
                switch (type) {
                    case "post/todos":
                        if (result) {
                            setItems((old) => [...old, result])
                        }
                        break
                    case "delete/todos":
                        if (result) {
                            const { index } = result;
                            setItems((old) => {
                                const updatedItems = [...old];
                                if (index !== -1) {
                                    updatedItems.splice(index, 1);
                                }
                                return updatedItems;
                            });
                        }
                        break
                    case "put/todos":
                        if (result) {
                            const { index, todo } = result;
                            setItems((old) => {
                                const updatedItems = [...old];
                                updatedItems[index] = todo
                                return updatedItems;
                            });
                        }
                        break

                    default:
                        break
                }
            })
        }
    }, [socket])

    async function loadAllTodos() {
        const { result } = await Api.getAllTodos()
        if (result) {
            setItems(result)
        }
    }

    return (
        <div className='full-box main-page'>
            <Header onSignOut={handleSignOut} />
            <AddTask socket={socket} />
            <TodoList
                info={userInfo}
                items={items}
                socket={socket}
            />
        </div>
    )
}