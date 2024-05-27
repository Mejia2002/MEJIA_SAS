import React, { useState } from "react";
import firebaseApp from "../firebase/Firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firestore = getFirestore(firebaseApp);

function RegistrarEmpleado() {
  const [cedula, setCedula] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [direccion, setDireccion] = useState("");
  const [fechaContratacion, setFechaContratacion] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [primerNombre, setPrimerNombre] = useState("");
  const [salario, setSalario] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [segundoNombre, setSegundoNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar el mensaje de error antes de validar

    // Validaciones de formato
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
        salario: parseFloat(salario),
        segundo_apellido: segundoApellido,
        segundo_nombre: segundoNombre,
        telefono: parseInt(telefono, 10),
      });
      setMensaje("Empleado registrado con éxito");
      // Limpiar todos los campos después de un registro exitoso
      setCedula("");
      setCorreoElectronico("");
      setDireccion("");
      setFechaContratacion("");
      setPrimerApellido("");
      setPrimerNombre("");
      setSalario("");
      setSegundoApellido("");
      setSegundoNombre("");
      setTelefono("");
    } catch (error) {
      console.error("Error registrando empleado: ", error);
      setError("Error registrando empleado. Inténtelo de nuevo.");
    }
  };

  return (
    <div>
      <h2>Registrar Empleado</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Cédula:
          <input
            type="number"
            id="cedula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
        </label>
        <br />
        <label>
          Correo Electrónico:
          <input
            type="email"
            id="correoElectronico"
            value={correoElectronico}
            onChange={(e) => setCorreoElectronico(e.target.value)}
          />
        </label>
        <br />
        <label>
          Dirección:
          <input
            type="text"
            id="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </label>
        <br />
        <label>
          Fecha de Contratación:
          <input
            type="date"
            id="fechaContratacion"
            value={fechaContratacion}
            onChange={(e) => setFechaContratacion(e.target.value)}
          />
        </label>
        <br />
        <label>
          Primer Apellido:
          <input
            type="text"
            id="primerApellido"
            value={primerApellido}
            onChange={(e) => setPrimerApellido(e.target.value)}
          />
        </label>
        <br />
        
        <label>
          Segundo Apellido:
          <input
            type="text"
            id="segundoApellido"
            value={segundoApellido}
            onChange={(e) => setSegundoApellido(e.target.value)}
          />
        </label>
        <br />
        <label>
          Primer Nombre:
          <input
            type="text"
            id="primerNombre"
            value={primerNombre}
            onChange={(e) => setPrimerNombre(e.target.value)}
          />
        </label>
        <br />
        <label>
          Segundo Nombre:
          <input
            type="text"
            id="segundoNombre"
            value={segundoNombre}
            onChange={(e) => setSegundoNombre(e.target.value)}
          />
        </label>
        <br />
        <label>
          Salario:
          <input
            type="number"
            id="salario"
            value={salario}
            onChange={(e) => setSalario(e.target.value)}
          />
        </label>
        <br />
        
        <label>
          Teléfono:
          <input
            type="number"
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Registrar Empleado</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
    </div>
  );
}

export default RegistrarEmpleado;
