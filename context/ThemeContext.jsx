import { createContext, useContext, useState } from  "react";


export const ThemeContext = createContext("light");

export const ThemeProvider = ({ children }) => {

    const [theme, setTheme] = useState("light");

    function toggleTheme() {
        console.log("Toggle");
        setTheme(theme === "light" ? "dark" : "light");
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            { children }
        </ThemeContext.Provider>
    );
}
