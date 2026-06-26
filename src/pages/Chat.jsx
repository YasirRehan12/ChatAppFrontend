import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import NewChatModal from "../components/NewChatModal";
import NewGroupModal from "../components/NewGroupModal";
import GroupInfoModal from "../components/GroupInfoModal";
import ProfileModal from "../components/ProfileModal";
import { useChat } from "../context/ChatContext";

const Chat = () => {
  const { activeChat, closeChat } = useChat();
  const [showNewChat, setShowNewChat] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="h-screen w-full flex overflow-hidden bg-surface-subtle dark:bg-surface-dark">
      {/* Sidebar: full width on mobile when no chat open, fixed width on desktop */}
      <div className={`w-full md:w-[380px] flex-shrink-0 ${activeChat ? "hidden md:block" : "block"}`}>
        <Sidebar
          onNewChat={() => setShowNewChat(true)}
          onNewGroup={() => setShowNewGroup(true)}
          onOpenProfile={() => setShowProfile(true)}
        />
      </div>

      {/* Chat window: hidden on mobile until a chat is selected */}
      <div className={`flex-1 ${activeChat ? "block" : "hidden md:block"}`}>
        <ChatWindow onBack={closeChat} onOpenGroupInfo={() => setShowGroupInfo(true)} />
      </div>

      {showNewChat && <NewChatModal onClose={() => setShowNewChat(false)} />}
      {showNewGroup && <NewGroupModal onClose={() => setShowNewGroup(false)} />}
      {showGroupInfo && activeChat?.isGroupChat && (
        <GroupInfoModal chat={activeChat} onClose={() => setShowGroupInfo(false)} />
      )}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
};

export default Chat;
