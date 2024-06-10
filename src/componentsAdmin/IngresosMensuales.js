import React, { useState } from "react";
import firebaseApp from "../firebase/Firebase";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../Styles/Formularios.module.css'; 

const firestore = getFirestore(firebaseApp);

function IngresosMensuales() {
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [gastosSueldos, setGastosSueldos] = useState(0);
  const [gastosLiquidaciones, setGastosLiquidaciones] = useState(0);
  const [gastosSeguridad, setGastosSeguridad] = useState(0);
  const [gastosRepuestos, setGastosRepuestos] = useState(0);
  const [gastosGasolina, setGastosGasolina] = useState(0);
  const [totalFacturado, setTotalFacturado] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!mes || !ano) {
      if (!mes) setError("Por favor, seleccione un mes.");
      if (!ano) setError("Por favor, ingrese un año.");
      return;
    }

    try {
      const qSueldos = query(collection(firestore, "PagarSueldo"), where("mes", "==", mes), where("año", "==", ano));
      const querySnapshotSueldos = await getDocs(qSueldos);
      let totalSueldos = 0;
      querySnapshotSueldos.forEach(doc => {
        totalSueldos += doc.data().monto_pagar;
      });
      setGastosSueldos(totalSueldos);

      const qLiquidaciones = query(collection(firestore, "PagarLiquidacion"));
      const querySnapshotLiquidaciones = await getDocs(qLiquidaciones);
      let totalLiquidaciones = 0;
      querySnapshotLiquidaciones.forEach(doc => {
        const data = doc.data();
        const fechaPago = new Date(data.fecha_pago.seconds * 1000);
        if (fechaPago.getMonth() + 1 === parseInt(mes) && fechaPago.getFullYear() === parseInt(ano)) {
          totalLiquidaciones += data.monto;
        }
      });
      setGastosLiquidaciones(totalLiquidaciones);

      const qOtrosGastos = query(collection(firestore, "otros_gastos"), where("mes", "==", parseInt(mes)), where("ano", "==", parseInt(ano)));
      const querySnapshotOtrosGastos = await getDocs(qOtrosGastos);
      let totalSeguridad = 0;
      let totalRepuestos = 0;
      let totalGasolina = 0;
      querySnapshotOtrosGastos.forEach(doc => {
        const data = doc.data();
        if (data.tipo_gasto === "Seguridad") totalSeguridad += data.monto;
        if (data.tipo_gasto === "Repuesto") totalRepuestos += data.monto;
        if (data.tipo_gasto === "Gasolina") totalGasolina += data.monto;
      });
      setGastosSeguridad(totalSeguridad);
      setGastosRepuestos(totalRepuestos);
      setGastosGasolina(totalGasolina);

      const qFacturado = query(collection(firestore, "total_facturado"), where("mes", "==", parseInt(mes)), where("ano", "==", parseInt(ano)));
      const querySnapshotFacturado = await getDocs(qFacturado);
      let totalFacturado = 0;
      querySnapshotFacturado.forEach(doc => {
        totalFacturado += doc.data().monto;
      });
      setTotalFacturado(totalFacturado);

      if (querySnapshotSueldos.empty && querySnapshotLiquidaciones.empty && querySnapshotOtrosGastos.empty && querySnapshotFacturado.empty) {
        setMensaje("No se encontraron registros para el mes y año especificados.");
      }
    } catch (error) {
      console.error("Error buscando ingresos y gastos: ", error);
      setError("Error buscando ingresos y gastos. Inténtelo de nuevo.");
    }
  };

  const totalGastado = gastosSueldos + gastosLiquidaciones + gastosSeguridad + gastosRepuestos + gastosGasolina;
  const ganancia = totalFacturado - totalGastado;

  return (
    <div className={styles.container}>
      <h2>Ingresos Mensuales</h2>
      <form onSubmit={handleSearch} className="mb-3">
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
        <button type="submit" className="btn btn-primary mt-3">Buscar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {mensaje === "" && (
        <div>
        <table className={`${styles.infoTable}`}>
      <tr>
        <td><strong>Gasto en sueldos:</strong></td>
        <td>{gastosSueldos.toLocaleString()}</td>
      </tr>
      <tr>
        <td><strong>Gastado en liquidaciones:</strong></td>
        <td>{gastosLiquidaciones.toLocaleString()}</td>
      </tr>
      <tr>
        <td><strong>Pagado en Seguridad:</strong></td>
        <td>{gastosSeguridad.toLocaleString()}</td>
      </tr>
      <tr>
        <td><strong>Gastado en repuestos:</strong></td>
        <td>{gastosRepuestos.toLocaleString()}</td>
      </tr>
      <tr>
        <td><strong>Gastado en gasolina:</strong></td>
        <td>{gastosGasolina.toLocaleString()}</td>
      </tr>
      <tr>
        <td><strong>Total gastado:</strong></td>
        <td>{totalGastado.toLocaleString()}</td>
      </tr>
      <tr>
        <td><strong>Total facturado:</strong></td>
        <td>{totalFacturado.toLocaleString()}</td>
      </tr>
      <tr>
        <td><strong>Ganancias:</strong></td>
        <td>{ganancia.toLocaleString()}</td>
      </tr>
    </table>
      </div>
      )}
    </div>
  );
}

export default IngresosMensuales;
