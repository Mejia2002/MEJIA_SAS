import React, { useState, useEffect } from "react";
import firebaseApp from "../firebase/Firebase";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { jsPDF } from "jspdf";
import logo from '../Images/LogoEmpresa.png'; 
import 'bootstrap/dist/css/bootstrap.min.css';

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

  const handleGuardarPdf = (contrato) => {
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
    addText(` Empleado: ${contrato.primer_nombre} ${contrato.primer_apellido}`);
    addText(` Identificación: ${contrato.cedula}`);

    addText(` 1. Duración del Contrato`);
    addText(`Este contrato es por tiempo ${contrato.tipo_contrato}, comenzando el ${contrato.fecha_inicio} y terminando el ${contrato.tipo_contrato === "Indefinido" ? "fecha indefinida" : contrato.fecha_finalizacion}.`);

    addText(` 2. Funciones y Responsabilidades`);
    addText(`El Empleado desempeñará el cargo de ${contrato.cargo} y realizará las tareas asignadas por la Empresa.`);

    addText(` 3. Salario y Beneficios`);
    addText(`El salario mensual es de ${contrato.salario_base}. Se otorgan beneficios adicionales conforme al manual de empleados de MEJIA SAS.`);

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

    doc.save(`Contrato_${contrato.primer_nombre}_${contrato.primer_apellido}.pdf`);
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
          {filteredContratos.map((contrato) => (
            <tr key={contrato.id}>
              <td>{editContrato === contrato.id ? (
                <input
                  type="text"
                  className="form-control"
                  value={editData.primer_nombre}
                  onChange={(e) => setEditData({ ...editData, primer_nombre: e.target.value })}
                />
              ) : contrato.primer_nombre}</td>
              <td>{editContrato === contrato.id ? (
                <input
                  type="text"
                  className="form-control"
                  value={editData.primer_apellido}
                  onChange={(e) => setEditData({ ...editData, primer_apellido: e.target.value })}
                />
              ) : contrato.primer_apellido}</td>
              <td>{editContrato === contrato.id ? (
                <input
                  type="text"
                  className="form-control"
                  value={editData.cedula}
                  onChange={(e) => setEditData({ ...editData, cedula: e.target.value })}
                />
              ) : contrato.cedula}</td>
              <td>{editContrato === contrato.id ? (
                <input
                  type="text"
                  className="form-control"
                  value={editData.cargo}
                  onChange={(e) => setEditData({ ...editData, cargo: e.target.value })}
                />
              ) : contrato.cargo}</td>
              <td>{editContrato === contrato.id ? (
                <select
                  className="form-control"
                  value={editData.tipo_contrato}
                  onChange={(e) => setEditData({ ...editData, tipo_contrato: e.target.value })}
                >
                  <option value="Fijo">Fijo</option>
                  <option value="Indefinido">Indefinido</option>
                </select>
              ) : contrato.tipo_contrato}</td>
              <td>{editContrato === contrato.id ? (
                <input
                  type="text"
                  className="form-control"
                  value={editData.salario_base}
                  onChange={(e) => setEditData({ ...editData, salario_base: e.target.value })}
                />
              ) : contrato.salario_base}</td>
              <td>{editContrato === contrato.id ? (
                <input
                  type="date"
                  className="form-control"
                  value={editData.fecha_inicio}
                  onChange={(e) => setEditData({ ...editData, fecha_inicio: e.target.value })}
                />
              ) : contrato.fecha_inicio}</td>
              <td>{editContrato === contrato.id ? (
                <input
                  type="date"
                  className="form-control"
                  value={editData.fecha_finalizacion}
                  onChange={(e) => setEditData({ ...editData, fecha_finalizacion: e.target.value })}
                  disabled={editData.tipo_contrato === "Indefinido"}
                />
              ) : contrato.fecha_finalizacion}</td>
              <td>
                {editContrato === contrato.id ? (
                  <button className="btn btn-success btn-sm mx-1" onClick={() => handleSave(contrato.id)}>Guardar</button>
                ) : (
                  <button className="btn btn-primary btn-sm mx-1" onClick={() => handleEdit(contrato)}>Editar</button>
                )}
                <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDelete(contrato.id)}>Eliminar</button>
                <button className="btn btn-info btn-sm mx-1" onClick={() => handleGuardarPdf(contrato)}>Descargar PDF</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VisualizarContratos;
