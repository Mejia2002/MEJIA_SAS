import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import HacerContrato from "./HacerContrato";
import RegistrarEmpleado from "./RegistrarEmpleado";
import VisualizarEmpleados from "./VisualizarEmpleados";
import VisualizarContratos from "./VisualizarContratos";
import PagarSueldo from "./PagarSueldo"; 
import { useNavigate } from "react-router-dom";
import styles from "../Styles/AdminView.module.css";

const auth = getAuth();

function AdminView() {
  const [showRegistrarEmpleado, setShowRegistrarEmpleado] = useState(false);
  const [showVisualizarEmpleados, setShowVisualizarEmpleados] = useState(false);
  const [showHacerContrato, setShowHacerContrato] = useState(false);
  const [showVisualizarContratos, setShowVisualizarContratos] = useState(false);
  const [showPagarSueldo, setShowPagarSueldo] = useState(false); 
  const navigate = useNavigate();

  const toggleRegistrarEmpleado = () => {
    setShowRegistrarEmpleado((prev) => !prev);
    setShowVisualizarEmpleados(false);
    setShowHacerContrato(false);
    setShowVisualizarContratos(false);
    setShowPagarSueldo(false); 
  };

  const toggleVisualizarEmpleados = () => {
    setShowVisualizarEmpleados((prev) => !prev);
    setShowRegistrarEmpleado(false);
    setShowHacerContrato(false);
    setShowVisualizarContratos(false);
    setShowPagarSueldo(false); 
  };

  const toggleHacerContrato = () => {
    setShowHacerContrato((prev) => !prev);
    setShowRegistrarEmpleado(false);
    setShowVisualizarEmpleados(false);
    setShowVisualizarContratos(false);
    setShowPagarSueldo(false); 
  };

  const toggleVisualizarContratos = () => {
    setShowVisualizarContratos((prev) => !prev);
    setShowRegistrarEmpleado(false);
    setShowVisualizarEmpleados(false);
    setShowHacerContrato(false);
    setShowPagarSueldo(false); 
  };

  const togglePagarSueldo = () => {
    setShowPagarSueldo((prev) => !prev);
    setShowRegistrarEmpleado(false);
    setShowVisualizarEmpleados(false);
    setShowHacerContrato(false);
    setShowVisualizarContratos(false);
  };

  const cerrarSesion = () => {
    signOut(auth)
      .then(() => {
        console.log("Sesión cerrada");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <div className={styles.adminContainer}>
      <h2>Bienvenido, Admin</h2>
      <div className={styles.buttonContainer}>
        <button
          onClick={toggleRegistrarEmpleado}
          className={`${styles.adminButton} ${showRegistrarEmpleado && styles.active}`}
        >
          {showRegistrarEmpleado ? "Ocultar formulario" : "Registrar Empleado"}
        </button>
        <button
          onClick={toggleVisualizarEmpleados}
          className={`${styles.adminButton} ${showVisualizarEmpleados && styles.active}`}
        >
          {showVisualizarEmpleados ? "Ocultar empleados" : "Visualizar Empleados"}
        </button>
        <button
          onClick={toggleHacerContrato}
          className={`${styles.adminButton} ${showHacerContrato && styles.active}`}
        >
          {showHacerContrato ? "Ocultar formulario" : "Hacer Contrato"}
        </button>
        <button
          onClick={toggleVisualizarContratos}
          className={`${styles.adminButton} ${showVisualizarContratos && styles.active}`}
        >
          {showVisualizarContratos ? "Ocultar contratos" : "Visualizar Contratos"}
        </button>
        <button
          onClick={togglePagarSueldo}
          className={`${styles.adminButton} ${showPagarSueldo && styles.active}`}
        >
          {showPagarSueldo ? "Ocultar pago de sueldo" : "Pagar Sueldo"}
        </button>
        <button onClick={cerrarSesion} className={`${styles.adminButton} ${styles.redButton}`}>
          Cerrar Sesión
        </button>
      </div>
      <div className={styles.formContainer}>
        {showRegistrarEmpleado && <RegistrarEmpleado />}
        {showVisualizarEmpleados && <VisualizarEmpleados />}
        {showHacerContrato && <HacerContrato />}
        {showVisualizarContratos && <VisualizarContratos />}
        {showPagarSueldo && <PagarSueldo />} {}
      </div>
    </div>
  );
}

export default AdminView;
