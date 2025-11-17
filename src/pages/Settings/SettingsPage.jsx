import { useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

export default function SettingsPage() {
  const { userInfo } = useAuth();

  const [fullName, setFullName] = useState(userInfo.fullName);
  const [email, setEmail] = useState(userInfo.email);

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmNewPwd, setConfirmNewPwd] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const updateProfile = async () => {
    try {
      setLoadingProfile(true);
      await api.patch("/users/update-profile", { fullName, email });
      toast.success("Profile updated successfully ✨");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingProfile(false);
    }
  };

  const updatePassword = async () => {
    if (newPwd !== confirmNewPwd) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoadingPassword(true);

      await api.patch("/users/change-password", {
        oldPassword: currentPwd,
        newPassword: newPwd,
      });

      toast.success("Password updated successfully 🔐");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmNewPwd("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ===== FIXED HEADER ===== */}
      <div className="p-6 pb-3 sticky top-0 bg-white dark:bg-gray-900 z-20 shadow-sm">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
          Settings
        </h1>
      </div>

      {/* ===== CONTENT AREA (No scroll on page, internal section scroll optional) ===== */}
      <div className="flex-1 overflow-y-auto hide-scrollbar space-y-10 p-6">
        {/* ================= PROFILE SECTION ================= */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-1">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 outline-none"
                type="text"
              />
            </div>

            <div>
              <label className="block mb-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 outline-none"
                type="email"
              />
            </div>

            <button
              onClick={updateProfile}
              disabled={loadingProfile}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white w-fit transition"
            >
              {loadingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* ================= PASSWORD SECTION ================= */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-1">Current Password</label>
              <input
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 outline-none"
                type="password"
              />
            </div>

            <div>
              <label className="block mb-1">New Password</label>
              <input
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 outline-none"
                type="password"
              />
            </div>

            <div>
              <label className="block mb-1">Confirm New Password</label>
              <input
                value={confirmNewPwd}
                onChange={(e) => setConfirmNewPwd(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 outline-none"
                type="password"
              />
            </div>

            <button
              onClick={updatePassword}
              disabled={loadingPassword}
              className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white w-fit transition"
            >
              {loadingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
