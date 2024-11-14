import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { assets } from '../../assets/assets'


const Navbar = () => {
  const web_location = useLocation();
  const navigate = useNavigate();
  const token = null;

  const [menu, setMenu] = useState("");

  // const logout = () => {
  //   localStorage.removeItem("token");
  //   dispath(setToken(""));
  //   navigate("/");
  // }

  useEffect(() => {
    if (web_location.pathname === '/') {
      setMenu("home")
    } else if (web_location.pathname === '/dropbox') {
      setMenu("dropbox")
    } else {
      setMenu("")
    }
  }, [])

  return (
    <div className='navbar'>
      <Link to='/' onClick={() => setMenu("home")}></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""} >Home</Link>
        <Link to='/dropbox' onClick={() => setMenu("dropbox")} className={menu === "dropbox" ? "active" : ""} >Dropbox</Link>
      </ul>
      <div className="navbar-right">
        <div className='navbar-profile'>
          <img src={assets.profile_icon} alt="profile icon" />
          <ul className='nav-profile-dropdown'>
            <li><img src={assets.profile_icon} alt="" /><p>Setting</p></li>
            <hr />
            <li><img src={assets.logout} alt="" /><p>Logout</p></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar