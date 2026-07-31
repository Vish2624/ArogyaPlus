import { useState } from "react";
import type { FormEvent } from "react";

import { getApiErrorMessage } from "@/services/api";
import { updateAdminProfile } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

export default function AdminProfilePage() {
  const admin = useAuthStore((s) => s.admin);
  const setAdmin = useAuthStore((s) => s.setAdmin);

  const [email, setEmail] = useState(admin?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword && newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateAdminProfile({
        email: email !== admin?.email ? email : undefined,
        current_password: newPassword ? currentPassword : undefined,
        new_password: newPassword || undefined,
      });
      setAdmin(updated);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not update your profile."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
      <p className="mt-1 text-sm text-slate-500">View your account details and update your email or password.</p>

      <div className="card mt-6 max-w-lg p-6">
        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-700 text-sm font-bold text-white">
            {admin?.username?.slice(0, 2).toUpperCase() ?? "AD"}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{admin?.username}</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="profile-email">Email</label>
            <input
              id="profile-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Change Password</p>
            <div className="space-y-3">
              <div>
                <label className="form-label" htmlFor="profile-current-password">Current Password</label>
                <input
                  id="profile-current-password"
                  type="password"
                  className="form-input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <div>
                <label className="form-label" htmlFor="profile-new-password">New Password</label>
                <input
                  id="profile-new-password"
                  type="password"
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="form-label" htmlFor="profile-confirm-password">Confirm New Password</label>
                <input
                  id="profile-confirm-password"
                  type="password"
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
          {message && <p className="rounded-lg bg-accent-500/10 px-4 py-3 text-sm font-medium text-accent-700">{message}</p>}

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
