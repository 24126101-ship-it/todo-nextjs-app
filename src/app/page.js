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

  // Load dữ liệu
  useEffect(() => {
    const saved = localStorage.getItem("todo-tasks");
    if (saved) setTasks(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  // Lưu dữ liệu
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("todo-tasks", JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  // Thêm task
  const addTask = (e) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      return toast.error("Nhập công việc đi bạn ơi!");
    }

    const newTask = {
      id: uuidv4(),
      text: inputValue,
      completed: false
    };

    setTasks([newTask, ...tasks]);
    setInputValue("");
    toast.success("Thêm thành công!");
  };

  // Hoàn thành task
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // Xóa task
  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    toast.success("Đã xóa!");
  };

  // Lọc
  const filteredTasks = tasks.filter((t) =>
    filter === "active"
      ? !t.completed
      : filter === "completed"
      ? t.completed
      : true
  );

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1518655048521-f130df041f66?q=80&w=2000')] bg-cover bg-center flex items-center justify-center p-4 sm:p-8 font-sans">

      {/* Overlay */}
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
            {tasks.filter((t) => t.completed).length} / {tasks.length} Hoàn thành
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={addTask} className="flex gap-2 sm:gap-3 mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Thêm công việc mới..."
            className="flex-1 px-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all text-gray-700"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 rounded-2xl transition-all shadow-lg flex items-center justify-center"
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
              className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                filter === f
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
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
              className="flex flex-col items-center justify-center py-12 text-gray-400"
            >
              <ClipboardList size={64} className="mb-4 text-gray-300" />
              <p className="text-lg">Không có công việc nào!</p>
            </motion.div>
          ) : (
            <ul className="space-y-3 pb-2">
              <AnimatePresence>
                {filteredTasks.map((task) => (
                  <motion.li
                    key={task.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl shadow-sm border transition-all ${
                      task.completed
                        ? "bg-gray-50 border-gray-100"
                        : "bg-white border-blue-50"
                    }`}
                  >
                    <div
                      className="flex items-center gap-4 cursor-pointer flex-1"
                      onClick={() => toggleComplete(task.id)}
                    >
                      {task.completed ? (
                        <CheckCircle2
                          className="text-green-500"
                          size={26}
                        />
                      ) : (
                        <Circle
                          className="text-gray-300"
                          size={26}
                        />
                      )}

                      <span
                        className={`flex-1 ${
                          task.completed
                            ? "line-through text-gray-400"
                            : "text-gray-700 font-medium"
                        }`}
                      >
                        {task.text}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400 hover:text-red-600 p-2.5 rounded-xl"
                    >
                      <Trash2 size={20} />
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
