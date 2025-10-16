import { NextRequest, NextResponse } from 'next/server';
// import { VehiclesService } from '@/src/services/transportadora/vehiclesService';
import { withAuth, withRoleAuth, handleApiError, validateRequestBody } from '../middleware';

// const vehiclesService = new VehiclesService();

// GET - Listar veículos
export const GET = withAuth(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const companyId = searchParams.get('company_id') || undefined;
    // Mock temporário - simula lista de veículos
    const mockVehicles = [
      {
        id: '1',
        plate: 'ABC-1234',
        model: 'Mock Bus 1',
        capacity: 40,
        status: 'active',
        company_id: '1'
      },
      {
        id: '2',
        plate: 'DEF-5678',
        model: 'Mock Bus 2',
        capacity: 50,
        status: 'maintenance',
        company_id: '2'
      }
    ];
    
    let filteredData = mockVehicles;
    
    // Aplicar filtros manualmente
    if (search) {
      filteredData = filteredData.filter(vehicle => 
        vehicle.plate.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (status) {
      filteredData = filteredData.filter(vehicle => vehicle.status === status);
    }
    
    if (companyId) {
      filteredData = filteredData.filter(vehicle => vehicle.company_id === companyId);
    }

    // Mock temporário - comentado vehiclesService
    // const allVehicles = await vehiclesService.findAllWithDetails();
    // const allVehicles = await vehiclesService.findWithFilters(filters);
    
    // Aplicar paginação manual aos dados filtrados
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    const result = {
      data: paginatedData,
      count: filteredData.length,
      error: null,
      pagination: {
        page,
        limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / limit)
      }
    };

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });

  } catch (error) {
    return handleApiError(error);
  }
});

// POST - Criar veículo
export const POST = withRoleAuth(['admin', 'operator'])(async (request) => {
  try {
    const body = await request.json();
    const userRole = request.user?.role;
    const userCompanyId = request.user?.company_id;

    // Validar campos obrigatórios
    const validation = validateRequestBody(body, [
      'plate',
      'brand',
      'model',
      'year',
      'capacity',
      'fuel_type',
      'company_id'
    ]);

    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Campos obrigatórios não fornecidos',
          missingFields: validation.missingFields 
        },
        { status: 400 }
      );
    }

    // Mock temporário - comentado vehiclesService
    // const result = await vehiclesService.create(body);
    
    // Simular criação de veículo
    const mockResult = {
      id: Date.now().toString(),
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: mockResult,
      message: 'Veículo criado com sucesso (mock)',
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error);
  }
});