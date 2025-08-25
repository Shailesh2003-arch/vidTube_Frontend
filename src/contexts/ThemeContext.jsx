import { createContext, useContext } from "react";

const ThemeContext = createContext({
  themeMode: "light",
  darkTheme: () => {},
  lightTheme: () => {},
});

// export const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState("light");
//   useEffect(() => {
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark"); // 👈 <html class="dark">
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [theme]);
//   const toggleTheme = () =>
//     setTheme((prev) => (prev === "light" ? "dark" : "light"));

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

export const ThemeProvider = ThemeContext.Provider;

export const useTheme = () => useContext(ThemeContext);
