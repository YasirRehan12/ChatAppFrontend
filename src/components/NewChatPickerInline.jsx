import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import Avatar from "./Avatar";
import axiosInstance from "../utils/axiosInstance";

const NewChatPickerInline = ({ onSelect, excludeIds = [], onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const search = useCallback(async (q) => {
    try {
      const { data } = await axiosInstance.get(`/users/search?q=${encodeURIComponent(q)}`);
      setResults(data.users.filter((u) => !excludeIds.includes(u._id)));
    } catch {
      setResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => search(query), 300);
    return () => clearTimeout(timeout);
  }, [query, search]);

  return (
    <div className="bg-gray-50 dark:bg-surface-dark rounded-xl p-2">
      <div className="relative mb-2">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search to add..."
          className="w-full pl-8 pr-3 py-2 rounded-lg bg-white dark:bg-surface-darkPanel text-sm text-gray-900 dark:text-white focus:outline-none"
        />
      </div>
      <div className="max-h-40 overflow-y-auto scrollbar-thin">
        {results.map((u) => (
          <button
            key={u._id}
            onClick={() => onSelect(u)}
            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white dark:hover:bg-surface-darkPanel text-left"
          >
            <Avatar src={u.avatar?.url} name={u.name} size="sm" />
            <span className="text-sm text-gray-900 dark:text-white">{u.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NewChatPickerInline;
