import { NextRequest, NextResponse } from 'next/server';
// import { CompaniesService } from '@/src/services/transportadora/companiesService';
// import { DriversService } from '@/src/services/drivers/driversService';
// import { VehiclesService } from '@/src/services/vehicles/vehiclesService';
// import { PassengersService } from '@/src/services/passengers/passengersService';
// import { RoutesService } from '@/src/services/transportadora/routesService';
// import { AlertsService } from '@/src/services/notifications/alertsService';
import { withAuth, handleApiError } from '../middleware';

// const companiesService = new CompaniesService();
// const driversService = new DriversService();
// const vehiclesService = new VehiclesService();
// const passengersService = new PassengersService();
// const routesService = new RoutesService();
// const alertsService = new AlertsService();

// GET - Obter estatísticas gerais
export const GET = withAuth(async (request) => {
  try {
    const userRole = request.user?.role;
    const userCompanyId = request.user?.company_id;

    let stats: any = {};

    // Estatísticas baseadas no role
    if (userRole === 'admin') {
      // Admin pode ver todas as estatísticas
      // const [
      //   companiesStats,
      //   driversStats,
      //   vehiclesStats,
      //   passengersStats,
      //   routesStats,
      //   alertsStats
      // ] = await Promise.all([
      //   companiesService.getStats(),
      //   driversService.getStats(),
      //   vehiclesService.getStats(),
      //   passengersService.getStats(),
      //   routesService.getStats(),
      //   alertsService.getStats()
      // ]);

      // Mock temporário
      const mockStats = { total: 0, active: 0, inactive: 0 };
      stats = {
        companies: mockStats,
        drivers: mockStats,
        vehicles: mockStats,
        passengers: mockStats,
        routes: mockStats,
        alerts: mockStats,
      };

    } else if (userRole === 'operator' || userRole === 'client') {
      if (!userCompanyId) {
        return NextResponse.json(
          { error: 'Usuário não associado a uma empresa' },
          { status: 403 }
        );
      }

      // Operadores e clientes veem apenas estatísticas da sua empresa
      // const [
      //   driversStats,
      //   vehiclesStats,
      //   passengersStats,
      //   routesStats,
      //   alertsStats
      // ] = await Promise.all([
      //   driversService.getStats(),
      //   vehiclesService.getStats(),
      //   passengersService.getStats(),
      //   routesService.getStats(),
      //   alertsService.getStats()
      // ]);

      // Mock temporário
      const mockStats = { total: 0, active: 0, inactive: 0 };
      stats = {
        drivers: mockStats,
        vehicles: mockStats,
        passengers: mockStats,
        routes: mockStats,
        alerts: mockStats,
      };

    } else {
      // Outros roles têm acesso limitado
      return NextResponse.json(
        { error: 'Acesso negado às estatísticas' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: stats,
    });

  } catch (error) {
    return handleApiError(error);
  }
});