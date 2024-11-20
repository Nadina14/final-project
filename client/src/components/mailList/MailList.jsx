import "./mailList.css";
import { Link } from "react-router-dom";

const MailList = () => {
  return (
    <div className="mail">
      <h1 className="mailTitle">Save time, save money!</h1>
      <span className="mailDesc">Sign up and we'll send the best deals to you</span>
      <div className="mailInputContainer">
        <input type="text" placeholder="Your Email" />
        <Link to="/signup"><button className="mailBtn">Subscribe</button></Link>
      </div>
    </div>
  )
}

export default MailList