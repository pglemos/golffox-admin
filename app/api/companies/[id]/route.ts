import { NextRequest, NextResponse } from 'next/server';
// import { CompaniesService } from '@/src/services/transportadora/companiesService';
import { withRoleAuth, handleApiError, validateRequestBody } from '../../middleware';

// const companiesService = new CompaniesService();

// GET - Obter empresa por ID
export const GET = withRoleAuth(['admin', 'operator', 'client'])(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    // Mock temporário - simula empresa encontrada
    const result = {
      id: id,
      name: 'Mock Company',
      email: 'mock@company.com',
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

// PUT - Atualizar empresa
export const PUT = withRoleAuth(['admin'])(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const body = await request.json();

    // Mock temporário - simula atualização bem-sucedida
    return NextResponse.json({
      success: true,
      data: { id, ...body },
      message: 'Empresa atualizada com sucesso (mock)',
    });

  } catch (error) {
    return handleApiError(error);
  }
});

// DELETE - Excluir empresa
export const DELETE = withRoleAuth(['admin'])(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    // Mock temporário - simula exclusão bem-sucedida
    return NextResponse.json({
      success: true,
      message: 'Empresa excluída com sucesso (mock)',
    });

  } catch (error) {
    return handleApiError(error);
  }
});