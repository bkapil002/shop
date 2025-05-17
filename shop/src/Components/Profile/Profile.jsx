import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';

function Profile() {
  const location = useLocation();
  const { userDetails } = location.state || {};
  const [isEditing, setIsEditing] = useState(false);
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
    if (user && user.token) {
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/address/check-user-details', {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          setFormData(response.data);
        } catch (error) {
          console.error('Failed to fetch user details:', error);
        }
      };

      fetchUserDetails();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user && user.token) {
      try {
        const response = await axios.put(`http://localhost:5000/api/address/${formData._id}`, formData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.status !== 200) {
          const errorData = response.data;
          throw new Error(errorData.message || 'Failed to update details. Please try again.');
        }

        toast.success('Details updated successfully');
        setIsEditing(false);
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast.error('Please log in to update your details.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Personal Details</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'medium', color: '#4B5563', marginBottom: '0.5rem' }}>
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                  required
                />
              ) : (
                <p style={{ color: '#111827' }}>{formData.name || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'medium', color: '#4B5563', marginBottom: '0.5rem' }}>
                House No.
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.houseNo || ''}
                  onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                  required
                />
              ) : (
                <p style={{ color: '#111827' }}>{formData.houseNo || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'medium', color: '#4B5563', marginBottom: '0.5rem' }}>
                Phone Number
              </label>
              {isEditing ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                    disabled
                    required
                  />
                </div>
              ) : (
                <p style={{ color: '#111827' }}>{formData.phone || 'Not provided'}</p>
              )}
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'medium', color: '#4B5563', marginBottom: '0.5rem' }}>
                Landmark
              </label>
              {isEditing ? (
                <textarea
                  value={formData.landmark || ''}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                  required
                />
              ) : (
                <p style={{ color: '#111827' }}>{formData.landmark || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'medium', color: '#4B5563', marginBottom: '0.5rem' }}>
                Area PIN
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.areaPin || ''}
                  onChange={(e) => setFormData({ ...formData, areaPin: e.target.value })}
                  pattern="[0-9]{6}"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                  required
                />
              ) : (
                <p style={{ color: '#111827' }}>{formData.areaPin || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'medium', color: '#4B5563', marginBottom: '0.5rem' }}>
                State
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.state || ''}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                  required
                />
              ) : (
                <p style={{ color: '#111827' }}>{formData.state || 'Not provided'}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
