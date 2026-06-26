import { useState, useRef, useCallback } from "react";
import { Send, Paperclip, Smile, Image as ImageIcon, X, FileText } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useTheme } from "../context/ThemeContext";

const TYPING_TIMEOUT = 2000;

const MessageInput = ({ onSend, onTyping, onStopTyping, replyTo, onCancelReply }) => {
  const { theme } = useTheme();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
    onTyping?.();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping?.();
    }, TYPING_TIMEOUT);
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    if (selected.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(selected));
    } else {
      setFilePreview("file");
    }
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = useCallback(async () => {
    if (!text.trim() && !file) return;
    setSending(true);
    try {
      await onSend({ content: text.trim(), file, replyTo: replyTo?._id });
      setText("");
      clearFile();
      onCancelReply?.();
      onStopTyping?.();
    } finally {
      setSending(false);
    }
  }, [text, file, replyTo, onSend, onCancelReply, onStopTyping]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-darkPanel p-3 sm:p-4">
      {replyTo && (
        <div className="flex items-center justify-between bg-gray-50 dark:bg-surface-dark rounded-lg px-3 py-2 mb-2 border-l-2 border-accent-500">
          <div className="min-w-0">
            <p className="text-xs font-medium text-accent-600">Replying to {replyTo.sender?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{replyTo.content}</p>
          </div>
          <button onClick={onCancelReply} className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2">
            <X size={16} />
          </button>
        </div>
      )}

      {file && (
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-surface-dark rounded-lg px-3 py-2 mb-2">
          {filePreview === "file" ? (
            <FileText size={24} className="text-accent-600" />
          ) : (
            <img src={filePreview} alt="preview" className="w-12 h-12 object-cover rounded" />
          )}
          <span className="text-sm text-gray-600 dark:text-gray-300 truncate flex-1">{file.name}</span>
          <button onClick={clearFile} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 relative">
        {showEmoji && (
          <div className="absolute bottom-14 left-0 z-30">
            <EmojiPicker onEmojiClick={onEmojiClick} theme={theme === "dark" ? "dark" : "light"} height={350} />
          </div>
        )}

        <button
          onClick={() => setShowEmoji(!showEmoji)}
          className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark text-gray-500 dark:text-gray-300 flex-shrink-0"
        >
          <Smile size={20} />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark text-gray-500 dark:text-gray-300 flex-shrink-0"
        >
          <Paperclip size={20} />
        </button>

        <textarea
          rows={1}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 resize-none max-h-32 px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-surface-dark text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
        />

        <button
          onClick={handleSend}
          disabled={sending || (!text.trim() && !file)}
          className="p-2.5 rounded-full bg-accent-500 hover:bg-accent-600 disabled:opacity-40 text-white flex-shrink-0 transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
