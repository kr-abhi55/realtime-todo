import { useEffect, useRef, useState } from 'react'
import TodoItem from '../components/TodoItem'
export default function TodoList({
    items, socket
}) {
    const [editIndex, setEditIndex] = useState(-1)
    async function deleteItem(i) {
        const updatedItems = [...items];
        const id = updatedItems[i]._id
        socket.sendMessage("delete/todos", { index: i, id: id })
    }
    async function handleUpdateItem(index, item) {
        socket.sendMessage("put/todos", { index: index, todo: item })
    }
    return (
        <div className='todo-list'>
            {items.map((e, i) => (
                <TodoItem
                    editIndex={editIndex}
                    onEditIndex={setEditIndex}
                    onDelete={deleteItem}
                    key={i}
                    item={e}
                    index={i}
                    onUpdateItem={handleUpdateItem}
                />
            ))}
        </div>
    )
}
