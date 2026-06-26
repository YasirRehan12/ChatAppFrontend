import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket } = useSocket();

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({}); // chatId -> { userId: userName }
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const notificationSoundRef = useRef(null);
  const activeChatRef = useRef(null);
  activeChatRef.current = activeChat;

  useEffect(() => {
    // Lightweight notification sound, generated as a data URI (no external asset needed)
    notificationSoundRef.current = new Audio(
      "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
    );
  }, []);

  const playNotificationSound = useCallback(() => {
    if (notificationSoundRef.current) {
      notificationSoundRef.current.currentTime = 0;
      notificationSoundRef.current.play().catch(() => {});
    }
  }, []);

  const fetchChats = useCallback(async () => {
    setLoadingChats(true);
    try {
      const { data } = await axiosInstance.get("/chats");
      setChats(data.chats);
    } catch (error) {
      toast.error("Failed to load chats");
    } finally {
      setLoadingChats(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchChats();
  }, [user, fetchChats]);

  const openChat = useCallback(
    async (chat) => {
      setActiveChat(chat);
      setLoadingMessages(true);
      socket?.emit("join-chat", chat._id);
      try {
        const { data } = await axiosInstance.get(`/messages/${chat._id}`);
        setMessages(data.messages);
        await axiosInstance.put(`/chats/${chat._id}/read`);
        await axiosInstance.put(`/messages/${chat._id}/mark-read`);
        socket?.emit("message-read", { chatId: chat._id, userId: user._id });
        setChats((prev) =>
          prev.map((c) => (c._id === chat._id ? { ...c, unreadCount: 0 } : c))
        );
      } catch (error) {
        toast.error("Failed to load messages");
      } finally {
        setLoadingMessages(false);
      }
    },
    [socket, user]
  );

  const closeChat = useCallback(() => {
    if (activeChat) socket?.emit("leave-chat", activeChat._id);
    setActiveChat(null);
    setMessages([]);
  }, [activeChat, socket]);

  // Move chat with new activity to top of list & update latestMessage
  const bumpChatToTop = useCallback((chatId, latestMessage, incrementUnread) => {
    setChats((prev) => {
      const idx = prev.findIndex((c) => c._id === chatId);
      if (idx === -1) return prev;
      const updated = { ...prev[idx], latestMessage };
      if (incrementUnread) updated.unreadCount = (updated.unreadCount || 0) + 1;
      const rest = prev.filter((c) => c._id !== chatId);
      return [updated, ...rest];
    });
  }, []);

  // --- Socket event listeners ---
  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (message) => {
      const chatId = message.chat._id || message.chat;
      const isActive = activeChatRef.current?._id === chatId;

      if (isActive) {
        setMessages((prev) => [...prev, message]);
        axiosInstance.put(`/messages/${chatId}/mark-read`).catch(() => {});
      }

      bumpChatToTop(chatId, message, !isActive);

      if (message.sender._id !== user?._id) {
        playNotificationSound();
        if (!isActive) {
          toast(`${message.sender.name}: ${message.content || "📎 Sent media"}`, {
            icon: "💬",
          });
        }
      }
    };

    const handleTyping = ({ chatId, userId, userName }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [chatId]: { ...(prev[chatId] || {}), [userId]: userName },
      }));
    };

    const handleStopTyping = ({ chatId, userId }) => {
      setTypingUsers((prev) => {
        const chatTyping = { ...(prev[chatId] || {}) };
        delete chatTyping[userId];
        return { ...prev, [chatId]: chatTyping };
      });
    };

    const handleMessageEdited = (updatedMessage) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMessage._id ? updatedMessage : m))
      );
    };

    const handleMessageDeleted = ({ messageId, mode }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? mode === "everyone"
              ? { ...m, isDeletedForEveryone: true, content: "", media: {} }
              : m
            : m
        )
      );
    };

    const handleReaction = (updatedMessage) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMessage._id ? updatedMessage : m))
      );
    };

    const handleGroupUpdated = (updatedChat) => {
      setChats((prev) => prev.map((c) => (c._id === updatedChat._id ? updatedChat : c)));
      if (activeChatRef.current?._id === updatedChat._id) {
        setActiveChat(updatedChat);
      }
    };

    socket.on("message-received", handleMessageReceived);
    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);
    socket.on("message-edited-broadcast", handleMessageEdited);
    socket.on("message-deleted-broadcast", handleMessageDeleted);
    socket.on("message-reaction-broadcast", handleReaction);
    socket.on("group-updated-broadcast", handleGroupUpdated);

    return () => {
      socket.off("message-received", handleMessageReceived);
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
      socket.off("message-edited-broadcast", handleMessageEdited);
      socket.off("message-deleted-broadcast", handleMessageDeleted);
      socket.off("message-reaction-broadcast", handleReaction);
      socket.off("group-updated-broadcast", handleGroupUpdated);
    };
  }, [socket, user, bumpChatToTop, playNotificationSound]);

  const sendMessage = async ({ content, file, replyTo }) => {
    if (!activeChat) return;
    const formData = new FormData();
    formData.append("chatId", activeChat._id);
    if (content) formData.append("content", content);
    if (replyTo) formData.append("replyTo", replyTo);
    if (file) formData.append("media", file);

    const { data } = await axiosInstance.post("/messages", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setMessages((prev) => [...prev, data.message]);
    bumpChatToTop(activeChat._id, data.message, false);
    socket?.emit("new-message", data.message);
    return data.message;
  };

  const editMessage = async (messageId, content) => {
    const { data } = await axiosInstance.put(`/messages/${messageId}`, { content });
    setMessages((prev) => prev.map((m) => (m._id === messageId ? data.message : m)));
    socket?.emit("message-edited", { chatId: activeChat._id, message: data.message });
  };

  const deleteMessage = async (messageId, mode) => {
    await axiosInstance.delete(`/messages/${messageId}?mode=${mode}`);
    if (mode === "everyone") {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, isDeletedForEveryone: true, content: "", media: {} } : m
        )
      );
      socket?.emit("message-deleted", { chatId: activeChat._id, messageId, mode });
    } else {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    }
  };

  const reactToMessage = async (messageId, emoji) => {
    const { data } = await axiosInstance.post(`/messages/${messageId}/react`, { emoji });
    setMessages((prev) => prev.map((m) => (m._id === messageId ? data.message : m)));
    socket?.emit("message-reaction", { chatId: activeChat._id, message: data.message });
  };

  const emitTyping = useCallback(() => {
    if (!activeChat || !user) return;
    socket?.emit("typing", { chatId: activeChat._id, userId: user._id, userName: user.name });
  }, [activeChat, socket, user]);

  const emitStopTyping = useCallback(() => {
    if (!activeChat || !user) return;
    socket?.emit("stop-typing", { chatId: activeChat._id, userId: user._id });
  }, [activeChat, socket, user]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        activeChat,
        messages,
        loadingChats,
        loadingMessages,
        typingUsers,
        fetchChats,
        openChat,
        closeChat,
        sendMessage,
        editMessage,
        deleteMessage,
        reactToMessage,
        emitTyping,
        emitStopTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
