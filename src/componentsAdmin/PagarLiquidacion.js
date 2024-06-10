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

function PagarLiquidacion() {
  const [empleados, setEmpleados] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [cedula, setCedula] = useState("");
  const [primerNombre, setPrimerNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinalizacion, setFechaFinalizacion] = useState("");
  const [diasTrabajados, setDiasTrabajados] = useState(0);
  const [monto, setMonto] = useState(0);
  const [fechaPago, setFechaPago] = useState("");
  const [motivo, setMotivo] = useState("");
  const [detalles, setDetalles] = useState("");
  const [tipoPago, setTipoPago] = useState("Pago liquidación");

  useEffect(() => {
    const fetchEmpleadosYContratos = async () => {
      try {
        const empleadosCollection = collection(firestore, "empleados");
        const empleadosSnapshot = await getDocs(empleadosCollection);
        const empleadosList = empleadosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const contratosCollection = collection(firestore, "contratos");
        const contratosSnapshot = await getDocs(contratosCollection);
        const contratosList = contratosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEmpleados(empleadosList);
        setContratos(contratosList);
      } catch (error) {
        console.error("Error al obtener los empleados y contratos:", error);
      }
    };

    fetchEmpleadosYContratos();
  }, []);

  useEffect(() => {
    setDetalles(`Pago de liquidación por motivo de ${motivo}`);
  }, [motivo]);

  const buscarEmpleadoPorCedula = (cedula) => {
    const empleadoEncontrado = empleados.find((empleado) => empleado.cedula === cedula);
    const contratoEncontrado = contratos.find((contrato) => contrato.cedula === cedula);

    if (empleadoEncontrado && contratoEncontrado) {
      setSelectedEmployee(empleadoEncontrado);
      setCedula(empleadoEncontrado.cedula);
      setPrimerNombre(empleadoEncontrado.primer_nombre);
      setPrimerApellido(empleadoEncontrado.primer_apellido);
      setFechaInicio(
        contratoEncontrado.fecha_inicio
          ? contratoEncontrado.fecha_inicio.toDate().toISOString().substring(0, 10)
          : ""
      );
      if (contratoEncontrado.fecha_finalizacion && contratoEncontrado.fecha_finalizacion !== "Indefinido") {
        setFechaFinalizacion(
          contratoEncontrado.fecha_finalizacion.toDate().toISOString().substring(0, 10)
        );
      } else {
        setFechaFinalizacion("");
        alert("Este empleado tiene la fecha de finalización indefinida. Ingrese fecha y luego haga click en el botón calcular.");
      }
    } else {
      limpiarCampos();
      alert("No se encontró ningún empleado con la cédula proporcionada.");
    }
  };

  const handleSelectEmpleado = (e) => {
    const cedulaSeleccionada = e.target.value;
    setCedula(cedulaSeleccionada);
    buscarEmpleadoPorCedula(cedulaSeleccionada);
  };

  const calcularDiasYMonto = () => {
    if (fechaInicio && fechaFinalizacion) {
      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinalizacionDate = new Date(fechaFinalizacion);

      const diffTime = Math.abs(fechaFinalizacionDate - fechaInicioDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const totalDias = diffDays + 1;
      const montoCalculado = totalDias * 9000; 

      setDiasTrabajados(totalDias);
      setMonto(montoCalculado);
    }
  };

  const handleGuardarPago = async () => {
    if (!cedula || !primerNombre || !primerApellido || !fechaInicio || !fechaFinalizacion || !diasTrabajados || !monto || !fechaPago || !motivo) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      await addDoc(collection(firestore, "PagarLiquidacion"), {
        cedula,
        primer_nombre: primerNombre,
        primer_apellido: primerApellido,
        fecha_inicio: new Date(fechaInicio),
        fecha_finalizacion: new Date(fechaFinalizacion),
        dias_trabajados: diasTrabajados,
        monto,
        fecha_pago: new Date(fechaPago),
        motivo,
        detalles,
        tipo_pago: tipoPago,
      });

      alert("¡Pago de liquidación guardado exitosamente!");
    } catch (error) {
      console.error("Error al guardar el pago de liquidación:", error);
      alert("Error al guardar el pago de liquidación. Por favor, inténtelo de nuevo.");
    }
  };

  const handleDescargarPDF = async () => {
    if (!cedula || !primerNombre || !primerApellido || !fechaInicio || !fechaFinalizacion || !diasTrabajados || !monto || !fechaPago || !motivo) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PAGO DE LIQUIDACIÓN", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

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
    doc.text(`Fecha de Inicio: ${fechaInicio}`, 20, startY + 30);
    doc.text(`Fecha de Finalización: ${fechaFinalizacion}`, 20, startY + 40);
    doc.text(`Días Trabajados: ${diasTrabajados}`, 20, startY + 50);
    doc.text(`Monto: ${monto}`, 20, startY + 60);
    doc.text(`Fecha de Pago: ${fechaPago}`, 20, startY + 70);
    doc.text(`Motivo: ${motivo}`, 20, startY + 80);
    doc.text(`Detalles: ${detalles}`, 20, startY + 90);
    doc.text(`Tipo de Pago: ${tipoPago}`, 20, startY + 100);
    doc.text("Firma del Empleado: ____________________", 20, startY + 160);

    const fileName = `${primerNombre}_${primerApellido}_Liquidacion(${fechaInicio}-${fechaFinalizacion}).pdf`;
    doc.save(fileName);
  };

  const limpiarCampos = () => {
    setSelectedEmployee(null);
    setCedula("");
    setPrimerNombre("");
    setPrimerApellido("");
    setFechaInicio("");
    setFechaFinalizacion("");
    setDiasTrabajados(0);
    setMonto(0);
    setFechaPago("");
    setMotivo("");
    setDetalles("");
    setTipoPago("Pago liquidación");
  };

  return (
    <div className={styles.container}>
      <h3>Pagar Liquidación</h3>
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
      <div className="form-group">
        <label>Primer Nombre:</label>
        <input type="text" className="form-control" value={primerNombre} disabled />
        <label>Primer Apellido:</label>
        <input type="text" className="form-control" value={primerApellido} disabled />
        <label>Fecha de Inicio:</label>
        <input
          type="date"
          className="form-control"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
        <label>Fecha de Finalización:</label>
        <input
          type="date"
          className="form-control"
          value={fechaFinalizacion}
          onChange={(e) => setFechaFinalizacion(e.target.value)}
          disabled={selectedEmployee && selectedEmployee.fecha_finalizacion ? true : false}
        />
        <button className="btn btn-secondary mt-2" onClick={calcularDiasYMonto} disabled={!fechaInicio || !fechaFinalizacion}>Calcular</button>
        <br></br>
        <label>Días Trabajados:</label>
        <input
          type="number"
          className="form-control"
          value={diasTrabajados}
          disabled
        />
        <label>Monto:</label>
        <input
          type="number"
          className="form-control"
          value={monto}
          disabled
        />
        <label>Fecha de Pago:</label>
        <input
          type="date"
          className="form-control"
          value={fechaPago}
          onChange={(e) => setFechaPago(e.target.value)}
        />
        <label>Motivo:</label>
        <select
          className="form-control"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        >
          <option value="">Seleccione un motivo</option>
          <option value="Finalización de contrato">Finalización de contrato</option>
          <option value="Renuncia">Renuncia</option>
          <option value="Despedido">Despedido</option>
        </select>
        <label>Detalles:</label>
        <textarea
          className="form-control"
          rows="3"
          value={detalles}
          onChange={(e) => setDetalles(e.target.value)}
          disabled
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

export default PagarLiquidacion;
