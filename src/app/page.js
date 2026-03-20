"use client";

import { useState, useEffect } from "react";
import {
  PlusCircle,
  ListTodo,
  Trash2,
  CheckCircle2,
  Circle,
  ClipboardList
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load
  useEffect(() => {
    const saved = localStorage.getItem("todo-tasks");
    if (saved) setTasks(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  // Save
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("todo-tasks", JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  // Add
  const addTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      return toast.error("Nhập công việc đi bạn ơi!");
    }

    setTasks([
      { id: uuidv4(), text: inputValue, completed: false },
      ...tasks
    ]);

    setInputValue("");
    toast.success("Thêm thành công!");
  };

  // Toggle
  const toggleComplete = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  // Delete
  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast.success("Đã xóa!");
  };

  // Filter
  const filteredTasks = tasks.filter(t =>
    filter === "active"
      ? !t.completed
      : filter === "completed"
      ? t.completed
      : true
  );

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1518655048521-f130df041f66?q=80&w=2000')] bg-cover bg-center flex items-center justify-center p-4 sm:p-8 font-sans">

      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>

      <Toaster position="top-center" />

      <div className="relative z-10 w-full max-w-xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
              <ListTodo size={28} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
              Công việc
            </h1>
          </div>

          <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-full shadow-inner">
            {tasks.filter(t => t.completed).length} / {tasks.length} Hoàn thành
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={addTask} className="flex gap-2 sm:gap-3 mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Thêm công việc mới..."
            className="flex-1 px-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            <PlusCircle size={26} />
          </button>
        </form>

        {/* FILTER */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1.5 rounded-2xl">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold ${
                filter === f
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              {f === "all"
                ? "Tất cả"
                : f === "active"
                ? "Đang làm"
                : "Đã xong"}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="overflow-y-auto flex-1 pr-2">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-12 text-gray-400"
            >
              <ClipboardList size={64} />
              <p>Không có công việc nào!</p>
            </motion.div>
          ) : (
            <ul className="space-y-3">
              <AnimatePresence>
                {filteredTasks.map((task) => (
                  <motion.li
                    key={task.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`flex items-center justify-between p-4 rounded-2xl border ${
                      task.completed
                        ? "bg-gray-50"
                        : "bg-white border-blue-50"
                    }`}
                  >
                    <div
                      onClick={() => toggleComplete(task.id)}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="text-green-500" />
                      ) : (
                        <Circle className="text-gray-400" />
                      )}
                      <span className={task.completed ? "line-through text-gray-400" : ""}>
                        {task.text}
                      </span>
                    </div>

                    <button onClick={() => deleteTask(task.id)}>
                      <Trash2 className="text-red-500" />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}