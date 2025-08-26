import React from "react";
export const InputField = React.memo(
  ({ label, name, type = "text", onChange, value, error }) => {
    return (
      <div>
        <label className="block font-medium" htmlFor={name}>
          {label}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className="bg-transparent w-full border border-gray-400 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>
    );
  }
);
