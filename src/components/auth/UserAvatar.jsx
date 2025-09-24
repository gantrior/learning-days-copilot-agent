import React, { useState } from 'react';

// Cat-themed avatar options
const CAT_AVATARS = [
  { id: 'orange-cat', emoji: '🐱', name: 'Orange Tabby' },
  { id: 'black-cat', emoji: '🐈‍⬛', name: 'Black Cat' },
  { id: 'white-cat', emoji: '🐈', name: 'White Cat' },
  { id: 'calico-cat', emoji: '🦊', name: 'Calico Cat' },
  { id: 'siamese-cat', emoji: '😺', name: 'Siamese Cat' },
  { id: 'persian-cat', emoji: '😸', name: 'Persian Cat' },
  { id: 'maine-coon', emoji: '😻', name: 'Maine Coon' },
  { id: 'bengal-cat', emoji: '🐅', name: 'Bengal Cat' }
];

function UserAvatar({ 
  user, 
  size = 'medium', 
  showName = false, 
  onClick, 
  editable = false,
  onAvatarChange 
}) {
  const [isSelecting, setIsSelecting] = useState(false);

  const getSizeClass = (size) => {
    switch (size) {
      case 'small': return 'avatar-small';
      case 'large': return 'avatar-large';
      case 'xl': return 'avatar-xl';
      default: return 'avatar-medium';
    }
  };

  const getDisplayAvatar = () => {
    if (user?.avatar) {
      const avatarData = CAT_AVATARS.find(a => a.id === user.avatar);
      return avatarData ? avatarData.emoji : '🐱';
    }
    return '🐱'; // Default avatar
  };

  const getDisplayName = () => {
    if (user?.name) {
      return user.name;
    }
    return 'Cat Lover';
  };

  const handleAvatarClick = () => {
    if (editable) {
      setIsSelecting(true);
    } else if (onClick) {
      onClick();
    }
  };

  const handleAvatarSelect = (avatarId) => {
    if (onAvatarChange) {
      onAvatarChange(avatarId);
    }
    setIsSelecting(false);
  };

  const handleCloseSelector = () => {
    setIsSelecting(false);
  };

  return (
    <div className="user-avatar-container">
      <div 
        className={`user-avatar ${getSizeClass(size)} ${onClick || editable ? 'clickable' : ''}`}
        onClick={handleAvatarClick}
        role={onClick || editable ? 'button' : 'img'}
        tabIndex={onClick || editable ? 0 : -1}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && (onClick || editable)) {
            e.preventDefault();
            handleAvatarClick();
          }
        }}
        aria-label={`${getDisplayName()}'s avatar`}
      >
        <span className="avatar-emoji">{getDisplayAvatar()}</span>
        {editable && (
          <div className="avatar-edit-indicator">
            <span className="edit-icon">✏️</span>
          </div>
        )}
      </div>
      
      {showName && (
        <div className="avatar-name">
          {getDisplayName()}
        </div>
      )}

      {isSelecting && (
        <div className="avatar-selector-overlay" onClick={handleCloseSelector}>
          <div className="avatar-selector" onClick={(e) => e.stopPropagation()}>
            <div className="avatar-selector-header">
              <h3>Choose Your Avatar</h3>
              <button 
                className="avatar-selector-close"
                onClick={handleCloseSelector}
                aria-label="Close avatar selector"
              >
                ✕
              </button>
            </div>
            
            <div className="avatar-options">
              {CAT_AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  className={`avatar-option ${user?.avatar === avatar.id ? 'selected' : ''}`}
                  onClick={() => handleAvatarSelect(avatar.id)}
                  title={avatar.name}
                >
                  <span className="avatar-option-emoji">{avatar.emoji}</span>
                  <span className="avatar-option-name">{avatar.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserAvatar;