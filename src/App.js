import "./App.css";
import gptLogo from "./assets/chatgpt.svg";
import addBtn from "./assets/add-30.png";
import msgIcon from "./assets/message.svg";
import home from "./assets/home.svg";
import saved from "./assets/bookmark.svg";
import rocket from "./assets/rocket.svg";
import sendBtn from "./assets/send.svg";
import trashIcon from "./assets/trash.svg";
import userIcon from "./assets/user-icon.png";
import gptImgLogo from "./assets/chatgptLogo.svg";
import React, { useState, useEffect, useRef } from "react";

function App() {
  const [userInput, setUserInput] = useState("");
  const [currentChat, setCurrentChat] = useState([]);
  const [chatSessions, setChatSessions] = useState([]);
  const [activeChatIndex, setActiveChatIndex] = useState(null);
  const [showInitialScreen, setShowInitialScreen] = useState(true);
  const [isChatSaved, setIsChatSaved] = useState(false);

  const chatRef = useRef(null);

  const truncateChatName = (name) => {
    return name.length > 20 ? `${name.substring(0, 20)}...` : name;
  };

  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem("chatSessions"));
    if (savedChats) {
      setChatSessions(savedChats);
    }
  }, []);

  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [currentChat]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSend = () => {
    if (userInput.trim() === "") return;

    const newMessage = { sender: "user", message: userInput };
    const gptResponse = { sender: "gpt", message: userInput };

    setCurrentChat((prevChat) => [...prevChat, newMessage, gptResponse]);

    setUserInput("");
    setShowInitialScreen(false);

    if (!isChatSaved) {
      const chatName = userInput.split(" ").slice(0, 5).join(" ") || "New Chat";
      setChatSessions((prevSessions) => [
        ...prevSessions,
        { name: chatName, messages: [...currentChat, newMessage, gptResponse] },
      ]);
      setIsChatSaved(true);
    }
  };

  const handleNewChat = () => {
    setCurrentChat([]);
    setActiveChatIndex(null);
    setShowInitialScreen(true);
    setIsChatSaved(false);
  };

  const handleLoadChat = (index) => {
    setActiveChatIndex(index);
    setCurrentChat(chatSessions[index].messages);
    setShowInitialScreen(false);
  };

  const handleDeleteChat = (index) => {
    const updatedSessions = chatSessions.filter((_, i) => i !== index);
    setChatSessions(updatedSessions);
    setCurrentChat([]);
    setActiveChatIndex(null);
    localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));
    setShowInitialScreen(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="App">
      <div className="sideBar">
        <div className="upperSide">
          <div className="upperSideTop">
            <img src={gptLogo} alt="Logo" className="logo" />
            <span className="brand">ChatGPT Clone</span>
          </div>
          <button className="midBtn" onClick={handleNewChat}>
            <img src={addBtn} alt="new chat" className="addBtn" />
            New Chat
          </button>

          <div className="upperSideBottom">
            {chatSessions.map((session, index) => (
              <div key={index} className="queryWrapper">
                <button
                  className={`query ${
                    activeChatIndex === index ? "active" : ""
                  }`}
                  onClick={() => handleLoadChat(index)}
                >
                  <img src={msgIcon} alt="Query" />
                  {truncateChatName(session.name)}
                  <img
                    src={trashIcon}
                    alt="Delete"
                    className="trashIcon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(index);
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lowerSide">
          <div className="listItems">
            <img src={home} alt="Home" className="listItemsImg" />
            Home
          </div>
          <div className="listItems">
            <img src={saved} alt="Saved" className="listItemsImg" />
            Saved
          </div>
          <div className="listItems">
            <img src={rocket} alt="Upgrade" className="listItemsImg" />
            Upgrade to Pro
          </div>
        </div>
      </div>

      <div className="main">
        <div className="chats" ref={chatRef}>
          {" "}
          {showInitialScreen ? (
            <div className="initialScreen">
              <img
                src={gptImgLogo}
                alt="ChatGPT Logo"
                className="initialLogo"
              />
              <h2>ChatGPT Clone</h2>
            </div>
          ) : (
            currentChat.map((chat, index) => (
              <div
                key={index}
                className={`chat ${chat.sender === "gpt" ? "bot" : ""}`}
              >
                <img
                  className="chatImg"
                  src={chat.sender === "user" ? userIcon : gptImgLogo}
                  alt=""
                />
                <p className="txt">{chat.message}</p>
              </div>
            ))
          )}
        </div>

        <div className="chatFooter">
          <div className="inp">
            <input
              type="text"
              placeholder="Message ChatGPT"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button className="send" onClick={handleSend}>
              <img src={sendBtn} alt="Send" />
            </button>
          </div>
          <p>ChatGPT can make mistakes. Check important info.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
