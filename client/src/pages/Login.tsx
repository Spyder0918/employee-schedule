// src/pages/Login.tsx
import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage: React.FC = () => {
  const handleLogin = (username: string, password: string) => {
    // TODO: Implement login logic
    console.log('Login attempt:', { username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;