import { NextRequest, NextResponse } from 'next/server';
// import { CompaniesService } from '@/src/services/transportadora/companiesService';
import { withRoleAuth, handleApiError } from '../../../middleware';

// const companiesService = new CompaniesService();

// POST - Alternar status da empresa
export const POST = withRoleAuth(['admin'])(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    // Mock temporário - simula toggle de status bem-sucedido
    const result = {
      success: true,
      data: { id, status: 'active' }
    };

    return NextResponse.json({
      success: true,
      data: result.data,
      message: `Status da empresa ${result.data?.status === 'Ativo' ? 'ativado' : 'desativado'} com sucesso`,
    });

  } catch (error) {
    return handleApiError(error);
  }
});