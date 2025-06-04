import React, { useEffect, useState } from 'react';
import { X, Camera, Save, Loader2 } from 'lucide-react';
import { useCamarasContext } from '../../context/CamarasContext';
import type { Camara, CreateCamaraPayload, UpdateCamaraPayload } from '../../types/entities';

interface CamaraFormProps {
  areaId: number;
  camaraId?: number | null;
  nombre?: string;
  onClose: () => void;
}

const CamaraForm: React.FC<CamaraFormProps> = ({ areaId, camaraId, onClose }) => {
  const { getById, createCamara, updateCamara } = useCamarasContext();
  const [form, setForm] = useState<Partial<Camara>>({
    id_area: areaId,
    nombre: '',
    ip_stream: '',
    estado: 'activa',
  });
  const [protocol, setProtocol] = useState('http://');
  const [streamPath, setStreamPath] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para separar protocolo y path de una URL completa
  const parseStreamUrl = (url: string) => {
    if (url.startsWith('http://')) {
      return { protocol: 'http://', path: url.replace('http://', '') };
    } else if (url.startsWith('https://')) {
      return { protocol: 'https://', path: url.replace('https://', '') };
    } else if (url.startsWith('rtsp://')) {
      return { protocol: 'rtsp://', path: url.replace('rtsp://', '') };
    }
    return { protocol: 'http://', path: url };
  };

  useEffect(() => {
    if (camaraId) {
      setLoading(true);
      getById(camaraId).then(camara => {
        if (camara) {
          setForm(camara);
          // Separar protocolo y path al cargar una cámara existente
          const { protocol: extractedProtocol, path } = parseStreamUrl(camara.ip_stream || '');
          setProtocol(extractedProtocol);
          setStreamPath(path);
        }
        setLoading(false);
      });
    }
  }, [camaraId, getById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleProtocolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProtocol(e.target.value);
    // Actualizar el ip_stream completo cuando cambia el protocolo
    setForm(f => ({ ...f, ip_stream: e.target.value + streamPath }));
  };

  const handleStreamPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const path = e.target.value;
    setStreamPath(path);
    // Actualizar el ip_stream completo cuando cambia el path
    setForm(f => ({ ...f, ip_stream: protocol + path }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (camaraId) {
      await updateCamara({ ...form, id_camara: camaraId } as UpdateCamaraPayload);
      console.log(form);
    } else {
      await createCamara(form as CreateCamaraPayload);
    }
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {camaraId ? 'Editar cámara' : 'Nueva cámara'}
              </h3>
              <p className="text-sm text-gray-600">
                {camaraId ? 'Modifica la información de la cámara' : 'Agrega una nueva cámara de seguridad'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors duration-200"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nombre de la cámara
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Cámara Entrada Principal"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400"
              required
            />
          </div>

          {/* IP Stream con selector de protocolo */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              URL de stream
            </label>
            <div className="flex gap-1">
              <select
                value={protocol}
                onChange={handleProtocolChange}
                className="px-1 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white font-mono text-sm min-w-[10px]"
              >
                <option value="http://">http://</option>
                <option value="https://">https://</option>
                <option value="rtsp://">rtsp://</option>
              </select>
              
              <input
                type="text"
                value={streamPath}
                onChange={handleStreamPathChange}
                placeholder="192.168.1.100:8080/stream"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 font-mono text-sm"
                required
              />
            </div>
            {/* Preview de la URL completa */}
            <div className="text-xs text-gray-500 font-mono bg-gray-50 px-3 py-2 rounded border">
              URL: {protocol + streamPath || 'Ingresa la dirección del stream'}
            </div>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
            >
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Guardar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CamaraForm;