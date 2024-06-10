import React, { useState } from "react";
import firebaseApp from "../firebase/Firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../Styles/Formularios.module.css'; 

const firestore = getFirestore(firebaseApp);

function RegistrarEmpleado() {
  const [cedula, setCedula] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [direccion, setDireccion] = useState("");
  const [fechaContratacion, setFechaContratacion] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [primerNombre, setPrimerNombre] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [segundoNombre, setSegundoNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 


    const cedulaPattern = /^[0-9]{10}$/;
    const telefonoPattern = /^[0-9]{7,}$/;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!cedulaPattern.test(cedula)) {
      setError("Por favor, ingrese una cédula válida (10 dígitos numéricos).");
      return;
    }

    if (!telefonoPattern.test(telefono)) {
      setError("Por favor, ingrese un teléfono válido (al menos 7 dígitos numéricos).");
      return;
    }

    if (!emailPattern.test(correoElectronico)) {
      setError("Por favor, ingrese un correo electrónico válido.");
      return;
    }

    try {
      await setDoc(doc(firestore, "empleados", cedula), {
        cedula,
        correo_electronico: correoElectronico,
        direccion,
        fecha_contratacion: new Date(fechaContratacion),
        primer_apellido: primerApellido,
        primer_nombre: primerNombre,
        segundo_apellido: segundoApellido,
        segundo_nombre: segundoNombre,
        telefono: parseInt(telefono, 10),
      });
      setMensaje("Empleado registrado con éxito");
      setCedula("");
      setCorreoElectronico("");
      setDireccion("");
      setFechaContratacion("");
      setPrimerApellido("");
      setPrimerNombre("");
      setSegundoApellido("");
      setSegundoNombre("");
      setTelefono("");
    } catch (error) {
      console.error("Error registrando empleado: ", error);
      setError("Error registrando empleado. Inténtelo de nuevo.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Registrar Empleado</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cedula">Cédula:</label>
          <input
            type="number"
            className="form-control"
            id="cedula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="correoElectronico">Correo Electrónico:</label>
          <input
            type="email"
            className="form-control"
            id="correoElectronico"
            value={correoElectronico}
            onChange={(e) => setCorreoElectronico(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="direccion">Dirección:</label>
          <input
            type="text"
            className="form-control"
            id="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="fechaContratacion">Fecha de Registro:</label>
          <input
            type="date"
            className="form-control"
            id="fechaContratacion"
            value={fechaContratacion}
            onChange={(e) => setFechaContratacion(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="primerApellido">Primer Apellido:</label>
          <input
            type="text"
            className="form-control"
            id="primerApellido"
            value={primerApellido}
            onChange={(e) => setPrimerApellido(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="segundoApellido">Segundo Apellido:</label>
          <input
            type="text"
            className="form-control"
            id="segundoApellido"
            value={segundoApellido}
            onChange={(e) => setSegundoApellido(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="primerNombre">Primer Nombre:</label>
          <input
            type="text"
            className="form-control"
            id="primerNombre"
            value={primerNombre}
            onChange={(e) => setPrimerNombre(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="segundoNombre">Segundo Nombre:</label>
          <input
            type="text"
            className="form-control"
            id="segundoNombre"
            value={segundoNombre}
            onChange={(e) => setSegundoNombre(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Teléfono:</label>
          <input
            type="number"
            className="form-control"
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Registrar Empleado</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
    </div>
  );
}

export default RegistrarEmpleado;
