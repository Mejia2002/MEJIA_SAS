import React, { useState } from "react";
import firebaseApp from "../firebase/Firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../Styles/Formularios.module.css'; 

const firestore = getFirestore(firebaseApp);

function RegistrarTotalFacturado() {
  const [monto, setMonto] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [detalles, setDetalles] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    const montoPattern = /^[0-9]+(\.[0-9]{1,2})?$/;
    const mesPattern = /^(1[0-2]|[1-9])$/;
    const anoPattern = /^(19|20)\d{2}$/;

    if (!montoPattern.test(monto)) {
      setError("Por favor, ingrese un monto válido.");
      return;
    }

    if (!mesPattern.test(mes)) {
      setError("Por favor, ingrese un mes válido (entre 1 y 12).");
      return;
    }

    if (!anoPattern.test(ano)) {
      setError("Por favor, ingrese un año válido.");
      return;
    }

    try {
      await setDoc(doc(firestore, "total_facturado", `${mes}-${ano}`), {
        monto: parseFloat(monto),
        mes: parseInt(mes, 10),
        ano: parseInt(ano, 10),
        detalles,
      });
      setMensaje("Total facturado registrado con éxito");
      setMonto("");
      setMes("");
      setAno("");
      setDetalles("");
    } catch (error) {
      console.error("Error registrando total facturado: ", error);
      setError("Error registrando total facturado. Inténtelo de nuevo.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Registrar Total Facturado</h2>
      <form onSubmit={handleSubmit}>
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
            onChange={(e) => setMes(e.target.value)}
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
            onChange={(e) => setAno(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="detalles">Detalles:</label>
          <textarea
            className="form-control"
            id="detalles"
            rows="3"
            value={detalles}
            onChange={(e) => setDetalles(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary mt-3">Registrar Total Facturado</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
    </div>
  );
}

export default RegistrarTotalFacturado;
