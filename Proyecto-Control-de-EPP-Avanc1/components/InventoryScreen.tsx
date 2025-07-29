import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import Button from './NeonButton';
import { Screen } from '../types';
import { getInventoryInsights } from '../services/geminiService';

interface InventoryScreenProps {
  onBack: () => void;
}

const InventoryScreen = ({ onBack }: InventoryScreenProps) => {
  const { state } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [assistantQuery, setAssistantQuery] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredInventory = state.inventory.filter(item =>
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAssistantSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!assistantQuery.trim()) return;
      
      setIsLoading(true);
      setAssistantResponse('');
      try {
        const response = await getInventoryInsights(state.inventory, assistantQuery);
        setAssistantResponse(response);
      } catch (error) {
          setAssistantResponse('Error al comunicarse con el asistente.');
      } finally {
          setIsLoading(false);
      }
  }

  const inputClass = "w-full bg-slate-100 border-2 border-slate-200 rounded-lg px-3 py-2 text-gray-700 focus:border-[#f97216] focus:ring-[#f97216] focus:outline-none transition-colors";

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl space-y-10">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8">{Screen.INVENTORY}</h2>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2 font-semibold">Buscar por código o descripción:</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={inputClass}
            placeholder="Ej: CAS-001 o Casco"
          />
        </div>
        <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-100 z-10">
              <tr>
                <th className="p-3 text-sm font-bold uppercase text-gray-600">Código</th>
                <th className="p-3 text-sm font-bold uppercase text-gray-600">Descripción</th>
                <th className="p-3 text-sm font-bold uppercase text-gray-600 text-right">Cantidad</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredInventory.map(item => (
                <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-3 font-mono text-gray-700">{item.id}</td>
                  <td className="p-3 text-gray-800">{item.description}</td>
                  <td className="p-3 text-right font-bold text-xl text-gray-800">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="pt-8 border-t border-slate-200">
        <h3 className="text-2xl font-extrabold text-gray-800 mb-4">Asistente de Inventario IA</h3>
        <form onSubmit={handleAssistantSubmit} className="flex flex-col sm:flex-row gap-4">
            <input 
                type="text"
                value={assistantQuery}
                onChange={e => setAssistantQuery(e.target.value)}
                className={inputClass}
                placeholder="Pregunta algo... ej: ¿qué artículos tienen menos de 20 unidades?"
                disabled={isLoading}
            />
            <Button type="submit" variant="secondary" disabled={isLoading} className="flex-shrink-0">
                {isLoading ? 'Pensando...' : 'Preguntar'}
            </Button>
        </form>
        { (isLoading || assistantResponse) && 
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 min-h-[6rem]">
                 <p className="text-gray-700 whitespace-pre-wrap font-medium">{isLoading ? "CYBER-CLERK está analizando los datos..." : assistantResponse}</p>
            </div>
        }
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <Button onClick={onBack} variant="primary">Volver</Button>
      </div>
    </div>
  );
};

export default InventoryScreen;