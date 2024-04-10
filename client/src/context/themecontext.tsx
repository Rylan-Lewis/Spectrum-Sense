'use client'
import React, { createContext, useState, ReactNode, SetStateAction, Dispatch, useContext } from "react";

interface ThemeContextProviderProps {
  children: ReactNode;
}

export interface Sonner {
  sonner: string;
  setSonner: Dispatch<SetStateAction<string>>;
}

const ThemeContext = createContext<Sonner>({
  sonner: '',
  setSonner: () => {},
});

export default function ThemeContextProvider({
  children,
}: ThemeContextProviderProps) {
  const [sonner, setSonner] = useState<string>('');

  return (
    <ThemeContext.Provider value={{ sonner, setSonner }}>
      {children}
    </ThemeContext.Provider>
  );
}


export function useSonner(){
  const context = useContext(ThemeContext);
  if(context == null) throw "Use hook within the ThemeContextProvider boundaries"
  return context;
}