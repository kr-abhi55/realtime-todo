import { useEffect, useRef, useState } from 'react'
import './Todo.css'
import Utils from '../Utils';
import { Api } from '../api/Api';
function TodoItem({ index, onClick, onDelete, editIndex, onEditIndex, item, onUpdateItem }) {
    const inputRef = useRef();
    const checkboxRef = useRef();
    // const [text, setText] = useState(defaultItem.text);
    // const [isCompleted, setIsCompleted] = useState(defaultItem.isCompleted);

    function handleEdit(index) {
        onEditIndex(index);
    }

    function handleOk() {
        if (inputRef.current) {
            const text = inputRef.current.value
            onEditIndex(-1);
            updateItem({ isCompleted: item.isCompleted, text: text });
        }
    }

    function handleKeyEvent(e) {
        if (e.key === 'Enter') {
            const text = e.target.value
            onEditIndex(-1);
            updateItem({ isCompleted: item.isCompleted, text: text });
        }
    }

    function handleCheckboxChange() {
        const value = !item.isCompleted
        updateItem({ isCompleted: value, text: item.text })
    }

    function updateItem({ text, isCompleted }) {
        console.log(text, isCompleted)
        const newItem = item
        newItem.text = text
        newItem.isCompleted = isCompleted
        onUpdateItem(index, item);
    }
    function handleDelete() {
        onDelete(index)
    }

    useEffect(() => {
        if (inputRef.current && editIndex === index) {
            inputRef.current.focus();
        }
    }, [editIndex, index]);

    return (
        <div className='todo-item flex-h'>
            <div className='todo-item-inner'>
                <input
                    onChange={handleCheckboxChange}
                    ref={checkboxRef}
                    checked={item.isCompleted}
                    type="checkbox"
                    name=""
                    id=""
                />
                {editIndex === index ? (
                    <input
                        ref={inputRef}
                        onKeyDown={handleKeyEvent}
                        type="text"
                        defaultValue={item.text}
                    />
                ) : (
                    <span
                        onClick={() => handleEdit(index)}
                        style={{ textDecoration: item.isCompleted ? 'line-through' : '' }}
                    >
                        {item.text}
                    </span>
                )}
            </div>

            <div className='flex-h'>
                {editIndex === index ? (
                    <button onClick={handleOk}>ok</button>
                ) : (
                    <button onClick={() => handleEdit(index)}>edit</button>
                )}
                <button onClick={handleDelete}>delete</button>
            </div>
        </div>
    );
}

export default function Todo({
    items, onSetItems, socket
}) {
    //  const [items, setItems] = useState(defaultItems)
    const [text, setText] = useState("")
    const [editIndex, setEditIndex] = useState(-1)

    function handleInputChange(e) {
        setText(e.target.value)
    }

    function handleKeyEvent(e) {
        if (e.key === 'Enter') {
            addItem()
        }
    }

    async function addItem() {
        if (text.length) {
            const item = { text: text, isCompleted: false }
            setText('')
            socket.sendMessage("post/todos", item)
            // onSetItems([...items, result])
            // console.log("added todo", result)
            // const { result, error } = await Api.postTodo(item)
            // if (error) {
            //     alert(error)
            // } else {
            //     onSetItems([...items, result])
            //     console.log("added todo", result)
            // }
        }
    }

    async function deleteItem(i) {
        const updatedItems = [...items];
        const id = updatedItems[i]._id
        socket.sendMessage("delete/todos", { index: i, id: id })

        // updatedItems.splice(i, 1);
        // onSetItems(updatedItems);
        // const { result, error } = await Api.deleteTodo(id)
        // if (error) {
        //     alert(error)
        // } else {
        //     console.log("delete todo", result)
        // }

    }

    function handleItemClick({ item, index }) {
        //alert(`${name} ${index}`)
    }

    async function handleUpdateItem(index, item) {

        socket.sendMessage("put/todos", { index: index, todo: item })

    }
    const isTextEmpty = text.length === 0

    return (
        <div>
            <div className={'flex-h'}>
                <input className='input-add' onKeyDown={handleKeyEvent} onChange={handleInputChange} value={text} type="text" />
                <button disabled={isTextEmpty} onClick={addItem}>Add</button>
            </div>
            <div className='flex-v box'>
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
        </div>
    )
}
