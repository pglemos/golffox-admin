import { NextRequest, NextResponse } from 'next/server';
// import { VehiclesService } from '@/src/services/vehicles/vehiclesService';
import { withAuth, withRoleAuth, handleApiError, AuthenticatedRequest } from '../../middleware';
// import { supabase } from '@/lib/supabase';

// const vehiclesService = new VehiclesService();

// GET - Obter veículo por ID
export const GET = withAuth(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const withDetails = searchParams.get('withDetails') === 'true';
    const userRole = request.user?.role;
    const userCompanyId = request.user?.company_id;

    // Mock temporário - comentado vehiclesService
    // const vehicles = await vehiclesService.findAllWithDetails();
    // const vehicleResponse = await vehiclesService.findById(id);
    
    // Simular busca de veículo por ID
    const mockVehicle = {
      id: id,
      plate: 'ABC-1234',
      model: 'Mock Bus',
      capacity: 40,
      status: 'active',
      company_id: '1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    };
    
    const result = mockVehicle;

    if ((userRole === 'client' || userRole === 'operator') && 
        result.company_id !== userCompanyId) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    return handleApiError(error);
  }
});

// PUT - Atualizar veículo
export const PUT = withRoleAuth(['admin', 'operator'])(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const body = await request.json();
    const userRole = request.user?.role;
    const userCompanyId = request.user?.company_id;

    // Mock temporário - comentado vehiclesService
    // const existingVehicle = await vehiclesService.findById(id);
    // const result = await vehiclesService.update(id, body);
    
    // Simular atualização de veículo
    const mockResult = {
      id: id,
      ...body,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: mockResult,
      message: 'Veículo atualizado com sucesso (mock)',
    });

  } catch (error) {
    return handleApiError(error);
  }
});

// DELETE - Excluir veículo
export const DELETE = withRoleAuth(['admin', 'operator'])(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const userRole = request.user?.role;
    const userCompanyId = request.user?.company_id;

    // Mock temporário - comentado vehiclesService
    // const existingVehicle = await vehiclesService.findById(id);
    // await vehiclesService.delete(id);
    
    // Simular exclusão de veículo
    console.log(`Mock: Veículo ${id} excluído`);

    return NextResponse.json({
      success: true,
      message: 'Veículo excluído com sucesso (mock)',
    });

  } catch (error) {
    return handleApiError(error);
  }
});