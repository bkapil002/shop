import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pencil, CircleArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../Context/AuthContext';
import './UserAddressForm.css'; // Import the CSS file

export default function UserAddressDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userDetails } = location.state || {};
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    _id: '',
    houseNo: '',
    phone: '',
    landmark: '',
    areaPin: '',
    name: '',
    state: '',
    ...userDetails,
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user?.token) {
        setIsLoading(true);
        try {
          const response = await fetch(`http://localhost:5000/api/address/check-user-details`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user details');
          }

          const data = await response.json();
          setFormData(data);
        } catch (error) {
          toast.error('Error fetching user details');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserDetails();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserDetails();
  };

  const handleUpdate = async () => {
    await updateUserDetails();
  };

  const updateUserDetails = async () => {
    if (user?.token) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/address/${formData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update details. Please try again.');
        }

        toast.success('Details updated successfully');
        setIsEditing(false);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    if (/^\+91[0-9]*$/.test(value) && value.length <= 13) {
      setFormData(prevData => ({
        ...prevData,
        phone: value
      }));
    }
  };

  const handleNext = () => {
    navigate('/Checkout');
  };

  if (!user || !formData) {
    return (
      <div className="loading-container">
        <Loader2 className="spinner" />
      </div>
    );
  }

  return (
    <div className="user-address-page">
      <div className="user-address-container">
        <div className="user-address-card">
          {/* Header */}
          <div className="user-address-header">
            <div className="header-content">
              <h1 className="header-title">Personal Details</h1>
              {!isEditing && (
                <div className="header-actions">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="edit-button"
                  >
                    <Pencil className="edit-icon" />
                    Edit
                  </button>
                  <button
                    onClick={handleNext}
                    className="next-button"
                  >
                    <CircleArrowRight className="next-icon" />
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="user-address-form">
            <div className="form-group">
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.houseNo}
                      onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                      className="form-input"
                      required
                    />
                  ) : (
                    <p className="form-value">{formData.houseNo || 'Not provided'}</p>
                  )}
                </div>

                <div className="form-field">
                  <label className="form-label">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="form-input"
                      required
                    />
                  ) : (
                    <p className="form-value">{formData.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Landmark</label>
                {isEditing ? (
                  <textarea
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="form-textarea"
                    required
                  />
                ) : (
                  <p className="form-value">{formData.landmark || 'Not provided'}</p>
                )}
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Area PIN</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.areaPin}
                      onChange={(e) => setFormData({ ...formData, areaPin: e.target.value })}
                      pattern="[0-9]{6}"
                      className="form-input"
                      required
                    />
                  ) : (
                    <p className="form-value">{formData.areaPin || 'Not provided'}</p>
                  )}
                </div>

                <div className="form-field">
                  <label className="form-label">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                      required
                    />
                  ) : (
                    <p className="form-value">{formData.name || 'Not provided'}</p>
                  )}
                </div>

                <div className="form-field">
                  <label className="form-label">State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="form-input"
                      required
                    />
                  ) : (
                    <p className="form-value">{formData.state || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <div className="actions-content">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="cancel-button"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="save-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="save-spinner" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
