import { useState, useRef, useEffect } from "react";
import { Check, CheckCheck, MoreVertical, Smile, Pencil, Trash2, FileText, Download } from "lucide-react";
import { formatMessageTime, formatFileSize } from "../utils/helpers";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const MessageBubble = ({ message, isOwn, onEdit, onDelete, onReact, showSenderName }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
        setShowReactions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (message.isDeletedForEveryone) {
    return (
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-1.5 px-2`}>
        <div className="max-w-[75%] sm:max-w-[60%] px-3.5 py-2 rounded-2xl bg-gray-100 dark:bg-surface-darkPanel text-gray-400 dark:text-gray-500 text-sm italic flex items-center gap-1.5">
          <Trash2 size={13} /> This message was deleted
        </div>
      </div>
    );
  }

  const handleEditSubmit = () => {
    if (editText.trim() && editText !== message.content) {
      onEdit(message._id, editText.trim());
    }
    setEditing(false);
  };

  const groupedReactions = message.reactions?.reduce((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-1.5 px-2 group`}>
      <div className={`flex items-end gap-1.5 max-w-[80%] sm:max-w-[65%] ${isOwn ? "flex-row-reverse" : ""}`}>
        {/* Hover actions */}
        <div
          className={`flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${
            isOwn ? "order-first" : "order-last"
          }`}
          ref={menuRef}
        >
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-surface-darkPanel text-gray-400"
            >
              <Smile size={14} />
            </button>
            {showReactions && (
              <div
                className={`absolute bottom-8 ${
                  isOwn ? "right-0" : "left-0"
                } bg-white dark:bg-surface-darkPanel shadow-lg rounded-full px-2 py-1.5 flex gap-1 border border-gray-100 dark:border-gray-700 z-10 animate-pop-in`}
              >
                {QUICK_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onReact(message._id, emoji);
                      setShowReactions(false);
                    }}
                    className="hover:scale-125 transition-transform text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isOwn && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-surface-darkPanel text-gray-400"
              >
                <MoreVertical size={14} />
              </button>
              {showMenu && (
                <div
                  className={`absolute bottom-8 ${
                    isOwn ? "right-0" : "left-0"
                  } bg-white dark:bg-surface-darkPanel shadow-lg rounded-xl py-1 w-44 border border-gray-100 dark:border-gray-700 z-10 animate-pop-in`}
                >
                  {message.messageType === "text" && (
                    <button
                      onClick={() => {
                        setEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-surface-dark flex items-center gap-2"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onDelete(message._id, "me");
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-surface-dark"
                  >
                    Delete for me
                  </button>
                  <button
                    onClick={() => {
                      onDelete(message._id, "everyone");
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    Delete for everyone
                  </button>
                </div>
              )}
            </div>
          )}

          {!isOwn && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-surface-darkPanel text-gray-400"
              >
                <MoreVertical size={14} />
              </button>
              {showMenu && (
                <div className="absolute bottom-8 left-0 bg-white dark:bg-surface-darkPanel shadow-lg rounded-xl py-1 w-40 border border-gray-100 dark:border-gray-700 z-10 animate-pop-in">
                  <button
                    onClick={() => {
                      onDelete(message._id, "me");
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-surface-dark"
                  >
                    Delete for me
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bubble */}
        <div>
          {showSenderName && !isOwn && (
            <p className="text-xs font-medium text-accent-600 mb-0.5 ml-1">{message.sender.name}</p>
          )}

          <div
            className={`px-3.5 py-2 rounded-2xl shadow-bubble ${
              isOwn
                ? "bg-accent-500 text-white rounded-br-md"
                : "bg-white dark:bg-surface-darkPanel text-gray-900 dark:text-gray-100 rounded-bl-md border border-gray-100 dark:border-gray-700"
            }`}
          >
            {message.replyTo && (
              <div
                className={`mb-1.5 px-2 py-1 rounded-lg border-l-2 text-xs ${
                  isOwn
                    ? "bg-white/15 border-white/50 text-white/90"
                    : "bg-gray-100 dark:bg-surface-dark border-accent-500 text-gray-500 dark:text-gray-400"
                }`}
              >
                <p className="font-medium">{message.replyTo.sender?.name}</p>
                <p className="truncate">{message.replyTo.content}</p>
              </div>
            )}

            {message.messageType === "image" && message.media?.url && (
              <img
                src={message.media.url}
                alt="shared"
                className="rounded-lg max-w-[240px] sm:max-w-[280px] mb-1 cursor-pointer"
                onClick={() => window.open(message.media.url, "_blank")}
              />
            )}

            {message.messageType === "file" && message.media?.url && (
              <a
                href={message.media.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 p-2 rounded-lg mb-1 ${
                  isOwn ? "bg-white/15" : "bg-gray-100 dark:bg-surface-dark"
                }`}
              >
                <FileText size={28} className={isOwn ? "text-white" : "text-accent-600"} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{message.media.fileName}</p>
                  <p className={`text-xs ${isOwn ? "text-white/70" : "text-gray-400"}`}>
                    {formatFileSize(message.media.fileSize)}
                  </p>
                </div>
                <Download size={16} className={isOwn ? "text-white/80" : "text-gray-400"} />
              </a>
            )}

            {editing ? (
              <div className="flex flex-col gap-1.5">
                <input
                  autoFocus
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEditSubmit()}
                  className="bg-white/20 rounded px-2 py-1 text-sm focus:outline-none w-full text-white placeholder:text-white/70"
                />
                <div className="flex gap-2 text-xs">
                  <button onClick={handleEditSubmit} className="font-medium underline">
                    Save
                  </button>
                  <button onClick={() => setEditing(false)} className="opacity-80">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              message.content && <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
            )}

            <div
              className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"} ${
                isOwn ? "text-white/70" : "text-gray-400"
              }`}
            >
              {message.isEdited && <span className="text-[10px]">edited</span>}
              <span className="text-[10px]">{formatMessageTime(message.createdAt)}</span>
              {isOwn && (
                <span>
                  {message.readBy?.length > 1 ? (
                    <CheckCheck size={13} className="text-blue-300" />
                  ) : message.deliveredTo?.length > 1 ? (
                    <CheckCheck size={13} />
                  ) : (
                    <Check size={13} />
                  )}
                </span>
              )}
            </div>
          </div>

          {groupedReactions && Object.keys(groupedReactions).length > 0 && (
            <div className={`flex gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
              {Object.entries(groupedReactions).map(([emoji, count]) => (
                <span
                  key={emoji}
                  className="bg-white dark:bg-surface-darkPanel border border-gray-200 dark:border-gray-700 rounded-full px-1.5 py-0.5 text-xs flex items-center gap-0.5 shadow-sm"
                >
                  {emoji} {count > 1 && <span className="text-gray-400 text-[10px]">{count}</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
