// import { useState, useRef } from "react";
// import { X, Crown, UserMinus, UserPlus, LogOut, Shield, Camera } from "lucide-react";
// import Avatar from "./Avatar";
// import axiosInstance from "../utils/axiosInstance";
// import { useAuth } from "../context/AuthContext";
// import { useChat } from "../context/ChatContext";
// import { useSocket } from "../context/SocketContext";
// import toast from "react-hot-toast";
// import NewChatPickerInline from "./NewChatPickerInline";

// const GroupInfoModal = ({ chat, onClose }) => {
//   const { user } = useAuth();
//   const { setChats, closeChat, fetchChats } = useChat();
//   const { socket } = useSocket();
//   const [showAddMember, setShowAddMember] = useState(false);
//   const [currentChat, setCurrentChat] = useState(chat);
//   const [uploadingAvatar, setUploadingAvatar] = useState(false);
//   const avatarInputRef = useRef(null);

//   const isAdmin = currentChat.admins?.some((a) => a._id === user._id);

//   const updateChatEverywhere = (updatedChat) => {
//     setCurrentChat(updatedChat);
//     setChats((prev) => prev.map((c) => (c._id === updatedChat._id ? updatedChat : c)));
//     socket?.emit("group-updated", { chatId: updatedChat._id, chat: updatedChat });
//   };

//   const handleAvatarChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploadingAvatar(true);
//     try {
//       const formData = new FormData();
//       formData.append("groupAvatar", file);

//       const { data } = await axiosInstance.put(`/chats/group/${currentChat._id}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       updateChatEverywhere(data.chat);
//       toast.success("Group photo updated");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to update group photo");
//     } finally {
//       setUploadingAvatar(false);
//       if (avatarInputRef.current) avatarInputRef.current.value = "";
//     }
//   };

//   const handleMakeAdmin = async (userId) => {
//     try {
//       const { data } = await axiosInstance.put(`/chats/group/${currentChat._id}/make-admin`, { userId });
//       updateChatEverywhere(data.chat);
//       toast.success("Promoted to admin");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to promote");
//     }
//   };

//   const handleRemoveAdmin = async (userId) => {
//     try {
//       const { data } = await axiosInstance.put(`/chats/group/${currentChat._id}/remove-admin`, { userId });
//       updateChatEverywhere(data.chat);
//       toast.success("Admin rights removed");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to demote");
//     }
//   };

//   const handleRemoveMember = async (userId) => {
//     try {
//       const { data } = await axiosInstance.put(`/chats/group/${currentChat._id}/remove`, { userId });
//       updateChatEverywhere(data.chat);
//       toast.success("Member removed");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to remove member");
//     }
//   };

//   const handleLeaveGroup = async () => {
//     try {
//       await axiosInstance.put(`/chats/group/${currentChat._id}/remove`, { userId: user._id });
//       toast.success("You left the group");
//       await fetchChats();
//       closeChat();
//       onClose();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to leave group");
//     }
//   };

//   const handleAddMember = async (selectedUser) => {
//     try {
//       const { data } = await axiosInstance.put(`/chats/group/${currentChat._id}/add`, {
//         userId: selectedUser._id,
//       });
//       updateChatEverywhere(data.chat);
//       setShowAddMember(false);
//       toast.success(`${selectedUser.name} added to group`);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to add member");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
//       <div
//         className="bg-white dark:bg-surface-darkPanel rounded-2xl w-full max-w-md shadow-2xl animate-slide-up max-h-[85vh] flex flex-col"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
//           <h2 className="font-semibold text-gray-900 dark:text-white">Group Info</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <X size={20} />
//           </button>
//         </div>

//         <div className="flex flex-col items-center py-6 border-b border-gray-100 dark:border-gray-800">
//           <div className="relative">
//             <Avatar src={currentChat.groupAvatar?.url} name={currentChat.chatName} isGroup size="xl" />
//             {isAdmin && (
//               <button
//                 onClick={() => avatarInputRef.current?.click()}
//                 disabled={uploadingAvatar}
//                 className="absolute bottom-0 right-0 bg-accent-500 text-white p-1.5 rounded-full shadow disabled:opacity-60"
//                 title="Change group photo"
//               >
//                 <Camera size={14} />
//               </button>
//             )}
//             <input
//               type="file"
//               ref={avatarInputRef}
//               onChange={handleAvatarChange}
//               accept="image/*"
//               className="hidden"
//             />
//           </div>
//           <h3 className="font-semibold text-lg text-gray-900 dark:text-white mt-3">{currentChat.chatName}</h3>
//           <p className="text-sm text-gray-400">{currentChat.users.length} members</p>
//         </div>

//         <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
//           <div className="flex items-center justify-between mb-3">
//             <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Members</p>
//             {isAdmin && (
//               <button
//                 onClick={() => setShowAddMember(true)}
//                 className="text-xs text-accent-600 font-medium flex items-center gap-1"
//               >
//                 <UserPlus size={14} /> Add
//               </button>
//             )}
//           </div>

//           {showAddMember && (
//             <div className="mb-3">
//               <NewChatPickerInline
//                 onSelect={handleAddMember}
//                 excludeIds={currentChat.users.map((u) => u._id)}
//                 onClose={() => setShowAddMember(false)}
//               />
//             </div>
//           )}

//           {currentChat.users.map((member) => {
//             const memberIsAdmin = currentChat.admins?.some((a) => a._id === member._id);
//             const isSelf = member._id === user._id;

//             return (
//               <div key={member._id} className="flex items-center gap-3 py-2.5">
//                 <Avatar src={member.avatar?.url} name={member.name} size="sm" />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
//                     {member.name} {isSelf && <span className="text-gray-400">(You)</span>}
//                   </p>
//                   {memberIsAdmin && (
//                     <p className="text-xs text-accent-600 flex items-center gap-1">
//                       <Crown size={11} /> Admin
//                     </p>
//                   )}
//                 </div>

//                 {isAdmin && !isSelf && (
//                   <div className="flex items-center gap-1">
//                     {memberIsAdmin ? (
//                       <button
//                         onClick={() => handleRemoveAdmin(member._id)}
//                         title="Remove admin"
//                         className="p-1.5 text-gray-400 hover:text-amber-500"
//                       >
//                         <Shield size={15} />
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => handleMakeAdmin(member._id)}
//                         title="Make admin"
//                         className="p-1.5 text-gray-400 hover:text-accent-600"
//                       >
//                         <Crown size={15} />
//                       </button>
//                     )}
//                     <button
//                       onClick={() => handleRemoveMember(member._id)}
//                       title="Remove from group"
//                       className="p-1.5 text-gray-400 hover:text-red-500"
//                     >
//                       <UserMinus size={15} />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         <div className="p-4 border-t border-gray-100 dark:border-gray-800">
//           <button
//             onClick={handleLeaveGroup}
//             className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium text-sm"
//           >
//             <LogOut size={16} /> Leave Group
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GroupInfoModal;



import { useState, useRef } from "react";
import { X, Crown, UserMinus, UserPlus, LogOut, Shield, Camera, Trash2, AlertTriangle } from "lucide-react";
import Avatar from "./Avatar";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { useSocket } from "../context/SocketContext";
import toast from "react-hot-toast";
import NewChatPickerInline from "./NewChatPickerInline";

const GroupInfoModal = ({ chat, onClose }) => {
  const { user } = useAuth();
  const { setChats, closeChat, fetchChats } = useChat();
  const { socket } = useSocket();
  const [showAddMember, setShowAddMember] = useState(false);
  const [currentChat, setCurrentChat] = useState(chat);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const avatarInputRef = useRef(null);

  const isAdmin = currentChat.admins?.some((a) => a._id === user._id);

  const updateChatEverywhere = (updatedChat) => {
    setCurrentChat(updatedChat);
    setChats((prev) => prev.map((c) => (c._id === updatedChat._id ? updatedChat : c)));
    socket?.emit("group-updated", { chatId: updatedChat._id, chat: updatedChat });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("groupAvatar", file);

      const { data } = await axiosInstance.put(`/chats/group/${currentChat._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateChatEverywhere(data.chat);
      toast.success("Group photo updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update group photo");
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      const { data } = await axiosInstance.put(`/chats/group/${currentChat._id}/make-admin`, { userId });
      updateChatEverywhere(data.chat);
      toast.success("Promoted to admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to promote");
    }
  };

  const handleRemoveAdmin = async (userId) => {
    try {
      const { data } = await axiosInstance.put(`/chats/group/${currentChat._id}/remove-admin`, { userId });
      updateChatEverywhere(data.chat);
      toast.success("Admin rights removed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to demote");
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const { data } = await axiosInstance.put(`/chats/group/${currentChat._id}/remove`, { userId });
      updateChatEverywhere(data.chat);
      toast.success("Member removed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove member");
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await axiosInstance.put(`/chats/group/${currentChat._id}/remove`, { userId: user._id });
      toast.success("You left the group");
      await fetchChats();
      closeChat();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to leave group");
    }
  };

  const handleDeleteGroup = async () => {
    setDeleting(true);
    try {
      const { data } = await axiosInstance.delete(`/chats/group/${currentChat._id}`);
      socket?.emit("group-deleted", { chatId: currentChat._id, memberIds: data.memberIds });
      toast.success("Group deleted");
      await fetchChats();
      closeChat();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete group");
      setConfirmingDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleAddMember = async (selectedUser) => {
    try {
      const { data } = await axiosInstance.put(`/chats/group/${currentChat._id}/add`, {
        userId: selectedUser._id,
      });
      updateChatEverywhere(data.chat);
      setShowAddMember(false);
      toast.success(`${selectedUser.name} added to group`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-surface-darkPanel rounded-2xl w-full max-w-md shadow-2xl animate-slide-up max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">Group Info</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center py-6 border-b border-gray-100 dark:border-gray-800">
          <div className="relative">
            <Avatar src={currentChat.groupAvatar?.url} name={currentChat.chatName} isGroup size="xl" />
            {isAdmin && (
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute bottom-0 right-0 bg-accent-500 text-white p-1.5 rounded-full shadow disabled:opacity-60"
                title="Change group photo"
              >
                <Camera size={14} />
              </button>
            )}
            <input
              type="file"
              ref={avatarInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mt-3">{currentChat.chatName}</h3>
          <p className="text-sm text-gray-400">{currentChat.users.length} members</p>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Members</p>
            {isAdmin && (
              <button
                onClick={() => setShowAddMember(true)}
                className="text-xs text-accent-600 font-medium flex items-center gap-1"
              >
                <UserPlus size={14} /> Add
              </button>
            )}
          </div>

          {showAddMember && (
            <div className="mb-3">
              <NewChatPickerInline
                onSelect={handleAddMember}
                excludeIds={currentChat.users.map((u) => u._id)}
                onClose={() => setShowAddMember(false)}
              />
            </div>
          )}

          {currentChat.users.map((member) => {
            const memberIsAdmin = currentChat.admins?.some((a) => a._id === member._id);
            const isSelf = member._id === user._id;

            return (
              <div key={member._id} className="flex items-center gap-3 py-2.5">
                <Avatar src={member.avatar?.url} name={member.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {member.name} {isSelf && <span className="text-gray-400">(You)</span>}
                  </p>
                  {memberIsAdmin && (
                    <p className="text-xs text-accent-600 flex items-center gap-1">
                      <Crown size={11} /> Admin
                    </p>
                  )}
                </div>

                {isAdmin && !isSelf && (
                  <div className="flex items-center gap-1">
                    {memberIsAdmin ? (
                      <button
                        onClick={() => handleRemoveAdmin(member._id)}
                        title="Remove admin"
                        className="p-1.5 text-gray-400 hover:text-amber-500"
                      >
                        <Shield size={15} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMakeAdmin(member._id)}
                        title="Make admin"
                        className="p-1.5 text-gray-400 hover:text-accent-600"
                      >
                        <Crown size={15} />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      title="Remove from group"
                      className="p-1.5 text-gray-400 hover:text-red-500"
                    >
                      <UserMinus size={15} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <button
            onClick={handleLeaveGroup}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium text-sm"
          >
            <LogOut size={16} /> Leave Group
          </button>

          {isAdmin && !confirmingDelete && (
            <button
              onClick={() => setConfirmingDelete(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 font-semibold text-sm"
            >
              <Trash2 size={16} /> Delete Group
            </button>
          )}

          {isAdmin && confirmingDelete && (
            <div className="bg-red-50 dark:bg-red-500/10 rounded-xl p-3 animate-slide-up">
              <p className="text-xs text-red-600 dark:text-red-400 flex items-start gap-1.5 mb-3">
                <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                This permanently deletes the group and all its messages for everyone. This can't be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmingDelete(false)}
                  disabled={deleting}
                  className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteGroup}
                  disabled={deleting}
                  className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium"
                >
                  {deleting ? "Deleting..." : "Yes, delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupInfoModal;
