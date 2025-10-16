import { NextRequest, NextResponse } from 'next/server';
// import { CompaniesService } from '@/src/services/transportadora/companiesService';
import { withRoleAuth, handleApiError, validateRequestBody } from '../middleware';

// const companiesService = new CompaniesService();

// GET - Listar empresas
export const GET = withRoleAuth(['admin', 'operator'])(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;

    // Mock temporário - simula lista de empresas
    const mockCompanies = [
      {
        id: '1',
        name: 'Mock Company 1',
        cnpj: '12.345.678/0001-90',
        email: 'mock1@company.com',
        status: 'active'
      },
      {
        id: '2',
        name: 'Mock Company 2',
        cnpj: '98.765.432/0001-10',
        email: 'mock2@company.com',
        status: 'inactive'
      }
    ];
    
    let filteredData = mockCompanies;
    
    // Aplicar filtros manualmente
    if (search) {
      filteredData = filteredData.filter(company => 
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        company.cnpj.includes(search)
      );
    }
    
    if (status) {
      filteredData = filteredData.filter(company => company.status === status);
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
      message: 'Empresas listadas com sucesso (mock)',
    });

  } catch (error) {
    return handleApiError(error);
  }
});

// POST - Criar nova empresa
export const POST = withRoleAuth(['admin'])(async (request) => {
  try {
    const body = await request.json();

    // Mock temporário - simula criação bem-sucedida
    return NextResponse.json({
      success: true,
      data: { id: 'mock-id', ...body },
      message: 'Empresa criada com sucesso (mock)',
    });

  } catch (error) {
    return handleApiError(error);
  }
});