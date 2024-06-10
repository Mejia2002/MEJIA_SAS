import React, { useState, useEffect } from "react";
import firebaseApp from "../firebase/Firebase";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';
import { jsPDF } from "jspdf";
import logo from '../Images/LogoEmpresa.png';
import styles from '../Styles/Formularios.module.css';

const firestore = getFirestore(firebaseApp);

function PagarSueldo() {
  const [empleados, setEmpleados] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [cedula, setCedula] = useState("");
  const [primerNombre, setPrimerNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [montoPagar, setMontoPagar] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [año, setAño] = useState("");
  const [mes, setMes] = useState("");
  const [numeroQuincena, setNumeroQuincena] = useState("");
  const [detalles, setDetalles] = useState("");
  const [tipoPago, setTipoPago] = useState("Pago de quincena");

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

    const fetchContratos = async () => {
      try {
        const contratosCollection = collection(firestore, "contratos");
        const contratosSnapshot = await getDocs(contratosCollection);
        const contratosList = contratosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setContratos(contratosList);
      } catch (error) {
        console.error("Error al obtener los contratos:", error);
      }
    };

    fetchEmpleados();
    fetchContratos();
  }, []);

  const buscarEmpleadoPorCedula = (cedula) => {
    const empleadoEncontrado = empleados.find((empleado) => empleado.cedula === cedula);
    if (empleadoEncontrado) {
      const contratoEncontrado = contratos.find((contrato) => contrato.cedula === cedula);
      if (contratoEncontrado) {
        setSelectedEmployee(empleadoEncontrado);
        setCedula(empleadoEncontrado.cedula);
        setPrimerNombre(empleadoEncontrado.primer_nombre);
        setPrimerApellido(empleadoEncontrado.primer_apellido);
        const salarioDividido = contratoEncontrado.salario_base / 2;
        setMontoPagar(salarioDividido);
      } else {
        alert("No se encontró ningún contrato para el empleado con la cédula proporcionada.");
      }
    } else {
      limpiarCampos();
      alert("No se encontró ningún empleado con la cédula proporcionada.");
    }
  };

  const handleGuardarPago = async () => {
    if (!cedula || !primerNombre || !primerApellido || !montoPagar || !fechaPago || !año || !mes || !numeroQuincena) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      const pagosRef = collection(firestore, "PagarSueldo");
      const q = query(
        pagosRef,
        where("cedula", "==", cedula),
        where("año", "==", año),
        where("mes", "==", mes),
        where("numero_quincena", "==", numeroQuincena)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("Ya existe un pago para este mes y quincena.");
        return;
      }

      await addDoc(pagosRef, {
        cedula,
        primer_nombre: primerNombre,
        primer_apellido: primerApellido,
        monto_pagar: montoPagar,
        fecha_pago: fechaPago,
        año,
        mes,
        numero_quincena: numeroQuincena,
        detalles,
        tipo_pago: tipoPago,
      });

      alert("¡Pago guardado exitosamente!");
    } catch (error) {
      console.error("Error al guardar el pago:", error);
      alert("Error al guardar el pago. Por favor, inténtelo de nuevo.");
    }
  };

  const handleDescargarPDF = async () => {
    if (!cedula || !primerNombre || !primerApellido || !montoPagar || !fechaPago || !año || !mes || !numeroQuincena) {
      alert("Todos los campos son obligatorios, excepto los detalles.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PAGO DE QUINCENA", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

    const imgWidth = 50;
    const imgHeight = 50;
    const imgX = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
    const imgY = 30;
    doc.addImage(logo, 'PNG', imgX, imgY, imgWidth, imgHeight);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const startY = imgY + imgHeight + 20;
    doc.text(`Cédula: ${cedula}`, 20, startY);
    doc.text(`Primer Nombre: ${primerNombre}`, 20, startY + 10);
    doc.text(`Primer Apellido: ${primerApellido}`, 20, startY + 20);
    doc.text(`Monto a Pagar: ${montoPagar}`, 20, startY + 30);
    doc.text(`Fecha de Pago: ${fechaPago}`, 20, startY + 40);
    doc.text(`Año: ${año}`, 20, startY + 50);
    doc.text(`Mes: ${mes}`, 20, startY + 60);
    doc.text(`Número de Quincena: ${numeroQuincena}`, 20, startY + 70);
    doc.text(`Detalles: ${detalles}`, 20, startY + 80);
    doc.text(`Tipo de Pago: ${tipoPago}`, 20, startY + 90);
    doc.text("Firma del Empleado: ____________________", 20, startY + 140);

    const fileName = `${primerNombre}_${primerApellido}_Pago(${mes},${numeroQuincena}).pdf`;
    doc.save(fileName);
  };

  const limpiarCampos = () => {
    setSelectedEmployee(null);
    setCedula("");
    setPrimerNombre("");
    setPrimerApellido("");
    setMontoPagar("");
    setFechaPago("");
    setAño("");
    setMes("");
    setNumeroQuincena("");
    setDetalles("");
    setTipoPago("Pago de quincena");
  };

  const handleSelectEmpleado = (e) => {
    const cedulaSeleccionada = e.target.value;
    setCedula(cedulaSeleccionada);
    buscarEmpleadoPorCedula(cedulaSeleccionada);
  };

  const handleAñoChange = (e) => {
    const nuevoAño = e.target.value;
    setAño(nuevoAño);
    setDetalles(`Pago de quincena número ${numeroQuincena} del mes ${mes} del año ${nuevoAño}`);
  };

  const handleMesChange = (e) => {
    const nuevoMes = e.target.value;
    setMes(nuevoMes);
    setDetalles(`Pago de quincena número ${numeroQuincena} del mes ${nuevoMes} del año ${año}`);
  };

  const handleNumeroQuincenaChange = (e) => {
    const nuevaQuincena = e.target.value;
    setNumeroQuincena(nuevaQuincena);
    setDetalles(`Pago de quincena número ${nuevaQuincena} del mes ${mes} del año ${año}`);
  };

  return (
    <div className={styles.container}>
      <h3>Pagar Sueldo</h3>
      <div className="form-group">
        <label htmlFor="cedulaInput">Buscar por Cédula:</label>
        <input
          type="text"
          className="form-control"
          id="cedulaInput"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={() => buscarEmpleadoPorCedula(cedula)}>Buscar</button>
      </div>
      <div className="form-group">
        <label htmlFor="selectEmpleado">Seleccionar Empleado:</label>
        <select
          className="form-control"
          id="selectEmpleado"
          value={cedula}
          onChange={handleSelectEmpleado}
        >
          <option value="">Seleccione un empleado</option>
          {empleados.map((empleado) => (
            <option key={empleado.id} value={empleado.cedula}>
              {empleado.primer_nombre} {empleado.primer_apellido}
            </option>
          ))}
        </select>
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
          <label>Tipo de Pago:</label>
          <input
            type="text"
            className="form-control"
            value={tipoPago}
            disabled
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
        <label>Año:</label>
        <input
          type="number"
          className="form-control"
          value={año}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (/^\d*$/.test(inputValue) && inputValue.length <= 4) {
              handleAñoChange(e); 
            }
          }}
        />
        <label>Mes:</label>
        <select
          className="form-control"
          value={mes}
          onChange={handleMesChange}
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
          onChange={handleNumeroQuincenaChange}
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
        <button className="btn btn-success mr-2" onClick={handleDescargarPDF}>
          Descargar PDF
        </button>
        <button className="btn btn-danger" onClick={limpiarCampos}>
          Limpiar
        </button>
      </div>
    </div>
  );
}

export default PagarSueldo;
