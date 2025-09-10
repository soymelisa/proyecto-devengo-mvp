// Tipos principales del sistema
export interface Student {
  id: string;
  name: string;
  program: string;
  campus: string;
  modality: 'Presencial' | 'Online' | 'Sabatina';
  level: string;
  subjects: string[];
  payments: Payment[];
  status: 'Activo' | 'En Riesgo' | 'Sin CxC';
  enrollmentDate: string;
  nextCycleEnrolled: boolean;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  type: 'Matrícula' | 'Mensualidad' | 'Adelanto';
  status: 'Pagado' | 'Pendiente' | 'Vencido';
}

export interface Campus {
  id: string;
  name: string;
  city: string;
  programs: Program[];
}

export interface Program {
  id: string;
  name: string;
  price: number;
  modalities: string[];
  duration: number;
}

export interface FinancialProjection {
  id: string;
  version: string;
  createdBy: string;
  createdAt: string;
  campus: string;
  program: string;
  modality: string;
  parameters: ProjectionParameters;
  results: ProjectionResults;
}

export interface ProjectionParameters {
  activeEnrollment: number;
  retentionRate: number;
  reinscriptionRate: number;
  discountRate: number;
  basePrice: number;
}

export interface ProjectionResults {
  projectedRevenue: number;
  adjustedRevenue: number;
  studentCount: number;
  averagePayment: number;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface RevenueData {
  period: string;
  campus: string;
  program: string;
  modality: string;
  projected: number;
  actual: number;
  variance: number;
}

// Nuevos tipos para Matrícula Activa
export interface ActiveStudent {
  id: string;
  brand: string;
  name: string;
  program: string;
  programLevel: string;
  schoolCycle: string;
  campus: string;
  modality: 'Presencial' | 'Online' | 'Sabatina';
  enrollmentType: 'RI' | 'NI' | 'RA'; // Reinscripción, Nuevo Ingreso, Reactivación
  subjects: string[];
  cashInPayments: CashInPayment[];
  status: 'Activa' | 'Activa en Riesgo' | 'Activa sin CxC';
  enrollmentDate: string;
  nextCycleEnrolled: boolean;
  lastPaymentDate: string;
  totalPaid: number;
}

export interface CashInPayment {
  id: string;
  amount: number;
  date: string;
  concept: string;
  method: 'Efectivo' | 'Transferencia' | 'Tarjeta';
  status: 'Confirmado' | 'Pendiente';
}

export interface EnrollmentProjection {
  id: string;
  month: string;
  year: number;
  campus: string;
  program: string;
  modality: string;
  intercycleRetention: number; // % retención interciclo
  intracycleRetention: number; // % retención intraciclo
  projectedEnrollment: number;
  actualEnrollment?: number;
  variance?: number;
  isReal: boolean; // true si ya es dato real, false si es proyección
}

export interface MonthlyEnrollmentCut {
  id: string;
  cutDate: string;
  month: string;
  year: number;
  totalActive: number;
  totalRisk: number;
  totalNoCxC: number;
  newEnrollments: number;
  reinscriptions: number;
  reactivations: number;
  dropouts: number;
  campus: string;
  program: string;
}

export interface RetentionParameters {
  id: string;
  month: string;
  year: number;
  campus: string;
  program: string;
  intercycleRetention: number;
  intracycleRetention: number;
  createdBy: string;
  createdAt: string;
}