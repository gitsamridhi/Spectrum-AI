"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  id?: string;
  showStrength?: boolean;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = "••••••••",
  id = "password-field",
  showStrength = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Directly derive variables from prop value to avoid cascading renders
  let strengthScore = 0;
  let strength: "None" | "Weak" | "Fair" | "Good" | "Strong" = "None";

  if (value) {
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;

    strengthScore = score === 0 ? 1 : score;

    switch (score) {
      case 0:
      case 1:
        strength = "Weak";
        break;
      case 2:
        strength = "Fair";
        break;
      case 3:
        strength = "Good";
        break;
      case 4:
        strength = "Strong";
        break;
      default:
        strength = "Weak";
    }
  }

  const strengthColor = () => {
    switch (strength) {
      case "Weak":   return "bg-rose-400";
      case "Fair":   return "bg-amber-400";
      case "Good":   return "bg-blue-500";
      case "Strong": return "bg-emerald-500";
      default:       return "bg-zinc-200";
    }
  };

  const strengthText = () => {
    switch (strength) {
      case "Weak":   return "text-rose-500";
      case "Fair":   return "text-amber-500";
      case "Good":   return "text-blue-600";
      case "Strong": return "text-emerald-600";
      default:       return "text-zinc-400";
    }
  };

  return (
    <div className="space-y-2 w-full">
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl h-11 px-4 pr-11 text-[13px] placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/20 transition-all"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors focus:outline-none"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {showStrength && value && (
        <div className="space-y-1.5 pt-0.5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
              Password strength
            </span>
            <span className={`text-[10px] font-bold tracking-wider uppercase ${strengthText()}`}>
              {strength}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 h-[3px]">
            {[1, 2, 3, 4].map((step) => (
              <div key={step}
                className={`h-full rounded-full transition-all duration-300 ${step <= strengthScore ? strengthColor() : "bg-zinc-200"}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
