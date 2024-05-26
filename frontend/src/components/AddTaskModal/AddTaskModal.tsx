import { Button, Input, InputRef, Modal, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { taskAPI } from '../../Api';
import useTaskStore from '../../Store/taskStore';
import useAuthStore from '../../Store/authStore';
import { TaskCategory } from '../Task/Types/types';


interface AddTaskModalProps {
    showAddTaskModal: boolean
    setShowAddTaskModal: React.Dispatch<React.SetStateAction<boolean>>
}

const AddTaskModal = ({ showAddTaskModal, setShowAddTaskModal }: AddTaskModalProps) => {

    const [task, setTask] = useState<{
        title: string;
        status: TaskCategory;
    }>({
        title: "",
        status: "todo",
    });

    const inputRef = useRef<InputRef>(null);
    const user = useAuthStore((state) => state.user?._id);
    const { addTaskDataStore, addTaskFilteredTasksStore } =
        useTaskStore();

    const handleInputChange = (e: { target: { name: string; value: any } }) => {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value });
    };
    const onSaveTask = (event: React.FormEvent) => {
        const { title, status } = task;
        event.preventDefault();

        if (user) {
            if (title.trim() === "") {
                setShowAddTaskModal(false);
                return;
            }
            taskAPI
                .createTask({ title, status, user })
                .then((response) => {
                    console.log("Response", response.data.task);
                    const newTask = response.data.task;
                    addTaskDataStore(status, newTask);
                    addTaskFilteredTasksStore(status, newTask);
                    void message.success("Task Added", 1.5);
                })
                .catch((error) => {
                    console.error(error);
                    void message.error("Error: Task Not added", 1.5);
                });
        }
        setTask({
            title: "",
            status: "todo",
        });
        setShowAddTaskModal(false);
    };


    useEffect(() => {
        if (showAddTaskModal && inputRef.current != null) {
            inputRef.current.focus();
        }
    }, [showAddTaskModal]);


    return (
        <Modal
            open={showAddTaskModal}
            onCancel={() => setShowAddTaskModal(false)}
            closable
            width={350}
            centered
            footer={
                <>
                    <Button size="small" onClick={() => setShowAddTaskModal(false)}>
                        Cancel
                    </Button>

                    <Button
                        size="small"
                        type="primary"
                        className="text-white bg-blue-500"
                        onClick={(e) => onSaveTask(e)}
                    >
                        Save
                    </Button>
                </>
            }
        >
            <div className="flex flex-col">
                <p className="text-center text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
                    Add Task
                </p>

                <div className="w-[full] mt-2">
                    {/* <label className="block mb-3 font-medium text-gray-700">Status</label> */}
                    <Input
                        ref={inputRef}
                        required
                        name="title"
                        defaultValue={task.title}
                        value={task.title}
                        onChange={handleInputChange}
                        placeholder=" Task Title"
                        className="w-full mb-2"
                    />
                    <select
                        id="status"
                        name="status"
                        className="block w-full xt-select rounded-md py-1 px-2 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                        aria-label="Select"
                        value={task.status}
                        onChange={handleInputChange}
                    >
                        <option value="todo">Todo</option>
                        <option value="inProgress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>
        </Modal>
    )
}

export default AddTaskModal