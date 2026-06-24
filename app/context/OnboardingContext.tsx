"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type AuthScreenType =
  | "LANDING"
  | "SIGN_UP"
  | "SIGN_IN"
  | "EMAIL_VERIFICATION"
  | "FORGOT_PASSWORD_1"
  | "FORGOT_PASSWORD_2"
  | "FORGOT_PASSWORD_3"
  | "FORGOT_PASSWORD_4"
  | "ONBOARDING"
  | "WELCOME_LOADING"
  | "HOME_PERSONALISED";

export interface OnboardingAnswers {
  creating: string[];
  role: string;
  workspaceType: "solo" | "team";
  teamSize?: string;
  experienceLevel: number;
  howFound: string;
  howFoundOther?: string;
  displayName: string;
  workspaceName: string;
  profilePicture: string | null;
  primaryUseCase: string;
}

interface OnboardingContextProps {
  currentScreen: AuthScreenType;
  setScreen: (screen: AuthScreenType) => void;
  goBack: () => void;

  email: string;
  setEmail: (email: string) => void;
  passwordSignUp: string;
  setPasswordSignUp: (pw: string) => void;
  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;
  signUpError: string | null;
  setSignUpError: (err: string | null) => void;
  signUpLoading: boolean;
  setSignUpLoading: (loading: boolean) => void;

  emailSignIn: string;
  setEmailSignIn: (email: string) => void;
  passwordSignIn: string;
  setPasswordSignIn: (pw: string) => void;
  signInError: string | null;
  setSignInError: (err: string | null) => void;
  signInLoading: boolean;
  setSignInLoading: (loading: boolean) => void;

  resendCountdown: number;
  startResendTimer: () => void;

  resetEmail: string;
  setResetEmail: (email: string) => void;
  newPassword: string;
  setNewPassword: (pw: string) => void;
  confirmNewPassword: string;
  setConfirmNewPassword: (pw: string) => void;

  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  answers: OnboardingAnswers;
  updateAnswers: (newAnswers: Partial<OnboardingAnswers>) => void;
  resetOnboarding: () => void;

  isLoggedIn: boolean;
  userEmail: string | null;
  loginUser: (email: string) => void;
  logoutUser: () => void;
}

const defaultAnswers: OnboardingAnswers = {
  creating: [],
  role: "",
  workspaceType: "solo",
  teamSize: "",
  experienceLevel: 1,
  howFound: "",
  howFoundOther: "",
  displayName: "",
  workspaceName: "",
  profilePicture: null,
  primaryUseCase: "",
};

// Screens that should NOT be pushed to browser history (no-back zones)
const NO_HISTORY_SCREENS: AuthScreenType[] = ["WELCOME_LOADING", "HOME_PERSONALISED"];

const OnboardingContext = createContext<OnboardingContextProps | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<AuthScreenType>("LANDING");

  const [email, setEmail] = useState("");
  const [passwordSignUp, setPasswordSignUp] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpLoading, setSignUpLoading] = useState(false);

  const [emailSignIn, setEmailSignIn] = useState("");
  const [passwordSignIn, setPasswordSignIn] = useState("");
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signInLoading, setSignInLoading] = useState(false);

  const [resendCountdown, setResendCountdown] = useState(0);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [onboardingStep, setOnboardingStep] = useState(1);
  const [answers, setAnswers] = useState<OnboardingAnswers>(defaultAnswers);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Push history state when screen changes (except no-back zones)
  const setScreen = useCallback((screen: AuthScreenType) => {
    if (typeof window !== "undefined" && !NO_HISTORY_SCREENS.includes(screen)) {
      window.history.pushState({ screen }, "");
    }
    setCurrentScreen(screen);
  }, []);

  // Browser back button: restore previous screen from history state
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const state = e.state as { screen?: AuthScreenType } | null;
      setCurrentScreen(state?.screen ?? "LANDING");
    };
    window.addEventListener("popstate", handlePopState);
    // Seed initial history entry so first back works correctly
    window.history.replaceState({ screen: "LANDING" }, "");
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const interval = setInterval(() => setResendCountdown(p => p - 1), 1000);
    return () => clearInterval(interval);
  }, [resendCountdown]);

  const startResendTimer = () => setResendCountdown(60);

  const changeEmail = (newEmail: string) => {
    setEmail(newEmail);
    if (newEmail) {
      const prefix = newEmail.split("@")[0] || "";
      const cap = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      setAnswers(prev => ({
        ...prev,
        displayName: prev.displayName || cap,
        workspaceName: prev.workspaceName || (cap ? `${cap}'s Studio` : "My Studio"),
      }));
    }
  };

  const updateAnswers = (newAnswers: Partial<OnboardingAnswers>) =>
    setAnswers(prev => ({ ...prev, ...newAnswers }));

  const resetOnboarding = () => { setOnboardingStep(1); setAnswers(defaultAnswers); };

  const loginUser = (userMail: string) => { setIsLoggedIn(true); setUserEmail(userMail); };
  const logoutUser = () => { setIsLoggedIn(false); setUserEmail(null); setScreen("LANDING"); resetOnboarding(); };

  return (
    <OnboardingContext.Provider value={{
      currentScreen, setScreen, goBack,
      email, setEmail: changeEmail,
      passwordSignUp, setPasswordSignUp,
      termsAccepted, setTermsAccepted,
      signUpError, setSignUpError,
      signUpLoading, setSignUpLoading,
      emailSignIn, setEmailSignIn,
      passwordSignIn, setPasswordSignIn,
      signInError, setSignInError,
      signInLoading, setSignInLoading,
      resendCountdown, startResendTimer,
      resetEmail, setResetEmail,
      newPassword, setNewPassword,
      confirmNewPassword, setConfirmNewPassword,
      onboardingStep, setOnboardingStep,
      answers, updateAnswers, resetOnboarding,
      isLoggedIn, userEmail, loginUser, logoutUser,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within an OnboardingProvider");
  return ctx;
}
