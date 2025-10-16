'use client';

import React from 'react';
import { ThemeProvider, DashboardView } from './DesignerDashboard';

const Dashboard: React.FC = () => {
  return (
    <ThemeProvider>
      <DashboardView />
    </ThemeProvider>
  );
};

export default Dashboard;