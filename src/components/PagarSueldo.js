import React, { useState, useEffect } from "react";
import firebaseApp from "../firebase/Firebase";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';
import { jsPDF } from "jspdf";

const firestore = getFirestore(firebaseApp);

function PagarSueldo() {
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [cedula, setCedula] = useState("");
  const [primerNombre, setPrimerNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [montoPagar, setMontoPagar] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [mes, setMes] = useState("");
  const [numeroQuincena, setNumeroQuincena] = useState("");
  const [detalles, setDetalles] = useState("");

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
      } catch (error) {
        console.error("Error al obtener los empleados:", error);
      }
    };

    fetchEmpleados();
  }, []);

  const buscarEmpleadoPorCedula = () => {
    const empleadoEncontrado = empleados.find((empleado) => empleado.cedula === cedula);
    if (empleadoEncontrado) {
      setSelectedEmployee(empleadoEncontrado);
      setPrimerNombre(empleadoEncontrado.primer_nombre);
      setPrimerApellido(empleadoEncontrado.primer_apellido);
      const salarioDividido = empleadoEncontrado.salario / 2;
      setMontoPagar(salarioDividido);
    } else {
      setSelectedEmployee(null);
      setPrimerNombre("");
      setPrimerApellido("");
      setMontoPagar("");
      alert("No se encontró ningún empleado con la cédula proporcionada.");
    }
  };

  const handleGuardarPago = async () => {
    try {
      await addDoc(collection(firestore, "PagarSueldo"), {
        cedula,
        primer_nombre: primerNombre,
        primer_apellido: primerApellido,
        monto_pagar: montoPagar,
        fecha_pago: fechaPago,
        mes,
        numero_quincena: numeroQuincena,
        detalles,
      });
      alert("¡Pago guardado exitosamente!");
    } catch (error) {
      console.error("Error al guardar el pago:", error);
      alert("Error al guardar el pago. Por favor, inténtelo de nuevo.");
    }
  };

  const handleDescargarPDF = () => {
    const doc = new jsPDF();
    doc.text("Pago de Sueldo", 20, 20);
    doc.text(`Cédula: ${cedula}`, 20, 30);
    doc.text(`Primer Nombre: ${primerNombre}`, 20, 40);
    doc.text(`Primer Apellido: ${primerApellido}`, 20, 50);
    doc.text(`Monto a Pagar: ${montoPagar}`, 20, 60);
    doc.text(`Fecha de Pago: ${fechaPago}`, 20, 70);
    doc.text(`Mes: ${mes}`, 20, 80);
    doc.text(`Número de Quincena: ${numeroQuincena}`, 20, 90);
    doc.text(`Detalles: ${detalles}`, 20, 100);
    doc.text("Firma del Empleado: ____________________", 20, 110);
    doc.save("pago_sueldo.pdf");
  };

  return (
    <div className="container mt-5">
      <h3>Pagar Sueldo</h3>
      <div className="form-group">
        <label htmlFor="selectEmpleado">Seleccionar Empleado:</label>
        <select
          className="form-control"
          id="selectEmpleado"
          value={selectedEmployee ? selectedEmployee.id : ""}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedEmp = empleados.find(emp => emp.id === selectedId);
            setSelectedEmployee(selectedEmp);
            setCedula(selectedEmp ? selectedEmp.cedula : "");
            setPrimerNombre(selectedEmp ? selectedEmp.primer_nombre : "");
            setPrimerApellido(selectedEmp ? selectedEmp.primer_apellido : "");
            setMontoPagar(selectedEmp ? selectedEmp.salario / 2 : "");
          }}
        >
          <option value="">Seleccione un empleado</option>
          {empleados.map((empleado) => (
            <option key={empleado.id} value={empleado.id}>
              {empleado.primer_nombre} {empleado.primer_apellido}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="buscarCedula">Buscar por Cédula:</label>
        <input
          type="text"
          id="buscarCedula"
          className="form-control"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={buscarEmpleadoPorCedula}>Buscar</button>
      </div>
      {selectedEmployee && (
        <div>
          <label>Cédula:</label>
          <input type="text" className="form-control" value={cedula} disabled />
          <label>Primer Nombre:</label>
          <input type="text" className="form-control" value={primerNombre} disabled />
          <label>Primer Apellido:</label>
          <input type="text" className="form-control" value={primerApellido} disabled />
          <label>Monto a Pagar:</label>
          <input
            type="number"
            className="form-control"
            value={montoPagar}
            onChange={(e) => setMontoPagar(e.target.value)}
          />
        </div>
      )}
      <div>
        <label>Fecha de Pago:</label>
        <input
          type="date"
          className="form-control"
          value={fechaPago}
          onChange={(e) => setFechaPago(e.target.value)}
        />
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
        <label>Número de Quincena:</label>
        <select
          className="form-control"
          value={numeroQuincena}
          onChange={(e) => setNumeroQuincena(e.target.value)}
        >
          <option value="">Seleccione una quincena</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
        <label>Detalles:</label>
        <textarea
          className="form-control"
          rows="3"
          value={detalles}
          onChange={(e) => setDetalles(e.target.value)}
        ></textarea>
      </div>
      <div className="mt-3">
        <button className="btn btn-primary mr-2" onClick={handleGuardarPago}>
          Guardar
        </button>
        <button className="btn btn-success" onClick={handleDescargarPDF}>
          Descargar PDF
        </button>
      </div>
    </div>
  );
}

export default PagarSueldo;

       
