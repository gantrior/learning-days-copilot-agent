import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserAvatar from '../components/auth/UserAvatar';

// Cat breeds for preferences
const CAT_BREEDS = [
  'Persian', 'Maine Coon', 'British Shorthair', 'Ragdoll', 'Bengal', 
  'Siamese', 'Abyssinian', 'Russian Blue', 'Scottish Fold', 'Sphynx',
  'American Shorthair', 'Norwegian Forest', 'Oriental', 'Devon Rex', 'Birman'
];

// Product categories for preferences
const PRODUCT_CATEGORIES = [
  'toys', 'food', 'accessories', 'treats', 'grooming', 'health'
];

function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    favoriteBreeds: user?.preferences?.favoriteBreeds || [],
    categories: user?.preferences?.categories || [],
    notifications: user?.preferences?.notifications !== false // Default to true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (arrayName, item, isChecked) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: isChecked 
        ? [...prev[arrayName], item]
        : prev[arrayName].filter(i => i !== item)
    }));
  };

  const handleAvatarChange = (avatarId) => {
    updateProfile({ avatar: avatarId });
    setSaveMessage('Avatar updated successfully! 🎉');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update profile with new data
    updateProfile({
      name: formData.name,
      preferences: {
        favoriteBreeds: formData.favoriteBreeds,
        categories: formData.categories,
        notifications: formData.notifications
      }
    });

    setIsSaving(false);
    setIsEditing(false);
    setSaveMessage('Profile updated successfully! 🎉');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleCancel = () => {
    // Reset form data to current user data
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      favoriteBreeds: user?.preferences?.favoriteBreeds || [],
      categories: user?.preferences?.categories || [],
      notifications: user?.preferences?.notifications !== false
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar-section">
            <UserAvatar 
              user={user} 
              size="xl" 
              editable={true}
              onAvatarChange={handleAvatarChange}
            />
            <div className="profile-basic-info">
              <h1>Welcome back, {user.name}! 🐱</h1>
              <p className="profile-email">{user.email}</p>
              <p className="profile-member-since">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {saveMessage && (
            <div className="profile-success-message">
              {saveMessage}
            </div>
          )}

          {!isEditing && (
            <button 
              className="edit-profile-btn"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        <div className="profile-content">
          {isEditing ? (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <h2>Basic Information</h2>
                
                <div className="form-group">
                  <label htmlFor="profile-name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="profile-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    disabled={isSaving}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="profile-email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="profile-email"
                    name="email"
                    value={formData.email}
                    className="form-input"
                    disabled
                    title="Email cannot be changed in this demo"
                  />
                  <small className="form-help">Email cannot be changed in this demo</small>
                </div>
              </div>

              <div className="form-section">
                <h2>Cat Preferences</h2>
                
                <div className="form-group">
                  <label className="form-label">Favorite Cat Breeds</label>
                  <div className="checkbox-grid">
                    {CAT_BREEDS.map(breed => (
                      <label key={breed} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.favoriteBreeds.includes(breed)}
                          onChange={(e) => handleArrayChange('favoriteBreeds', breed, e.target.checked)}
                          disabled={isSaving}
                        />
                        <span className="checkbox-text">{breed}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Product Categories</label>
                  <div className="checkbox-grid">
                    {PRODUCT_CATEGORIES.map(category => (
                      <label key={category} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.categories.includes(category)}
                          onChange={(e) => handleArrayChange('categories', category, e.target.checked)}
                          disabled={isSaving}
                        />
                        <span className="checkbox-text capitalize">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2>Notification Settings</h2>
                
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={formData.notifications}
                      onChange={handleInputChange}
                      disabled={isSaving}
                    />
                    <span className="checkbox-text">
                      Receive email notifications about orders and promotions
                    </span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="save-profile-btn"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="loading-spinner"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      💾 Save Changes
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  className="cancel-profile-btn"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-display">
              <div className="profile-section">
                <h2>Cat Preferences</h2>
                
                {user.preferences?.favoriteBreeds?.length > 0 ? (
                  <div className="preference-display">
                    <h3>Favorite Breeds</h3>
                    <div className="preference-tags">
                      {user.preferences.favoriteBreeds.map(breed => (
                        <span key={breed} className="preference-tag">{breed}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="no-preferences">No favorite breeds selected</p>
                )}

                {user.preferences?.categories?.length > 0 ? (
                  <div className="preference-display">
                    <h3>Preferred Categories</h3>
                    <div className="preference-tags">
                      {user.preferences.categories.map(category => (
                        <span key={category} className="preference-tag capitalize">{category}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="no-preferences">No preferred categories selected</p>
                )}
              </div>

              <div className="profile-section">
                <h2>Account Settings</h2>
                <div className="setting-display">
                  <span className="setting-label">Email Notifications:</span>
                  <span className="setting-value">
                    {user.preferences?.notifications ? '✅ Enabled' : '❌ Disabled'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;