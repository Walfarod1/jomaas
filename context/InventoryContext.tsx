
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { InventoryItem, EPPRequest, AuthorizedApprover, EPPRequestItem, RequestReason } from '../types';
import * as GoogleSheets from '../services/googleSheetsService';

interface InventoryState {
  inventory: InventoryItem[];
  requests: EPPRequest[];
  authorizedApprovers: AuthorizedApprover[];
  eppColumns: string[];
  currentApprover: AuthorizedApprover | null;
  isLoading: boolean;
  error: string | null;
}

interface InventoryContextType {
  state: InventoryState;
  addRequest: (payload: { requesterName: string; requesterId: string; items: EPPRequestItem[]; reason: RequestReason }) => void;
  approveAndProcessDelivery: (request: EPPRequest) => Promise<{ success: boolean; error?: string }>;
  loginApprover: (approver: AuthorizedApprover) => void;
  logoutApprover: () => void;
  findItemById: (id: string) => InventoryItem | undefined;
  findApproverById: (id: string) => AuthorizedApprover | undefined;
  reloadData: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

interface InventoryProviderProps {
    children: ReactNode;
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({ children }) => {
  const [state, setState] = useState<InventoryState>({
    inventory: [],
    requests: [],
    authorizedApprovers: [],
    eppColumns: [],
    currentApprover: null,
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await GoogleSheets.getInitialData();
      if (data.error) {
        throw new Error(data.error);
      }
      setState(s => ({
        ...s,
        inventory: data.inventory,
        authorizedApprovers: data.authorizedApprovers,
        eppColumns: data.eppColumns,
        isLoading: false,
      }));
    } catch (err: any) {
      console.error("Failed to fetch initial data:", err);
      setState(s => ({ ...s, isLoading: false, error: err.message || 'Error al cargar los datos de la hoja de cálculo.' }));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const findItemById = useCallback((id: string) => {
    return state.inventory.find(item => item.id.toLowerCase() === id.toLowerCase());
  }, [state.inventory]);

  const findApproverById = useCallback((id: string) => {
    // Coerce to string to handle cases where Google Sheets sends a numeric ID
    return state.authorizedApprovers.find(app => app.id.toString() === id);
  }, [state.authorizedApprovers]);

  const addRequest = (payload: { requesterName: string; requesterId: string; items: EPPRequestItem[]; reason: RequestReason }) => {
    const newRequest: EPPRequest = {
      id: `REQ-${Date.now()}`,
      ...payload,
    };
    setState(s => ({ ...s, requests: [...s.requests, newRequest] }));
  };
  
  const approveAndProcessDelivery = async (requestToApprove: EPPRequest) => {
    if (!state.currentApprover) {
      console.error("Attempted to approve without a logged in approver.");
      return { success: false, error: "No hay un aprobador activo en la sesión." };
    }
    
    const result = await GoogleSheets.processDelivery(requestToApprove, state.currentApprover);
    
    if(result.success){
        // Remove approved request from local state
        setState(s => ({
            ...s,
            requests: s.requests.filter(req => req.id !== requestToApprove.id),
        }));
        // Refresh inventory data silently
        const data = await GoogleSheets.getInitialData();
         if (!data.error) {
            setState(s => ({ ...s, inventory: data.inventory }));
        }
    }
    return result;
  }

  const loginApprover = (approver: AuthorizedApprover) => {
    setState(s => ({ ...s, currentApprover: approver }));
  };

  const logoutApprover = () => {
    setState(s => ({ ...s, currentApprover: null }));
  };


  return (
    <InventoryContext.Provider value={{ 
        state, 
        addRequest, 
        approveAndProcessDelivery, 
        loginApprover, 
        logoutApprover, 
        findItemById, 
        findApproverById,
        reloadData: fetchData
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};