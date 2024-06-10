import React, { useState, useEffect } from "react";
import firebaseApp from "../firebase/Firebase";
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../Styles/Formularios.module.css'; 

const firestore = getFirestore(firebaseApp);

function VisualizarRegistroTotalFacturado() {
  const [facturados, setFacturados] = useState([]);
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [editId, setEditId] = useState(null);
  const [monto, setMonto] = useState("");
  const [detalles, setDetalles] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFacturados();
  }, []);

  const fetchFacturados = async () => {
    const q = query(collection(firestore, "total_facturado"));
    const querySnapshot = await getDocs(q);
    const facturadosData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setFacturados(facturadosData);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!mes || !ano) {
      if (!mes) setError("Por favor, seleccione un mes.");
      if (!ano) setError("Por favor, ingrese un año.");
      return;
    }

    try {
      const q = query(collection(firestore, "total_facturado"), where("mes", "==", parseInt(mes)), where("ano", "==", parseInt(ano)));
      const querySnapshot = await getDocs(q);
      const facturadosData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      if (facturadosData.length === 0) {
        setMensaje("No se encontraron registros para el mes y año especificados.");
      }
      setFacturados(facturadosData);
    } catch (error) {
      console.error("Error buscando total facturado: ", error);
      setError("Error buscando total facturado. Inténtelo de nuevo.");
    }
  };

  const handleViewAll = async () => {
    setError("");
    setMensaje("");
    await fetchFacturados();
  };

  const handleEdit = (facturado) => {
    setEditId(facturado.id);
    setMonto(facturado.monto);
    setMes(facturado.mes);
    setAno(facturado.ano);
    setDetalles(facturado.detalles);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    const montoPattern = /^[0-9]+(\.[0-9]{1,2})?$/;

    if (!montoPattern.test(monto)) {
      setError("Por favor, ingrese un monto válido.");
      return;
    }

    try {
      const docRef = doc(firestore, "total_facturado", editId);
      await updateDoc(docRef, {
        monto: parseFloat(monto),
        mes: parseInt(mes, 10),
        ano: parseInt(ano, 10),
        detalles,
      });
      setMensaje("Total facturado actualizado con éxito");
      setEditId(null);
      setMonto("");
      setMes("");
      setAno("");
      setDetalles("");
      fetchFacturados();
    } catch (error) {
      console.error("Error actualizando total facturado: ", error);
      setError("Error actualizando total facturado. Inténtelo de nuevo.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, "total_facturado", id));
      setMensaje("Total facturado eliminado con éxito");
      fetchFacturados();
    } catch (error) {
      console.error("Error eliminando total facturado: ", error);
      setError("Error eliminando total facturado. Inténtelo de nuevo.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Total Facturado Por Mes</h2>
      <form onSubmit={handleSearch} className="mb-3">
        <div className="form-group">
          <label>Mes:</label>
          <select
            className="form-control"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
          >
            <option value="">Seleccione un mes</option>
            {[...Array(12)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Año:</label>
          <input
            type="number"
            className="form-control"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Buscar</button>
        <button type="button" className="btn btn-secondary mt-3 ml-2" onClick={handleViewAll}>Ver todo</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Mes</th>
            <th>Año</th>
            <th>Monto</th>
            <th>Detalles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturados.map((facturado) => (
            <tr key={facturado.id}>
              <td>{facturado.mes}</td>
              <td>{facturado.ano}</td>
              <td>{facturado.monto}</td>
              <td>{facturado.detalles}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleEdit(facturado)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(facturado.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editId && (
        <div className="mt-5">
          <h2>Editar Total Facturado</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="monto">Monto:</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                id="monto"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Mes:</label>
              <select
                className="form-control"
                value={mes}
                onChange={(e) => setMes(e.target.value)}
              >
                <option value="">Seleccione un mes</option>
                {[...Array(12)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Año:</label>
              <input
                type="number"
                className="form-control"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="detalles">Detalles:</label>
              <textarea
                className="form-control"
                id="detalles"
                rows="3"
                value={detalles}
                onChange={(e) => setDetalles(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary mt-3">Actualizar Total Facturado</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default VisualizarRegistroTotalFacturado;
