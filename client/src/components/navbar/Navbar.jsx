import "./navbar.css";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext.js";  

const Navbar = () => {
  const { user, logOut } = useUser(); 

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">Nadi's Booking</span>
        </Link>
 
        {user ? (
          <div className="navItems">
            <span className="username">{user.username || user.details.username}</span>
            <button className="navButton" onClick={logOut}>Log out</button> 
          </div>
        ) : (
          <div className="navItems">
            <Link to={"/signup"}>
              <button className="navButton">Register</button>
            </Link>
            <Link to={"/login"}>
              <button className="navButton">Login</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
