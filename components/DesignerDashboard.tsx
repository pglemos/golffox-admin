'use client';

import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import {
  LayoutDashboard,
  Map,
  Route,
  Car,
  Users,
  Building,
  ShieldCheck,
  LifeBuoy,
  Bell,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  MoreVertical,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  CreditCard,
  Settings,
  Search,
  PlusCircle,
  Filter,
  FileText
} from 'lucide-react';

// Registro dos componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

// --- HOOK PARA ANIMAÇÃO DE NÚMEROS ---
function useCountUp(end: number, duration: number = 1.5) {
    const count = useSpring(0, { stiffness: 100, damping: 20 });
    const rounded = useTransform(count, latest => Math.round(latest));

    useEffect(() => {
        const controls = count.set(end);
        return controls;
    }, [end, count]);

    return rounded;
}


// --- DADOS MOCKADOS ---
const kpiData = {
  activeRoutes: 12,
  onTimePercentage: 92,
  activeVehicles: 38,
  passengersToday: 1245,
};

const routeStatusData = [
  { id: 1, name: "Rota Minerva - Manhã", driver: "João Silva", vehicle: "ABC-1234", status: "onTime", passengers: "18/20", punctuality: "+1 min" },
  { id: 2, name: "Rota JBS - Manhã", driver: "Maria Oliveira", vehicle: "DEF-5678", status: "delayed", passengers: "15/15", punctuality: "+8 min" },
  { id: 3, name: "Rota Minerva - Tarde", driver: "Pedro Martins", vehicle: "XYZ-0011", status: "onTime", passengers: "20/20", punctuality: "-2 min" },
  { id: 4, name: "Rota JBS - Tarde", driver: "Carlos Souza", vehicle: "GHI-7890", status: "problem", passengers: "12/20", punctuality: "+15 min" },
  { id: 5, name: "Rota LogiCorp", driver: "Ana Costa", vehicle: "JKL-1357", status: "completed", passengers: "25/25", punctuality: "No horário" },
];

const vehiclesData = [
    { id: 1, plate: "ABC-1234", model: "Mercedes Sprinter", driver: "João Silva", status: "active" },
    { id: 2, plate: "DEF-5678", model: "Iveco Daily", driver: "Maria Oliveira", status: "inactive" },
    { id: 3, plate: "GHI-7890", model: "Renault Master", driver: "Carlos Souza", status: "maintenance" },
];

const companiesData = [
    { id: 1, name: "InnovateTech Soluções", contact: "contact@innovatetech.com", status: "active" },
    { id: 2, name: "Nexus Global", contact: "adm@nexusglobal.com", status: "active" },
    { id: 3, name: "Quantum Dynamics", contact: "support@quantum.com", status: "inactive" },
]

const permissionsData = [
    { role: "Admin", description: "Acesso total a todas as áreas do sistema, incluindo gerenciamento de usuários e permissões." },
    { role: "Operador", description: "Acesso para gerenciar funcionários e acompanhar rotas da sua empresa." },
    { role: "Motorista", description: "Acesso exclusivo ao aplicativo do motorista para visualização de rotas, checklist e navegação." },
    { role: "Passageiro", description: "Acesso ao aplicativo para rastreamento de rotas e histórico de viagens." },
];

const alertsData = [
    { id: 1, type: 'problem', title: "Pneu Furado - Veículo GHI-7890", description: "O motorista Carlos Souza reportou um pneu furado na Rota JBS - Tarde. A rota está impactada.", time: "2025-10-12 10:41:01" },
    { id: 2, type: 'delayed', title: "Trânsito Intenso - Rota JBS Manhã", description: "Atraso estimado de 10 minutos na Rota JBS - Manhã devido a congestionamento na Av. Principal.", time: "2025-10-12 08:21:30" },
    { id: 3, type: 'maintenance', title: "Manutenção Preventiva Agendada", description: "Veículo DEF-5678 com manutenção agendada para amanhã às 8h.", time: "2025-10-11 16:45:00" },
];

const financialData = {
    kpis: { revenue: 45230, expenses: 31890, profit: 13340 },
    transactions: [
        { id: 1, date: "2025-10-11", description: "Pagamento Contrato - InnovateTech", type: "income", amount: 20000 },
        { id: 2, date: "2025-10-10", description: "Combustível - Frota A", type: "expense", amount: -2500 },
        { id: 3, date: "2025-10-09", description: "Pagamento Contrato - Nexus Global", type: "income", amount: 15000 },
        { id: 4, date: "2025-10-08", description: "Manutenção - Veículo GHI-7890", type: "expense", amount: -1200 },
    ]
};

const punctualityChartData = {
  labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  datasets: [
    {
      label: 'Pontualidade (%)',
      data: [95, 92, 94, 88, 96, 98, 97],
      backgroundColor: 'rgba(52, 211, 153, 0.5)',
      borderColor: 'rgba(52, 211, 153, 1)',
      borderWidth: 2,
      borderRadius: 8,
      tension: 0.4,
    },
  ],
};

const vehicleStatusChartData = {
  labels: ['Em Movimento', 'Parado', 'Em Manutenção', 'Disponível'],
  datasets: [
    {
      label: 'Status da Frota',
      data: [38, 12, 5, 10],
      backgroundColor: ['#3b82f6', '#6b7280', '#f59e0b', '#10b981'],
      borderColor: 'transparent',
      borderWidth: 4,
    },
  ],
};


// --- CONTEXTO DE TEMA (CLARO/ESCURO) ---
type Theme = 'light' | 'dark';
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('golffox-theme') as Theme | null : 'light';
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('golffox-theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


// --- COMPONENTES DA UI ---

const StatusBadge = ({ status, type = "badge" }: { status: string, type?: "badge" | "dot" }) => {
  const statusConfig = {
    onTime: { icon: <Clock className="h-3 w-3" />, text: 'No Horário', color: 'text-blue-700 bg-blue-100 dark:text-blue-200 dark:bg-blue-500/20' },
    delayed: { icon: <AlertTriangle className="h-3 w-3" />, text: 'Atrasado', color: 'text-yellow-700 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-500/20' },
    problem: { icon: <XCircle className="h-3 w-3" />, text: 'Com Problema', color: 'text-red-700 bg-red-100 dark:text-red-200 dark:bg-red-500/20' },
    completed: { icon: <CheckCircle2 className="h-3 w-3" />, text: 'Concluída', color: 'text-green-700 bg-green-100 dark:text-green-200 dark:bg-green-500/20' },
    active: { icon: <CheckCircle2 className="h-3 w-3" />, text: 'Ativo', color: 'text-green-700 bg-green-100 dark:text-green-200 dark:bg-green-500/20' },
    maintenance: { icon: <Settings className="h-3 w-3" />, text: 'Manutenção', color: 'text-yellow-700 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-500/20' },
    inactive: { icon: <XCircle className="h-3 w-3" />, text: 'Inativo', color: 'text-slate-700 bg-slate-100 dark:text-slate-200 dark:bg-slate-500/20' },
  };
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.onTime;

  if (type === 'dot') {
      return (
         <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${config.color.split(' ')[1]}`} />
            <span className="text-sm">{config.text}</span>
         </div>
      )
  }

  return (
    <div className={`flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};

const KpiCard = ({ title, value, unit, icon, color }: {title: string, value: number, unit?: string, icon: React.ReactNode, color: string}) => {
    const animatedValue = useCountUp(value);
    
    return (
      <motion.div
        className="relative overflow-hidden bg-white/50 dark:bg-slate-800/50 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm"
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
            <div className="flex items-end gap-1">
                 <motion.p className="text-4xl font-bold text-slate-800 dark:text-white mt-1">{animatedValue}</motion.p>
                 {unit && <span className="text-2xl font-semibold text-slate-400 dark:text-slate-500 mb-0.5">{unit}</span>}
            </div>
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            {icon}
          </div>
        </div>
      </motion.div>
    );
};

const Sidebar = ({ isSidebarOpen, setSidebarOpen, isMobile, activeView, setActiveView }: { isSidebarOpen: boolean; setSidebarOpen: (isOpen: boolean) => void; isMobile: boolean; activeView: string, setActiveView: (view: string) => void }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { icon: <Map size={20} />, label: 'Mapa em Tempo Real' },
    { icon: <Route size={20} />, label: 'Rotas' },
    { icon: <Car size={20} />, label: 'Veículos' },
    { icon: <Users size={20} />, label: 'Motoristas' },
    { icon: <Building size={20} />, label: 'Empresas' },
    { icon: <ShieldCheck size={20} />, label: 'Permissões' },
    { icon: <LifeBuoy size={20} />, label: 'Socorro' },
    { icon: <Bell size={20} />, label: 'Alertas' },
    { icon: <BarChart3 size={20} />, label: 'Relatórios' },
    { icon: <CreditCard size={20} />, label: 'Financeiro' },
    { icon: <Settings size={20} />, label: 'Configurações' },
  ];
  
  const handleToggle = () => {
    if (isMobile) {
      setSidebarOpen(!isSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleNavClick = (viewLabel: string) => {
      setActiveView(viewLabel);
      if(isMobile) {
          setSidebarOpen(false);
      }
  }

  const sidebarVariants = {
    open: { width: isMobile ? '80%' : (isCollapsed ? 88 : 288), transition: { stiffness: 400, damping: 40 } },
    closed: { width: 0, transition: { stiffness: 400, damping: 40 } },
  };
  
  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
        {isMobile && <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)} 
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" />}
        <motion.div
          key="sidebar"
          variants={sidebarVariants}
          initial={isMobile ? "closed" : "open"}
          animate="open"
          exit="closed"
          className="fixed lg:relative top-0 left-0 h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 text-white flex flex-col z-50"
        >
          <div className={`flex items-center p-6 h-20 border-b border-slate-700/50 ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed || isMobile ? <span className="text-2xl font-bold tracking-wider">GOLFFOX</span> : null}
            <div onClick={handleToggle} className="p-2 rounded-full hover:bg-slate-700/50 transition-colors cursor-pointer">
                {isMobile ? <X /> : (isCollapsed ? <ChevronRight /> : <ChevronLeft />) }
            </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <motion.div
                key={item.label}
                onClick={() => handleNavClick(item.label)}
                className={`relative w-full flex items-center gap-4 p-3 rounded-lg hover:bg-slate-700/50 transition-colors text-left cursor-pointer ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
                whileTap={{ scale: 0.98 }}
              >
                {activeView === item.label && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg shadow-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.5 } }}
                    exit={{ opacity: 0 }}
                  />
                )}
                <div className="relative z-10">{item.icon}</div>
                {!isCollapsed || isMobile ? <span className="relative z-10 font-medium">{item.label}</span> : null}
              </motion.div>
            ))}
          </nav>
          <div className={`p-4 border-t border-slate-700/50 ${isCollapsed && !isMobile ? 'justify-center' : ''}`}>
             <div
                onClick={() => alert('Logout action triggered!')}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-slate-700/50 transition-colors text-left cursor-pointer"
              >
                <LogOut/>
                {!isCollapsed || isMobile ? <span>Sair</span> : null}
              </div>
          </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Header = ({ onMenuClick, title }: { onMenuClick: () => void, title: string }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="flex items-center justify-between h-20 px-4 md:px-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-200/50 dark:border-slate-700/50">
            <div onClick={onMenuClick} className="lg:hidden p-2 rounded-md -ml-2 text-slate-700 dark:text-slate-200 cursor-pointer">
                <Menu/>
            </div>
            <div className="hidden lg:block">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h1>
                 {title === 'Dashboard' && <p className="text-sm text-slate-500 dark:text-slate-400">Visão geral das suas operações de hoje.</p>}
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => toggleTheme()} 
                    className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    type="button"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                 <div className="relative">
                    <img src={`https://i.pravatar.cc/150?u=admin`} alt="Admin User" className="h-10 w-10 rounded-full cursor-pointer"/>
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-900"></span>
                </div>
            </div>
        </header>
    );
};

// --- COMPONENTES DE VISUALIZAÇÃO (PÁGINAS) ---

export const DashboardView = () => {
  const { theme } = useTheme();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
          backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
          titleColor: theme === 'dark' ? '#cbd5e1' : '#334155',
          bodyColor: theme === 'dark' ? '#94a3b8' : '#64748b',
          borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: theme === 'dark' ? '#94a3b8' : '#64748b' }
      },
      y: {
        grid: { color: theme === 'dark' ? '#334155' : '#e2e8f0' },
        ticks: { color: theme === 'dark' ? '#94a3b8' : '#64748b' }
      },
    },
  };
  
  const doughnutChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
          legend: {
              position: 'bottom' as const,
              labels: {
                  color: theme === 'dark' ? '#94a3b8' : '#64748b',
                  boxWidth: 12,
                  padding: 20,
                  font: { size: 12 }
              }
          }
      }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { stiffness: 100, damping: 20 } },
  };

  return (
    <motion.div key="dashboard" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Rotas Ativas" value={kpiData.activeRoutes} icon={<Route className="h-6 w-6 text-white" />} color="bg-blue-500" />
        <KpiCard title="Pontualidade" value={kpiData.onTimePercentage} unit="%" icon={<CheckCircle2 className="h-6 w-6 text-white" />} color="bg-green-500" />
        <KpiCard title="Veículos em Rota" value={kpiData.activeVehicles} icon={<Car className="h-6 w-6 text-white" />} color="bg-amber-500" />
        <KpiCard title="Passageiros (Hoje)" value={kpiData.passengersToday} icon={<Users className="h-6 w-6 text-white" />} color="bg-indigo-500" />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
        <div className="lg:col-span-3 bg-white/50 dark:bg-slate-800/50 p-6 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Pontualidade na Semana</h3>
            <div className="h-80">
                <Bar options={chartOptions as any} data={punctualityChartData} />
            </div>
        </div>
         <div className="lg:col-span-2 bg-white/50 dark:bg-slate-800/50 p-6 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 flex flex-col backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Status da Frota</h3>
            <div className="h-80 flex-1 flex items-center justify-center">
                <Doughnut options={doughnutChartOptions as any} data={vehicleStatusChartData} />
            </div>
        </div>
      </motion.div>
      <motion.div variants={itemVariants}>
         <RoutesView />
      </motion.div>
    </motion.div>
  );
};

const ActionMenu = ({ onAction, onClose }: { onAction: (action: string) => void; onClose: () => void }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);
    
    const actions = [
        { label: 'Ver Detalhes', icon: <Eye className="h-4 w-4 mr-2"/>, action: 'view'},
        { label: 'Editar', icon: <Edit className="h-4 w-4 mr-2"/>, action: 'edit'},
        { label: 'Excluir', icon: <Trash2 className="h-4 w-4 mr-2 text-red-500"/>, action: 'delete'},
    ];

    return (
        <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-4 top-12 z-10 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
            <ul className="py-1">
                {actions.map(action => (
                    <li key={action.action}>
                        <button onClick={() => onAction(action.action)} className={`w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 ${action.action === 'delete' ? 'hover:text-red-500' : ''}`}>
                           {action.icon} {action.label}
                        </button>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
};

const RoutesView = () => {
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const handleAction = (action: string, routeId: number) => {
        alert(`Ação: ${action} na Rota ID: ${routeId}`);
        setOpenMenuId(null);
    }
    
    return (
        <motion.div key="routes" className="bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
          <div className="p-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Gerenciamento de Rotas</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Crie, edite e visualize todas as rotas ativas.</p>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead className="border-b border-slate-200/50 dark:border-slate-700/50">
                      <tr>
                          <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rota</th>
                          <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Motorista</th>
                          <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Veículo</th>
                          <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                          <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Passageiros</th>
                          <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pontualidade</th>
                          <th className="p-4"></th>
                      </tr>
                  </thead>
                  <tbody>
                      {routeStatusData.map((route) => (
                          <tr key={route.id} className="border-b border-slate-200/50 dark:border-slate-700/50 last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                              <td className="p-4 font-medium text-slate-800 dark:text-white">{route.name}</td>
                              <td className="p-4 text-slate-600 dark:text-slate-300">{route.driver}</td>
                              <td className="p-4 text-slate-600 dark:text-slate-300">{route.vehicle}</td>
                              <td className="p-4"><StatusBadge status={route.status} /></td>
                              <td className="p-4 text-slate-600 dark:text-slate-300">{route.passengers}</td>
                              <td className={`p-4 font-medium ${route.punctuality.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>{route.punctuality}</td>
                              <td className="p-4 relative">
                                  <button onClick={() => setOpenMenuId(openMenuId === route.id ? null : route.id)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-700">
                                      <MoreVertical className="h-5 w-5"/>
                                  </button>
                                  <AnimatePresence>
                                      {openMenuId === route.id && <ActionMenu onAction={(action) => handleAction(action, route.id)} onClose={() => setOpenMenuId(null)} />}
                                  </AnimatePresence>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
        </motion.div>
    );
};

const MapView = () => (
    <motion.div
      key="map"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-[calc(100vh-10rem)] flex gap-8"
    >
        <div className="flex-1 bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-4 flex items-center justify-center backdrop-blur-sm">
             <p className="text-slate-500">Componente do Mapa Interativo</p>
        </div>
        <div className="w-80 bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-6 flex flex-col backdrop-blur-sm">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Veículos Ativos</h3>
             <div className="mt-4 flex-1 overflow-y-auto space-y-4">
                {routeStatusData.slice(0, 3).map(r => (
                    <div key={r.id} className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700/50">
                        <p className="font-semibold">{r.vehicle}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{r.driver}</p>
                        <StatusBadge status={r.status} type="dot" />
                    </div>
                ))}
            </div>
        </div>
    </motion.div>
);

const VehiclesView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return(
        <motion.div
            key="vehicles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm"
        >
          <div className="p-6 flex justify-between items-center">
            <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Gerenciamento de Frota</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Adicione, edite e monitore todos os veículos.</p>
            </div>
            <motion.button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                whileHover={{ y: -2 }} whileTap={{ y: 0, scale: 0.98 }}
            >
                <PlusCircle size={18}/> Adicionar Veículo
            </motion.button>
          </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead className="border-b border-slate-200/50 dark:border-slate-700/50">
                      <tr>
                          <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Placa</th>
                          <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Modelo</th>
                          <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Motorista Atual</th>
                          <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                          <th className="p-4"></th>
                      </tr>
                  </thead>
                  <tbody>
                      {vehiclesData.map((vehicle) => (
                          <tr key={vehicle.id} className="border-b border-slate-200/50 dark:border-slate-700/50 last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                              <td className="p-4 font-mono text-slate-800 dark:text-white">{vehicle.plate}</td>
                              <td className="p-4 text-slate-600 dark:text-slate-300">{vehicle.model}</td>
                              <td className="p-4 text-slate-600 dark:text-slate-300">{vehicle.driver}</td>
                              <td className="p-4"><StatusBadge status={vehicle.status} /></td>
                              <td className="p-4 relative">
                                  <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-700">
                                      <MoreVertical className="h-5 w-5"/>
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
           <AnimatePresence>
            {isModalOpen && <Modal title="Adicionar Novo Veículo" onClose={() => setIsModalOpen(false)}>
                <form className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Placa</label>
                        <input type="text" className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600"/>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Modelo</label>
                        <input type="text" className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600"/>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Capacidade</label>
                        <input type="number" className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600"/>
                    </div>
                </form>    
            </Modal>}
           </AnimatePresence>
        </motion.div>
    );
};

const DriversView = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredDrivers = routeStatusData.filter(d => d.driver.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <motion.div
            key="drivers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="mb-6 relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                 <input 
                    type="text"
                    placeholder="Buscar motorista..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-sm pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm"
                 />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                {filteredDrivers.map(d => (
                     <motion.div 
                        layout
                        key={d.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-6 text-center backdrop-blur-sm"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                     >
                        <img src={`https://i.pravatar.cc/150?u=${d.driver}`} alt={d.driver} className="h-24 w-24 rounded-full mx-auto mb-4"/>
                        <h4 className="font-bold text-lg">{d.driver}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{d.vehicle}</p>
                    </motion.div>
                ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const CompaniesView = () => (
    <motion.div key="companies" className="bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Gestão de Empresas</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Visualize e gerencie as empresas clientes.</p>
      </div>
      <div className="overflow-x-auto">
          <table className="w-full text-left">
              <thead className="border-b border-slate-200/50 dark:border-slate-700/50">
                  <tr>
                      <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome da Empresa</th>
                      <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contato</th>
                      <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="p-4"></th>
                  </tr>
              </thead>
              <tbody>
                  {companiesData.map((company) => (
                      <tr key={company.id} className="border-b border-slate-200/50 dark:border-slate-700/50 last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                          <td className="p-4 font-medium text-slate-800 dark:text-white">{company.name}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-300">{company.contact}</td>
                          <td className="p-4"><StatusBadge status={company.status} /></td>
                          <td className="p-4 relative">
                              <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-700">
                                  <MoreVertical className="h-5 w-5"/>
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </motion.div>
);

const PermissionsView = () => (
     <motion.div
        key="permissions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
    >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {permissionsData.map(p => (
                <div key={p.role} className="bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-6 backdrop-blur-sm">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">{p.role}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{p.description}</p>
                    <button className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700">Editar Permissões</button>
                </div>
            ))}
        </div>
    </motion.div>
);

const RescueDispatchView = () => (
    <motion.div
        key="rescue"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl mx-auto"
    >
         <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-8 space-y-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Despacho de Socorro</h2>
            <div>
                <label className="text-sm font-medium">1. Selecione a Rota com Problema</label>
                <select className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600">
                    <option>Rota JBS - Tarde (Veículo: GHI-7890)</option>
                </select>
            </div>
             <div>
                <label className="text-sm font-medium">2. Escolha o Motorista de Socorro</label>
                <select className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600">
                    <option>Júlio Silva (Status: Ativo)</option>
                </select>
            </div>
             <div>
                <label className="text-sm font-medium">3. Escolha o Veículo de Socorro</label>
                <select className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600">
                    <option>ABC-1234 (Mercedes Sprinter)</option>
                </select>
            </div>
            <button className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors">Despachar Socorro Agora</button>
        </div>
    </motion.div>
);

const AlertsView = () => {
    const alertIcons = {
        problem: <XCircle className="text-red-500"/>,
        delayed: <AlertTriangle className="text-yellow-500"/>,
        maintenance: <Settings className="text-blue-500"/>,
    }
    return (
     <motion.div
        key="alerts"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
    >
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-8 space-y-6 backdrop-blur-sm">
            {alertsData.map(alert => (
                <div key={alert.id} className="flex gap-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <div className="flex-shrink-0">{alertIcons[alert.type as keyof typeof alertIcons]}</div>
                    <div>
                        <p className="font-bold">{alert.title}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{alert.description}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{alert.time}</p>
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
    )
};

const ReportsView = () => (
    <motion.div
        key="reports"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
    >
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-8 backdrop-blur-sm">
            <h3 className="font-bold text-lg">Relatórios com IA</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Faça uma pergunta sobre as operações.</p>
            <textarea className="mt-4 w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600" placeholder="Ex: Qual rota teve o maior atraso?"></textarea>
            <button className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Gerar</button>
        </div>
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-8 backdrop-blur-sm">
            <h3 className="font-bold text-lg">Exportar Dados</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 flex justify-between items-center">
                    <div>
                        <FileText />
                        <p className="font-semibold mt-2">Relatório de Pontualidade</p>
                    </div>
                    <button className="text-sm font-semibold text-blue-600">Exportar CSV</button>
                </div>
                 <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 flex justify-between items-center">
                    <div>
                        <FileText />
                        <p className="font-semibold mt-2">Relatório de Passageiros</p>
                    </div>
                    <button className="text-sm font-semibold text-blue-600">Exportar CSV</button>
                </div>
            </div>
        </div>
    </motion.div>
);

const FinancialView = () => (
     <motion.div
        key="financial"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
    >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KpiCard title="Faturamento (Mês)" value={financialData.kpis.revenue} icon={<ArrowUpRight className="text-white"/>} color="bg-green-500"/>
            <KpiCard title="Custos (Mês)" value={financialData.kpis.expenses} icon={<ArrowUpRight className="text-white -scale-y-100"/>} color="bg-red-500"/>
            <KpiCard title="Lucro (Mês)" value={financialData.kpis.profit} icon={<CheckCircle2 className="text-white"/>} color="bg-blue-500"/>
        </div>
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
             <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Últimas Transações</h3>
             </div>
             <table className="w-full text-left">
                  <thead className="border-b border-slate-200/50 dark:border-slate-700/50">
                      <tr>
                          <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Data</th>
                          <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Descrição</th>
                          <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Valor</th>
                      </tr>
                  </thead>
                  <tbody>
                      {financialData.transactions.map((t) => (
                          <tr key={t.id} className="border-b border-slate-200/50 dark:border-slate-700/50 last:border-b-0">
                              <td className="p-4 text-slate-600 dark:text-slate-300">{t.date}</td>
                              <td className="p-4 font-medium text-slate-800 dark:text-white">{t.description}</td>
                              <td className={`p-4 font-medium ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </td>
                          </tr>
                      ))}
                  </tbody>
             </table>
        </div>
    </motion.div>
);

const SettingsView = () => {
    const [notifications, setNotifications] = useState({ alerts: true, summary: false });
    return (
     <motion.div
        key="settings"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto"
    >
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
            <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Configurações</h2>
                <p className="mt-1 text-slate-500 dark:text-slate-400">Gerencie suas preferências e conta.</p>
            </div>
            <div className="p-8 border-t border-slate-200/50 dark:border-slate-700/50">
                <h3 className="font-bold text-lg">Perfil</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                        <label className="text-sm font-medium">Nome</label>
                        <input type="text" defaultValue="Administrador" className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600"/>
                    </div>
                     <div>
                        <label className="text-sm font-medium">Email</label>
                        <input type="email" defaultValue="admin@golffox.com" className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600"/>
                    </div>
                </div>
            </div>
             <div className="p-8 border-t border-slate-200/50 dark:border-slate-700/50">
                <h3 className="font-bold text-lg">Notificações</h3>
                <div className="space-y-4 mt-4">
                    <div className="flex justify-between items-center">
                        <p>Alertas críticos em tempo real</p>
                        <button onClick={() => setNotifications(n => ({...n, alerts: !n.alerts}))} className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications.alerts ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                            <motion.div layout className={`w-4 h-4 rounded-full bg-white transition-transform`} style={{translateX: notifications.alerts ? '100%' : '0%'}} />
                        </button>
                    </div>
                     <div className="flex justify-between items-center">
                        <p>Resumo diário por email</p>
                         <button onClick={() => setNotifications(n => ({...n, summary: !n.summary}))} className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications.summary ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                            <motion.div layout className={`w-4 h-4 rounded-full bg-white transition-transform`} style={{translateX: notifications.summary ? '100%' : '0%'}} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
    );
};


const Modal = ({title, onClose, children}: {title: string, onClose: () => void, children: React.ReactNode}) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm" onClick={onClose}>
            <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.98 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><X size={20}/></button>
                </div>
                <div className="p-6">
                    {children}
                </div>
                 <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-700">Cancelar</button>
                    <button onClick={() => { alert('Salvo!'); onClose(); }} className="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700">Salvar</button>
                </div>
            </motion.div>
        </div>
    )
}

const GenericView = ({ title }: { title: string }) => (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-8 backdrop-blur-sm"
    >
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>
        <p className="mt-4 text-slate-500 dark:text-slate-400">Conteúdo para a página de {title} será exibido aqui.</p>
    </motion.div>
);

// --- COMPONENTE INTERNO DO DASHBOARD QUE USA O TEMA ---
const DashboardContent = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeView, setActiveView] = useState('Dashboard');
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    setSidebarOpen(window.innerWidth >= 1024);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const renderActiveView = () => {
    switch (activeView) {
        case 'Dashboard': return <DashboardView />;
        case 'Rotas': return <RoutesView />;
        case 'Mapa em Tempo Real': return <MapView />;
        case 'Veículos': return <VehiclesView />;
        case 'Motoristas': return <DriversView />;
        case 'Empresas': return <CompaniesView />;
        case 'Permissões': return <PermissionsView />;
        case 'Socorro': return <RescueDispatchView />;
        case 'Alertas': return <AlertsView />;
        case 'Relatórios': return <ReportsView />;
        case 'Financeiro': return <FinancialView />;
        case 'Configurações': return <SettingsView />;
        default: return <GenericView title={activeView} />;
    }
  };

  return (
    <div className="relative bg-slate-100 dark:bg-slate-900 min-h-screen flex text-slate-800 dark:text-slate-200 font-sans overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vh] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"/>
            <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-green-500/20 dark:bg-green-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"/>
            <div className="absolute top-1/4 right-0 w-[60vw] h-[60vh] bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-4000"/>
      </div>
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} activeView={activeView} setActiveView={setActiveView} />
      
      <main className="relative z-10 flex-1 flex flex-col transition-all duration-300">
        <Header onMenuClick={() => setSidebarOpen(true)} title={activeView} />

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
                {renderActiveView()}
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
};


// --- PÁGINA PRINCIPAL QUE FORNECE O TEMA ---
export default function DashboardPage() {
    return (
        <ThemeProvider>
            <style>{`
                @keyframes pulse-slow {
                    0%, 100% {
                        transform: scale(1) rotate(0deg);
                        opacity: 0.3;
                    }
                    50% {
                        transform: scale(1.2) rotate(5deg);
                        opacity: 0.5;
                    }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 20s infinite ease-in-out;
                }
                .animation-delay-2000 {
                    animation-delay: -2s;
                }
                 .animation-delay-4000 {
                    animation-delay: -4s;
                }
            `}</style>
            <DashboardContent />
        </ThemeProvider>
    );
}

