import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pencil, ArrowRightCircle as CircleArrowRight, Loader2 } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 md:py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white md:rounded-lg md:shadow-md transition-all duration-200">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 md:px-6 md:py-6 md:rounded-t-lg md:border-none">
            <div className="flex justify-between items-center">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 transition-all duration-200">
                Personal Details
              </h1>
              {!isEditing && (
                <div className="flex items-center gap-3 md:gap-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 text-sm md:text-base rounded-md hover:bg-blue-50 transition-all duration-200"
                  >
                    <Pencil className="h-4 w-4 md:h-5 md:w-5 mr-1.5" />
                    Edit
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 text-sm md:text-base rounded-md hover:bg-blue-50 transition-all duration-200"
                  >
                    <CircleArrowRight className="h-4 w-4 md:h-5 md:w-5 mr-1.5" />
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
            <div className="space-y-6">
              <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 group-hover:text-blue-600 transition-colors duration-200">
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.houseNo}
                      onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                      className="w-full px-4 py-2.5 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 text-base bg-gray-50 px-4 py-2.5 rounded-lg">{formData.houseNo || 'Not provided'}</p>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 group-hover:text-blue-600 transition-colors duration-200">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="w-full px-4 py-2.5 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 text-base bg-gray-50 px-4 py-2.5 rounded-lg">{formData.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1.5 group-hover:text-blue-600 transition-colors duration-200">
                  Landmark
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-[80px]"
                    required
                  />
                ) : (
                  <p className="text-gray-900 text-base bg-gray-50 px-4 py-2.5 rounded-lg min-h-[80px]">{formData.landmark || 'Not provided'}</p>
                )}
              </div>

              <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 group-hover:text-blue-600 transition-colors duration-200">
                    Area PIN
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.areaPin}
                      onChange={(e) => setFormData({ ...formData, areaPin: e.target.value })}
                      pattern="[0-9]{6}"
                      className="w-full px-4 py-2.5 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 text-base bg-gray-50 px-4 py-2.5 rounded-lg">{formData.areaPin || 'Not provided'}</p>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 group-hover:text-blue-600 transition-colors duration-200">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 text-base bg-gray-50 px-4 py-2.5 rounded-lg">{formData.name || 'Not provided'}</p>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 group-hover:text-blue-600 transition-colors duration-200">
                    State
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2.5 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 text-base bg-gray-50 px-4 py-2.5 rounded-lg">{formData.state || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:relative md:border-none md:p-0 md:mt-6">
                <div className="flex gap-3 md:justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 md:flex-none px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="flex-1 md:flex-none px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
