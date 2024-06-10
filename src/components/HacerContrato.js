import React, { useState, useEffect } from "react";
import firebaseApp from "../firebase/Firebase";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';
import { jsPDF } from "jspdf";
import styles from '../Styles/Formularios.module.css'; 
import logo from '../Images/LogoEmpresa.png'; 

const firestore = getFirestore(firebaseApp);

function HacerContrato() {
  const [primerNombre, setPrimerNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [cargo, setCargo] = useState("");
  const [tipoContrato, setTipoContrato] = useState("");
  const [salarioBase, setSalarioBase] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinalizacion, setFechaFinalizacion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchCedula, setSearchCedula] = useState("");

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

  useEffect(() => {
    if (selectedEmployee) {
      setPrimerNombre(selectedEmployee.primer_nombre);
      setPrimerApellido(selectedEmployee.primer_apellido);
      setCedula(selectedEmployee.cedula);
    } else {
      setPrimerNombre("");
      setPrimerApellido("");
      setCedula("");
    }
  }, [selectedEmployee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(firestore, "contratos", cedula), {
        primer_nombre: primerNombre,
        primer_apellido: primerApellido,
        cedula,
        cargo,
        tipo_contrato: tipoContrato,
        salario_base: parseFloat(salarioBase),
        fecha_inicio: new Date(fechaInicio),
        fecha_finalizacion: tipoContrato === "Indefinido" ? "Indefinido" : new Date(fechaFinalizacion),
      });
      setMensaje("Contrato creado con éxito");
      // limpiarCampos(); 
    } catch (error) {
      console.error("Error creando contrato: ", error);
      setMensaje("Error creando contrato. Inténtelo de nuevo.");
    }
  };

  const limpiarCampos = () => {
    setPrimerNombre("");
    setPrimerApellido("");
    setCedula("");
    setCargo("");
    setTipoContrato("");
    setSalarioBase("");
    setFechaInicio("");
    setFechaFinalizacion("");
    setSelectedEmployee(null);
    setSearchCedula("");
  };

  const handleBuscarEmpleado = () => {
    if (!searchCedula) {
      alert("Ingrese una cédula para buscar.");
      return;
    }
    const empleadoEncontrado = empleados.find(empleado => empleado.cedula === searchCedula);
    if (empleadoEncontrado) {
      setSelectedEmployee(empleadoEncontrado);
    } else {
      alert("No se encontró ningún empleado con la cédula proporcionada.");
    }
  };

  const handleGuardarPdf = async () => {
    if (!primerNombre || !primerApellido || !cedula || !cargo || !tipoContrato || !salarioBase || !fechaInicio || (!fechaFinalizacion && tipoContrato === "Por proyecto")) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("TÉRMINOS Y CONDICIONES DE EMPLEO - MEJIA SAS", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

  
    const imgWidth = 50;
    const imgHeight = 50;
    const imgX = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
    const imgY = 30;
    doc.addImage(logo, 'PNG', imgX, imgY, imgWidth, imgHeight);


    doc.setFontSize(12);
    const startY = imgY + imgHeight + 20; 
    const lineHeight = 10;
    const pageHeight = doc.internal.pageSize.getHeight();

    let currentY = startY;

    const addText = (text, spacing = lineHeight) => {
      const splitText = doc.splitTextToSize(text, doc.internal.pageSize.getWidth() - 40);
      splitText.forEach(line => {
        if (currentY + spacing > pageHeight - 30) {
          doc.addPage();
          currentY = 20;
        }
        doc.text(line, 20, currentY);
        currentY += spacing;
      });
    };
    addText(` Empleado: ${primerNombre} ${primerApellido}`);
    addText(` Identificación: ${cedula}`);

    addText(` 1. Duración del Contrato`);
    addText(`Este contrato es por tiempo ${tipoContrato}, comenzando el ${fechaInicio} y terminando el ${tipoContrato === "Indefinido" ? "fecha indefinida" : fechaFinalizacion}.`);

    addText(` 2. Funciones y Responsabilidades`);
    addText(`El Empleado desempeñará el cargo de ${cargo} y realizará las tareas asignadas por la Empresa.`);

    addText(` 3. Salario y Beneficios`);
    addText(`El salario mensual es de ${salarioBase}. Se otorgan beneficios adicionales conforme al manual de empleados de MEJIA SAS.`);

    addText(` 4. Horario de Trabajo`);
    addText(`El horario de trabajo es de 6:30 a. m - 4:00 p. m de lunes a viernes y de 6:30 a. m - 12:00 pm los días sábados.`);

    addText(` 5. Confidencialidad`);
    addText(`El Empleado debe mantener la confidencialidad de toda la información sensible de la Empresa.`);

    addText(` 6. Terminación del Contrato`);
    addText(`Cualquiera de las partes puede terminar el contrato con un preaviso de 15 días.`);
    addText(`MEJIA SAS puede terminar el contrato inmediatamente por causa justificada.`);

    addText(` 7. Aceptación del Contrato`);
    addText(`Al firmar, el Empleado acepta los términos y condiciones descritos.`);


    addText(`Firma del Empleado: ____________________ Fecha: __________`, 20);
    addText(`Firma del Representante de MEJIA SAS: ____________________ Fecha: __________`, 20);

    
    doc.save(`Contrato_${primerNombre}_${primerApellido}.pdf`);
  };

  return (
    <div className={styles.container}>
      <h2>Hacer Contrato</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Seleccione un empleado:</label>
          <div className="d-flex">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por cédula"
              value={searchCedula}
              onChange={(e) => setSearchCedula(e.target.value)}
            />
            <button type="button" className="btn btn-primary mx-2" onClick={handleBuscarEmpleado}>Buscar</button>
            <select
              className="form-control"
              onChange={(e) => {
                const selectedId = e.target.value;
                const selectedEmp = empleados.find(emp => emp.id === selectedId);
                setSelectedEmployee(selectedEmp);
              }}
              value={selectedEmployee ? selectedEmployee.id : ""}
            >
              <option value="">Seleccionar empleado</option>
              {empleados.map((empleado) => (
                <option key={empleado.id} value={empleado.id}>
                  {empleado.primer_nombre} {empleado.primer_apellido}
                </option>
              ))}
            </select>
          </div>
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
          <label htmlFor="cargo">Cargo:</label>
          <select
            className="form-control"
            id="cargo"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
          >
            <option value="">Seleccionar cargo</option>
            <option value="Siso">Siso</option>
            <option value="Conductor">Conductor</option>
            <option value="Guadañador">Guadañador</option>
            <option value="Capataz">Capataz</option>
            <option value="Obrero">Obrero</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="tipoContrato">Tipo de Contrato:</label>
          <select
            className="form-control"
            id="tipoContrato"
            value={tipoContrato}
            onChange={(e) => setTipoContrato(e.target.value)}
          >
            <option value="">Seleccionar tipo de contrato</option>
            <option value="Por proyecto">Por proyecto</option>
            <option value="Indefinido">Indefinido</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="salarioBase">Salario Base:</label>
          <input
            type="number"
            className="form-control"
            id="salarioBase"
            value={salarioBase}
            onChange={(e) => setSalarioBase(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="fechaInicio">Fecha de Inicio:</label>
          <input
            type="date"
            className="form-control"
            id="fechaInicio"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        {tipoContrato === "Por proyecto" && (
          <div className="form-group">
            <label htmlFor="fechaFinalizacion">Fecha de Finalización:</label>
            <input
              type="date"
              className="form-control"
              id="fechaFinalizacion"
              value={fechaFinalizacion}
              onChange={(e) => setFechaFinalizacion(e.target.value)}
            />
          </div>
        )}
        <div className="form-group">
          <button type="submit" className="btn btn-primary">Guardar</button>
          <button type="button" className="btn btn-success mx-2" onClick={handleGuardarPdf}>Descargar PDF</button>
          <button type="button" className="btn btn-danger" onClick={limpiarCampos}>Limpiar</button>
        </div>
      </form>
      {mensaje && <p style={{ color: mensaje.startsWith("Error") ? "red" : "green" }}>{mensaje}</p>}
    </div>
  );
}

export default HacerContrato;
