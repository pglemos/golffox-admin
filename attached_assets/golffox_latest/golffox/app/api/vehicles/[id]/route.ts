import { NextRequest, NextResponse } from 'next/server';
import { VehiclesService } from '@/services/vehiclesService';
import { withAuth, withRoleAuth, handleApiError, AuthenticatedRequest } from '../../middleware';
import { supabase } from '@/lib/supabase';

const vehiclesService = new VehiclesService();

// GET - Obter veículo por ID
export const GET = withAuth(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const withDetails = searchParams.get('withDetails') === 'true';

    let result;

    if (withDetails) {
      const vehicles = await vehiclesService.findAllWithDetails();
      if (vehicles.error) {
        return NextResponse.json(
          { error: vehicles.error },
          { status: 500 }
        );
      }
      result = vehicles.data.find(vehicle => vehicle.id === id);
    } else {
      const vehicleResponse = await vehiclesService.findById(id);
      if (vehicleResponse.error || !vehicleResponse.data) {
        return NextResponse.json(
          { error: vehicleResponse.error || 'Veículo não encontrado' },
          { status: 500 }
        );
      }
      result = vehicleResponse.data;
    }

    if (!result) {
      return NextResponse.json(
        { error: 'Veículo não encontrado' },
        { status: 404 }
      );
    }

    // Verificar permissões baseadas no role
    const userRole = request.user?.role;
    const userCompanyId = request.user?.company_id;

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

    // Verificar se o veículo existe
    const existingVehicle = await vehiclesService.findById(id);
    if (existingVehicle.error || !existingVehicle.data) {
      return NextResponse.json(
        { error: existingVehicle.error || 'Veículo não encontrado' },
        { status: 404 }
      );
    }

    // Para operadores, verificar se o veículo pertence à empresa através do driver
    if (userRole === 'operator') {
      // Buscar o driver associado ao veículo para verificar a empresa
      if (existingVehicle.data.driver_id) {
        const { data: driver } = await supabase
          .from('drivers')
          .select('linked_company')
          .eq('id', existingVehicle.data.driver_id)
          .single()
        
        if (driver && driver.linked_company !== userCompanyId) {
          return NextResponse.json(
            { error: 'Acesso negado: veículo não pertence à sua empresa' },
            { status: 403 }
          )
        }
      }
    }

    const result = await vehiclesService.update(id, body);

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Veículo atualizado com sucesso',
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

    // Verificar se o veículo existe
    const existingVehicle = await vehiclesService.findById(id);
    if (existingVehicle.error || !existingVehicle.data) {
      return NextResponse.json(
        { error: existingVehicle.error || 'Veículo não encontrado' },
        { status: 404 }
      );
    }

    // Para operadores, verificar se o veículo pertence à empresa através do driver
    if (userRole === 'operator') {
      // Buscar o driver associado ao veículo para verificar a empresa
      if (existingVehicle.data.driver_id) {
        const { data: driver } = await supabase
          .from('drivers')
          .select('linked_company')
          .eq('id', existingVehicle.data.driver_id)
          .single()
        
        if (driver && driver.linked_company !== userCompanyId) {
          return NextResponse.json(
            { error: 'Não é possível excluir veículo de outra empresa' },
            { status: 403 }
          )
        }
      }
    }

    await vehiclesService.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Veículo excluído com sucesso',
    });

  } catch (error) {
    return handleApiError(error);
  }
});