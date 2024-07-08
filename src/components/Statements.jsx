import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

function Statements() {
  const [statements, setStatements] = useState([]);
  const [newStatement, setNewStatement] = useState('');
  const [newVariable, setNewVariable] = useState('');

  useEffect(() => {
    fetchStatements();
  }, []);

  const fetchStatements = async () => {
    const { data, error } = await supabase.from('statements').select('*');
    if (error) {
      console.error('Error fetching statements:', error);
    } else {
      console.log('Fetched statements:', data);
      setStatements(data);
    }
  };

  const addStatement = async () => {
    console.log('Adding statement:', newStatement, 'with variable:', newVariable);
    const { data, error } = await supabase.from('statements').insert([{ statement: newStatement, variable: newVariable }]);
    if (error) {
      console.error('Error adding statement:', error);
    } else {
      console.log('Statement added:', data);
      setStatements([...statements, data[0]]);
      setNewStatement('');
      setNewVariable('');
    }
  };

  const deleteStatement = async (id) => {
    const { error } = await supabase.from('statements').delete().eq('id', id);
    if (error) {
      console.error('Error deleting statement:', error);
    } else {
      setStatements(statements.filter(statement => statement.id !== id));
    }
  };

  return (
    <div className='p-4'>
      <h2 className='text-2xl md:text-3xl text-green-500 font-semibold mb-4 md:mb-8'>
        Daftar Pernyataan
      </h2>
      <div className='w-full flex flex-row md:flex-row justify-between md:justify-end items-center mb-4'>
        <div className='flex flex-col md:flex-row'>
          <input
            type="text"
            value={newStatement}
            onChange={(e) => setNewStatement(e.target.value)}
            placeholder="Pernyataan baru"
            className="p-2 border border-gray-300 bg-gray-100 rounded mb-2 md:mb-0 md:mr-4"
          />
          <input
            type="text"
            value={newVariable}
            onChange={(e) => setNewVariable(e.target.value)}
            placeholder="Tambahkan variabel"
            className="p-2 border border-gray-300 bg-gray-100 rounded mb-2 md:mb-0 md:mr-4"
          />
        </div>
        <button onClick={addStatement} className="bg-green-500 text-white py-2 px-4 rounded self-end">
          Tambah
        </button>
      </div>
        <table className="min-w-full border border-gray-300">
          <thead className='bg-green-500 text-white'>
            <tr>
              <th className='border border-gray-300 p-2'>No</th>
              <th className='border border-gray-300 p-2'>Pernyataan</th>
              <th className='border border-gray-300 p-2'>Variabel</th>
              <th className='border border-gray-300 p-2'>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {statements.map((statement, index) => (
              <tr key={statement.id} className='even:bg-gray-100'>
                <td className='border border-gray-300 p-2 text-center'>{index + 1}</td>
                <td className='border border-gray-300 p-2'>{statement.statement}</td>
                <td className='border border-gray-300 p-2 text-center'>{statement.variable}</td>
                <td className='border border-gray-300 p-2 text-center'>
                  <button 
                    className="bg-red-500 text-white py-1 px-2 rounded"
                    onClick={() => deleteStatement(statement.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}

export default Statements;
