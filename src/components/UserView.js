import React from "react";
import { useNavigate } from "react-router-dom";
import firebaseApp from "../firebase/Firebase";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth(firebaseApp);

function UserView() {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Redirigir a la página de inicio de sesión
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <div>
      <h2>Bienvenido a la vista de usuario</h2>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default UserView;
