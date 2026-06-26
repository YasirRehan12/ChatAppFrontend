import { useState } from "react";
import { Search, MessageSquarePlus, Users, LogOut, Settings } from "lucide-react";
import Avatar from "./Avatar";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { useSocket } from "../context/SocketContext";
import {
  getChatDisplayName,
  getChatAvatar,
  getOtherUser,
  formatChatListTime,
} from "../utils/helpers";

const Sidebar = ({ onNewChat, onNewGroup, onOpenProfile }) => {
  const { user, logout } = useAuth();
  const { chats, activeChat, openChat, loadingChats } = useChat();
  const { isUserOnline } = useSocket();
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const filteredChats = chats.filter((chat) => {
    const name = getChatDisplayName(chat, user._id);
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="h-full flex flex-col bg-white dark:bg-surface-darkPanel border-r border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onOpenProfile} className="flex items-center gap-3 group">
          <Avatar src={user.avatar?.url} name={user.name} size="md" />
          <div className="text-left">
            <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-accent-600">
              {user.name}
            </p>
            <p className="text-xs text-gray-400">Online</p>
          </div>
        </button>

        <div className="flex items-center gap-1 relative">
          <button
            onClick={onNewGroup}
            title="New group"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark text-gray-500 dark:text-gray-300"
          >
            <Users size={19} />
          </button>
          <button
            onClick={onNewChat}
            title="New chat"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark text-gray-500 dark:text-gray-300"
          >
            <MessageSquarePlus size={19} />
          </button>
          <ThemeToggle compact />
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark text-gray-500 dark:text-gray-300"
          >
            <Settings size={19} />
          </button>

          {showMenu && (
            <div className="absolute top-12 right-0 w-44 bg-white dark:bg-surface-darkPanel border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg py-1 z-20 animate-slide-up">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenProfile();
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-surface-dark"
              >
                Edit profile
              </button>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-full bg-gray-100 dark:bg-surface-dark text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {loadingChats && (
          <div className="flex items-center justify-center py-10 text-gray-400 text-sm">Loading chats...</div>
        )}

        {!loadingChats && filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <MessageSquarePlus className="text-gray-300 dark:text-gray-700 mb-3" size={40} />
            <p className="text-gray-400 text-sm">No chats yet. Start a new conversation!</p>
          </div>
        )}

        {filteredChats.map((chat) => {
          const displayName = getChatDisplayName(chat, user._id);
          const avatarUrl = getChatAvatar(chat, user._id);
          const otherUser = getOtherUser(chat, user._id);
          const online = otherUser ? isUserOnline(otherUser._id) : false;
          const isActive = activeChat?._id === chat._id;
          const lastMsg = chat.latestMessage;

          let preview = "No messages yet";
          if (lastMsg) {
            if (lastMsg.isDeletedForEveryone) preview = "This message was deleted";
            else if (lastMsg.messageType === "image") preview = "📷 Photo";
            else if (lastMsg.messageType === "file") preview = "📎 File";
            else preview = lastMsg.content;
          }

          return (
            <button
              key={chat._id}
              onClick={() => openChat(chat)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition text-left ${
                isActive
                  ? "bg-accent-50 dark:bg-accent-500/10"
                  : "hover:bg-gray-50 dark:hover:bg-surface-dark"
              }`}
            >
              <Avatar
                src={avatarUrl}
                name={displayName}
                isGroup={chat.isGroupChat}
                showStatus={!chat.isGroupChat}
                isOnline={online}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{displayName}</p>
                  {lastMsg && (
                    <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">
                      {formatChatListTime(lastMsg.createdAt)}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate pr-2">{preview}</p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-accent-500 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 flex-shrink-0">
                      {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
