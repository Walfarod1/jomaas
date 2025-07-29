import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import Button from './NeonButton';
import { Screen, RequestReason, EPPRequestItem } from '../types';

// Interfaces for the new collaborator-centric data structure
interface ItemAssignment {
  id: number;
  itemId: string;
  itemDescription: string;
}

interface CollaboratorAssignment {
  id: number;
  employeeId: string;
  employeeName: string;
  items: ItemAssignment[];
  currentItemCode: string; // Temp state for the item code input for this specific collaborator
}

interface RequestScreenProps {
  onBack: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const RequestScreen = ({ onBack, showToast }: RequestScreenProps) => {
  const { addRequest, findItemById } = useInventory();

  // State for requester details
  const [requesterName, setRequesterName] = useState('');
  const [requesterId, setRequesterId] = useState('');
  const [reason, setReason] = useState<RequestReason>('Nueva Entrega');

  // State for the list of collaborators and their assigned items
  const [collaborators, setCollaborators] = useState<CollaboratorAssignment[]>([]);

  // State for the new collaborator being added
  const [newEmployeeId, setNewEmployeeId] = useState('');
  const [newEmployeeName, setNewEmployeeName] = useState('');

  const handleAddCollaborator = () => {
    if (!newEmployeeId || !newEmployeeName) {
      showToast('Debe ingresar el código y el nombre del colaborador.', 'error');
      return;
    }
    if (collaborators.some(c => c.employeeId === newEmployeeId)) {
      showToast('Este colaborador ya ha sido añadido a la solicitud.', 'error');
      return;
    }

    const newCollaborator: CollaboratorAssignment = {
      id: Date.now(),
      employeeId: newEmployeeId,
      employeeName: newEmployeeName,
      items: [],
      currentItemCode: '',
    };
    setCollaborators(prev => [...prev, newCollaborator]);
    setNewEmployeeId('');
    setNewEmployeeName('');
  };

  const removeCollaborator = (collaboratorId: number) => {
    setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
  };

  const handleItemCodeChange = (collaboratorId: number, code: string) => {
    setCollaborators(prev => prev.map(c =>
      c.id === collaboratorId ? { ...c, currentItemCode: code } : c
    ));
  };

  const handleAddItem = (collaboratorId: number) => {
    const collaborator = collaborators.find(c => c.id === collaboratorId);
    if (!collaborator || !collaborator.currentItemCode) {
      showToast('Por favor, introduzca un código de artículo.', 'error');
      return;
    }

    const item = findItemById(collaborator.currentItemCode);
    if (!item) {
      showToast('Código de artículo no encontrado.', 'error');
      return;
    }

    const newItem: ItemAssignment = {
      id: Date.now(),
      itemId: item.id,
      itemDescription: item.description,
    };

    setCollaborators(prev => prev.map(c =>
      c.id === collaboratorId
        ? { ...c, items: [...c.items, newItem], currentItemCode: '' }
        : c
    ));
  };
  
  const handleItemCodeKeyPress = (event: React.KeyboardEvent, collaboratorId: number) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleAddItem(collaboratorId);
    }
  }

  const removeItemFromCollaborator = (collaboratorId: number, itemId: number) => {
    setCollaborators(prev => prev.map(c =>
      c.id === collaboratorId
        ? { ...c, items: c.items.filter(item => item.id !== itemId) }
        : c
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requesterName || !requesterId) {
      showToast('Por favor, complete los datos del solicitante.', 'error');
      return;
    }
    if (collaborators.length === 0) {
      showToast('Debe añadir al menos un colaborador a la solicitud.', 'error');
      return;
    }
    if (collaborators.some(c => c.items.length === 0)) {
      showToast('Cada colaborador debe tener al menos un artículo asignado.', 'error');
      return;
    }

    const requestItems: EPPRequestItem[] = [];
    collaborators.forEach(collab => {
      collab.items.forEach(item => {
        requestItems.push({
          itemId: item.itemId,
          quantity: 1,
          employees: [{ employeeId: collab.employeeId, employeeName: collab.employeeName }]
        });
      });
    });

    addRequest({ requesterName, requesterId, items: requestItems, reason });
    showToast('Solicitud enviada y pendiente de aprobación.', 'success');

    // Reset form state
    setRequesterName('');
    setRequesterId('');
    setCollaborators([]);
  };

  const inputClass = "w-full bg-slate-100 border-2 border-slate-200 rounded-lg px-3 py-2 text-gray-700 focus:border-[#f97216] focus:ring-[#f97216] focus:outline-none transition-colors";

  return (
    <div className="w-full max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8">{Screen.REQUEST}</h2>
      <form onSubmit={handleSubmit} className="space-y-8">

        <fieldset className="p-6 border border-slate-200 rounded-xl">
          <legend className="px-2 text-xl font-bold text-gray-700">Datos del Solicitante</legend>
          <div className="grid grid-cols-1 md:grid-cols-[3fr,1fr] gap-6">
            <div>
              <label className="block text-gray-600 mb-2 font-semibold">Nombre del Solicitante</label>
              <input type="text" value={requesterName} onChange={e => setRequesterName(e.target.value)} className={inputClass} placeholder="Nombre de Jefatura" required />
            </div>
            <div>
              <label className="block text-gray-600 mb-2 font-semibold">Código</label>
              <input type="text" value={requesterId} onChange={e => setRequesterId(e.target.value)} className={inputClass} placeholder="Ej: 5658" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-600 mb-2 font-semibold">Motivo de la Solicitud</label>
              <select value={reason} onChange={e => setReason(e.target.value as RequestReason)} className={inputClass} required>
                <option>Nueva Entrega</option>
                <option>Cambio por Daño</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className="p-6 border border-slate-200 rounded-xl">
           <legend className="px-2 text-xl font-bold text-gray-700">Añadir Colaborador</legend>
           <div className="grid grid-cols-1 md:grid-cols-[1fr,4fr,auto] gap-4 items-end">
                <div>
                    <label className="block text-gray-600 mb-2 font-semibold">Código</label>
                    <input type="text" value={newEmployeeId} onChange={e => setNewEmployeeId(e.target.value)} className={inputClass} placeholder="Ej: 1234" />
                </div>
                 <div>
                    <label className="block text-gray-600 mb-2 font-semibold">Nombre del Colaborador</label>
                    <input type="text" value={newEmployeeName} onChange={e => setNewEmployeeName(e.target.value)} className={inputClass} placeholder="Mario Moreno Reyes" />
                </div>
                <Button type="button" onClick={handleAddCollaborator} variant="secondary">Añadir</Button>
           </div>
        </fieldset>

        {collaborators.length > 0 && (
          <fieldset className="p-6 border border-[#fed7aa] rounded-xl bg-[#fff7ed]">
            <legend className="px-2 text-xl font-bold text-[#9a3412]">Asignación de EPP</legend>
            <div className="space-y-6">
              {collaborators.map(collab => {
                const itemDescription = findItemById(collab.currentItemCode)?.description || '...';
                return (
                  <div key={collab.id} className="p-4 bg-white border border-slate-200 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="font-bold text-lg text-gray-800">{collab.employeeName}</p>
                        <p className="text-sm text-gray-500 font-mono">{collab.employeeId}</p>
                      </div>
                      <button type="button" onClick={() => removeCollaborator(collab.id)} className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </button>
                    </div>

                    {collab.items.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {collab.items.map(item => (
                          <li key={item.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-md border border-slate-200">
                             <div>
                                <p className="font-semibold text-gray-800">{item.itemDescription}</p>
                                <p className="text-sm text-gray-500 font-mono">{item.itemId}</p>
                            </div>
                            <button type="button" onClick={() => removeItemFromCollaborator(collab.id, item.id)} className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-[2fr,3fr,auto] gap-4 items-end pt-4 border-t border-slate-200">
                        <div>
                            <label className="block text-gray-600 mb-1 text-sm font-semibold">Código de Artículo</label>
                            <input 
                              type="text" 
                              value={collab.currentItemCode} 
                              onChange={e => handleItemCodeChange(collab.id, e.target.value)} 
                              onKeyPress={e => handleItemCodeKeyPress(e, collab.id)}
                              className={inputClass} 
                              placeholder="Ej: CAS-001" 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1 text-sm font-semibold">Descripción</label>
                            <p className="text-gray-500 h-11 flex items-center px-3 bg-slate-50 rounded-lg border border-slate-200">{itemDescription}</p>
                        </div>
                        <Button type="button" variant="secondary" onClick={() => handleAddItem(collab.id)} className="h-11">Añadir Artículo</Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </fieldset>
        )}

        <div className="flex justify-between items-center pt-6 border-t border-slate-200">
          <Button type="button" onClick={onBack} variant="primary">Volver</Button>
          <Button type="submit" variant="secondary" disabled={collaborators.length === 0 || collaborators.some(c => c.items.length === 0)}>
            Enviar Solicitud
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RequestScreen;