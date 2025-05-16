import { useState } from 'react';
import './CSS/LoginSignup.css';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = () => {
    setAgreedToTerms((prev) => !prev);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (response.ok) {
        alert('Logged in successfully');
        navigate('/');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
      console.error('Login attempt failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='loginsignup'>
      <form onSubmit={handleSubmit} className="loginsignup-container">
        <h1>Log In</h1>
        <div className="loginsignup-fields">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder='Email Address'
            required
          />
          <div style={{ position: 'relative' }}>
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder='Password'
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {isPasswordVisible ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>
        <button type='submit' disabled={loading}>
          {loading ? 'Signing in...' : 'Log In'}
        </button>
        <p className="loginsignup-login">Create new account? <Link to='/signup'><span>Sign Up</span></Link></p>
        <div className="loginsignup-agree">
          <input
            type="checkbox"
            id="agree"
            checked={agreedToTerms}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="agree">By continuing, I agree to the terms of use & privacy policy.</label>
        </div>
      </form>
    </div>
  );
};

export default Login;
