import { KeyRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { changePassword } from "../../Services/changePassword.services";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) return;

    const nextErrors = {
      currentPassword: currentPassword ? "" : "Current password is required.",
      newPassword: !newPassword
        ? "New password is required."
        : passwordRegex.test(newPassword)
          ? ""
          : "At least 8 characters with uppercase, lowercase, number, and special character.",
      confirmPassword: !confirmPassword
        ? "Please confirm your new password."
        : newPassword !== confirmPassword
          ? "Passwords do not match."
          : "",
    };
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) return;

    setIsSubmitting(true);
    try {
      const { data } = await changePassword({
        password: currentPassword,
        newPassword,
      });
      toast.success(data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to change password", error);
      const message =
        axios.isAxiosError(error) &&
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Unable to change your password. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f0f2f5] px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-md sm:p-9">
        <header className="mb-8 flex items-center gap-4">
          <div className="grid size-15 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
            <KeyRound size={26} strokeWidth={2.4} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Change Password
            </h1>
            <p className="mt-1 text-lg text-slate-500">
              Keep your account secure by using a strong password.
            </p>
          </div>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              className="mb-2 block text-lg font-bold text-slate-700"
              htmlFor="current-password"
            >
              Current password
            </label>
            <input
              autoComplete="current-password"
              className={`w-full rounded-2xl border bg-slate-50 px-5 py-4 text-lg text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200 ${
                errors.currentPassword
                  ? "border-rose-400"
                  : "border-slate-200 focus:border-blue-400"
              }`}
              id="current-password"
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Enter current password"
              type="password"
              value={currentPassword}
            />
            {errors.currentPassword && (
              <p className="mt-1.5 text-base text-rose-600">
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <label
              className="mb-2 block text-lg font-bold text-slate-700"
              htmlFor="new-password"
            >
              New password
            </label>
            <input
              autoComplete="new-password"
              className={`w-full rounded-2xl border bg-slate-50 px-5 py-4 text-lg text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200 ${
                errors.newPassword
                  ? "border-rose-400"
                  : "border-slate-200 focus:border-blue-400"
              }`}
              id="new-password"
              onChange={(event) => {
                const value = event.target.value;
                setNewPassword(value);
                setErrors((currentErrors) => ({
                  ...currentErrors,
                  newPassword: !value
                    ? ""
                    : passwordRegex.test(value)
                      ? ""
                      : "At least 8 characters with uppercase, lowercase, number, and special character.",
                  confirmPassword: confirmPassword
                    ? confirmPassword === value
                      ? ""
                      : "Passwords do not match."
                    : currentErrors.confirmPassword,
                }));
              }}
              placeholder="Enter new password"
              type="password"
              value={newPassword}
            />
            <p
              className={`mt-1.5 text-sm ${
                errors.newPassword ? "text-rose-600" : "text-slate-500"
              }`}
            >
              At least 8 characters with uppercase, lowercase, number, and special character.
            </p>
          </div>

          <div>
            <label
              className="mb-2 block text-lg font-bold text-slate-700"
              htmlFor="confirm-password"
            >
              Confirm new password
            </label>
            <input
              autoComplete="new-password"
              className={`w-full rounded-2xl border bg-slate-50 px-5 py-4 text-lg text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200 ${
                errors.confirmPassword
                  ? "border-rose-400"
                  : "border-slate-200 focus:border-blue-400"
              }`}
              id="confirm-password"
              onBlur={() => {
                setErrors((currentErrors) => ({
                  ...currentErrors,
                  confirmPassword: !confirmPassword
                    ? "Please confirm your new password."
                    : newPassword !== confirmPassword
                      ? "Passwords do not match."
                      : "",
                }));
              }}
              onChange={(event) => {
                const value = event.target.value;
                setConfirmPassword(value);
                if (errors.confirmPassword) {
                  setErrors((currentErrors) => ({
                    ...currentErrors,
                    confirmPassword: !value
                      ? "Please confirm your new password."
                      : newPassword !== value
                        ? "Passwords do not match."
                        : "",
                  }));
                }
              }}
              placeholder="Re-enter new password"
              type="password"
              value={confirmPassword}
            />
            {errors.confirmPassword && (
              <p className="mt-1.5 text-base text-rose-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            className="w-full rounded-2xl bg-blue-500 px-5 py-4 text-lg font-bold text-white transition hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Updating password..." : "Update password"}
          </button>
        </form>
      </section>
    </main>
  );
}
