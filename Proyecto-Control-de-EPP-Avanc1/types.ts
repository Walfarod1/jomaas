export interface InventoryItem {
  id: string;
  description: string;
  quantity: number;
}

export interface AssignedEmployee {
  employeeId: string;
  employeeName: string;
}

export interface EPPRequestItem {
  itemId: string;
  quantity: 1; // Always 1 per assignment
  employees: [AssignedEmployee]; // Always a single employee
}

export type RequestReason = "Nueva Entrega" | "Cambio por Daño";

export interface EPPRequest {
  id: string;
  requesterName: string;
  requesterId: string;
  items: EPPRequestItem[];
  reason: RequestReason;
  // Status is now implicit (it's in the app's state)
}

export interface Delivery {
  // This might not be needed anymore as we write directly to Control de EPP
  employeeId: string;
  employeeName: string;
  itemDescription: string;
  deliveryDate: string;
}

export interface EmployeeDotation {
  employeeId: string;
  employeeName: string;
  items: Record<string, string>; // key: item description, value: date string
}

export enum Screen {
  HOME = 'HOME',
  REQUEST = 'SOLICITUD DE EPP',
  DELIVERY = 'ENTREGA DE EPP',
  CONSULTA_DE_DOTACION = 'CONSULTA DE DOTACION',
  INVENTORY = 'CONTROL DE INVENTARIO',
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export interface AuthorizedApprover {
  id: string;
  name: string;
}
