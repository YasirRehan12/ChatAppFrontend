import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Search, MoreVertical, X, Users } from "lucide-react";
import Avatar from "./Avatar";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { getChatDisplayName, getChatAvatar, getOtherUser, formatLastSeen } from "../utils/helpers";
import axiosInstance from "../utils/axiosInstance";

const ChatWindow = ({ onBack, onOpenGroupInfo }) => {
  const { user } = useAuth();
  const { activeChat, messages, sendMessage, editMessage, deleteMessage, reactToMessage, emitTyping, emitStopTyping, typingUsers } =
    useChat();
  const { isUserOnline } = useSocket();

  const [replyTo, setReplyTo] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!activeChat) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center bg-surface-subtle dark:bg-surface-dark">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-accent-100 dark:bg-accent-500/10 flex items-center justify-center mx-auto mb-4">
            <Users className="text-accent-500" size={32} />
          </div>
          <p className="text-gray-400 dark:text-gray-500">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  const displayName = getChatDisplayName(activeChat, user._id);
  const avatarUrl = getChatAvatar(activeChat, user._id);
  const otherUser = getOtherUser(activeChat, user._id);
  const online = otherUser ? isUserOnline(otherUser._id) : false;

  const chatTyping = typingUsers[activeChat._id] || {};
  const typingNames = Object.values(chatTyping);

  let subtitle = "";
  if (activeChat.isGroupChat) {
    subtitle = `${activeChat.users.length} members`;
  } else if (online) {
    subtitle = "Online";
  } else if (otherUser?.lastSeen) {
    subtitle = formatLastSeen(otherUser.lastSeen);
  }

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const { data } = await axiosInstance.get(`/messages/${activeChat._id}/search?q=${encodeURIComponent(q)}`);
      setSearchResults(data.messages);
    } catch {
      setSearchResults([]);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-subtle dark:bg-surface-dark">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-surface-darkPanel border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="md:hidden text-gray-500 dark:text-gray-300">
          <ArrowLeft size={22} />
        </button>

        <button
          onClick={() => activeChat.isGroupChat && onOpenGroupInfo()}
          className="flex items-center gap-3 flex-1 min-w-0 text-left"
        >
          <Avatar
            src={avatarUrl}
            name={displayName}
            isGroup={activeChat.isGroupChat}
            showStatus={!activeChat.isGroupChat}
            isOnline={online}
          />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{displayName}</p>
            <p className="text-xs text-gray-400 truncate">
              {typingNames.length > 0 ? (
                <span className="text-accent-500 font-medium">
                  {typingNames.join(", ")} {typingNames.length === 1 ? "is" : "are"} typing...
                </span>
              ) : (
                subtitle
              )}
            </p>
          </div>
        </button>

        <button
          onClick={() => setShowSearch(!showSearch)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark text-gray-500 dark:text-gray-300"
        >
          <Search size={19} />
        </button>
        {activeChat.isGroupChat && (
          <button
            onClick={onOpenGroupInfo}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark text-gray-500 dark:text-gray-300"
          >
            <MoreVertical size={19} />
          </button>
        )}
      </div>

      {/* Search overlay */}
      {showSearch && (
        <div className="bg-white dark:bg-surface-darkPanel border-b border-gray-100 dark:border-gray-800 p-3 animate-slide-up">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search in this chat..."
              className="w-full pl-9 pr-9 py-2 text-sm rounded-full bg-gray-100 dark:bg-surface-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <X size={16} />
            </button>
          </div>
          {searchQuery && (
            <div className="mt-2 max-h-48 overflow-y-auto scrollbar-thin">
              {searchResults.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-3">No messages found</p>
              ) : (
                searchResults.map((m) => (
                  <div key={m._id} className="px-2 py-2 border-b border-gray-50 dark:border-gray-800 text-sm">
                    <span className="font-medium text-accent-600">{m.sender.name}: </span>
                    <span className="text-gray-600 dark:text-gray-300">{m.content}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin py-4">
        {messages.map((msg, idx) => {
          const isOwn = msg.sender._id === user._id;
          const prevMsg = messages[idx - 1];
          const showSenderName =
            activeChat.isGroupChat && (!prevMsg || prevMsg.sender._id !== msg.sender._id);

          return (
            <div key={msg._id} onDoubleClick={() => setReplyTo(msg)}>
              <MessageBubble
                message={msg}
                isOwn={isOwn}
                showSenderName={showSenderName}
                onEdit={editMessage}
                onDelete={deleteMessage}
                onReact={reactToMessage}
              />
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSend={sendMessage}
        onTyping={emitTyping}
        onStopTyping={emitStopTyping}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
};

export default ChatWindow;
