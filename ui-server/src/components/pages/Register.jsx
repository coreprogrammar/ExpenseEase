//  src/pages/auth/Register.jsx
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import AuthApi from "../../api/auth";

const register = async (formData) => AuthApi.register(formData);

export default function Register() {
  /* ─── state ──────────────────────────────── */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [alert, setAlert] = useState(null);      // {message, ok}
  const [submitting, setSubmitting] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  /* ─── helpers ────────────────────────────── */
  const pwdStrength = (pwd) => {
    if (pwd.length < 6) return 0;
    let score = 0;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  /* ─── submit ─────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (formData.password !== formData.confirmPassword) {
      return setAlert({ ok: false, message: "Passwords do not match" });
    }

    setSubmitting(true);
    setAlert(null);
    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (!res.success) {
        let msg = res.message || "Registration failed";
        if (res.errors) {
          msg = Object.values(res.errors)
            .map((v) => `<li>${v.message}</li>`)
            .join("");
          msg = `<ul>${msg}</ul>`;
        }
        setAlert({ ok: false, message: msg });
      } else {
        setAlert({
          ok: true,
          message:
            "Account created! Please check your inbox to verify your email."
        });
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
      }
    } catch (err) {
      setAlert({ ok: false, message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── view ───────────────────────────────── */
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div
        className={`w-full max-w-sm rounded-xl bg-white p-8 shadow-lg transition-all ${
          alert && !alert.ok ? "animate-shake" : ""
        }`}
      >
        <h2 className="mb-8 text-center text-3xl font-bold text-indigo-600">
          Create your account
        </h2>

        {alert && (
          <div
            className={`mb-6 rounded-md border px-4 py-3 text-sm ${
              alert.ok
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-red-300 bg-red-50 text-red-700"
            }`}
            dangerouslySetInnerHTML={{ __html: alert.message }}
          />
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              required
              className="mt-1 w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.name}
              onChange={(e) =>
                setFormData((s) => ({ ...s, name: e.target.value }))
              }
            />
          </div>

          {/* email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              required
              className="mt-1 w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.email}
              onChange={(e) =>
                setFormData((s) => ({ ...s, email: e.target.value }))
              }
            />
          </div>

          {/* password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPwd ? "text" : "password"}
                required
                className="w-full rounded-md border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.password}
                onChange={(e) =>
                  setFormData((s) => ({ ...s, password: e.target.value }))
                }
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPwd ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* strength */}
            {formData.password && (
              <div className="mt-1 flex h-2 overflow-hidden rounded bg-gray-200">
                <div
                  className={`transition-all ${
                    ["bg-red-500", "bg-yellow-500", "bg-yellow-400", "bg-emerald-500"][pwdStrength(formData.password)]
                  }`}
                  style={{
                    width: `${(pwdStrength(formData.password) / 4) * 100}%`
                  }}
                />
              </div>
            )}
          </div>

          {/* confirm pwd */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type={showPwd ? "text" : "password"}
              required
              className="mt-1 w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData((s) => ({
                  ...s,
                  confirmPassword: e.target.value
                }))
              }
            />
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={submitting}
            className="group relative flex w-full items-center justify-center rounded-md bg-indigo-600 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-400"
          >
            {submitting && (
              <svg
                className="absolute left-4 h-5 w-5 animate-spin text-indigo-100"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            )}
            Sign&nbsp;up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-indigo-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
