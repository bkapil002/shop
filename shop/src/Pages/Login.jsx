
import './CSS/LoginSignup.css'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>Log In</h1>
        <div className="loginsignup-fields">
          <input type="email" placeholder='Email Address' />
          <input type="password" placeholder='Password' />
        </div>
        <button>Continue</button>
        <p className="loginsignup-login">Create new account? <Link to='/signup'> <span>SignUp</span></Link></p>
      </div>
    </div>
  )
}

export default Login
