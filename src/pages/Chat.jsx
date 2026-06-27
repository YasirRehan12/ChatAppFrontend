// import { useState } from "react";
// import Sidebar from "../components/Sidebar";
// import ChatWindow from "../components/ChatWindow";
// import NewChatModal from "../components/NewChatModal";
// import NewGroupModal from "../components/NewGroupModal";
// import GroupInfoModal from "../components/GroupInfoModal";
// import ProfileModal from "../components/ProfileModal";
// import { useChat } from "../context/ChatContext";

// const Chat = () => {
//   const { activeChat, closeChat } = useChat();
//   const [showNewChat, setShowNewChat] = useState(false);
//   const [showNewGroup, setShowNewGroup] = useState(false);
//   const [showGroupInfo, setShowGroupInfo] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);

//   return (
//     <div className="h-screen w-full flex overflow-hidden bg-surface-subtle dark:bg-surface-dark">
//       {/* Sidebar: full width on mobile when no chat open, fixed width on desktop */}
//       <div className={`w-full md:w-[380px] flex-shrink-0 ${activeChat ? "hidden md:block" : "block"}`}>
//         <Sidebar
//           onNewChat={() => setShowNewChat(true)}
//           onNewGroup={() => setShowNewGroup(true)}
//           onOpenProfile={() => setShowProfile(true)}
//         />
//       </div>

//       {/* Chat window: hidden on mobile until a chat is selected */}
//       <div className={`flex-1 ${activeChat ? "block" : "hidden md:block"}`}>
//         <ChatWindow onBack={closeChat} onOpenGroupInfo={() => setShowGroupInfo(true)} />
//       </div>

//       {showNewChat && <NewChatModal onClose={() => setShowNewChat(false)} />}
//       {showNewGroup && <NewGroupModal onClose={() => setShowNewGroup(false)} />}
//       {showGroupInfo && activeChat?.isGroupChat && (
//         <GroupInfoModal chat={activeChat} onClose={() => setShowGroupInfo(false)} />
//       )}
//       {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
//     </div>
//   );
// };

// export default Chat;
import { useState, useEffect, useRef } from "react";
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
  const chatWasOpenRef = useRef(false);

  // Push an in-app history entry whenever a chat opens, so the phone's
  // hardware/browser back button closes the chat first instead of
  // immediately exiting the website.
  useEffect(() => {
    if (activeChat && !chatWasOpenRef.current) {
      window.history.pushState({ chatOpen: true }, "");
      chatWasOpenRef.current = true;
    } else if (!activeChat) {
      chatWasOpenRef.current = false;
    }
  }, [activeChat]);

  // Intercept the back navigation: if a chat is open, close it in-app
  // instead of letting the browser actually navigate away/exit.
  useEffect(() => {
    const handlePopState = () => {
      if (activeChat) {
        closeChat();
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeChat, closeChat]);

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
        <ChatWindow onOpenGroupInfo={() => setShowGroupInfo(true)} />
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
