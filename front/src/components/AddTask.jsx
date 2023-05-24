import { useEffect, useRef, useState } from 'react'

export default function AddTask({ socket }) {
    const [text, setText] = useState("")
    const [isCompleted, setIsCompleted] = useState(false)
    function handleKeyEvent(e) {
        if (e.key === 'Enter') {
            addItem()
        }
    }
    function handleInputChange(e) {
        setText(e.target.value)
    }
    async function addItem() {
        if (text.length) {
            const item = { text: text, isCompleted: isCompleted }
            setText('')
            socket.sendMessage("post/todos", item)
        }
    }
    const isTextEmpty = text.length === 0
    return (
        <div className="add-task space">
            <div className="add-task-top">
                <input type="checkbox" checked={isCompleted} onChange={(e)=>{setIsCompleted(e.target.checked)}} />
                <input
                    onKeyDown={handleKeyEvent}
                    onChange={handleInputChange} value={text}
                    placeholder="Add a task"
                    className="add-task-input-text"
                    type="text" />
            </div>
            <div className="add-task-bottom">
                <div>
                    {!isTextEmpty && <button onClick={addItem} className="add-button">Add</button>}
                </div>
            </div>
        </div>
    )
}