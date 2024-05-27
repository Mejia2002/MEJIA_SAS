import React, { useState, useEffect } from "react";
import firebaseApp from "../firebase/credenciales";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";

const firestore = getFirestore(firebaseApp);

function HacerContrato() {
  const [descripcion, setDescripcion] = useState("");
  const [estadoContrato, setEstadoContrato] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinalizacion, setFechaFinalizacion] = useState("");
  const [horarioTrabajo, setHorarioTrabajo] = useState("");
  const [terminosCondiciones, setTerminosCondiciones] = useState("");
  const [tipoContrato, setTipoContrato] = useState("");
  const [idEmpleado, setIdEmpleado] = useState("");
  const [salarioBase, setSalarioBase] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    const obtenerEmpleados = async () => {
      const empleadosSnapshot = await getDocs(collection(firestore, "empleados"));
      const empleadosList = empleadosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmpleados(empleadosList);
    };

    obtenerEmpleados();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(firestore, "contrato", idEmpleado), {
        descripcion,
        estado_contrato: estadoContrato,
        fecha_inicio: new Date(fechaInicio),
        fecha_finalizacion: new Date(fechaFinalizacion),
        horario_trabajo: horarioTrabajo,
        terminos_condiciones: terminosCondiciones,
        tipo_contrato: tipoContrato,
        id_empleado: idEmpleado,
        salario_base: parseFloat(salarioBase),
      });
      setMensaje("Contrato creado con éxito");
      setDescripcion("");
      setEstadoContrato("");
      setFechaInicio("");
      setFechaFinalizacion("");
      setHorarioTrabajo("");
      setTerminosCondiciones("");
      setTipoContrato("");
      setIdEmpleado("");
      setSalarioBase("");
    } catch (error) {
      console.error("Error creando contrato: ", error);
      setMensaje("Error creando contrato. Inténtelo de nuevo.");
    }
  };

  return (
    <div>
      <h2>Hacer Contrato</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Empleado:
          <select value={idEmpleado} onChange={(e) => setIdEmpleado(e.target.value)}>
            <option value="">Seleccione un empleado</option>
            {empleados.map((empleado) => (
              <option key={empleado.id} value={empleado.id}>
                {empleado.primer_nombre} {empleado.primer_apellido}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Descripción:
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </label>
        <br />
        <label>
          Estado del Contrato:
          <input
            type="text"
            value={estadoContrato}
            onChange={(e) => setEstadoContrato(e.target.value)}
          />
        </label>
        <br />
        <label>
          Fecha de Inicio:
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </label>
        <br />
        <label>
          Fecha de Finalización:
          <input
            type="date"
            value={fechaFinalizacion}
            onChange={(e) => setFechaFinalizacion(e.target.value)}
          />
        </label>
        <br />
        <label>
          Horario de Trabajo:
          <input
            type="text"
            value={horarioTrabajo}
            onChange={(e) => setHorarioTrabajo(e.target.value)}
          />
        </label>
        <br />
        <label>
          Términos y Condiciones:
          <input
            type="text"
            value={terminosCondiciones}
            onChange={(e) => setTerminosCondiciones(e.target.value)}
          />
        </label>
        <br />
        <label>
          Tipo de Contrato:
          <input
            type="text"
            value={tipoContrato}
            onChange={(e) => setTipoContrato(e.target.value)}
          />
        </label>
        <br />
        <label>
          Salario Base:
          <input
            type="number"
            value={salarioBase}
            onChange={(e) => setSalarioBase(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Crear Contrato</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default HacerContrato;
