import { useState, useRef } from "react";
import { X, Camera } from "lucide-react";
import Avatar from "./Avatar";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const ProfileModal = ({ onClose }) => {
  const { user, updateUserInContext } = useAuth();
  const [name, setName] = useState(user.name);
  const [about, setAbout] = useState(user.about || "");
  const [avatarPreview, setAvatarPreview] = useState(user.avatar?.url);
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("about", about);
      if (avatarFile) formData.append("avatar", avatarFile);

      const { data } = await axiosInstance.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUserInContext(data.user);
      toast.success("Profile updated");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-surface-darkPanel rounded-2xl w-full max-w-sm shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="relative">
            <Avatar src={avatarPreview} name={name} size="xl" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-accent-500 text-white p-1.5 rounded-full shadow"
            >
              <Camera size={14} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="w-full mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-surface-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">About</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={2}
                maxLength={150}
                className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-surface-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-6 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white font-medium"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
