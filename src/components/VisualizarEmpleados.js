import React, { useEffect, useState } from "react";
import firebaseApp from "../firebase/Firebase";
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';

const firestore = getFirestore(firebaseApp);

function VisualizarEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [searchCedula, setSearchCedula] = useState("");
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [editEmpleado, setEditEmpleado] = useState(null);
  const [editData, setEditData] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    cedula: "",
    correo_electronico: "",
    direccion: "",
    fecha_contratacion: "",
    telefono: "",
  });

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const empleadosCollection = collection(firestore, "empleados");
        const empleadosSnapshot = await getDocs(empleadosCollection);
        const empleadosList = empleadosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmpleados(empleadosList);
        setFilteredEmpleados(empleadosList);
      } catch (error) {
        console.error("Error al obtener los empleados:", error);
      }
    };

    fetchEmpleados();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, "empleados", id));
      setEmpleados(empleados.filter((empleado) => empleado.id !== id));
      setFilteredEmpleados(filteredEmpleados.filter((empleado) => empleado.id !== id));
    } catch (error) {
      console.error("Error al borrar el empleado:", error);
    }
  };

  const handleEdit = (empleado) => {
    setEditEmpleado(empleado.id);
    setEditData({
      primer_nombre: empleado.primer_nombre,
      segundo_nombre: empleado.segundo_nombre,
      primer_apellido: empleado.primer_apellido,
      segundo_apellido: empleado.segundo_apellido,
      cedula: empleado.cedula,
      correo_electronico: empleado.correo_electronico,
      direccion: empleado.direccion,
      fecha_contratacion: empleado.fecha_contratacion instanceof Object && empleado.fecha_contratacion.seconds ? new Date(empleado.fecha_contratacion.seconds * 1000).toISOString().split('T')[0] : empleado.fecha_contratacion,
      telefono: empleado.telefono,
    });
  };

  const handleSave = async (id) => {
    try {
      await updateDoc(doc(firestore, "empleados", id), {
        primer_nombre: editData.primer_nombre,
        segundo_nombre: editData.segundo_nombre,
        primer_apellido: editData.primer_apellido,
        segundo_apellido: editData.segundo_apellido,
        cedula: editData.cedula,
        correo_electronico: editData.correo_electronico,
        direccion: editData.direccion,
        fecha_contratacion: editData.fecha_contratacion,
        telefono: editData.telefono,
      });
      setEmpleados(
        empleados.map((empleado) =>
          empleado.id === id ? { ...empleado, ...editData } : empleado
        )
      );
      setFilteredEmpleados(
        filteredEmpleados.map((empleado) =>
          empleado.id === id ? { ...empleado, ...editData } : empleado
        )
      );
      setEditEmpleado(null);
    } catch (error) {
      console.error("Error al actualizar el empleado:", error);
    }
  };

  const handleSearch = () => {
    const searchResults = empleados.filter((empleado) =>
      empleado.cedula.includes(searchCedula)
    );
    setFilteredEmpleados(searchResults);
  };

  const handleShowAll = () => {
    setFilteredEmpleados(empleados);
    setSearchCedula("");
  };

  return (
    <div className="container mt-5">
      <h3>Visualizar Empleados</h3>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por cédula"
          value={searchCedula}
          onChange={(e) => setSearchCedula(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleSearch}>Buscar</button>
        <button className="btn btn-secondary mt-2 mx-2" onClick={handleShowAll}>Ver Empleados</button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Primer Nombre</th>
            <th>Segundo Nombre</th>
            <th>Primer Apellido</th>
            <th>Segundo Apellido</th>
            <th>Cédula</th>
            <th>Correo Electrónico</th>
            <th>Dirección</th>
            <th>Fecha Contratación</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmpleados.length > 0 ? (
            filteredEmpleados.map((empleado) => (
              <tr key={empleado.id}>
                {editEmpleado === empleado.id ? (
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
                        value={editData.segundo_nombre}
                        onChange={(e) => setEditData({ ...editData, segundo_nombre: e.target.value })}
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
                        type="text"
                        className="form-control"
                        value={editData.segundo_apellido}
                        onChange={(e) => setEditData({ ...editData, segundo_apellido: e.target.value })}
                      />
                    </td>
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
                        type="email"
                        className="form-control"
                        value={editData.correo_electronico}
                        onChange={(e) => setEditData({ ...editData, correo_electronico: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.direccion}
                        onChange={(e) => setEditData({ ...editData, direccion: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        className="form-control"
                        value={editData.fecha_contratacion}
                        onChange={(e) => setEditData({ ...editData, fecha_contratacion: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={editData.telefono}
                        onChange={(e) => setEditData({ ...editData, telefono: e.target.value })}
                      />
                    </td>
                    <td>
                      <button className="btn btn-success" onClick={() => handleSave(empleado.id)}>
                        Guardar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{empleado.primer_nombre}</td>
                    <td>{empleado.segundo_nombre}</td>
                    <td>{empleado.primer_apellido}</td>
                    <td>{empleado.segundo_apellido}</td>
                    <td>{empleado.cedula}</td>
                    <td>{empleado.correo_electronico}</td>
                    <td>{empleado.direccion}</td>
                    <td>
                      {empleado.fecha_contratacion instanceof Object && empleado.fecha_contratacion.seconds
                        ? new Date(empleado.fecha_contratacion.seconds * 1000).toISOString().split('T')[0]
                        : empleado.fecha_contratacion}
                    </td>
                    <td>{empleado.telefono}</td>
                    <td>
                      <button className="btn btn-primary" onClick={() => handleEdit(empleado)}>
                        Editar
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(empleado.id)}>
                        Borrar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">No hay empleados disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default VisualizarEmpleados;
