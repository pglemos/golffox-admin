import React from 'react';
import { LoginForm } from './auth/LoginForm';

interface AdminLoginProps {
  onLogin?: (success: boolean) => void;
}

function AdminLogin({ onLogin }: AdminLoginProps) {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-golffox-base text-white">
      <LoginForm onSuccess={(_user) => onLogin?.(true)} />
    </div>
  );
}

export default AdminLogin;
