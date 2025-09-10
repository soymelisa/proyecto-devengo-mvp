import { Student, Campus, Program, FinancialProjection, RevenueData } from '../types';
import { ActiveStudent, EnrollmentProjection, MonthlyEnrollmentCut, RetentionParameters } from '../types';

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Ana García Martínez',
    program: 'Ingeniería en Sistemas',
    campus: 'Ciudad de México',
    modality: 'Presencial',
    level: '5to Semestre',
    subjects: ['Estructuras de Datos', 'Base de Datos', 'Redes'],
    payments: [
      { id: '1', amount: 12500, date: '2024-01-15', type: 'Matrícula', status: 'Pagado' },
      { id: '2', amount: 8500, date: '2024-02-15', type: 'Mensualidad', status: 'Pagado' }
    ],
    status: 'Activo',
    enrollmentDate: '2022-08-15',
    nextCycleEnrolled: true
  },
  {
    id: '2',
    name: 'Carlos Rodríguez López',
    program: 'Administración de Empresas',
    campus: 'Guadalajara',
    modality: 'Online',
    level: '3er Semestre',
    subjects: ['Finanzas', 'Marketing', 'Recursos Humanos'],
    payments: [
      { id: '3', amount: 9500, date: '2024-01-20', type: 'Matrícula', status: 'Pagado' },
      { id: '4', amount: 6500, date: '2024-02-20', type: 'Mensualidad', status: 'Vencido' }
    ],
    status: 'En Riesgo',
    enrollmentDate: '2023-01-20',
    nextCycleEnrolled: false
  },
  {
    id: '3',
    name: 'María Elena Sánchez',
    program: 'Derecho',
    campus: 'Monterrey',
    modality: 'Sabatina',
    level: '7mo Semestre',
    subjects: ['Derecho Penal', 'Derecho Civil', 'Procesal'],
    payments: [
      { id: '5', amount: 11000, date: '2024-01-10', type: 'Matrícula', status: 'Pagado' }
    ],
    status: 'Sin CxC',
    enrollmentDate: '2021-08-10',
    nextCycleEnrolled: true
  }
];

export const mockCampuses: Campus[] = [
  {
    id: '1',
    name: 'Ciudad de México',
    city: 'CDMX',
    programs: [
      { id: '1', name: 'Ingeniería en Sistemas', price: 12500, modalities: ['Presencial', 'Online'], duration: 8 },
      { id: '2', name: 'Administración de Empresas', price: 9500, modalities: ['Presencial', 'Online', 'Sabatina'], duration: 8 }
    ]
  },
  {
    id: '2',
    name: 'Guadalajara',
    city: 'GDL',
    programs: [
      { id: '3', name: 'Administración de Empresas', price: 9000, modalities: ['Online', 'Sabatina'], duration: 8 },
      { id: '4', name: 'Derecho', price: 11000, modalities: ['Presencial', 'Sabatina'], duration: 10 }
    ]
  }
];

export const mockProjections: FinancialProjection[] = [
  {
    id: '1',
    version: 'V2024.01',
    createdBy: 'Juan Pérez',
    createdAt: '2024-01-15',
    campus: 'Ciudad de México',
    program: 'Ingeniería en Sistemas',
    modality: 'Presencial',
    parameters: {
      activeEnrollment: 150,
      retentionRate: 85,
      reinscriptionRate: 90,
      discountRate: 10,
      basePrice: 12500
    },
    results: {
      projectedRevenue: 1595000,
      adjustedRevenue: 1435500,
      studentCount: 128,
      averagePayment: 11225
    }
  }
];

export const mockRevenueData: RevenueData[] = [
  {
    period: '2024-01',
    campus: 'Ciudad de México',
    program: 'Ingeniería en Sistemas',
    modality: 'Presencial',
    projected: 1595000,
    actual: 1523000,
    variance: -72000
  },
  {
    period: '2024-01',
    campus: 'Guadalajara',
    program: 'Administración de Empresas',
    modality: 'Online',
    projected: 850000,
    actual: 892000,
    variance: 42000
  }
];

export const mockActiveStudents: ActiveStudent[] = [
  {
    id: '1',
    brand: 'Lottus',
    name: 'Ana García Martínez',
    program: 'Ingeniería en Sistemas',
    programLevel: '5to Semestre',
    schoolCycle: '2024-1',
    campus: 'Ciudad de México',
    modality: 'Presencial',
    enrollmentType: 'RI',
    subjects: ['Estructuras de Datos', 'Base de Datos', 'Redes', 'Algoritmos'],
    cashInPayments: [
      { id: '1', amount: 12500, date: '2024-01-15', concept: 'Matrícula', method: 'Transferencia', status: 'Confirmado' },
      { id: '2', amount: 8500, date: '2024-02-15', concept: 'Mensualidad', method: 'Tarjeta', status: 'Confirmado' }
    ],
    status: 'Activa',
    enrollmentDate: '2022-08-15',
    nextCycleEnrolled: true,
    lastPaymentDate: '2024-02-15',
    totalPaid: 21000
  },
  {
    id: '2',
    brand: 'Lottus',
    name: 'Carlos Rodríguez López',
    program: 'Administración de Empresas',
    programLevel: '3er Semestre',
    schoolCycle: '2024-1',
    campus: 'Guadalajara',
    modality: 'Online',
    enrollmentType: 'NI',
    subjects: ['Finanzas', 'Marketing', 'Recursos Humanos'],
    cashInPayments: [
      { id: '3', amount: 9500, date: '2024-01-20', concept: 'Matrícula', method: 'Efectivo', status: 'Confirmado' },
      { id: '4', amount: 6500, date: '2024-02-20', concept: 'Mensualidad', method: 'Transferencia', status: 'Pendiente' }
    ],
    status: 'Activa en Riesgo',
    enrollmentDate: '2023-08-20',
    nextCycleEnrolled: false,
    lastPaymentDate: '2024-01-20',
    totalPaid: 9500
  },
  {
    id: '3',
    brand: 'Lottus',
    name: 'María Elena Sánchez',
    program: 'Derecho',
    programLevel: '7mo Semestre',
    schoolCycle: '2024-1',
    campus: 'Monterrey',
    modality: 'Sabatina',
    enrollmentType: 'RA',
    subjects: ['Derecho Penal', 'Derecho Civil', 'Procesal'],
    cashInPayments: [
      { id: '5', amount: 11000, date: '2024-01-10', concept: 'Matrícula', method: 'Tarjeta', status: 'Confirmado' }
    ],
    status: 'Activa sin CxC',
    enrollmentDate: '2021-08-10',
    nextCycleEnrolled: true,
    lastPaymentDate: '2024-01-10',
    totalPaid: 11000
  },
  {
    id: '4',
    brand: 'UVM',
    name: 'José Luis Hernández',
    program: 'Medicina',
    programLevel: '2do Semestre',
    schoolCycle: '2024-1',
    campus: 'Ciudad de México',
    modality: 'Presencial',
    enrollmentType: 'NI',
    subjects: ['Anatomía', 'Fisiología', 'Bioquímica'],
    cashInPayments: [
      { id: '6', amount: 25000, date: '2024-01-05', concept: 'Matrícula', method: 'Transferencia', status: 'Confirmado' },
      { id: '7', amount: 15000, date: '2024-02-05', concept: 'Mensualidad', method: 'Transferencia', status: 'Confirmado' }
    ],
    status: 'Activa',
    enrollmentDate: '2023-08-05',
    nextCycleEnrolled: true,
    lastPaymentDate: '2024-02-05',
    totalPaid: 40000
  },
  {
    id: '5',
    brand: 'UNITEC',
    name: 'Laura Patricia Morales',
    program: 'Psicología',
    programLevel: '4to Semestre',
    schoolCycle: '2024-1',
    campus: 'Guadalajara',
    modality: 'Online',
    enrollmentType: 'RI',
    subjects: ['Psicología Clínica', 'Neuropsicología', 'Terapia Cognitiva'],
    cashInPayments: [
      { id: '8', amount: 8000, date: '2024-01-12', concept: 'Matrícula', method: 'Tarjeta', status: 'Confirmado' }
    ],
    status: 'Activa sin CxC',
    enrollmentDate: '2022-08-12',
    nextCycleEnrolled: false,
    lastPaymentDate: '2024-01-12',
    totalPaid: 8000
  }
];

export const mockEnrollmentProjections: EnrollmentProjection[] = [
  {
    id: '1',
    month: 'Enero',
    year: 2024,
    campus: 'Ciudad de México',
    program: 'Ingeniería en Sistemas',
    modality: 'Presencial',
    intercycleRetention: 85,
    intracycleRetention: 95,
    projectedEnrollment: 150,
    actualEnrollment: 147,
    variance: -3,
    isReal: true
  },
  {
    id: '2',
    month: 'Febrero',
    year: 2024,
    campus: 'Ciudad de México',
    program: 'Ingeniería en Sistemas',
    modality: 'Presencial',
    intercycleRetention: 85,
    intracycleRetention: 95,
    projectedEnrollment: 145,
    actualEnrollment: 142,
    variance: -3,
    isReal: true
  },
  {
    id: '3',
    month: 'Marzo',
    year: 2024,
    campus: 'Ciudad de México',
    program: 'Ingeniería en Sistemas',
    modality: 'Presencial',
    intercycleRetention: 87,
    intracycleRetention: 96,
    projectedEnrollment: 148,
    isReal: false
  },
  {
    id: '4',
    month: 'Abril',
    year: 2024,
    campus: 'Ciudad de México',
    program: 'Ingeniería en Sistemas',
    modality: 'Presencial',
    intercycleRetention: 87,
    intracycleRetention: 96,
    projectedEnrollment: 152,
    isReal: false
  }
];

export const mockMonthlyEnrollmentCuts: MonthlyEnrollmentCut[] = [
  {
    id: '1',
    cutDate: '2024-01-31',
    month: 'Enero',
    year: 2024,
    totalActive: 2847,
    totalRisk: 89,
    totalNoCxC: 156,
    newEnrollments: 245,
    reinscriptions: 2456,
    reactivations: 146,
    dropouts: 67,
    campus: 'Todos',
    program: 'Todos'
  },
  {
    id: '2',
    cutDate: '2024-02-29',
    month: 'Febrero',
    year: 2024,
    totalActive: 2798,
    totalRisk: 112,
    totalNoCxC: 134,
    newEnrollments: 89,
    reinscriptions: 2567,
    reactivations: 142,
    dropouts: 98,
    campus: 'Todos',
    program: 'Todos'
  }
];

export const mockRetentionParameters: RetentionParameters[] = [
  {
    id: '1',
    month: 'Marzo',
    year: 2024,
    campus: 'Ciudad de México',
    program: 'Ingeniería en Sistemas',
    intercycleRetention: 87,
    intracycleRetention: 96,
    createdBy: 'Juan Pérez',
    createdAt: '2024-02-15'
  },
  {
    id: '2',
    month: 'Abril',
    year: 2024,
    campus: 'Ciudad de México',
    program: 'Ingeniería en Sistemas',
    intercycleRetention: 88,
    intracycleRetention: 97,
    createdBy: 'Juan Pérez',
    createdAt: '2024-02-15'
  }
];