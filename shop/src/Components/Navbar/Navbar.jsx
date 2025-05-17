import React, {  useRef, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import nav_dropdown from '../Assets/nav_dropdown.png'
import { Link } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'; 
import { User} from 'lucide-react';
import SideBar from '../SIdeBar/SideBar'
const Navbar = () => {

    const [menu,setMenu] = useState("shop");
    const menuRef = useRef();
    const { isAuthenticated  , cart}= useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const dropdown_toggle = (e) => {
      menuRef.current.classList.toggle('nav-menu-visible');
      e.target.classList.toggle('open');
    }

  return (
    <div className='navbar'>
      <Link to='/' onClick={()=>{setMenu("shop")}} className="nav-logo">
        <img src={logo} alt="" />
        <p>SHOPPER</p>
      </Link>
      <img onClick={dropdown_toggle} className='nav-dropdown' src={nav_dropdown} alt="" />
      <ul ref={menuRef} className="nav-menu">
        <li onClick={()=>{setMenu("shop")}}><Link to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("mens")}}><Link to='/men'>Men</Link>{menu==="mens"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("womens")}}><Link to="women">Women</Link>{menu==="womens"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("kids")}}><Link to='/kids'>Kids</Link>{menu==="kids"?<hr/>:<></>}</li>
      </ul>
      <div className="nav-login-cart">
        {!isAuthenticated ? (
          <Link to='/login'>
                <button>
                LogIn
            </button>
          </Link>
          
        ):(
          <>
          <Link>
          <button onClick={() => setIsSidebarOpen(true)}  style={{border:'none'}}>
                 <User/>   
          </button>
          </Link>
          <Link to='/cart'><img src={cart_icon} alt="" /></Link>
          <div className="nav-cart-count">{cart && cart.length > 0 && (
                      <span >
                        {cart.length}
                      </span>
                    )}</div>
          </>
        )}
        


      </div>
      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

    </div>
  )
}

export default Navbar
