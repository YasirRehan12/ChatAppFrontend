import { useState, useEffect, useCallback } from "react";
import { X, Search } from "lucide-react";
import Avatar from "./Avatar";
import axiosInstance from "../utils/axiosInstance";
import { useChat } from "../context/ChatContext";
import toast from "react-hot-toast";

const NewChatModal = ({ onClose }) => {
  const { openChat, fetchChats } = useChat();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/users/search?q=${encodeURIComponent(q)}`);
      setResults(data.users);
    } catch {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => search(query), 300);
    return () => clearTimeout(timeout);
  }, [query, search]);

  const handleSelectUser = async (selectedUser) => {
    try {
      const { data } = await axiosInstance.post("/chats", { userId: selectedUser._id });
      await fetchChats();
      openChat(data.chat);
      onClose();
    } catch {
      toast.error("Failed to start chat");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-surface-darkPanel rounded-2xl w-full max-w-md shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">New Chat</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-surface-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
            />
          </div>

          <div className="max-h-72 overflow-y-auto scrollbar-thin">
            {loading && <p className="text-center text-sm text-gray-400 py-4">Searching...</p>}
            {!loading && query && results.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-4">No users found</p>
            )}
            {results.map((u) => (
              <button
                key={u._id}
                onClick={() => handleSelectUser(u)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-surface-dark text-left"
              >
                <Avatar src={u.avatar?.url} name={u.name} size="sm" showStatus isOnline={u.isOnline} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email || u.phone}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
