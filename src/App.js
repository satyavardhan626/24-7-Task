import React, { useEffect, useState } from 'react';
import './App.css';
import { Badge, Input } from 'reactstrap';
import { RiDeleteBin6Line, RiSpam2Line, RiSpam3Fill } from "react-icons/ri";
import { BsFlag, BsFlagFill, BsFillInboxFill } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import data from './data.json'

function App() {
  const [unReadCount, setUnReadCount] = useState(null);
  const [flagCount, setFlagCount] = useState(null);
  const [spamCount, setSpamCount] = useState(null);
  const [deleteCount, setDeleteCount] = useState(null);
  const [defaultTab, setDefaultTab] = useState("inbox")
  const [isExpanded, setIsexpanded] = useState(true);

  const [emailData, setEmailData] = useState(data.emaildata);
  const [searchedValue, setSearchedValue] = useState("");
  useEffect(() => {
    const jsonData = emailData;
    if (jsonData.length !== 0) {
      const unRead = [...jsonData].filter(p => !p.read && !p.delete).length;
      const flagged = [...jsonData].filter(p => p.flagged).length;
      const spam = [...jsonData].filter(p => p.spam).length;
      const deleted = [...jsonData].filter(p => p.delete).length;

      setUnReadCount(unRead);
      setFlagCount(flagged);
      setSpamCount(spam)
      setDeleteCount(deleted)
    }

  }, [emailData])
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchedValue(value)

  }
  const handleTab = (currentTab) => {

    setDefaultTab(currentTab);
    const jsonData = emailData;
    const res = [...jsonData].filter(p => p.currentTab);
  }


  const handleClick = (mainIndex, actionName) => {
    let data = [...emailData];
    if (actionName == "unflag") {
      const res = data.map((item, index) => {
        if (index == mainIndex) {
          return { ...item, flagged: false }
        } else {
          return item
        }
      });
      setEmailData(res);
    } else if (actionName == "unspam") {
      const res = data.map((item, index) => {
        if (index == mainIndex) {
          return { ...item, spam: false }
        } else {
          return item
        }
      });
      setEmailData(res);
    }
    else {
      const res = data.map((item, index) => {
        if (index == mainIndex) {
          return { ...item, [actionName]: true }
        } else {
          return item
        }
      });
      setEmailData(res);
    }

  }

  const handleMenu = () => {
    setIsexpanded(!isExpanded)
  }

  const searchedData = emailData && emailData.filter((data) => {
    let title = data && data.title.toLowerCase();
    let message = data && data.msg.toLowerCase();
    return (title && title.includes(searchedValue) || message && message.includes(searchedValue))

  });

  return (
    <div className="container">
      <div className={isExpanded ? "App" : "App collapse"}>
        <div className="sidebar-menu">
          <FiMenu className="sidebar-menu-icon" onClick={handleMenu} />
        </div>
        <div className="sidebar-items">
          <div className={` item ${defaultTab == "inbox" ? "bgItem" : ""}`} onClick={(e) => handleTab("inbox")}>
            <BsFillInboxFill className="sidebar-icon" /><div className="sidebar-text">  <span> Inbox </span> <span className="badgeAlign">{unReadCount}</span></div>
          </div>
          <div className={` item ${defaultTab == "flag" ? "bgItem" : ""}`} onClick={(e) => handleTab("flag")}>
            <BsFlag className="sidebar-icon" /> <div className="sidebar-text">  Flagged <span className="badgeAlign">{flagCount}</span></div>
          </div>
          <div className={` item ${defaultTab == "spam" ? "bgItem" : ""}`} onClick={(e) => handleTab("spam")}>
            <RiSpam2Line className="sidebar-icon" /><div className="sidebar-text">  Spam <span className="badgeAlign">{spamCount}</span></div>
          </div>
          <div className={` item ${defaultTab == "delete" ? "bgItem" : ""}`} onClick={(e) => handleTab("delete")}>
            <RiDeleteBin6Line className="sidebar-icon" /><div className="sidebar-text"> Deleted <span className="badgeAlign">{deleteCount}</span></div>
          </div></div>
      </div>

      <div className="content">
        <Input type="text" name="search" className="search" autoComplete="off" onChange={handleSearch} placeholder="Search here" />

        {
          searchedData.map((item, index) => {
            return !item.delete ? <div className="emailItem" >
              <div className="sameline"><span onClick={(e) => handleClick(index, "read")} className={item.read ? "readTitle" : "title"}>{item.title}</span> <span className="date">{item.date}</span></div>
              <div className="msgLine"><span className="message">{item.msg}</span>
                <div className="msgLineAlign">
                  {item.spam ?
                    <RiSpam3Fill className="msg-icon" onClick={(e) => handleClick(index, "unspam")} /> :
                    <RiSpam2Line className="msg-icon" onClick={(e) => handleClick(index, "spam")} />
                  }
                  <RiDeleteBin6Line className="msg-icon" onClick={(e) => handleClick(index, "delete")} />
                  {
                    item.flagged ?
                      <BsFlagFill className="msg-icon " onClick={(e) => handleClick(index, "unflag")} /> :
                      <BsFlag className="msg-icon " onClick={(e) => handleClick(index, "flagged")} />
                  }
                </div>
              </div>
            </div>
              :
              <div></div>
          }
          )
        }

      </div>
    </div>
  );
}

export default App;
