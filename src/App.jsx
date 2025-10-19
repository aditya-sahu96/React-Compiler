import React, { useState } from 'react'
import "./App.css"
import MainComponent from './MainComponent'
import { ThemeContext } from './ThemeContext';

const App = () => {
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }
  return (
    <>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className={`heroSection ${theme === "light" ? "lightTheme" : ""}`}>
          <div className={`Header ${theme === "light" ? "lightTheme" : ""}`}>
            <div className='iconBox'>
              <h1>CodeGenix</h1>
              <p>Online Code Compiler</p>
            </div>
          </div>
          <MainComponent />
        </div>
      </ThemeContext.Provider>
    </>
  )
}

export default App