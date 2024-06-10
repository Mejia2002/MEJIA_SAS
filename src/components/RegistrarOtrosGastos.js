import React, { useState, useEffect } from "react";
import firebaseApp from "../firebase/Firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../Styles/Formularios.module.css'; 

const firestore = getFirestore(firebaseApp);

function RegistrarOtrosGastos() {
  const [fechaRegistro, setFechaRegistro] = useState("");
  const [tipoGasto, setTipoGasto] = useState("");
  const [monto, setMonto] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear().toString();
    setMes(currentMonth.toString());
    setAno(currentYear);
  }, []);

  const handleMesChange = (e) => {
    setMes(e.target.value);
  };

  const handleAnoChange = (e) => {
    const year = e.target.value;
    const currentYear = new Date().getFullYear().toString();
    if (year.length <= 4 && /^\d+$/.test(year) && parseInt(year, 10) <= parseInt(currentYear, 10)) {
      setAno(year);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    const montoPattern = /^[0-9]+(\.[0-9]{1,2})?$/;
    const mesPattern = /^(1[0-2]|[1-9])$/;

    if (!montoPattern.test(monto)) {
      setError("Por favor, ingrese un monto válido.");
      return;
    }

    if (!mesPattern.test(mes)) {
      setError("Por favor, ingrese un mes válido (entre 1 y 12).");
      return;
    }

    if (!ano) {
      setError("Por favor, ingrese un año válido.");
      return;
    }

    try {
      await setDoc(doc(firestore, "otros_gastos", `${fechaRegistro}-${tipoGasto}-${mes}`), {
        fecha_registro: new Date(fechaRegistro),
        tipo_gasto: tipoGasto,
        monto: parseFloat(monto),
        mes: parseInt(mes, 10),
        ano: parseInt(ano, 10),
        descripcion,
      });
      setMensaje("Gasto registrado con éxito");
      setFechaRegistro("");
      setTipoGasto("");
      setMonto("");
      setMes("");
      setAno("");
      setDescripcion("");
    } catch (error) {
      console.error("Error registrando gasto: ", error);
      setError("Error registrando gasto. Inténtelo de nuevo.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Registrar Otros Gastos</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fechaRegistro">Fecha de Registro:</label>
          <input
            type="date"
            className="form-control"
            id="fechaRegistro"
            value={fechaRegistro}
            onChange={(e) => setFechaRegistro(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="tipoGasto">Tipo de Gasto:</label>
          <select
            className="form-control"
            id="tipoGasto"
            value={tipoGasto}
            onChange={(e) => setTipoGasto(e.target.value)}
          >
            <option value="">Seleccione el tipo de gasto</option>
            <option value="Gasolina">Gasolina</option>
            <option value="Repuesto">Repuesto</option>
            <option value="Seguridad">Seguridad</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="monto">Monto:</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            id="monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
        </div>
        <div className="form-group">
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
        </div>
        <div className="form-group">
          <label>Año:</label>
          <input
            type="number"
            className="form-control"
            value={ano}
            onChange={handleAnoChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <input
            type="text"
            className="form-control"
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Registrar Gasto</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
    </div>
  );
}

export default RegistrarOtrosGastos;
