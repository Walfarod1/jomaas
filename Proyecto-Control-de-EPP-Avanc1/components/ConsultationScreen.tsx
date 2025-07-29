import React, { useState } from 'react';
import Button from './NeonButton';
import { Screen, EmployeeDotation } from '../types';
import * as GoogleSheets from '../services/googleSheetsService';


const ConsultationScreen = ({ onBack }: { onBack: () => void }) => {
  const [searchId, setSearchId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeDotation | null>(null);
  const [searchedId, setSearchedId] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;

    setIsLoading(true);
    setError(null);
    setEmployeeData(null);
    setSearchedId(searchId);

    try {
        const result = await GoogleSheets.getEmployeeDotation(searchId);
        if (result.found && result.data) {
            setEmployeeData(result.data);
        } else {
            setError(result.message || 'No se encontraron entregas para el código.');
        }
    } catch(err: any) {
        setError(err.message || 'Error al realizar la consulta.');
    } finally {
        setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-100 border-2 border-slate-200 rounded-lg px-3 py-2 text-gray-700 focus:border-[#f97216] focus:ring-[#f97216] focus:outline-none transition-colors";
  
  const receivedEppColumns = employeeData ? Object.keys(employeeData.items) : [];

  return (
    <div className="w-full max-w-7xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8">{Screen.CONSULTA_DE_DOTACION}</h2>
      
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className={inputClass}
          placeholder="Introduzca el código del colaborador (ej: 5658)"
          disabled={isLoading}
        />
        <Button type="submit" variant="secondary" className="flex-shrink-0" disabled={isLoading}>
          {isLoading ? 'Buscando...' : 'Buscar'}
        </Button>
      </form>

      {searchedId && !isLoading && (
        <div className="mt-8">
          {employeeData ? (
            <div>
              <div className="mb-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <p className="font-bold text-blue-800">Mostrando dotación para: <span className="font-mono">{employeeData.employeeName} ({employeeData.employeeId})</span></p>
              </div>
              
              {receivedEppColumns.length > 0 ? (
                <div className="max-w-full overflow-x-auto">
                    <table className="min-w-full text-left border-collapse border border-slate-300">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="p-3 text-sm font-bold uppercase text-gray-600 border border-slate-300">ID Empleado</th>
                          <th className="p-3 text-sm font-bold uppercase text-gray-600 border border-slate-300">Nombre</th>
                          {receivedEppColumns.map(desc => (
                            <th key={desc} className="p-3 text-sm font-bold uppercase text-gray-600 border border-slate-300 whitespace-nowrap">
                              {desc}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr>
                          <td className="p-3 font-mono text-gray-700 border border-slate-300">{employeeData.employeeId}</td>
                          <td className="p-3 text-gray-800 font-semibold border border-slate-300">{employeeData.employeeName}</td>
                          {receivedEppColumns.map(desc => (
                            <td key={desc} className="p-3 text-center text-gray-700 border border-slate-300">
                              {employeeData.items[desc] || '-'}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-10 border-2 border-dashed border-slate-300 rounded-xl">
                  <p className="font-semibold">Este colaborador no tiene EPP asignado actualmente.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10 border-2 border-dashed border-slate-300 rounded-xl">
              <p className="font-semibold">
                {error ? error : <>No se encontraron entregas para el código: <span className="font-mono">{searchedId}</span></>}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-10 border-t border-slate-200 pt-6">
        <Button onClick={onBack} variant="primary">Volver</Button>
      </div>
    </div>
  );
};

export default ConsultationScreen;