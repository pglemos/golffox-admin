import { NextRequest, NextResponse } from 'next/server';
// import { AuthService } from '@/src/services/auth/authService';
import { withAuth, handleApiError } from '../../middleware';

// const authService = new AuthService();

export const POST = withAuth(async (request) => {
  try {
    // Mock temporário - simula logout bem-sucedido
    return NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso (mock)',
    });

  } catch (error) {
    return handleApiError(error);
  }
});