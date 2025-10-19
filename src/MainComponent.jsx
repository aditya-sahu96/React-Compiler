import React, { useContext, useEffect, useState } from 'react'
import { PiSunDimBold } from "react-icons/pi";
import { AiOutlineShareAlt } from "react-icons/ai";
import { FaPython } from "react-icons/fa";
import { RiJavascriptFill } from "react-icons/ri";
import { FaJava } from "react-icons/fa";
import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import { ThemeContext } from './ThemeContext';

const MainComponent = () => {
    const [code, setCode] = useState("//Write your Code here")
    const [option, setOption] = useState(null)
    const [lang, setLang] = useState(null)
    const [output, setOutput] = useState("")
    const [ext, setExt] = useState("")
    const { theme, toggleTheme } = useContext(ThemeContext);

    const handelInput = (value) => {
        setCode(value)
        console.log(value)
    }

    const languages = [
        { id: 1, icon: <FaPython /> },
        { id: 2, icon: <RiJavascriptFill /> },
        { id: 3, icon: "C" },
        { id: 4, icon: <FaJava /> }
    ]

    const handelOption = (itemId) => {
        setOption(itemId)
        switch (itemId) {
            case 1:
                setLang("python")
                break;
            case 2:
                setLang("javascript")
                break;
            case 3:
                setLang("c")
                break;
            case 4:
                setLang("java")
                break;
        }
    }

    useEffect(() => {
        setExt(getExtension(lang));
    }, [option, lang]);

    const getExtension = (lang) => {
        switch (lang) {
            case "python": return "py";
            case "javascript": return "js";
            case "java": return "java";
            case "c": return "c";
            default: return "txt";
        }
    };

    const getVersion = (lang) => {
        switch (lang) {
            case "python": return "3.10.0";
            case "javascript": return "18.15.0"; // Node.js version
            case "java": return "15.0.2";
            case "c": return "10.2.0"; // GCC version
            default: return "latest";
        }
    };

    const handelRun = async () => {
        if (!lang) {
            alert("Please select a language first!");
            return;
        }

        try {
            const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
                language: lang,
                version: getVersion(lang),
                // you can omit version or provide one like "3.10.0" for Python
                files: [
                    {
                        name: `main.${getExtension(lang)}`,
                        content: code,
                    },
                ],
            });

            console.log("Response:", response.data);
            setOutput(response.data.run.output || "No output");
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            setOutput("Error: " + (error.response?.data?.message || "Something went wrong"));
        }
    }

    const handelShare = () => {
        navigator.clipboard.writeText(code).then(() => {
            console.log('Text copied to clipboard');
        }, () => {
            console.log('Failed to copy text to clipboard');
        });
    }

    const handelClear = () => {
        setOutput("")
    }

    return (
        <div className={`main-div ${theme === "light" ? "lightTheme" : ""}`}>
            {/* ========== OPTIONS BAR ========== */}
            <div className={`options ${theme === "light" ? "lightTheme" : ""}`}>
                {languages.map((item) => (
                    <div
                        key={item.id}
                        className={`optionBox ${option === item.id ? "activeOption" : ""} ${theme === "light" ? "lightTheme" : ""}`}
                        onClick={() => handelOption(item.id)}
                    >
                        {item.icon}
                    </div>
                ))}
            </div>

            {/* ========== CODE BOX ========== */}
            <div className={`codeBox ${theme === "light" ? "lightTheme" : ""}`}>
                <div className={`codeHeader ${theme === "light" ? "lightTheme" : ""}`}>
                    <div className="fileName">{`Main.${ext === null ? "" : ext}`}</div>

                    <div
                        className={`themeBtn ${theme === "light" ? "lightTheme" : ""}`}
                        onClick={toggleTheme}
                    >
                        <PiSunDimBold />
                    </div>

                    <div
                        className={`shareDiv ${theme === "light" ? "lightTheme" : ""}`}
                        onClick={handelShare}
                    >
                        <AiOutlineShareAlt className="shareIcon" onClick={handelShare} />
                        <p>Share</p>
                    </div>

                    <button
                        style={{
                            height: "33px",
                            padding: "10px",
                            border: "2px solid white",
                            borderRadius: "3px",
                            color: "white",
                            fontFamily: "sans-serif",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                        onClick={handelRun}
                    >
                        Run
                    </button>
                </div>

                {/* ========== INPUT (EDITOR) ========== */}
                <div className={`inputBox ${theme === "light" ? "lightTheme" : ""}`}>
                    <Editor
                        height="90vh"
                        width="100%"
                        language="javascript"
                        theme={theme === "light" ? "vs-light" : "vs-dark"}
                        value={code}
                        onChange={handelInput}
                        options={{
                            fontSize: 15,
                            minimap: { enabled: true },
                            wordWrap: "on",
                            automaticLayout: true,
                        }}
                    />
                </div>
            </div>

            {/* ========== OUTPUT SECTION ========== */}
            <div className={`resultbox ${theme === "light" ? "lightTheme" : ""}`}>
                <div className={`outputHeader ${theme === "light" ? "lightTheme" : ""}`}>
                    <div>Output</div>
                    <div onClick={handelClear} style={{ cursor: "pointer" }}>Clear</div>
                </div>

                <div className={`outputBox ${theme === "light" ? "lightTheme" : ""}`}>
                    <textarea type="text" value={output} readOnly />
                </div>
            </div>
        </div>
    )
}

export default MainComponent