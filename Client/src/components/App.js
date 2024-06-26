import React, { useEffect, useState } from "react";
import Home from "./Home/Home/Home";
import Navbar from "./Home/Navbar/Navbar"
import Single from './Home/Single/Single'
import Write from "./Home/Write/Write"
import Settings from "./Home/Settings/Settings"
import LoginSignup from './Home/LoginSignup/LoginSignup'
import { Route,Routes } from "react-router-dom";


function App() {
  const [user,setUser] = useState(false)
  const [searchTerm,setSearchTerm] = useState('')
  const [search,setSearch] = useState(false)
  const[username,setUsername] = useState('')
  return (
    <>
      <Navbar user={user} setUser={setUser} setSearchTerm={setSearchTerm} setSearch={setSearch}/>
      <Routes>
        <Route exact path='/' element={<Home user={user}/>}/>
        <Route path='/:id' element={<Single username={username}/>}/>
        <Route path='/newpost' element={user?<Write/>:<LoginSignup setUser={setUser} />}/>
        <Route path='/signup' element={user?<Home user={user} search={search} searchTerm={searchTerm}/>:<LoginSignup setUser={setUser} />}/>
        <Route path='/account' element={user?<Settings setUsername={setUsername}/>:<LoginSignup setUser={setUser} />}/>
      </Routes>
    </>
);
}

export default App;
