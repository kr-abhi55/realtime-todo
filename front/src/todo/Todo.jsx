import { useEffect, useRef, useState } from 'react'
import './Todo.css'

function TodoItem({ index, name, onClick, onDelete, editIndex, onEditIndex, onUpdateText }) {
    const inputRef = useRef()
    const [isComplete, setIsComplete] = useState(false)
    function handleEdit(index) {
        onEditIndex(index)

    }
    function handleOk(index) {
        onEditIndex(-1)

    }
    function handleKeyEvent(e) {
        if (e.key === 'Enter') {
            onEditIndex(-1)
        }
    }
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [editIndex])

    return (
        <div onClick={() => { onClick({ index, name }) }} className='todo-item flex-h'>
            <div className='todo-item-inner'>
                <input onClick={(e) => { setIsComplete((old) => !old) }} defaultChecked={isComplete} type="checkbox" name="" id="" />
                {(editIndex == index) ? <input ref={inputRef} onKeyDown={handleKeyEvent} type="text" value={name} onChange={(e) => { onUpdateText(index, e.target.value) }} /> :

                    <span onClick={() => { handleEdit(index) }} style={{ textDecoration: isComplete ? 'line-through' : '' }} >{name}</span>
                }
            </div>

            <div className='flex-h'>
                {(editIndex == index) ? <button onClick={() => { handleOk(index) }}>ok</button> : <button onClick={() => { handleEdit(index) }}>edit</button>}
                <button onClick={() => { onDelete(index) }}>delete</button>
            </div>
        </div>
    )
}

export default function Todo({
    items,handleSetItems
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

    function addItem() {
        if (text.length) {
            handleSetItems([...items, text])
            setText('')
        }
    }

    function deleteItem(index) {
        const updatedItems = [...items]
        updatedItems.splice(index, 1)
        handleSetItems(updatedItems)
    }

    function handleItemClick({ name, index }) {
        //alert(`${name} ${index}`)
    }
    function updateItem(index, name) {
        if (index != -1) {
            const updatedItems = [...items]
            updatedItems[index] = name
            handleSetItems(updatedItems)
        }
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
                    <TodoItem onUpdateText={updateItem} onClick={handleItemClick} editIndex={editIndex} onEditIndex={setEditIndex} onDelete={deleteItem} key={i} name={e} index={i} />
                ))}
            </div>
        </div>
    )
}
