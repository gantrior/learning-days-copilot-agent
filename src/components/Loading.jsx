import React from 'react';
import PropTypes from 'prop-types';

function Loading({ message = "Loading..." }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="cat-spinner">
          🐱
        </div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
}

Loading.propTypes = {
  message: PropTypes.string
};

Loading.defaultProps = {
  message: "Loading..."
};

export default Loading;