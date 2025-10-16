import { NextRequest, NextResponse } from 'next/server';
// import { DriversService } from '@/src/services/drivers/driversService';
import { withAuth, withRoleAuth, handleApiError, AuthenticatedRequest } from '../../middleware';

// const driversService = new DriversService();

// GET - Obter motorista por ID
export const GET = withAuth(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    // Mock temporário - simula motorista encontrado
    const result = {
      id: id,
      name: 'Mock Driver',
      email: 'mock@driver.com',
      phone: '(11) 99999-9999',
      license_number: 'ABC123456',
      status: 'active'
    };

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    return handleApiError(error);
  }
});

// PUT - Atualizar motorista
export const PUT = withRoleAuth(['admin', 'operator'])(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const body = await request.json();
    const userRole = request.user?.role;
    const userCompanyId = request.user?.company_id;

    // Mock temporário - simula atualização bem-sucedida
    const mockResult = {
      id: id,
      ...body,
      updated_at: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      data: mockResult,
      message: 'Motorista atualizado com sucesso (mock)',
    });

  } catch (error) {
    return handleApiError(error);
  }
});

// DELETE - Excluir motorista
export const DELETE = withRoleAuth(['admin', 'operator'])(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const userRole = request.user?.role;
    const userCompanyId = request.user?.company_id;

    // Mock temporário - simula exclusão bem-sucedida
    return NextResponse.json({
      success: true,
      message: 'Motorista excluído com sucesso (mock)',
    });

  } catch (error) {
    return handleApiError(error);
  }
});