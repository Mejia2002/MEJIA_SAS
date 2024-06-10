import React, { useState, useEffect } from "react";
import firebaseApp from "../firebase/Firebase";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";

const firestore = getFirestore(firebaseApp);

function VisualizarPagosSueldo() {
  const [pagos, setPagos] = useState([]);
  const [editPago, setEditPago] = useState(null);
  const [searchCedula, setSearchCedula] = useState("");
  const [filteredPagos, setFilteredPagos] = useState([]);
  const [editData, setEditData] = useState({
    cedula: "",
    primer_nombre: "",
    primer_apellido: "",
    monto_pagar: "",
    fecha_pago: "",
    año: "",
    mes: "",
    numero_quincena: "",
    detalles: "",
    tipo_pago: "",
  });

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const pagosCollection = collection(firestore, "PagarSueldo");
        const pagosSnapshot = await getDocs(pagosCollection);
        const pagosList = pagosSnapshot.docs.map((doc) => {
          const data = doc.data();
          const fechaPago = data.fecha_pago && data.fecha_pago.toDate ? data.fecha_pago.toDate().toISOString().split('T')[0] : data.fecha_pago;
          return {
            id: doc.id,
            ...data,
            fecha_pago: fechaPago,
          };
        });
        setPagos(pagosList);
        setFilteredPagos(pagosList);
      } catch (error) {
        console.error("Error al obtener los pagos:", error);
      }
    };

    fetchPagos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, "PagarSueldo", id));
      setPagos(pagos.filter((pago) => pago.id !== id));
      setFilteredPagos(filteredPagos.filter((pago) => pago.id !== id));
    } catch (error) {
      console.error("Error al borrar el pago:", error);
    }
  };

  const handleEdit = (pago) => {
    setEditPago(pago.id);
    setEditData({
      cedula: pago.cedula,
      primer_nombre: pago.primer_nombre,
      primer_apellido: pago.primer_apellido,
      monto_pagar: pago.monto_pagar,
      fecha_pago: pago.fecha_pago,
      año: pago.año,
      mes: pago.mes,
      numero_quincena: pago.numero_quincena,
      detalles: pago.detalles,
      tipo_pago: pago.tipo_pago,
    });
  };

  const handleSave = async (id) => {
    try {
      await updateDoc(doc(firestore, "PagarSueldo", id), {
        cedula: editData.cedula,
        primer_nombre: editData.primer_nombre,
        primer_apellido: editData.primer_apellido,
        monto_pagar: editData.monto_pagar,
        fecha_pago: new Date(editData.fecha_pago),
        año: editData.año,
        mes: editData.mes,
        numero_quincena: editData.numero_quincena,
        detalles: editData.detalles,
        tipo_pago: editData.tipo_pago,
      });
      setPagos(
        pagos.map((pago) =>
          pago.id === id ? { ...pago, ...editData } : pago
        )
      );
      setFilteredPagos(
        filteredPagos.map((pago) =>
          pago.id === id ? { ...pago, ...editData } : pago
        )
      );
      setEditPago(null);
    } catch (error) {
      console.error("Error al actualizar el pago:", error);
    }
  };

  const handleSearch = () => {
    const searchResults = pagos.filter((pago) =>
      pago.cedula.includes(searchCedula)
    );
    setFilteredPagos(searchResults);
  };

  const handleShowAll = () => {
    setFilteredPagos(pagos);
    setSearchCedula("");
  };

  return (
    <div className="container mt-5">
      <h3>Visualizar Pagos de Sueldo</h3>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por cédula"
          value={searchCedula}
          onChange={(e) => setSearchCedula(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleSearch}>Buscar</button>
        <button className="btn btn-secondary mt-2 mx-2" onClick={handleShowAll}>Ver Pagos</button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Cédula</th>
            <th>Primer Nombre</th>
            <th>Primer Apellido</th>
            <th>Monto a Pagar</th>
            <th>Fecha de Pago</th>
            <th>Año</th>
            <th>Mes</th>
            <th>Número de Quincena</th>
            <th>Detalles</th>
            <th>Tipo de Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredPagos.length > 0 ? (
            filteredPagos.map((pago) => (
              <tr key={pago.id}>
                {editPago === pago.id ? (
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
                        type="number"
                        className="form-control"
                        value={editData.monto_pagar}
                        onChange={(e) => setEditData({ ...editData, monto_pagar: e.target.value })}
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
                        type="number"
                        className="form-control"
                        value={editData.año}
                        onChange={(e) => setEditData({ ...editData, año: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        className="form-control"
                        value={editData.mes}
                        onChange={(e) => setEditData({ ...editData, mes: e.target.value })}
                      >
                        <option value="">Seleccionar mes</option>
                        {[...Array(12)].map((_, index) => (
                          <option key={index + 1} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className="form-control"
                        value={editData.numero_quincena}
                        onChange={(e) => setEditData({ ...editData, numero_quincena: e.target.value })}
                      >
                        <option value="">Seleccionar quincena</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                      </select>
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
                      <button className="btn btn-success" onClick={() => handleSave(pago.id)}>
                        Guardar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{pago.cedula}</td>
                    <td>{pago.primer_nombre}</td>
                    <td>{pago.primer_apellido}</td>
                    <td>{pago.monto_pagar}</td>
                    <td>{pago.fecha_pago}</td>
                    <td>{pago.año}</td>
                    <td>{pago.mes}</td>
                    <td>{pago.numero_quincena}</td>
                    <td>{pago.detalles}</td>
                    <td>{pago.tipo_pago}</td>
                    <td>
                      <button className="btn btn-primary" onClick={() => handleEdit(pago)}>
                        Editar
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(pago.id)}>
                        Eliminar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center">
                No se encontraron pagos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default VisualizarPagosSueldo;
