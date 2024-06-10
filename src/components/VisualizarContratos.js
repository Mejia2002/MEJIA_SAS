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
  const [searchCedula, setSearchCedula] = useState("");
  const [filteredContratos, setFilteredContratos] = useState([]);
  const [editData, setEditData] = useState({
    primer_nombre: "",
    primer_apellido: "",
    cedula: "",
    cargo: "",
    tipo_contrato: "",
    salario_base: "",
    fecha_inicio: "",
    fecha_finalizacion: "",
  });

  useEffect(() => {
    const fetchContratos = async () => {
      try {
        const contratosCollection = collection(firestore, "contratos");
        const contratosSnapshot = await getDocs(contratosCollection);
        const contratosList = contratosSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            fecha_inicio: data.fecha_inicio.toDate().toISOString().split('T')[0],
            fecha_finalizacion: data.fecha_finalizacion !== "Indefinido" ? data.fecha_finalizacion.toDate().toISOString().split('T')[0] : "Indefinido",
          };
        });
        setContratos(contratosList);
        setFilteredContratos(contratosList);
      } catch (error) {
        console.error("Error al obtener los contratos:", error);
      }
    };

    fetchContratos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, "contratos", id));
      setContratos(contratos.filter((contrato) => contrato.id !== id));
      setFilteredContratos(filteredContratos.filter((contrato) => contrato.id !== id));
    } catch (error) {
      console.error("Error al borrar el contrato:", error);
    }
  };

  const handleEdit = (contrato) => {
    setEditContrato(contrato.id);
    setEditData({
      primer_nombre: contrato.primer_nombre,
      primer_apellido: contrato.primer_apellido,
      cedula: contrato.cedula,
      cargo: contrato.cargo,
      tipo_contrato: contrato.tipo_contrato,
      salario_base: contrato.salario_base,
      fecha_inicio: contrato.fecha_inicio,
      fecha_finalizacion: contrato.fecha_finalizacion !== "Indefinido" ? contrato.fecha_finalizacion : "",
    });
  };

  const handleSave = async (id) => {
    try {
      await updateDoc(doc(firestore, "contratos", id), {
        primer_nombre: editData.primer_nombre,
        primer_apellido: editData.primer_apellido,
        cedula: editData.cedula,
        cargo: editData.cargo,
        tipo_contrato: editData.tipo_contrato,
        salario_base: editData.salario_base,
        fecha_inicio: new Date(editData.fecha_inicio),
        fecha_finalizacion: editData.tipo_contrato === "Indefinido" ? "Indefinido" : new Date(editData.fecha_finalizacion),
      });
      setContratos(
        contratos.map((contrato) =>
          contrato.id === id ? { ...contrato, ...editData } : contrato
        )
      );
      setFilteredContratos(
        filteredContratos.map((contrato) =>
          contrato.id === id ? { ...contrato, ...editData } : contrato
        )
      );
      setEditContrato(null);
    } catch (error) {
      console.error("Error al actualizar el contrato:", error);
    }
  };

  const handleSearch = () => {
    const searchResults = contratos.filter((contrato) =>
      contrato.cedula.includes(searchCedula)
    );
    setFilteredContratos(searchResults);
  };

  const handleShowAll = () => {
    setFilteredContratos(contratos);
    setSearchCedula("");
  };

  return (
    <div className="container mt-5">
      <h3>Visualizar Contratos</h3>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por cédula"
          value={searchCedula}
          onChange={(e) => setSearchCedula(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleSearch}>Buscar</button>
        <button className="btn btn-secondary mt-2 mx-2" onClick={handleShowAll}>Ver Contratos</button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Primer Nombre</th>
            <th>Primer Apellido</th>
            <th>Cédula</th>
            <th>Cargo</th>
            <th>Tipo de Contrato</th>
            <th>Salario Base</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Finalización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredContratos.length > 0 ? (
            filteredContratos.map((contrato) => (
              <tr key={contrato.id}>
                {editContrato === contrato.id ? (
                  <>
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
                        value={editData.cedula}
                        onChange={(e) => setEditData({ ...editData, cedula: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.cargo}
                        onChange={(e) => setEditData({ ...editData, cargo: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        className="form-control"
                        value={editData.tipo_contrato}
                        onChange={(e) => setEditData({ ...editData, tipo_contrato: e.target.value })}
                      >
                        <option value="">Seleccionar tipo de contrato</option>
                        <option value="Por proyecto">Por proyecto</option>
                        <option value="Indefinido">Indefinido</option>
                      </select>
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
                      <input
                        type="date"
                        className="form-control"
                        value={editData.fecha_inicio}
                        onChange={(e) => setEditData({ ...editData, fecha_inicio: e.target.value })}
                      />
                    </td>
                    <td>
                      {editData.tipo_contrato === "Por proyecto" ? (
                        <input
                          type="date"
                          className="form-control"
                          value={editData.fecha_finalizacion}
                          onChange={(e) => setEditData({ ...editData, fecha_finalizacion: e.target.value })}
                        />
                      ) : (
                        <input
                          type="text"
                          className="form-control"
                          value="Indefinido"
                          readOnly
                        />
                      )}
                    </td>
                    <td>
                      <button className="btn btn-success" onClick={() => handleSave(contrato.id)}>
                        Guardar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{contrato.primer_nombre}</td>
                    <td>{contrato.primer_apellido}</td>
                    <td>{contrato.cedula}</td>
                    <td>{contrato.cargo}</td>
                    <td>{contrato.tipo_contrato}</td>
                    <td>{contrato.salario_base}</td>
                    <td>{contrato.fecha_inicio}</td>
                    <td>{contrato.fecha_finalizacion}</td>
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
