import React, { useEffect, useState } from 'react';
import { useCamarasContext } from '../../context/CamarasContext';
import type { Camara, CreateCamaraPayload, UpdateCamaraPayload } from '../../types/entities';

interface CamaraFormProps {
  areaId: number;
  camaraId?: number | null;
  onClose: () => void;
}

const CamaraForm: React.FC<CamaraFormProps> = ({ areaId, camaraId, onClose }) => {
  const { getById, createCamara, updateCamara } = useCamarasContext();
  const [form, setForm] = useState<Partial<Camara>>({
    id_area: areaId,
    nombre: '',
    ip_stream: '',
    estado: 'activo',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (camaraId) {
      setLoading(true);
      getById(camaraId).then(camara => {
        if (camara) setForm(camara);
        setLoading(false);
      });
    }
  }, [camaraId, getById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (camaraId) {
      await updateCamara({ ...form, id_camara: camaraId } as UpdateCamaraPayload);
    } else {
      await createCamara(form as CreateCamaraPayload);
    }
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg space-y-4">
        <h3 className="text-lg font-semibold">{camaraId ? 'Editar cámara' : 'Nueva cámara'}</h3>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre de la cámara"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="ip_stream"
          value={form.ip_stream}
          onChange={handleChange}
          placeholder="IP o URL de stream"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="activo">Activa</option>
          <option value="inactivo">Inactiva</option>
        </select>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CamaraForm;