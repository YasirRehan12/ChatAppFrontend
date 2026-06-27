import { useState, useEffect, useCallback, useRef } from "react";
import { X, Search, Check, Users, Camera } from "lucide-react";
import Avatar from "./Avatar";
import axiosInstance from "../utils/axiosInstance";
import { useChat } from "../context/ChatContext";
import { useSocket } from "../context/SocketContext";
import toast from "react-hot-toast";

const NewGroupModal = ({ onClose }) => {
  const { openChat, fetchChats } = useChat();
  const { socket } = useSocket();
  const [step, setStep] = useState(1); // 1: select members, 2: name group + photo
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const fileInputRef = useRef(null);

  const search = useCallback(async (q) => {
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

  const toggleUser = (u) => {
    setSelected((prev) =>
      prev.some((s) => s._id === u._id) ? prev.filter((s) => s._id !== u._id) : [...prev, u]
    );
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selected.length < 2) {
      toast.error("Group name and at least 2 members required");
      return;
    }
    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("name", groupName.trim());
      formData.append("userIds", JSON.stringify(selected.map((u) => u._id)));
      if (avatarFile) formData.append("groupAvatar", avatarFile);

      const { data } = await axiosInstance.post("/chats/group", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchChats();
      openChat(data.chat);
      onClose();
      toast.success("Group created!");

      // Notify the other members in real-time so the group appears
      // on their side instantly, without needing a page refresh.
      socket?.emit("new-group", { chat: data.chat });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-surface-darkPanel rounded-2xl w-full max-w-md shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Users size={18} /> {step === 1 ? "Add Members" : "Name Your Group"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {step === 1 && (
          <div className="p-4">
            {selected.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selected.map((u) => (
                  <span
                    key={u._id}
                    className="flex items-center gap-1.5 bg-accent-50 dark:bg-accent-500/10 text-accent-600 text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    {u.name}
                    <button onClick={() => toggleUser(u)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search people to add..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-surface-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
              />
            </div>

            <div className="max-h-64 overflow-y-auto scrollbar-thin">
              {loading && <p className="text-center text-sm text-gray-400 py-4">Searching...</p>}
              {results.map((u) => {
                const isSelected = selected.some((s) => s._id === u._id);
                return (
                  <button
                    key={u._id}
                    onClick={() => toggleUser(u)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-surface-dark text-left"
                  >
                    <Avatar src={u.avatar?.url} name={u.name} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email || u.phone}</p>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              disabled={selected.length < 2}
              onClick={() => setStep(2)}
              className="w-full mt-4 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 disabled:opacity-40 text-white font-medium"
            >
              Next ({selected.length} selected)
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="p-4">
            <div className="flex flex-col items-center mb-5">
              <div className="relative">
                <Avatar src={avatarPreview} name={groupName || "Group"} isGroup size="xl" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-accent-500 text-white p-1.5 rounded-full shadow"
                  title="Add group photo"
                >
                  <Camera size={14} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">Tap the camera to add a group photo (optional)</p>
            </div>

            <input
              autoFocus
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-surface-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm mb-4"
            />
            <p className="text-xs text-gray-400 mb-4">{selected.length} members selected</p>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium"
              >
                Back
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white font-medium"
              >
                {creating ? "Creating..." : "Create Group"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewGroupModal;
