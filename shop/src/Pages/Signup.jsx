import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './CSS/LoginSignup.css';
import { Link ,useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleCheckboxChange = () => {
    setAgreedToTerms((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/user/signup', formData);
      console.log(response.data);
      alert('Signup successful!');
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error.response.data);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className='loginsignup'>
      <form onSubmit={handleSubmit} className="loginsignup-container">
        <h1>Sign Up</h1>
        <div className="loginsignup-fields">
          <input type="email" name='email' value={formData.email} onChange={handleChange} placeholder='Email Address' required />
          <div style={{ position: 'relative' }}>
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Password'
              required
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
              // style={{ position: 'absolute', left: '12rem', top: '10%', transform: 'translateY(-50%)', background: 'none', border: 'none', color:'black' }}
            >
              {isPasswordVisible ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>
        <button type='submit'>Continue</button>
        <p className="loginsignup-login">Already have an account? <Link to='/login'><span>Login here</span></Link></p>
        <div className="loginsignup-agree">
          <input type="checkbox" id="agree" checked={agreedToTerms} onChange={handleCheckboxChange} />
          <label htmlFor="agree">By continuing, I agree to the terms of use & privacy policy.</label>
        </div>
      </form>
    </div>
  );
};

export default Signup;
