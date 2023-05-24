import { useEffect, useRef, useState } from 'react'
import { ASSETS_DELETE } from '../Assets';

export default function TodoItem({ index, onClick, onDelete, editIndex, onEditIndex, item, onUpdateItem }) {
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
        <div className='todo-item '>
            <div className='todo-item-left'>
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

            <div className='todo-item-right'>
                <img onClick={handleDelete} src={ASSETS_DELETE} alt="delete" />
            </div>
        </div>
    );
}
