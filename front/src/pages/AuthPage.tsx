import React from 'react';
import LoginForm from '../components/LoginForm';

const AuthPage: React.FC = () => (
  <div 
    className="min-h-screen flex justify-center items-center"
    style={{
      background: 'linear-gradient(-45deg, #660ff9, #00f3fb, #ff6b6b, #4ecdc4)',
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite',
    } as React.CSSProperties}
  >
    <LoginForm/>
    <style>
      {`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}
    </style>
  </div>
);

export default AuthPage;