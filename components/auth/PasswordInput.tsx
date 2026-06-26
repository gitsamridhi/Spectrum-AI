"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

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
  const { T } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

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
      case 0: case 1: strength = "Weak"; break;
      case 2: strength = "Fair"; break;
      case 3: strength = "Good"; break;
      case 4: strength = "Strong"; break;
      default: strength = "Weak";
    }
  }

  const strengthColor = () => {
    switch (strength) {
      case "Weak":   return "bg-rose-400";
      case "Fair":   return "bg-amber-400";
      case "Good":   return "bg-blue-500";
      case "Strong": return "bg-emerald-500";
      default:       return "";
    }
  };

  const strengthText = () => {
    switch (strength) {
      case "Weak":   return "text-rose-500";
      case "Fair":   return "text-amber-500";
      case "Good":   return "text-blue-600";
      case "Strong": return "text-emerald-600";
      default:       return "";
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
          className="w-full rounded-xl h-11 px-4 pr-11 text-[13px] outline-none transition-all"
          style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }}
          onFocus={e => (e.target as HTMLInputElement).style.borderColor = T.text}
          onBlur={e =>  (e.target as HTMLInputElement).style.borderColor = T.border}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors focus:outline-none"
          style={{ color: T.textMuted }}>
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {showStrength && value && (
        <div className="space-y-1.5 pt-0.5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: T.textMuted }}>
              Password strength
            </span>
            <span className={`text-[10px] font-bold tracking-wider uppercase ${strengthText()}`}>
              {strength}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 h-[3px]">
            {[1, 2, 3, 4].map((step) => (
              <div key={step}
                className={`h-full rounded-full transition-all duration-300 ${step <= strengthScore ? strengthColor() : ''}`}
                style={step > strengthScore ? { background: T.bgCard } : {}}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
