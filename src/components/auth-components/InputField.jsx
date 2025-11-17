import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
export const InputField = React.memo(
  ({ label, name, type = "text", onChange, value, error }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;
    return (
      <div className="relative">
        <label className="block font-medium mb-1" htmlFor={name}>
          {label}
        </label>

        <div className="relative">
          <input
            id={name}
            name={name}
            type={inputType}
            value={value}
            onChange={onChange}
            className="bg-transparent w-full border border-gray-400 rounded p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />

          {/* 👁️ Eye Icon */}
          {isPassword && (
            <button
              type="button"
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>
    );
  }
);
