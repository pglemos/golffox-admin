import React from 'react';
import { LoginForm } from './auth/LoginForm';

interface AdminLoginProps {
  onLogin?: (success: boolean) => void;
}

function AdminLogin({ onLogin }: AdminLoginProps) {
  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
      <LoginForm onSuccess={(_user) => onLogin?.(true)} />
    </div>
  );
}

export default AdminLogin;
