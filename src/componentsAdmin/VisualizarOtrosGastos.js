import React, { useEffect, useState } from "react";
import firebaseApp from "../firebase/Firebase";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';

const firestore = getFirestore(firebaseApp);

function VisualizarOtrosGastos() {
  const [gastos, setGastos] = useState([]);
  const [searchMes, setSearchMes] = useState("");
  const [searchAno, setSearchAno] = useState("");
  const [filteredGastos, setFilteredGastos] = useState([]);
  const [totalGastos, setTotalGastos] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const gastosCollection = collection(firestore, "otros_gastos");
        const gastosSnapshot = await getDocs(gastosCollection);
        const gastosList = gastosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGastos(gastosList);
        setFilteredGastos(gastosList);
      } catch (error) {
        console.error("Error al obtener los gastos:", error);
      }
    };

    fetchGastos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, "otros_gastos", id));
      setGastos(gastos.filter((gasto) => gasto.id !== id));
      setFilteredGastos(filteredGastos.filter((gasto) => gasto.id !== id));
      calculateTotal(filteredGastos.filter((gasto) => gasto.id !== id));
    } catch (error) {
      console.error("Error al borrar el gasto:", error);
    }
  };

  const handleEdit = (id) => {
    console.log("Editando gasto con id:", id);
  };

  const handleSearch = () => {
    if (!searchMes && !searchAno) {
      setError("Por favor, ingrese el mes y/o el año para buscar.");
      return;
    }

    if (!searchMes) {
      setError("Por favor, ingrese el mes para buscar.");
      return;
    }

    if (!searchAno) {
      setError("Por favor, ingrese el año para buscar.");
      return;
    }

    const searchResults = gastos.filter((gasto) =>
      gasto.mes.toString() === searchMes && gasto.ano.toString() === searchAno
    );
    setFilteredGastos(searchResults);
    calculateTotal(searchResults);
    setError("");
  };

  const handleShowAll = () => {
    setFilteredGastos(gastos);
    setSearchMes("");
    setSearchAno("");
    calculateTotal(gastos);
    setError("");
  };

  const calculateTotal = (gastosList) => {
    const total = gastosList.reduce((acc, gasto) => acc + gasto.monto, 0);
    setTotalGastos(total);
  };

  const formatNumber = (number) => {
    return number.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <div className="container mt-5">
      <h3>Visualizar Otros Gastos</h3>
      <div className="mb-3">
        <input
          type="number"
          min="1"
          max="12"
          className="form-control"
          placeholder="Mes"
          value={searchMes}
          onChange={(e) => setSearchMes(e.target.value)}
        />
        <input
          type="number"
          min="1900"
          max="9999"
          className="form-control"
          placeholder="Año"
          value={searchAno}
          onChange={(e) => setSearchAno(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleSearch}>Buscar</button>
        <button className="btn btn-secondary mt-2 mx-2" onClick={handleShowAll}>Ver Todos</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Fecha de Registro</th>
            <th>Tipo de Gasto</th>
            <th>Monto</th>
            <th>Mes</th>
            <th>Año</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredGastos.length > 0 ? (
            filteredGastos.map((gasto) => (
              <tr key={gasto.id}>
                <td>{new Date(gasto.fecha_registro.seconds * 1000).toISOString().split('T')[0]}</td>
                <td>{gasto.tipo_gasto}</td>
                <td>{formatNumber(gasto.monto)}</td>
                <td>{gasto.mes}</td>
                <td>{gasto.ano}</td>
                <td>{gasto.descripcion}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleEdit(gasto.id)}>
                    Editar
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(gasto.id)}>
                    Borrar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No hay gastos disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="mt-3">
        <label>Total Gastos del Mes: </label>
        <span className="ml-2">${formatNumber(totalGastos)}</span>
      </div>
    </div>
  );
}

export default VisualizarOtrosGastos;
