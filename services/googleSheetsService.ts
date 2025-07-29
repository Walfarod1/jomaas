import { EPPRequest, InventoryItem, AuthorizedApprover, EmployeeDotation } from '../types';

// --- TYPE DEFINITIONS for backend communication ---
interface InitialData {
    inventory: InventoryItem[];
    authorizedApprovers: AuthorizedApprover[];
    eppColumns: string[];
    error?: string;
}

interface ProcessResult {
    success: boolean;
    error?: string;
}

interface DotationResult {
    found: boolean;
    data?: EmployeeDotation;
    error?: string;
    message?: string;
}

// --- MOCK DATA FOR LOCAL DEVELOPMENT ---
const IS_LOCAL = typeof google === 'undefined' || typeof google.script === 'undefined';

const MOCK_EPP_COLUMNS = [
    "Casco de Seguridad Blanco",
    "Lentes de Seguridad Claros",
    "Guantes de Nitrilo",
    "Protector Auditivo de Copa",
    "Zapatos de Seguridad",
    "Mascarilla Desechable"
];

const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'CAS-001', description: 'Casco de Seguridad Blanco', quantity: 50 },
  { id: 'LEN-002', description: 'Lentes de Seguridad Claros', quantity: 120 },
  { id: 'GUA-003', description: 'Guantes de Nitrilo', quantity: 300 },
  { id: 'PRO-004', description: 'Protector Auditivo de Copa', quantity: 75 },
  { id: 'ZAP-005', description: 'Zapatos de Seguridad', quantity: 40 },
  { id: 'MAS-006', description: 'Mascarilla Desechable', quantity: 1000 },
];

const MOCK_APPROVERS: AuthorizedApprover[] = [
  { id: '5658', name: 'William Alfaro Delgado' },
  { id: '9876', name: 'Ana Solís' },
];

const MOCK_DELIVERIES: { [employeeId: string]: { employeeName: string, items: Record<string, string> } } = {
  '5658': {
      employeeName: 'William Alfaro Delgado',
      items: {
          "Casco de Seguridad Blanco": "20/07/2024",
          "Zapatos de Seguridad": "15/06/2024",
      }
  },
  '1234': {
      employeeName: 'Carlos Ramirez',
      items: {
          "Lentes de Seguridad Claros": "18/07/2024",
          "Guantes de Nitrilo": "18/07/2024",
      }
  }
};


if (IS_LOCAL) {
    console.log(
      '%cMODO DE DESARROLLO LOCAL ACTIVADO',
      'color: #f97216; font-size: 14px; font-weight: bold; background-color: #fff7ed; padding: 4px 8px; border-radius: 4px; border: 1px solid #fed7aa;'
    );
}

// --- SERVICE FUNCTIONS (INTELLIGENT DISPATCH) ---

export const getInitialData = (): Promise<InitialData> => {
    if (IS_LOCAL) {
        return new Promise(resolve => setTimeout(() => resolve({
            inventory: MOCK_INVENTORY,
            authorizedApprovers: MOCK_APPROVERS,
            eppColumns: MOCK_EPP_COLUMNS,
        }), 500));
    }
    return new Promise((resolve, reject) => {
        google.script.run
            .withSuccessHandler(resolve)
            .withFailureHandler(reject)
            .getInitialData();
    });
};

export const processDelivery = (request: EPPRequest, approver: AuthorizedApprover): Promise<ProcessResult> => {
    if (IS_LOCAL) {
         console.log("Procesando entrega localmente:", { request, approver });
        // Simulate stock reduction
        request.items.forEach(reqItem => {
            const itemInStock = MOCK_INVENTORY.find(invItem => invItem.id === reqItem.itemId);
            if (itemInStock && itemInStock.quantity > 0) {
                itemInStock.quantity -= 1;
            }
        });
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
    }
    return new Promise((resolve, reject) => {
        google.script.run
            .withSuccessHandler(resolve)
            .withFailureHandler(reject)
            .processDelivery(request, approver);
    });
};

export const getEmployeeDotation = (employeeId: string): Promise<DotationResult> => {
    if (IS_LOCAL) {
        const dotation = MOCK_DELIVERIES[employeeId];
        if (dotation) {
            return new Promise(resolve => setTimeout(() => resolve({
                found: true,
                data: {
                    employeeId: employeeId,
                    employeeName: dotation.employeeName,
                    items: dotation.items,
                }
            }), 500));
        } else {
             return new Promise(resolve => setTimeout(() => resolve({
                found: false,
                message: `MODO LOCAL: No se encontraron entregas para el código: ${employeeId}`
             }), 500));
        }
    }
     return new Promise((resolve, reject) => {
        google.script.run
            .withSuccessHandler(resolve)
            .withFailureHandler(reject)
            .getEmployeeDotation(employeeId);
    });
};
