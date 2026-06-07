export interface Report {
  id: string;
  title: string;
  date: string;
  author: string;
  type: 'sales' | 'inventory' | 'financial' | 'performance';
  summary: string;
  data: Record<string, unknown>[];
}

export const mockReports: Report[] = [
  {
    id: 'rpt-001',
    title: 'Q1 2024 Sales Report',
    date: '2024-03-31',
    author: 'John Smith',
    type: 'sales',
    summary: 'Quarterly sales performance analysis with regional breakdown',
    data: [
      { region: 'North', revenue: 125000, units: 1250, growth: 12.5 },
      { region: 'South', revenue: 98000, units: 980, growth: 8.2 },
      { region: 'East', revenue: 142000, units: 1420, growth: 15.7 },
      { region: 'West', revenue: 87000, units: 870, growth: 5.3 }
    ]
  },
  {
    id: 'rpt-002',
    title: 'Inventory Status Report',
    date: '2024-04-15',
    author: 'Sarah Johnson',
    type: 'inventory',
    summary: 'Current stock levels and reorder recommendations',
    data: [
      { product: 'Widget A', sku: 'WDG-001', inStock: 450, reorderLevel: 100, status: 'OK' },
      { product: 'Widget B', sku: 'WDG-002', inStock: 75, reorderLevel: 100, status: 'Low' },
      { product: 'Gadget X', sku: 'GDG-101', inStock: 1200, reorderLevel: 200, status: 'OK' },
      { product: 'Gadget Y', sku: 'GDG-102', inStock: 0, reorderLevel: 50, status: 'Out' }
    ]
  },
  {
    id: 'rpt-003',
    title: 'March 2024 Financial Summary',
    date: '2024-04-01',
    author: 'Mike Davis',
    type: 'financial',
    summary: 'Monthly financial overview including revenue, expenses, and profit margin',
    data: [
      { category: 'Revenue', amount: 452000, percentage: 100 },
      { category: 'Cost of Goods', amount: 180800, percentage: 40 },
      { category: 'Operating Expenses', amount: 135600, percentage: 30 },
      { category: 'Net Profit', amount: 135600, percentage: 30 }
    ]
  },
  {
    id: 'rpt-004',
    title: 'Employee Performance Q1',
    date: '2024-04-10',
    author: 'HR Department',
    type: 'performance',
    summary: 'Quarterly performance metrics for all departments',
    data: [
      { department: 'Engineering', tasksCompleted: 245, avgScore: 4.2, retention: 95 },
      { department: 'Sales', tasksCompleted: 189, avgScore: 4.5, retention: 88 },
      { department: 'Marketing', tasksCompleted: 156, avgScore: 4.0, retention: 92 },
      { department: 'Support', tasksCompleted: 312, avgScore: 4.3, retention: 90 }
    ]
  }
];

export const getReportById = (id: string): Report | undefined => {
  return mockReports.find(report => report.id === id);
};

export const getReportsByType = (type: Report['type']): Report[] => {
  return mockReports.filter(report => report.type === type);
};
