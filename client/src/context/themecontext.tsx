"use client";
import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface ThemeContextProviderProps {
  children: ReactNode;
}

export interface User {
  email: string;
  displayName: string;
  photoURL: string;
  uid: string;
  accessToken: string;
}

interface UserContext {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

export const ThemeContext = createContext<UserContext>({
  user: {
    email: "",
    displayName: "",
    photoURL: "",
    uid: "",
    accessToken: "",
  },
  setUser: () => {},
});

export default function UserContextProvider({
  children,
}: ThemeContextProviderProps) {
  const [user, setUser] = useState<User>({
    email: "",
    displayName: "",
    photoURL: "",
    uid: "",
    accessToken: "",
  });

  return (
    <ThemeContext.Provider value={{ user, setUser }}>
      {children}
    </ThemeContext.Provider>
  );
}
