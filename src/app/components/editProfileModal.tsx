import React, { useState } from "react";
import { ModalProps } from "../type/type";
import { useUser } from "@clerk/nextjs";

export default function EditProfileModal({
  isOpen,
  onClose,
  currentView,
  setCurrentView,
  onSaveSuccess,
}: ModalProps & { onSaveSuccess?: () => void }) {
  const { user } = useUser();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setError(null);
      if (!user) throw new Error("User not authenticated.");

      if (currentView === "editUsername") {
        await user.update({ username: inputValue });
      } else if (currentView === "editPassword") {
        await user.updatePassword({ newPassword: inputValue });
      }

      setCurrentView("options");
      onClose();
      if (onSaveSuccess) onSaveSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        const clerkError = err as { errors?: { message: string }[] };
        setError(clerkError.errors?.[0]?.message || err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        {currentView === "options" && (
          <>
            <h2 className="text-lg font-bold mb-4 text-black">Edit Profile</h2>
            <div className="space-y-4">
              <button
                className="w-full px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setCurrentView("editUsername")}>
                Edit Username
              </button>
              <button
                className="w-full px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => setCurrentView("editPassword")}>
                Edit Password
              </button>
            </div>
          </>
        )}
        {(currentView === "editUsername" || currentView === "editPassword") && (
          <>
            <h2 className="text-lg font-bold mb-4 text-black">
              {currentView === "editUsername"
                ? "Edit Username"
                : "Edit Password"}
            </h2>
            <input
              type={currentView === "editUsername" ? "text" : "password"}
              placeholder={
                currentView === "editUsername"
                  ? "Enter new username"
                  : "Enter new password"
              }
              className="w-full px-4 py-2 border rounded mb-4 text-black"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              className="w-full px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleSave}>
              Save
            </button>
          </>
        )}
        <button
          className="mt-4 w-full px-4 py-2 bg-gray-300 text-black rounded"
          onClick={() => {
            if (currentView === "options") {
              onClose();
            } else {
              setCurrentView("options");
            }
          }}>
          {currentView === "options" ? "Close" : "Back"}
        </button>
      </div>
    </div>
  );
}
