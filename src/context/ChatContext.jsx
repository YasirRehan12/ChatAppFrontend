// import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import { useSocket } from "./SocketContext";
// import { useAuth } from "./AuthContext";
// import toast from "react-hot-toast";

// const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//   const { user } = useAuth();
//   const { socket } = useSocket();

//   const [chats, setChats] = useState([]);
//   const [activeChat, setActiveChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [typingUsers, setTypingUsers] = useState({}); // chatId -> { userId: userName }
//   const [loadingChats, setLoadingChats] = useState(false);
//   const [loadingMessages, setLoadingMessages] = useState(false);

//   const notificationSoundRef = useRef(null);
//   const activeChatRef = useRef(null);
//   activeChatRef.current = activeChat;

//   useEffect(() => {
//     // Short two-tone notification "ding" (valid WAV, embedded as base64 - no external asset needed)
//     notificationSoundRef.current = new Audio(
//       "data:audio/wav;base64,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"
//     );
//     notificationSoundRef.current.volume = 0.5;
//   }, []);

//   const playNotificationSound = useCallback(() => {
//     if (notificationSoundRef.current) {
//       notificationSoundRef.current.currentTime = 0;
//       notificationSoundRef.current.play().catch((err) => {
//         // Browsers block autoplay until the user has interacted with the page at least once.
//         // This is expected on first load and is not a bug - it resolves after any click/tap.
//         console.warn("Notification sound blocked until user interacts with the page:", err.message);
//       });
//     }
//   }, []);

//   const fetchChats = useCallback(async () => {
//     setLoadingChats(true);
//     try {
//       const { data } = await axiosInstance.get("/chats");
//       setChats(data.chats);
//     } catch (error) {
//       toast.error("Failed to load chats");
//     } finally {
//       setLoadingChats(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (user) fetchChats();
//   }, [user, fetchChats]);

//   const openChat = useCallback(
//     async (chat) => {
//       setActiveChat(chat);
//       setLoadingMessages(true);
//       socket?.emit("join-chat", chat._id);
//       try {
//         const { data } = await axiosInstance.get(`/messages/${chat._id}`);
//         setMessages(data.messages);
//         await axiosInstance.put(`/chats/${chat._id}/read`);
//         await axiosInstance.put(`/messages/${chat._id}/mark-read`);
//         socket?.emit("message-read", { chatId: chat._id, userId: user._id });
//         setChats((prev) =>
//           prev.map((c) => (c._id === chat._id ? { ...c, unreadCount: 0 } : c))
//         );
//       } catch (error) {
//         toast.error("Failed to load messages");
//       } finally {
//         setLoadingMessages(false);
//       }
//     },
//     [socket, user]
//   );

//   const closeChat = useCallback(() => {
//     if (activeChat) socket?.emit("leave-chat", activeChat._id);
//     setActiveChat(null);
//     setMessages([]);
//   }, [activeChat, socket]);

//   // Move chat with new activity to top of list & update latestMessage
//   const bumpChatToTop = useCallback((chatId, latestMessage, incrementUnread) => {
//     setChats((prev) => {
//       const idx = prev.findIndex((c) => c._id === chatId);
//       if (idx === -1) return prev;
//       const updated = { ...prev[idx], latestMessage };
//       if (incrementUnread) updated.unreadCount = (updated.unreadCount || 0) + 1;
//       const rest = prev.filter((c) => c._id !== chatId);
//       return [updated, ...rest];
//     });
//   }, []);

//   // --- Socket event listeners ---
//   useEffect(() => {
//     if (!socket) return;

//     const handleMessageReceived = (message) => {
//       const chatId = message.chat._id || message.chat;
//       const isActive = activeChatRef.current?._id === chatId;

//       if (isActive) {
//         setMessages((prev) => [...prev, message]);
//         axiosInstance.put(`/messages/${chatId}/mark-read`).catch(() => {});
//       }

//       bumpChatToTop(chatId, message, !isActive);

//       if (message.sender._id !== user?._id) {
//         playNotificationSound();
//         if (!isActive) {
//           toast(`${message.sender.name}: ${message.content || "📎 Sent media"}`, {
//             icon: "💬",
//           });
//         }
//       }
//     };

//     const handleTyping = ({ chatId, userId, userName }) => {
//       setTypingUsers((prev) => ({
//         ...prev,
//         [chatId]: { ...(prev[chatId] || {}), [userId]: userName },
//       }));
//     };

//     const handleStopTyping = ({ chatId, userId }) => {
//       setTypingUsers((prev) => {
//         const chatTyping = { ...(prev[chatId] || {}) };
//         delete chatTyping[userId];
//         return { ...prev, [chatId]: chatTyping };
//       });
//     };

//     const handleMessageEdited = (updatedMessage) => {
//       setMessages((prev) =>
//         prev.map((m) => (m._id === updatedMessage._id ? updatedMessage : m))
//       );
//     };

//     const handleMessageDeleted = ({ messageId, mode }) => {
//       setMessages((prev) =>
//         prev.map((m) =>
//           m._id === messageId
//             ? mode === "everyone"
//               ? { ...m, isDeletedForEveryone: true, content: "", media: {} }
//               : m
//             : m
//         )
//       );
//     };

//     const handleReaction = (updatedMessage) => {
//       setMessages((prev) =>
//         prev.map((m) => (m._id === updatedMessage._id ? updatedMessage : m))
//       );
//     };

//     const handleGroupUpdated = (updatedChat) => {
//       setChats((prev) => prev.map((c) => (c._id === updatedChat._id ? updatedChat : c)));
//       if (activeChatRef.current?._id === updatedChat._id) {
//         setActiveChat(updatedChat);
//       }
//     };

//     // A new group was created and this user was added as a member -
//     // add it to their chat list immediately instead of waiting for a refresh.
//     const handleNewGroup = (newChat) => {
//       setChats((prev) => {
//         if (prev.some((c) => c._id === newChat._id)) return prev;
//         return [{ ...newChat, unreadCount: 0 }, ...prev];
//       });
//       toast(`You were added to "${newChat.chatName}"`, { icon: "👥" });
//     };

//     socket.on("message-received", handleMessageReceived);
//     socket.on("typing", handleTyping);
//     socket.on("stop-typing", handleStopTyping);
//     socket.on("message-edited-broadcast", handleMessageEdited);
//     socket.on("message-deleted-broadcast", handleMessageDeleted);
//     socket.on("message-reaction-broadcast", handleReaction);
//     socket.on("group-updated-broadcast", handleGroupUpdated);
//     socket.on("new-group-broadcast", handleNewGroup);

//     return () => {
//       socket.off("message-received", handleMessageReceived);
//       socket.off("typing", handleTyping);
//       socket.off("stop-typing", handleStopTyping);
//       socket.off("message-edited-broadcast", handleMessageEdited);
//       socket.off("message-deleted-broadcast", handleMessageDeleted);
//       socket.off("message-reaction-broadcast", handleReaction);
//       socket.off("group-updated-broadcast", handleGroupUpdated);
//       socket.off("new-group-broadcast", handleNewGroup);
//     };
//   }, [socket, user, bumpChatToTop, playNotificationSound]);

//   const sendMessage = async ({ content, file, replyTo }) => {
//     if (!activeChat) return;
//     const formData = new FormData();
//     formData.append("chatId", activeChat._id);
//     if (content) formData.append("content", content);
//     if (replyTo) formData.append("replyTo", replyTo);
//     if (file) formData.append("media", file);

//     const { data } = await axiosInstance.post("/messages", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     setMessages((prev) => [...prev, data.message]);
//     bumpChatToTop(activeChat._id, data.message, false);
//     socket?.emit("new-message", data.message);
//     return data.message;
//   };

//   const editMessage = async (messageId, content) => {
//     const { data } = await axiosInstance.put(`/messages/${messageId}`, { content });
//     setMessages((prev) => prev.map((m) => (m._id === messageId ? data.message : m)));
//     socket?.emit("message-edited", { chatId: activeChat._id, message: data.message });
//   };

//   const deleteMessage = async (messageId, mode) => {
//     await axiosInstance.delete(`/messages/${messageId}?mode=${mode}`);
//     if (mode === "everyone") {
//       setMessages((prev) =>
//         prev.map((m) =>
//           m._id === messageId ? { ...m, isDeletedForEveryone: true, content: "", media: {} } : m
//         )
//       );
//       socket?.emit("message-deleted", { chatId: activeChat._id, messageId, mode });
//     } else {
//       setMessages((prev) => prev.filter((m) => m._id !== messageId));
//     }
//   };

//   const reactToMessage = async (messageId, emoji) => {
//     const { data } = await axiosInstance.post(`/messages/${messageId}/react`, { emoji });
//     setMessages((prev) => prev.map((m) => (m._id === messageId ? data.message : m)));
//     socket?.emit("message-reaction", { chatId: activeChat._id, message: data.message });
//   };

//   const emitTyping = useCallback(() => {
//     if (!activeChat || !user) return;
//     socket?.emit("typing", { chatId: activeChat._id, userId: user._id, userName: user.name });
//   }, [activeChat, socket, user]);

//   const emitStopTyping = useCallback(() => {
//     if (!activeChat || !user) return;
//     socket?.emit("stop-typing", { chatId: activeChat._id, userId: user._id });
//   }, [activeChat, socket, user]);

//   return (
//     <ChatContext.Provider
//       value={{
//         chats,
//         setChats,
//         activeChat,
//         messages,
//         loadingChats,
//         loadingMessages,
//         typingUsers,
//         fetchChats,
//         openChat,
//         closeChat,
//         sendMessage,
//         editMessage,
//         deleteMessage,
//         reactToMessage,
//         emitTyping,
//         emitStopTyping,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => useContext(ChatContext);
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
    // Short two-tone notification "ding" (valid WAV, embedded as base64 - no external asset needed)
    notificationSoundRef.current = new Audio(
      "data:audio/wav;base64,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"
    );
    notificationSoundRef.current.volume = 0.5;
  }, []);

  const playNotificationSound = useCallback(() => {
    if (notificationSoundRef.current) {
      notificationSoundRef.current.currentTime = 0;
      notificationSoundRef.current.play().catch((err) => {
        // Browsers block autoplay until the user has interacted with the page at least once.
        // This is expected on first load and is not a bug - it resolves after any click/tap.
        console.warn("Notification sound blocked until user interacts with the page:", err.message);
      });
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

    // A new group was created and this user was added as a member -
    // add it to their chat list immediately instead of waiting for a refresh.
    const handleNewGroup = (newChat) => {
      setChats((prev) => {
        if (prev.some((c) => c._id === newChat._id)) return prev;
        return [{ ...newChat, unreadCount: 0 }, ...prev];
      });
      toast(`You were added to "${newChat.chatName}"`, { icon: "👥" });
    };

    // A group an admin deleted - remove it from this user's list, and close
    // it immediately if they happened to have it open.
    const handleGroupDeleted = ({ chatId }) => {
      setChats((prev) => prev.filter((c) => c._id !== chatId));
      if (activeChatRef.current?._id === chatId) {
        setActiveChat(null);
        setMessages([]);
        toast("This group was deleted by an admin", { icon: "🗑️" });
      }
    };

    socket.on("message-received", handleMessageReceived);
    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);
    socket.on("message-edited-broadcast", handleMessageEdited);
    socket.on("message-deleted-broadcast", handleMessageDeleted);
    socket.on("message-reaction-broadcast", handleReaction);
    socket.on("group-updated-broadcast", handleGroupUpdated);
    socket.on("new-group-broadcast", handleNewGroup);
    socket.on("group-deleted-broadcast", handleGroupDeleted);

    return () => {
      socket.off("message-received", handleMessageReceived);
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
      socket.off("message-edited-broadcast", handleMessageEdited);
      socket.off("message-deleted-broadcast", handleMessageDeleted);
      socket.off("message-reaction-broadcast", handleReaction);
      socket.off("group-updated-broadcast", handleGroupUpdated);
      socket.off("new-group-broadcast", handleNewGroup);
      socket.off("group-deleted-broadcast", handleGroupDeleted);
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
