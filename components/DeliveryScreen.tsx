import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import Button from './NeonButton';
import { Screen, EPPRequest } from '../types';

interface DeliveryScreenProps {
  onBack: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const DeliveryScreen = ({ onBack, showToast }: DeliveryScreenProps) => {
  const { state, logoutApprover, approveAndProcessDelivery, findItemById } = useInventory();
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const pendingRequests = state.requests;
  const { currentApprover } = state;

  const handleApprove = async (request: EPPRequest) => {
    setProcessingId(request.id);
    const result = await approveAndProcessDelivery(request);
    if (result.success) {
      showToast('Solicitud aprobada y registrada en Google Sheets.', 'success');
    } else {
      showToast(`Error al aprobar: ${result.error}`, 'error');
    }
    setProcessingId(null);
  };
  
  const handleGoBack = () => {
    logoutApprover();
    onBack();
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-4">{Screen.DELIVERY}</h2>
      
      {currentApprover && (
        <div className="mb-8 p-4 bg-[#fff7ed] border border-[#fed7aa] rounded-lg text-center">
            <p className="text-lg text-[#7c2d12] font-bold">Aprobador: {currentApprover.name}</p>
            <p className="text-sm text-[#f97216] font-mono">ID: {currentApprover.id}</p>
        </div>
      )}

      <div className="space-y-6">
        {pendingRequests.length > 0 ? (
          pendingRequests.map(request => (
            <div key={request.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">Solicitud: <span className="font-mono text-[#f97216]">{request.id}</span></h3>
                    <p className="text-gray-600 mt-1">
                      <span className="font-semibold">Solicitante:</span> {request.requesterName} ({request.requesterId})
                    </p>
                    <p className="text-gray-600"><span className="font-semibold">Motivo:</span> {request.reason}</p>
                  </div>
                  <Button 
                    variant="secondary" 
                    onClick={() => handleApprove(request)}
                    disabled={processingId === request.id}
                  >
                    {processingId === request.id ? 'Procesando...' : 'Aprobar'}
                  </Button>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-300">
                <h4 className="font-semibold text-gray-700 mb-2">Artículos para Aprobación:</h4>
                <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-200">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-slate-100 z-10">
                            <tr>
                                <th className="p-2 text-sm font-bold uppercase text-gray-600">Artículo</th>
                                <th className="p-2 text-sm font-bold uppercase text-gray-600">Código Colaborador</th>
                                <th className="p-2 text-sm font-bold uppercase text-gray-600">Nombre Colaborador</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {request.items.map((item, index) => (
                                <tr key={`${request.id}-${item.itemId}-${index}`} className="border-b border-slate-200 last:border-b-0">
                                    <td className="p-2">
                                        <p className="font-semibold text-gray-800">{findItemById(item.itemId)?.description || 'Desconocido'}</p>
                                        <p className="text-sm text-gray-500 font-mono">{item.itemId}</p>
                                    </td>
                                    <td className="p-2 font-mono text-gray-700">
                                        {item.employees[0].employeeId}
                                    </td>
                                    <td className="p-2 text-gray-800">
                                        {item.employees[0].employeeName}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10 border-2 border-dashed border-slate-300 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <p className="mt-4 font-semibold">No hay solicitudes pendientes.</p>
          </div>
        )}
      </div>
      <div className="mt-8 border-t border-slate-200 pt-6">
        <Button onClick={handleGoBack} variant="primary">Volver</Button>
      </div>
    </div>
  );
};

export default DeliveryScreen;