import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import HacerContrato from "./HacerContrato";
import RegistrarEmpleado from "./RegistrarEmpleado";
import VisualizarEmpleados from "./VisualizarEmpleados";
import VisualizarContratos from "./VisualizarContratos";
import PagarSueldo from "./PagarSueldo";
import PagarLiquidacion from "./PagarLiquidacion";
import VisualizarPagosSueldo from "./VisualizarPagosSueldo";
import VisualizarLiquidaciones from "./VisualizarLiquidaciones";
import RegistrarOtrosGastos from "./RegistrarOtrosGastos";
import VisualizarOtrosGastos from "./VisualizarOtrosGastos";
import RegistrarTotalFacturado from "./RegistrarTotalFacturado";
import VisualizarRegistroTotalFacturado from "./VisualizarRegistroTotalFacturado"; 
import IngresosMensuales from "./IngresosMensuales"; 
import { useNavigate } from "react-router-dom";
import styles from "../Styles/AdminView.module.css";

const auth = getAuth();

function AdminView() {
  const [showRegistrarEmpleado, setShowRegistrarEmpleado] = useState(false);
  const [showVisualizarEmpleados, setShowVisualizarEmpleados] = useState(false);
  const [showHacerContrato, setShowHacerContrato] = useState(false);
  const [showVisualizarContratos, setShowVisualizarContratos] = useState(false);
  const [showPagarSueldo, setShowPagarSueldo] = useState(false);
  const [showPagarLiquidacion, setShowPagarLiquidacion] = useState(false);
  const [showVisualizarPagosSueldo, setShowVisualizarPagosSueldo] = useState(false);
  const [showVisualizarLiquidaciones, setShowVisualizarLiquidaciones] = useState(false);
  const [showRegistrarOtrosGastos, setShowRegistrarOtrosGastos] = useState(false);
  const [showVisualizarOtrosGastos, setShowVisualizarOtrosGastos] = useState(false);
  const [showRegistrarTotalFacturado, setShowRegistrarTotalFacturado] = useState(false);
  const [showVisualizarRegistroTotalFacturado, setShowVisualizarRegistroTotalFacturado] = useState(false); 
  const [showIngresosMensuales, setShowIngresosMensuales] = useState(false); 

  const navigate = useNavigate();

  const toggleRegistrarEmpleado = () => {
    setShowRegistrarEmpleado((prev) => !prev);
    setShowVisualizarEmpleados(false);
    setShowHacerContrato(false);
    setShowVisualizarContratos(false);
    setShowPagarSueldo(false);
    setShowPagarLiquidacion(false);
    setShowVisualizarPagosSueldo(false);
    setShowVisualizarLiquidaciones(false);
    setShowRegistrarOtrosGastos(false);
    setShowVisualizarOtrosGastos(false);
    setShowRegistrarTotalFacturado(false);
    setShowVisualizarRegistroTotalFacturado(false);
    setShowIngresosMensuales(false); 
  };

  const toggleVisualizarEmpleados = () => {
    setShowVisualizarEmpleados((prev) => !prev);
    setShowRegistrarEmpleado(false);
    setShowHacerContrato(false);
    setShowVisualizarContratos(false);
    setShowPagarSueldo(false);
    setShowPagarLiquidacion(false);
    setShowVisualizarPagosSueldo(false);
    setShowVisualizarLiquidaciones(false);
    setShowRegistrarOtrosGastos(false);
    setShowVisualizarOtrosGastos(false);
    setShowRegistrarTotalFacturado(false);
    setShowVisualizarRegistroTotalFacturado(false);
    setShowIngresosMensuales(false); 
  };

  const toggleHacerContrato = () => {
    setShowHacerContrato((prev) => !prev);
    setShowRegistrarEmpleado(false);
    setShowVisualizarEmpleados(false);
    setShowVisualizarContratos(false);
    setShowPagarSueldo(false);
    setShowPagarLiquidacion(false);
    setShowVisualizarPagosSueldo(false);
    setShowVisualizarLiquidaciones(false);
    setShowRegistrarOtrosGastos(false);
    setShowVisualizarOtrosGastos(false);
    setShowRegistrarTotalFacturado(false);
    setShowVisualizarRegistroTotalFacturado(false);
    setShowIngresosMensuales(false); 
  };

  const toggleVisualizarContratos = () => {
    setShowVisualizarContratos((prev) => !prev);
    setShowRegistrarEmpleado(false);
    setShowVisualizarEmpleados(false);
    setShowHacerContrato(false);
    setShowPagarSueldo(false);
    setShowPagarLiquidacion(false);
    setShowVisualizarPagosSueldo(false);
    setShowVisualizarLiquidaciones(false);
    setShowRegistrarOtrosGastos(false);
    setShowVisualizarOtrosGastos(false);
    setShowRegistrarTotalFacturado(false);
    setShowVisualizarRegistroTotalFacturado(false);
    setShowIngresosMensuales(false); 
  };

  const togglePagarSueldo = () => {
    setShowPagarSueldo((prev) => !prev);
    setShowRegistrarEmpleado(false);
    setShowVisualizarEmpleados(false);
    setShowHacerContrato(false);
    setShowVisualizarContratos(false);
    setShowPagarLiquidacion(false);
    setShowVisualizarPagosSueldo(false);
    setShowVisualizarLiquidaciones(false);
    setShowRegistrarOtrosGastos(false);
    setShowVisualizarOtrosGastos(false);
    setShowRegistrarTotalFacturado(false);
    setShowVisualizarRegistroTotalFacturado(false);
    setShowIngresosMensuales(false); 
  };

  const togglePagarLiquidacion = () => {
    setShowPagarLiquidacion((prev) => !prev);
    setShowRegistrarEmpleado(false);
    setShowVisualizarEmpleados(false);
    setShowHacerContrato(false);
    setShowVisualizarContratos(false);
    setShowPagarSueldo(false);
    setShowVisualizarPagosSueldo(false);
    setShowVisualizarLiquidaciones(false);
    setShowRegistrarOtrosGastos(false);
    setShowVisualizarOtrosGastos(false);
    setShowRegistrarTotalFacturado(false);
    setShowVisualizarRegistroTotalFacturado(false);
    setShowIngresosMensuales(false); 
  };

  const toggleVisualizarPagosSueldo = () => {
    setShowVisualizarPagosSueldo((prev) => !prev);
    setShowRegistrarEmpleado(false);
    setShowVisualizarEmpleados(false);
    setShowHacerContrato(false);
    setShowVisualizarContratos(false);
    setShowPagarSueldo(false);
    setShowPagarLiquidacion(false);
    setShowVisualizarLiquidaciones(false);
    setShowRegistrarOtrosGastos(false);
    setShowVisualizarOtrosGastos(false);
    setShowRegistrarTotalFacturado(false);
    setShowVisualizarRegistroTotalFacturado(false);
    setShowIngresosMensuales(false); 
  };

  const toggleVisualizarLiquidaciones = () => {
    setShowVisualizarLiquidaciones((prev) => !prev);
    setShowRegistrarEmpleado(false);
    setShowVisualizarEmpleados(false);
    setShowHacerContrato(false);
    setShowVisualizarContratos(false);
    setShowPagarSueldo(false);
    setShowPagarLiquidacion(false);
    setShowVisualizarPagosSueldo(false);
    setShowRegistrarOtrosGastos(false);
    setShowVisualizarOtrosGastos(false);
    setShowRegistrarTotalFacturado(false);
    setShowVisualizarRegistroTotalFacturado(false);
    setShowIngresosMensuales(false); 
  };

  const toggleRegistrarOtrosGastos = () => {
    setShowRegistrarOtrosGastos((prev) => !prev);
    setShowRegistrarEmpleado(false);
    setShowVisualizarEmpleados(false);
    setShowHacerContrato(false);
    setShowVisualizarContratos(false);
    setShowPagarSueldo(false);
    setShowPagarLiquidacion(false);
    setShowVisualizarPagosSueldo(false);
    setShowVisualizarLiquidaciones(false);
    setShowVisualizarOtrosGastos(false);
    setShowRegistrarTotalFacturado(false);
    setShowVisualizarRegistroTotalFacturado(false);
    setShowIngresosMensuales(false); 
  };

  const toggleVisualizarOtrosGastos = () => {
    setShowVisualizarOtrosGastos((prev) => !prev);
    setShowRegistrarEmpleado(false);
    setShowVisualizarEmpleados(false);
    setShowHacerContrato(false);
    setShowVisualizarContratos(false);
    setShowPagarSueldo(false);
    setShowPagarLiquidacion(false);
    setShowVisualizarPagosSueldo(false);
    setShowVisualizarLiquidaciones(false);
    setShowRegistrarOtrosGastos(false);
    setShowRegistrarTotalFacturado(false);
    setShowVisualizarRegistroTotalFacturado(false);
    setShowIngresosMensuales(false); 
  };

  const toggleRegistrarTotalFacturado = () => {
    setShowRegistrarTotalFacturado((prev) => !prev);
    setShowRegistrarEmpleado(false);
    setShowVisualizarEmpleados(false);
    setShowHacerContrato(false);
    setShowVisualizarContratos(false);
    setShowPagarSueldo(false);
    setShowPagarLiquidacion(false);
    setShowVisualizarPagosSueldo(false);
    setShowVisualizarLiquidaciones(false);
    setShowRegistrarOtrosGastos(false);
    setShowVisualizarOtrosGastos(false);
    setShowVisualizarRegistroTotalFacturado(false);
    setShowIngresosMensuales(false);
  };

  const toggleVisualizarRegistroTotalFacturado = () => {
    setShowVisualizarRegistroTotalFacturado((prev) => !prev);
    setShowRegistrarEmpleado(false);
    setShowVisualizarEmpleados(false);
    setShowHacerContrato(false);
    setShowVisualizarContratos(false);
    setShowPagarSueldo(false);
    setShowPagarLiquidacion(false);
    setShowVisualizarPagosSueldo(false);
    setShowVisualizarLiquidaciones(false);
    setShowRegistrarOtrosGastos(false);
    setShowVisualizarOtrosGastos(false);
    setShowRegistrarTotalFacturado(false);
    setShowIngresosMensuales(false);
  };

  const toggleIngresosMensuales = () => {
    setShowIngresosMensuales((prev) => !prev);
    setShowRegistrarEmpleado(false);
    setShowVisualizarEmpleados(false);
    setShowHacerContrato(false);
    setShowVisualizarContratos(false);
    setShowPagarSueldo(false);
    setShowPagarLiquidacion(false);
    setShowVisualizarPagosSueldo(false);
    setShowVisualizarLiquidaciones(false);
    setShowRegistrarOtrosGastos(false);
    setShowVisualizarOtrosGastos(false);
    setShowRegistrarTotalFacturado(false);
    setShowVisualizarRegistroTotalFacturado(false);
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
    <div className={styles.adminViewContainer}>
      <div className={styles.menuContainer}>
        <h6 style={{ color: 'black' }}>ADMIN, BIENVENIDO A MEJIA SAS</h6>
        <div className={styles.buttonContainer}>
          <button
            onClick={toggleRegistrarEmpleado}
            className={`${styles.adminButton} ${showRegistrarEmpleado && styles.active}`}
          >
            {showRegistrarEmpleado ? "Ocultar Registro de Empleado" : "Registrar Empleado"}
          </button>
          <button
            onClick={toggleVisualizarEmpleados}
            className={`${styles.adminButton} ${showVisualizarEmpleados && styles.active}`}
          >
            {showVisualizarEmpleados ? "Ocultar Empleados" : "Ver Empleados"}
          </button>
          <button
            onClick={toggleHacerContrato}
            className={`${styles.adminButton} ${showHacerContrato && styles.active}`}
          >
            {showHacerContrato ? "Ocultar Contrato" : "Hacer Contrato"}
          </button>
          <button
            onClick={toggleVisualizarContratos}
            className={`${styles.adminButton} ${showVisualizarContratos && styles.active}`}
          >
            {showVisualizarContratos ? "Ocultar Contratos" : "Ver Contratos"}
          </button>
          <button
            onClick={togglePagarSueldo}
            className={`${styles.adminButton} ${showPagarSueldo && styles.active}`}
          >
            {showPagarSueldo ? "Ocultar Pago de Sueldo" : "Pagar Sueldo"}
          </button>
          <button
            onClick={toggleVisualizarPagosSueldo}
            className={`${styles.adminButton} ${showVisualizarPagosSueldo && styles.active}`}
          >
            {showVisualizarPagosSueldo ? "Ocultar Pagos de Sueldos" : "Ver Pagos de Sueldos"}
          </button>
          <button
            onClick={togglePagarLiquidacion}
            className={`${styles.adminButton} ${showPagarLiquidacion && styles.active}`}
          >
            {showPagarLiquidacion ? "Ocultar Pago de Liquidación" : "Pagar Liquidación"}
          </button>
          
          <button
            onClick={toggleVisualizarLiquidaciones}
            className={`${styles.adminButton} ${showVisualizarLiquidaciones && styles.active}`}
          >
            {showVisualizarLiquidaciones ? "Ocultar Liquidaciones" : "Ver Liquidaciones"}
          </button>
          <button
            onClick={toggleRegistrarOtrosGastos}
            className={`${styles.adminButton} ${showRegistrarOtrosGastos && styles.active}`}
          >
            {showRegistrarOtrosGastos ? "Ocultar Registro de Otros Gastos" : "Registrar Otros Gastos"}
          </button>
          <button
            onClick={toggleVisualizarOtrosGastos}
            className={`${styles.adminButton} ${showVisualizarOtrosGastos && styles.active}`}
          >
            {showVisualizarOtrosGastos ? "Ocultar Otros Gastos" : "Ver Otros Gastos"}
          </button>
          <button
            onClick={toggleRegistrarTotalFacturado}
            className={`${styles.adminButton} ${showRegistrarTotalFacturado && styles.active}`}
          >
            {showRegistrarTotalFacturado ? "Ocultar Registro de Total Facturado" : "Registrar Factura"}
          </button>
          <button
            onClick={toggleVisualizarRegistroTotalFacturado}
            className={`${styles.adminButton} ${showVisualizarRegistroTotalFacturado && styles.active}`}
          >
            {showVisualizarRegistroTotalFacturado ? "Ocultar Total Facturado" : "Ver Facturacion Mensual"}
          </button>
          <button
            onClick={toggleIngresosMensuales}
            className={`${styles.adminButton} ${showIngresosMensuales && styles.active}`}
          >
            {showIngresosMensuales ? "Ocultar Ingresos Mensuales" : "Ingresos Mensuales"}
          </button>
          <button
            onClick={cerrarSesion}
            className={`${styles.adminButton} ${styles.redButton}`}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
      <div className={styles.contentContainer}>
        {showRegistrarEmpleado && <RegistrarEmpleado />}
        {showVisualizarEmpleados && <VisualizarEmpleados />}
        {showHacerContrato && <HacerContrato />}
        {showVisualizarContratos && <VisualizarContratos />}
        {showPagarSueldo && <PagarSueldo />}
        {showPagarLiquidacion && <PagarLiquidacion />}
        {showVisualizarPagosSueldo && <VisualizarPagosSueldo />}
        {showVisualizarLiquidaciones && <VisualizarLiquidaciones />}
        {showRegistrarOtrosGastos && <RegistrarOtrosGastos />}
        {showVisualizarOtrosGastos && <VisualizarOtrosGastos />}
        {showRegistrarTotalFacturado && <RegistrarTotalFacturado />}
        {showVisualizarRegistroTotalFacturado && <VisualizarRegistroTotalFacturado />}
        {showIngresosMensuales && <IngresosMensuales />}
      </div>
    </div>
  );
}

export default AdminView;
