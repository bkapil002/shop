import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../Context/AuthContext';
import { MapPin } from 'lucide-react';
import './AddressForm.css'; // Import the CSS file

export default function AddressForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    type: 'home',
    houseNo: '',
    landmark: '',
    area: '',
    areaPin: '',
    state: '',
    phone: '+91',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const houseNoWords = formData.houseNo.trim().split(/\s+/);
    if (houseNoWords.length < 3) {
      toast.error('House No. /Details must be at least 3 words long');
      return;
    }

    const landmarkWords = formData.landmark.trim().split(/\s+/);
    if (landmarkWords.length < 4) {
      toast.error('Landmark must be at least 4 words long');
      return;
    }

    const areaPinRegex = /^\d{6}$/;
    if (!areaPinRegex.test(formData.areaPin)) {
      toast.error('Area PIN must be a 6-digit number');
      return;
    }

    const phoneRegex = /^\+91\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Invalid phone number. It must start with +91 followed by 10 digits.');
      return;
    }

    setLoading(true);
    try {
      await saveAddress(formData, user.token);
      toast.success('Address saved successfully');
      navigate('/cart');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveAddress = async (data, token) => {
    const response = await fetch('http://localhost:5000/api/address/address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to save address. Please try again.');
    }

    return await response.json();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setFormData((prevData) => ({
        ...prevData,
        phone: `+91${value}`,
      }));
    }
  };

  return (
    <div className="address-form-container">
      <div className="address-form-card">
        <div className="address-form-header">
          <div className="address-icon-container">
            <MapPin className="address-icon" />
          </div>
          <h2 className="address-form-title">Delivery Address</h2>
          <p className="address-form-subtitle">Please provide your delivery details</p>
        </div>

        <form onSubmit={handleSubmit} className="address-form">
          <div className="form-group">
            <label className="form-label">Address Type</label>
            <div className="address-type-buttons">
              {['home', 'work', 'other'].map((types) => (
                <button
                  key={types}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, type: types }))}
                  className={`address-type-button ${formData.type === types ? 'active' : ''}`}
                >
                  {types}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter Full Name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <div className="phone-input-container">
              <span className="phone-country-code">+91</span>
              <input
                id="phone"
                type="tel"
                required
                value={formData.phone.replace('+91', '')}
                onChange={handlePhoneChange}
                className="phone-input"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">House No. / Details</label>
            <input
              type="text"
              name="houseNo"
              value={formData.houseNo}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Flat 101, Building Name"
              required
            />
            <p className="form-hint">Please provide at least 3 words for accurate delivery</p>
          </div>

          <div className="form-group">
            <label className="form-label">Landmark</label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Near City Mall, Opposite Park"
              required
            />
            <p className="form-hint">Please provide at least 4 words for better location identification</p>
          </div>

          <div className="form-group">
            <label className="form-label">Area PIN Code</label>
            <input
              type="text"
              name="areaPin"
              value={formData.areaPin}
              onChange={handleChange}
              pattern="[0-9]{6}"
              className="form-input"
              placeholder="Enter 6-digit PIN code"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter state name"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? (
              <span className="loading-spinner">
                <svg className="spinner-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Address...
              </span>
            ) : (
              'Save Address'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
