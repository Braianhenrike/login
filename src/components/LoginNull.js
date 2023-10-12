import React from 'react';
import './LoginNull.css';

class LoginNull extends React.Component {
  render() {
    const { messageType } = this.props;
    let message = '';

    if (messageType === 'invalidLogin') {
      message = 'Your username or password is incorrect. Please try again.';
    } 
    if (messageType === 'adminError') {
      message = 'Cannot register as an admin. Please contact the company.';
    } 
    if (messageType === 'emptyInput') {
      message = 'Please fill in the password field to log in.';
    }

    return (
      <div className="overlay">
        <div className="login-popup">
          <div className="popup-content">
            <h2>{message}</h2>
          </div>
          <button className="btn btn-two" onClick={this.props.onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }
}

export default LoginNull;
