import React, { useState, useEffect } from "react";
import firebaseApp from "../firebase/Firebase";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';

const firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

function HistorialPagos() {
  const [pagos, setPagos] = useState([]);
  const [searchAño, setSearchAño] = useState("");
  const [searchMes, setSearchMes] = useState("");
  const [searchTipoPago, setSearchTipoPago] = useState("");
  const [filteredPagos, setFilteredPagos] = useState([]);
  const [cedula, setCedula] = useState("");

  const meses = [
    { value: "", label: "Todos los meses" },
    { value: "01", label: "Enero" },
    { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" },
    { value: "06", label: "Junio" },
    { value: "07", label: "Julio" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  const tiposPago = [
    { value: "", label: "Todos los tipos de pago" },
    { value: "Sueldo", label: "Pago de quincena" },
    { value: "Liquidación", label: "Pago liquidación" }
  ];

  useEffect(() => {
    const fetchCedula = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const email = user.email;
          const q = query(collection(firestore, "todosUsuarios"), where("email", "==", email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setCedula(userData.cedula);
          }
        }
      } catch (error) {
        console.error("Error al obtener la cédula del usuario:", error);
      }
    };

    fetchCedula();
  }, []);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        if (cedula) {
          const qLiquidaciones = query(collection(firestore, "PagarLiquidacion"), where("cedula", "==", cedula));
          const qSueldos = query(collection(firestore, "PagarSueldo"), where("cedula", "==", cedula));

          const [liquidacionesSnapshot, sueldosSnapshot] = await Promise.all([
            getDocs(qLiquidaciones),
            getDocs(qSueldos)
          ]);

          const liquidacionesList = liquidacionesSnapshot.docs.map((doc) => {
            const data = doc.data();
            const fechaInicio = data.fecha_inicio && data.fecha_inicio.toDate ? data.fecha_inicio.toDate().toISOString().split('T')[0] : data.fecha_inicio;
            const fechaFinalizacion = data.fecha_finalizacion && data.fecha_finalizacion.toDate ? data.fecha_finalizacion.toDate().toISOString().split('T')[0] : data.fecha_finalizacion;
            const fechaPago = data.fecha_pago && data.fecha_pago.toDate ? data.fecha_pago.toDate().toISOString().split('T')[0] : data.fecha_pago;
            return {
              id: doc.id,
              ...data,
              fecha_inicio: fechaInicio,
              fecha_finalizacion: fechaFinalizacion,
              fecha_pago: fechaPago,
              tipo: "Liquidación"
            };
          });

          const sueldosList = sueldosSnapshot.docs.map((doc) => {
            const data = doc.data();
            const fechaPago = data.fecha_pago && data.fecha_pago.toDate ? data.fecha_pago.toDate().toISOString().split('T')[0] : data.fecha_pago;
            return {
              id: doc.id,
              ...data,
              fecha_pago: fechaPago,
              tipo: "Sueldo"
            };
          });

          const combinedList = [...liquidacionesList, ...sueldosList];
          setPagos(combinedList);
          setFilteredPagos(combinedList);
        }
      } catch (error) {
        console.error("Error al obtener los pagos:", error);
      }
    };

    fetchPagos();
  }, [cedula]);

  const handleSearch = () => {
    const searchResults = pagos.filter((pago) =>
      (!searchAño || pago.fecha_pago.includes(searchAño)) &&
      (!searchMes || pago.fecha_pago.includes(`-${searchMes}-`)) &&
      (!searchTipoPago || pago.tipo.includes(searchTipoPago))
    );
    setFilteredPagos(searchResults);
  };

  const handleShowAll = () => {
    setFilteredPagos(pagos);
    setSearchAño("");
    setSearchMes("");
    setSearchTipoPago("");
  };

  const handleAñoChange = (e) => {
    const input = e.target.value;
    if (/^\d{0,4}$/.test(input)) {
      setSearchAño(input);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Historial de Pagos</h3>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por año"
          value={searchAño}
          onChange={handleAñoChange}
        />
        <select
          className="form-control mt-2"
          value={searchMes}
          onChange={(e) => setSearchMes(e.target.value)}
        >
          {meses.map((mes) => (
            <option key={mes.value} value={mes.value}>
              {mes.label}
            </option>
          ))}
        </select>
        <select
          className="form-control mt-2"
          value={searchTipoPago}
          onChange={(e) => setSearchTipoPago(e.target.value)}
        >
          {tiposPago.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.label}
            </option>
          ))}
        </select>
        <button className="btn btn-primary mt-2" onClick={handleSearch}>Buscar</button>
        <button className="btn btn-secondary mt-2 mx-2" onClick={handleShowAll}>Ver Todos</button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Cédula</th>
            <th>Primer Nombre</th>
            <th>Primer Apellido</th>
            <th>Fecha de Pago</th>
            <th>Detalles</th>
            <th>Tipo de Pago</th>
            <th>Monto</th>
            <th>Año</th>
            <th>Mes</th>
            <th>Número de Quincena</th>
          </tr>
        </thead>
        <tbody>
          {filteredPagos.length > 0 ? (
            filteredPagos.map((pago) => (
              <tr key={pago.id}>
                <td>{pago.cedula}</td>
                <td>{pago.primer_nombre}</td>
                <td>{pago.primer_apellido}</td>
                <td>{pago.fecha_pago}</td>
                <td>{pago.detalles}</td>
                <td>{pago.tipo}</td>
                <td>{pago.monto || pago.monto_pagar}</td>
                <td>{pago.año}</td>
                <td>{pago.mes}</td>
                <td>{pago.numero_quincena}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">
                No se encontraron pagos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HistorialPagos;
