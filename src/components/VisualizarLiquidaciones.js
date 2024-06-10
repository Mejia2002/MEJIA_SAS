import React, { useState, useEffect } from "react";
import firebaseApp from "../firebase/Firebase";
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';

const firestore = getFirestore(firebaseApp);

function VisualizarLiquidaciones() {
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [editLiquidacion, setEditLiquidacion] = useState(null);
  const [searchCedula, setSearchCedula] = useState("");
  const [filteredLiquidaciones, setFilteredLiquidaciones] = useState([]);
  const [editData, setEditData] = useState({
    cedula: "",
    primer_nombre: "",
    primer_apellido: "",
    fecha_inicio: "",
    fecha_finalizacion: "",
    dias_trabajados: 0,
    monto: 0,
    fecha_pago: "",
    motivo: "",
    detalles: "",
    tipo_pago: "",
  });

  useEffect(() => {
    const fetchLiquidaciones = async () => {
      try {
        const liquidacionesCollection = collection(firestore, "PagarLiquidacion");
        const liquidacionesSnapshot = await getDocs(liquidacionesCollection);
        const liquidacionesList = liquidacionesSnapshot.docs.map((doc) => {
          const data = doc.data();
          const fechaInicio = data.fecha_inicio && data.fecha_inicio.toDate ? data.fecha_inicio.toDate().toISOString().split('T')[0] : data.fecha_inicio;
          const fechaFinalizacion = data.fecha_finalizacion && data.fecha_finalizacion.toDate ? data.fecha_finalizacion.toDate().toISOString().split('T')[0] : data.fecha_finalizacion;
          const fechaPago = data.fecha_pago && data.fecha_pago.toDate ? data.fecha_pago.toDate().toISOString().split('T')[0] : data.fecha_pago;
          return {
            id: doc.id,
            ...data,
            fecha_inicio: fechaInicio,
            fecha_finalizacion: fechaFinalizacion,
            fecha_pago: fechaPago,
          };
        });
        setLiquidaciones(liquidacionesList);
        setFilteredLiquidaciones(liquidacionesList);
      } catch (error) {
        console.error("Error al obtener las liquidaciones:", error);
      }
    };

    fetchLiquidaciones();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, "PagarLiquidacion", id));
      setLiquidaciones(liquidaciones.filter((liquidacion) => liquidacion.id !== id));
      setFilteredLiquidaciones(filteredLiquidaciones.filter((liquidacion) => liquidacion.id !== id));
    } catch (error) {
      console.error("Error al borrar la liquidación:", error);
    }
  };

  const handleEdit = (liquidacion) => {
    setEditLiquidacion(liquidacion.id);
    setEditData({
      cedula: liquidacion.cedula,
      primer_nombre: liquidacion.primer_nombre,
      primer_apellido: liquidacion.primer_apellido,
      fecha_inicio: liquidacion.fecha_inicio,
      fecha_finalizacion: liquidacion.fecha_finalizacion,
      dias_trabajados: liquidacion.dias_trabajados,
      monto: liquidacion.monto,
      fecha_pago: liquidacion.fecha_pago,
      motivo: liquidacion.motivo,
      detalles: liquidacion.detalles,
      tipo_pago: liquidacion.tipo_pago,
    });
  };

  const handleSave = async (id) => {
    try {
      await updateDoc(doc(firestore, "PagarLiquidacion", id), {
        cedula: editData.cedula,
        primer_nombre: editData.primer_nombre,
        primer_apellido: editData.primer_apellido,
        fecha_inicio: new Date(editData.fecha_inicio),
        fecha_finalizacion: new Date(editData.fecha_finalizacion),
        dias_trabajados: editData.dias_trabajados,
        monto: editData.monto,
        fecha_pago: new Date(editData.fecha_pago),
        motivo: editData.motivo,
        detalles: editData.detalles,
        tipo_pago: editData.tipo_pago,
      });
      setLiquidaciones(
        liquidaciones.map((liquidacion) =>
          liquidacion.id === id ? { ...liquidacion, ...editData } : liquidacion
        )
      );
      setFilteredLiquidaciones(
        filteredLiquidaciones.map((liquidacion) =>
          liquidacion.id === id ? { ...liquidacion, ...editData } : liquidacion
        )
      );
      setEditLiquidacion(null);
    } catch (error) {
      console.error("Error al actualizar la liquidación:", error);
    }
  };

  const handleSearch = () => {
    const searchResults = liquidaciones.filter((liquidacion) =>
      liquidacion.cedula.includes(searchCedula)
    );
    setFilteredLiquidaciones(searchResults);
  };

  const handleShowAll = () => {
    setFilteredLiquidaciones(liquidaciones);
    setSearchCedula("");
  };

  return (
    <div className="container mt-5">
      <h3>Visualizar Liquidaciones</h3>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por cédula"
          value={searchCedula}
          onChange={(e) => setSearchCedula(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleSearch}>Buscar</button>
        <button className="btn btn-secondary mt-2 mx-2" onClick={handleShowAll}>Ver Todas</button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Cédula</th>
            <th>Primer Nombre</th>
            <th>Primer Apellido</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Finalización</th>
            <th>Días Trabajados</th>
            <th>Monto</th>
            <th>Fecha de Pago</th>
            <th>Motivo</th>
            <th>Detalles</th>
            <th>Tipo de Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredLiquidaciones.length > 0 ? (
            filteredLiquidaciones.map((liquidacion) => (
              <tr key={liquidacion.id}>
                {editLiquidacion === liquidacion.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.cedula}
                        onChange={(e) => setEditData({ ...editData, cedula: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.primer_nombre}
                        onChange={(e) => setEditData({ ...editData, primer_nombre: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.primer_apellido}
                        onChange={(e) => setEditData({ ...editData, primer_apellido: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        className="form-control"
                        value={editData.fecha_inicio}
                        onChange={(e) => setEditData({ ...editData, fecha_inicio: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        className="form-control"
                        value={editData.fecha_finalizacion}
                        onChange={(e) => setEditData({ ...editData, fecha_finalizacion: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={editData.dias_trabajados}
                        onChange={(e) => setEditData({ ...editData, dias_trabajados: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={editData.monto}
                        onChange={(e) => setEditData({ ...editData, monto: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        className="form-control"
                        value={editData.fecha_pago}
                        onChange={(e) => setEditData({ ...editData, fecha_pago: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.motivo}
                        onChange={(e) => setEditData({ ...editData, motivo: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.detalles}
                        onChange={(e) => setEditData({ ...editData, detalles: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.tipo_pago}
                        onChange={(e) => setEditData({ ...editData, tipo_pago: e.target.value })}
                      />
                    </td>
                    <td>
                      <button className="btn btn-success mr-2" onClick={() => handleSave(liquidacion.id)}>
                        Guardar
                      </button>
                      <button className="btn btn-secondary" onClick={() => setEditLiquidacion(null)}>
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{liquidacion.cedula}</td>
                    <td>{liquidacion.primer_nombre}</td>
                    <td>{liquidacion.primer_apellido}</td>
                    <td>{liquidacion.fecha_inicio}</td>
                    <td>{liquidacion.fecha_finalizacion}</td>
                    <td>{liquidacion.dias_trabajados}</td>
                    <td>{liquidacion.monto}</td>
                    <td>{liquidacion.fecha_pago}</td>
                    <td>{liquidacion.motivo}</td>
                    <td>{liquidacion.detalles}</td>
                    <td>{liquidacion.tipo_pago}</td>
                    <td>
                      <button className="btn btn-primary" onClick={() => handleEdit(liquidacion)}>
                        Editar
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(liquidacion.id)}>
                        Eliminar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" className="text-center">
                No se encontraron liquidaciones.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default VisualizarLiquidaciones;
