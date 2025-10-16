import { NextRequest, NextResponse } from 'next/server';
// import { RoutesService } from '@/src/services/transportadora/routesService';
import { withAuth, withRoleAuth, handleApiError, AuthenticatedRequest } from '../../middleware';

// const routesService = new RoutesService();

// GET - Obter rota por ID
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
      // const routes = await routesService.findAllWithDetails();
      const routes = { data: [{ id, name: 'Mock Route', driver_id: request.user?.id, company_id: request.user?.company_id }] }; // Mock temporário
      result = routes.data.find(route => route.id === id);
      if (!result) {
        return NextResponse.json(
          { error: 'Rota não encontrada' },
          { status: 404 }
        );
      }
    } else {
      // const routeResponse = await routesService.findById(id);
      const routeResponse = { data: { id, name: 'Mock Route', driver_id: request.user?.id, company_id: request.user?.company_id } }; // Mock temporário
      if (!routeResponse.data) {
        return NextResponse.json(
          { error: 'Rota não encontrada' },
          { status: 404 }
        );
      }
      result = routeResponse.data;
    }

    // Verificar permissões baseadas no role
    const userRole = request.user?.role;
    const userCompanyId = request.user?.company_id;
    const userId = request.user?.id;

    if (userRole === 'driver' && result.driver_id !== userId) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

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

// PUT - Atualizar rota
export const PUT = withRoleAuth(['admin', 'operator'])(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const body = await request.json();
    const userRole = request.user?.role;
    const userCompanyId = request.user?.company_id;

    // Verificar se a rota existe
    // const existingRoute = await routesService.findById(id);
    const existingRoute = { data: { id, company_id: userCompanyId } }; // Mock temporário
    if (!existingRoute.data) {
      return NextResponse.json(
        { error: 'Rota não encontrada' },
        { status: 404 }
      );
    }

    // Verificar permissões de empresa
    if (userRole === 'operator' && existingRoute.data.company_id !== userCompanyId) {
      return NextResponse.json(
        { error: 'Não é possível atualizar rota de outra empresa' },
        { status: 403 }
      );
    }

    // const result = await routesService.update(id, body);
    const result = { id, ...body }; // Mock temporário

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Rota atualizada com sucesso (mock)',
    });

  } catch (error) {
    return handleApiError(error);
  }
});

// DELETE - Excluir rota
export const DELETE = withRoleAuth(['admin', 'operator'])(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const userRole = request.user?.role;
    const userCompanyId = request.user?.company_id;

    // Verificar se a rota existe
    // const existingRoute = await routesService.findById(id);
    const existingRoute = { data: { id, company_id: userCompanyId } }; // Mock temporário
    if (!existingRoute.data) {
      return NextResponse.json(
        { error: 'Rota não encontrada' },
        { status: 404 }
      );
    }

    // Verificar permissões de empresa
    if (userRole === 'operator' && existingRoute.data.company_id !== userCompanyId) {
      return NextResponse.json(
        { error: 'Não é possível excluir rota de outra empresa' },
        { status: 403 }
      );
    }

    // await routesService.delete(id); // Mock temporário

    return NextResponse.json({
      success: true,
      message: 'Rota excluída com sucesso (mock)',
    });

  } catch (error) {
    return handleApiError(error);
  }
});