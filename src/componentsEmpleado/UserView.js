import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import VerInformacion from "./VerInformacion";
import HistorialPagos from "./HistorialPagos";
import { useNavigate } from "react-router-dom";
import styles from "../Styles/AdminView.module.css";
import imageStyles from "../Styles/CenteredImage.module.css"; 
import LogoEmpresa from "../Images/LogoEmpresa.png"; 

const auth = getAuth();

function UserView() {
  const [showVerInformacion, setShowVerInformacion] = useState(false);
  const [showHistorialPagos, setShowHistorialPagos] = useState(false);
  const navigate = useNavigate();

  const toggleVerInformacion = () => {
    setShowVerInformacion((prev) => !prev);
    setShowHistorialPagos(false);
  };

  const toggleHistorialPagos = () => {
    setShowHistorialPagos((prev) => !prev);
    setShowVerInformacion(false);
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
        <h6 style={{ color: 'black' }}>USUARIO, BIENVENIDO A MEJIA SAS</h6>
        <div className={styles.buttonContainer}>
          <button
            onClick={toggleVerInformacion}
            className={`${styles.adminButton} ${showVerInformacion && styles.active}`}
          >
            {showVerInformacion ? "Ocultar Información" : "Ver Información"}
          </button>
          <button
            onClick={toggleHistorialPagos}
            className={`${styles.adminButton} ${showHistorialPagos && styles.active}`}
          >
            {showHistorialPagos ? "Ocultar Historial de Pagos" : "Historial de Pagos"}
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
        {showVerInformacion && <VerInformacion />}
        {showHistorialPagos && <HistorialPagos />}
        {!showVerInformacion && !showHistorialPagos && (
          <div className={imageStyles.imageContainer}>
            <img src={LogoEmpresa} alt="Logo de la Empresa" className={imageStyles.logoImage} />
          </div>
        )}
      </div>
    </div>
  );
}

export default UserView;
