"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { cn } from "@/lib/utils";
import { HiOutlineLockClosed } from "react-icons/hi";

export default function SecuritySettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "password" | "privacy" | "account"
  >("password");

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showWorkouts: true,
    showProgress: false,
    allowMessages: true,
    showOnlineStatus: true,
  });

  // Account Actions State
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsChangingPassword(false);
    // Reset form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleExportData = async () => {
    setIsExporting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsExporting(false);
    // In real app, trigger download
    console.log("Exporting user data...");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Account deleted");
    // Redirect to homepage
    window.location.href = "/";
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-ink tracking-tight">Security & Privacy</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your security settings and privacy preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab("password")}
            className={cn(
              "border-b-2 pb-3 text-sm font-medium transition-colors",
              activeTab === "password"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-600 hover:text-gray-900",
            )}
          >
            Password
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={cn(
              "border-b-2 pb-3 text-sm font-medium transition-colors",
              activeTab === "privacy"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-600 hover:text-gray-900",
            )}
          >
            Privacy
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={cn(
              "border-b-2 pb-3 text-sm font-medium transition-colors",
              activeTab === "account"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-600 hover:text-gray-900",
            )}
          >
            Account Data
          </button>
        </nav>
      </div>

      {/* Password Tab */}
      {activeTab === "password" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-gray-900">
              Change Password
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Update your password to keep your account secure
            </p>

            <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
              <Input
                label="Current Password"
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isChangingPassword}
                leftIcon={<HiOutlineLockClosed className="h-5 w-5" />}
              />

              <Input
                label="New Password"
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isChangingPassword}
                hint="At least 8 characters"
                leftIcon={<HiOutlineLockClosed className="h-5 w-5" />}
              />

              <PasswordStrength password={newPassword} />

              <Input
                label="Confirm New Password"
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isChangingPassword}
                leftIcon={<HiOutlineLockClosed className="h-5 w-5" />}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showPasswords"
                  checked={showPasswords}
                  onChange={(e) => setShowPasswords(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label
                  htmlFor="showPasswords"
                  className="text-sm text-gray-700"
                >
                  Show passwords
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  loading={isChangingPassword}
                  loadingText="Updating..."
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>

          {/* Two-Factor Authentication */}
          <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Two-Factor Authentication
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === "privacy" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-gray-900">
              Privacy Settings
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Control who can see your information and activities
            </p>

            <div className="mt-6 space-y-4">
              {/* Profile Visibility */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Profile Visibility
                  </h4>
                  <p className="text-sm text-gray-600">
                    Who can view your profile
                  </p>
                </div>
                <select
                  value={privacySettings.profileVisibility}
                  onChange={(e) =>
                    setPrivacySettings((prev) => ({
                      ...prev,
                      profileVisibility: e.target.value,
                    }))
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              {/* Show Workouts */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h4 className="font-medium text-gray-900">Show Workouts</h4>
                  <p className="text-sm text-gray-600">
                    Display your workout routines publicly
                  </p>
                </div>
                <button
                  onClick={() =>
                    setPrivacySettings((prev) => ({
                      ...prev,
                      showWorkouts: !prev.showWorkouts,
                    }))
                  }
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    privacySettings.showWorkouts
                      ? "bg-emerald-600"
                      : "bg-gray-200",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      privacySettings.showWorkouts
                        ? "translate-x-6"
                        : "translate-x-1",
                    )}
                  />
                </button>
              </div>

              {/* Show Progress */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h4 className="font-medium text-gray-900">Show Progress</h4>
                  <p className="text-sm text-gray-600">
                    Share your fitness progress and stats
                  </p>
                </div>
                <button
                  onClick={() =>
                    setPrivacySettings((prev) => ({
                      ...prev,
                      showProgress: !prev.showProgress,
                    }))
                  }
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    privacySettings.showProgress
                      ? "bg-emerald-600"
                      : "bg-gray-200",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      privacySettings.showProgress
                        ? "translate-x-6"
                        : "translate-x-1",
                    )}
                  />
                </button>
              </div>

              {/* Allow Messages */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h4 className="font-medium text-gray-900">Allow Messages</h4>
                  <p className="text-sm text-gray-600">
                    Let other users send you messages
                  </p>
                </div>
                <button
                  onClick={() =>
                    setPrivacySettings((prev) => ({
                      ...prev,
                      allowMessages: !prev.allowMessages,
                    }))
                  }
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    privacySettings.allowMessages
                      ? "bg-emerald-600"
                      : "bg-gray-200",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      privacySettings.allowMessages
                        ? "translate-x-6"
                        : "translate-x-1",
                    )}
                  />
                </button>
              </div>

              {/* Show Online Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Show Online Status
                  </h4>
                  <p className="text-sm text-gray-600">
                    Let others see when you're active
                  </p>
                </div>
                <button
                  onClick={() =>
                    setPrivacySettings((prev) => ({
                      ...prev,
                      showOnlineStatus: !prev.showOnlineStatus,
                    }))
                  }
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    privacySettings.showOnlineStatus
                      ? "bg-emerald-600"
                      : "bg-gray-200",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      privacySettings.showOnlineStatus
                        ? "translate-x-6"
                        : "translate-x-1",
                    )}
                  />
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button>Save Privacy Settings</Button>
            </div>
          </div>
        </div>
      )}

      {/* Account Data Tab */}
      {activeTab === "account" && (
        <div className="space-y-6">
          {/* Export Data */}
          <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  Export Your Data
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Download a copy of your account data including workouts,
                  routines, and profile information
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleExportData}
                disabled={isExporting}
                loading={isExporting}
                loadingText="Exporting..."
              >
                Export Data
              </Button>
            </div>
          </div>

          {/* Delete Account */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <h3 className="font-semibold text-red-900">Danger Zone</h3>
            <p className="mt-1 text-sm text-red-700">
              Deleting your account is permanent and cannot be undone
            </p>

            {!showDeleteConfirm ? (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="mt-4"
              >
                Delete Account
              </Button>
            ) : (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-red-900">
                    Type DELETE to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-red-300 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="DELETE"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== "DELETE"}
                  >
                    Delete My Account
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
