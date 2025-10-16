import { NextRequest, NextResponse } from 'next/server';
// import { DriversService } from '@/src/services/transportadora/driversService';
import { withAuth, withRoleAuth, handleApiError, validateRequestBody } from '../middleware';

// const driversService = new DriversService();

// GET - Listar motoristas
export const GET = withAuth(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const companyId = searchParams.get('company_id') || undefined;
    // Mock temporário - simula lista de motoristas
    const mockDrivers = [
      {
        id: '1',
        name: 'Mock Driver 1',
        email: 'driver1@mock.com',
        phone: '(11) 99999-9999',
        license_number: 'ABC123456',
        status: 'active'
      },
      {
        id: '2',
        name: 'Mock Driver 2',
        email: 'driver2@mock.com',
        phone: '(11) 88888-8888',
        license_number: 'DEF789012',
        status: 'inactive'
      }
    ];
    
    let filteredData = mockDrivers;
    
    // Aplicar filtros manualmente
    if (search) {
      filteredData = filteredData.filter(driver => 
        driver.name.toLowerCase().includes(search.toLowerCase()) ||
        driver.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (status) {
      filteredData = filteredData.filter(driver => driver.status === status);
    }
    
    // Aplicar paginação manual
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    const result = {
      data: paginatedData,
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

// POST - Criar motorista
export const POST = withRoleAuth(['admin', 'operator'])(async (request) => {
  try {
    const body = await request.json();
    const userRole = request.user?.role;
    const userCompanyId = request.user?.company_id;

    // Validar campos obrigatórios
    const validation = validateRequestBody(body, [
      'name',
      'cpf',
      'cnh',
      'cnh_category',
      'cnh_expiry',
      'phone',
      'email',
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

    // Verificar permissões de empresa
    if (userRole === 'operator') {
      if (!userCompanyId || body.company_id !== userCompanyId) {
        return NextResponse.json(
          { error: 'Não é possível criar motorista para outra empresa' },
          { status: 403 }
        );
      }
    }

    // Mock temporário - simula criação de motorista
    const result = {
      id: Date.now().toString(),
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Motorista criado com sucesso',
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error);
  }
});