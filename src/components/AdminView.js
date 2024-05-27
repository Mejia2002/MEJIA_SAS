import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import RegistrarEmpleado from "./RegistrarEmpleado";

const auth = getAuth();

function AdminView() {
  const [showRegistrarEmpleado, setShowRegistrarEmpleado] = useState(false);

  const toggleRegistrarEmpleado = () => {
    setShowRegistrarEmpleado(!showRegistrarEmpleado);
  };

  const cerrarSesion = () => {
    signOut(auth).then(() => {
      console.log("Sesión cerrada");
    }).catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
  };

  return (
    <div>
      <h2>Bienvenido, Admin</h2>
      <button onClick={cerrarSesion}>Cerrar Sesión</button>
      <button onClick={toggleRegistrarEmpleado}>
        {showRegistrarEmpleado ? "Ocultar formulario" : "Registrar Empleado"}
      </button>
      {showRegistrarEmpleado && <RegistrarEmpleado />}
      {/* Otros componentes o funcionalidades de administrador */}
    </div>
  );
}

export default AdminView;
