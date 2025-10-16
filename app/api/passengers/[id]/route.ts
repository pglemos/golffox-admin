import { NextRequest, NextResponse } from 'next/server';
// import { PassengersService } from '@/src/services/passengers/passengersService';
import { withAuth, withRoleAuth, handleApiError, AuthenticatedRequest } from '../../middleware';

// const passengersService = new PassengersService();

// GET - Obter passageiro por ID
export const GET = withAuth(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const withDetails = searchParams.get('withDetails') === 'true';

    // Mock temporário - comentado passengersService
    // const passengers = await passengersService.findAllWithDetails();
    // const passengerResponse = await passengersService.findById(id);
    
    // Simular busca de passageiro por ID
    const mockPassenger = {
      id: id,
      name: 'Mock Passenger',
      email: 'passenger@mock.com',
      phone: '(11) 99999-9999',
      user_id: '1',
      company_id: '1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    };
    
    const result = mockPassenger;

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    return handleApiError(error);
  }
});

// PUT - Atualizar passageiro
export const PUT = withRoleAuth(['admin', 'operator', 'client'])(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const body = await request.json();
    const userRole = request.user?.role;
    const userCompanyId = request.user?.company_id;

    // Mock temporário - comentado passengersService
    // const existingPassenger = await passengersService.findById(id);
    
    // Simular atualização de passageiro
    const mockResult = {
      id: id,
      ...body,
      updated_at: new Date().toISOString()
    };

    // const result = await passengersService.update(id, body);

    return NextResponse.json({
      success: true,
      data: mockResult,
      message: 'Passageiro atualizado com sucesso (mock)',
    });

  } catch (error) {
    return handleApiError(error);
  }
});

// DELETE - Excluir passageiro
export const DELETE = withRoleAuth(['admin', 'operator'])(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const userRole = request.user?.role;
    const userCompanyId = request.user?.company_id;

    // Mock temporário - comentado passengersService
    // const existingPassenger = await passengersService.findById(id);
    // await passengersService.delete(id);
    
    // Simular exclusão de passageiro
    console.log(`Mock: Passageiro ${id} excluído`);

    return NextResponse.json({
      success: true,
      message: 'Passageiro excluído com sucesso (mock)',
    });

  } catch (error) {
    return handleApiError(error);
  }
});