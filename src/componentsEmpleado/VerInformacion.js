import React, { useEffect, useState } from "react";
import firebaseApp from "../firebase/Firebase";
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';

const firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

function VerInformacion() {
  const [usuario, setUsuario] = useState(null);
  const [empleado, setEmpleado] = useState(null);
  const [editData, setEditData] = useState({
    correo_electronico: "",
    direccion: "",
    telefono: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          console.log("Usuario autenticado:", user); 
          const email = user.email;
          const q = query(collection(firestore, "todosUsuarios"), where("email", "==", email));
          const querySnapshot = await getDocs(q);
          console.log("Resultados de la consulta en todosUsuarios:", querySnapshot); 
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            console.log("Datos del usuario en todosUsuarios:", userData); 
            setUsuario({ id: querySnapshot.docs[0].id, ...userData });

            const cedula = userData.cedula;
            const qEmpleado = query(collection(firestore, "empleados"), where("cedula", "==", cedula));
            const querySnapshotEmpleado = await getDocs(qEmpleado);
            console.log("Resultados de la consulta en empleados:", querySnapshotEmpleado); 
            if (!querySnapshotEmpleado.empty) {
              const empleadoData = querySnapshotEmpleado.docs[0].data();
              console.log("Datos del empleado:", empleadoData); 
              setEmpleado({ id: querySnapshotEmpleado.docs[0].id, ...empleadoData });
              setEditData({
                correo_electronico: empleadoData.correo_electronico,
                direccion: empleadoData.direccion,
                telefono: empleadoData.telefono,
              });
            } else {
              console.error("No se encontraron documentos para el empleado.");
            }
          } else {
            console.error("No se encontraron documentos para el usuario.");
          }
        } else {
          console.error("No hay usuario autenticado.");
        }
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      }
    };

    fetchUsuario();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editData.correo_electronico && editData.direccion && editData.telefono) {
      try {
        const userDoc = doc(firestore, "empleados", empleado.id);
        await updateDoc(userDoc, {
          correo_electronico: editData.correo_electronico,
          direccion: editData.direccion,
          telefono: editData.telefono,
        });
        setEmpleado({ ...empleado, ...editData });
        setIsEditing(false);
      } catch (error) {
        console.error("Error al actualizar la información del empleado:", error);
      }
    } else {
      alert("Los campos de correo, dirección y teléfono no pueden estar vacíos.");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Información</h3>
      {empleado ? (
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
            <tr>
              <td>{empleado.primer_nombre}</td>
              <td>{empleado.segundo_nombre}</td>
              <td>{empleado.primer_apellido}</td>
              <td>{empleado.segundo_apellido}</td>
              <td>{empleado.cedula}</td>
              <td>
                {isEditing ? (
                  <input
                    type="email"
                    className="form-control"
                    value={editData.correo_electronico}
                    onChange={(e) => setEditData({ ...editData, correo_electronico: e.target.value })}
                  />
                ) : (
                  empleado.correo_electronico
                )}
              </td>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editData.direccion}
                    onChange={(e) => setEditData({ ...editData, direccion: e.target.value })}
                  />
                ) : (
                  empleado.direccion
                )}
              </td>
              <td>
                {empleado.fecha_contratacion instanceof Object && empleado.fecha_contratacion.seconds
                  ? new Date(empleado.fecha_contratacion.seconds * 1000).toISOString().split('T')[0]
                  : empleado.fecha_contratacion}
              </td>
              <td>
                {isEditing ? (
                  <input
                    type="number"
                    className="form-control"
                    value={editData.telefono}
                    onChange={(e) => setEditData({ ...editData, telefono: e.target.value })}
                  />
                ) : (
                  empleado.telefono
                )}
              </td>
              <td>
                {isEditing ? (
                  <button className="btn btn-success" onClick={handleSave}>Guardar</button>
                ) : (
                  <button className="btn btn-primary" onClick={handleEdit}>Editar</button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Cargando información...</p>
      )}
    </div>
  );
}

export default VerInformacion;
