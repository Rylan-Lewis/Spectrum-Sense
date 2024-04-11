import { ThemeContext } from "@/context/themecontext";
import { useContext } from "react";

export function useInfo(){
  const context = useContext(ThemeContext);
  if(context == null) throw "Use hook within the ThemeContextProvider boundaries"
  return context;
}