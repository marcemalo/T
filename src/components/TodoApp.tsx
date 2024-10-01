import React, { useEffect, useState } from 'react';

interface Todo {
    name: string;
    hour: number;
    minute: number;
    second: number;
    isCompleted: boolean;
    time: number;
}

const formatTime = (time: number) => time.toString().padStart(2, '0');

const TodoApp: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });
    const [todoInput, setTodoInput] = useState('');
    const [sortOption, setSortOption] = useState<string>('default');
    const [hourFilter, setHourFilter] = useState<number | ''>('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const createTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (todoInput.trim() !== '') {
            const date = new Date();
            const newTodo: Todo = {
                name: todoInput,
                hour: date.getHours(),
                minute: date.getMinutes(),
                second: date.getSeconds(),
                isCompleted: false,
                time: date.getTime(),
            };
            setTodos([...todos, newTodo]);
            setTodoInput('');
        } else {
            alert('Please enter a valid todo!');
        }
    };

   

    const toggleCompletion = (index: number) => {
        const updatedTodos = todos.map((todo, i) => (i === index ? { ...todo, isCompleted: !todo.isCompleted } : todo));
        setTodos(updatedTodos);
    };


    const searchTodos = () => {
        if (searchQuery !== '') {
            const searchedTodos = todos.filter(todo => todo.name.toLowerCase().includes(searchQuery.toLowerCase()));
            setTodos(searchedTodos);
        } else {
            const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
            setTodos(savedTodos);
        }
    };

    return (
        <div className="todolist">
            <h1>Todo App</h1>
            <form onSubmit={createTodo}>
                <input
                    value={todoInput}
                    onChange={e => setTodoInput(e.target.value)}
                    placeholder="Enter todo"
                />
                <button type="submit">Add todo</button>
            </form>

            <div className="todo-actions">
                <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
                    <option value="" disabled>Sort todos</option>
                    <option value="a-z">A-Z</option>
                    <option value="z-a">Z-A</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="completed">Completed</option>
                    <option value="incompleted">Incompleted</option>
                </select>

                <input
                    type="number"
                    value={hourFilter}
                    onChange={e => setHourFilter(Number(e.target.value))}
                    placeholder="Enter hour"
                />
                <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search task"
                    onKeyUp={searchTodos}
                />
            </div>
            <div id="result">
                {todos.map((todo, index) => (
                    <div key={index} onDoubleClick={() => toggleCompletion(index)} className="todo-item">
                        <span>{index + 1}</span>
                        <h2 className={todo.isCompleted ? 'completed' : ''}>{todo.name}</h2>
                        <span>{formatTime(todo.hour)}:{formatTime(todo.minute)}:{formatTime(todo.second)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoApp;
