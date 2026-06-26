import { format, isToday, isYesterday } from "date-fns";

export const formatMessageTime = (date) => {
  return format(new Date(date), "h:mm a");
};

export const formatChatListTime = (date) => {
  const d = new Date(date);
  if (isToday(d)) return format(d, "h:mm a");
  if (isYesterday(d)) return "Yesterday";
  return format(d, "dd/MM/yyyy");
};

export const formatLastSeen = (date) => {
  const d = new Date(date);
  if (isToday(d)) return `last seen today at ${format(d, "h:mm a")}`;
  if (isYesterday(d)) return `last seen yesterday at ${format(d, "h:mm a")}`;
  return `last seen on ${format(d, "dd/MM/yyyy")}`;
};

export const getChatDisplayName = (chat, currentUserId) => {
  if (chat.isGroupChat) return chat.chatName;
  const otherUser = chat.users.find((u) => u._id !== currentUserId);
  return otherUser?.name || "Unknown User";
};

export const getChatAvatar = (chat, currentUserId) => {
  if (chat.isGroupChat) {
    return chat.groupAvatar?.url || null;
  }
  const otherUser = chat.users.find((u) => u._id !== currentUserId);
  return otherUser?.avatar?.url;
};

export const getOtherUser = (chat, currentUserId) => {
  if (chat.isGroupChat) return null;
  return chat.users.find((u) => u._id !== currentUserId);
};

export const formatFileSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};
