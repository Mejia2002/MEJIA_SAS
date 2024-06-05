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

function VisualizarContratos() {
  const [contratos, setContratos] = useState([]);
  const [editContrato, setEditContrato] = useState(null);
  const [editData, setEditData] = useState({
    descripcion: "",
    estado_contrato: "",
    fecha_inicio: "",
    fecha_finalizacion: "",
    horario_trabajo: "",
    terminos_condiciones: "",
    tipo_contrato: "",
    salario_base: "",
  });

  useEffect(() => {
    const fetchContratos = async () => {
      try {
        const contratosCollection = collection(firestore, "contrato");
        const contratosSnapshot = await getDocs(contratosCollection);
        const contratosList = contratosSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            fecha_inicio: data.fecha_inicio.toDate().toISOString().split('T')[0],
            fecha_finalizacion: data.fecha_finalizacion.toDate().toISOString().split('T')[0],
          };
        });
        setContratos(contratosList);
      } catch (error) {
        console.error("Error al obtener los contratos:", error);
      }
    };

    fetchContratos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, "contrato", id));
      setContratos(contratos.filter((contrato) => contrato.id !== id));
    } catch (error) {
      console.error("Error al borrar el contrato:", error);
    }
  };

  const handleEdit = (contrato) => {
    setEditContrato(contrato.id);
    setEditData({
      descripcion: contrato.descripcion,
      estado_contrato: contrato.estado_contrato,
      fecha_inicio: contrato.fecha_inicio,
      fecha_finalizacion: contrato.fecha_finalizacion,
      horario_trabajo: contrato.horario_trabajo,
      terminos_condiciones: contrato.terminos_condiciones,
      tipo_contrato: contrato.tipo_contrato,
      salario_base: contrato.salario_base,
    });
  };

  const handleSave = async (id) => {
    try {
      await updateDoc(doc(firestore, "contrato", id), {
        descripcion: editData.descripcion,
        estado_contrato: editData.estado_contrato,
        fecha_inicio: new Date(editData.fecha_inicio),
        fecha_finalizacion: new Date(editData.fecha_finalizacion),
        horario_trabajo: editData.horario_trabajo,
        terminos_condiciones: editData.terminos_condiciones,
        tipo_contrato: editData.tipo_contrato,
        salario_base: editData.salario_base,
      });
      setContratos(
        contratos.map((contrato) =>
          contrato.id === id ? { ...contrato, ...editData } : contrato
        )
      );
      setEditContrato(null);
    } catch (error) {
      console.error("Error al actualizar el contrato:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Visualizar Contratos</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Estado del Contrato</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Finalización</th>
            <th>Horario de Trabajo</th>
            <th>Términos y Condiciones</th>
            <th>Tipo de Contrato</th>
            <th>Salario Base</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contratos.length > 0 ? (
            contratos.map((contrato) => (
              <tr key={contrato.id}>
                {editContrato === contrato.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.descripcion}
                        onChange={(e) => setEditData({ ...editData, descripcion: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.estado_contrato}
                        onChange={(e) => setEditData({ ...editData, estado_contrato: e.target.value })}
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
                        type="text"
                        className="form-control"
                        value={editData.horario_trabajo}
                        onChange={(e) => setEditData({ ...editData, horario_trabajo: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.terminos_condiciones}
                        onChange={(e) => setEditData({ ...editData, terminos_condiciones: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                          type="text"
                          className="form-control"
                          value={editData.tipo_contrato}
                          onChange={(e) => setEditData({ ...editData, tipo_contrato: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={editData.salario_base}
                        onChange={(e) => setEditData({ ...editData, salario_base: e.target.value })}
                      />
                    </td>
                    <td>
                      <button className="btn btn-success" onClick={() => handleSave(contrato.id)}>
                        Guardar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{contrato.descripcion}</td>
                    <td>{contrato.estado_contrato}</td>
                    <td>{contrato.fecha_inicio}</td>
                    <td>{contrato.fecha_finalizacion}</td>
                    <td>{contrato.horario_trabajo}</td>
                    <td>{contrato.terminos_condiciones}</td>
                    <td>{contrato.tipo_contrato}</td>
                    <td>{contrato.salario_base}</td>
                    <td>
                      <button className="btn btn-primary mr-2" onClick={() => handleEdit(contrato)}>
                        Editar
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(contrato.id)}>
                        Eliminar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No hay contratos disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default VisualizarContratos;
