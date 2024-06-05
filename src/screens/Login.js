import React, { useState } from "react";
import styles from "../Styles/Login.module.css"; // Importa el módulo CSS
import firebaseApp from "../firebase/Firebase";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

function Login() {
  const [isRegistrando, setIsRegistrando] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("Usuario");
  const [primerNombre, setPrimerNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const navigate = useNavigate(); // Usamos useNavigate para redirigir

  async function registrarUsuario() {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;
      const userData = { rol: rol };
      if (rol === "Administrador") {
        await setDoc(doc(firestore, `usuariosAdmin/${uid}`), userData);
      } else if (rol === "Empleado") {
        await setDoc(doc(firestore, `usuariosEmpleados/${uid}`), userData);
      }
      await setDoc(doc(firestore, `todosUsuarios/${uid}`), userData);
      setSuccessMessage("Registro exitoso.");
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("El correo electrónico ya está en uso.");
      } else {
        setErrorMessage("Hubo un error al registrar el usuario. Por favor, inténtalo de nuevo más tarde.");
      }
    }
  }

  async function submitHandler(e) {
    e.preventDefault();
    try {
      if (isRegistrando) {
        await registrarUsuario();
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        const user = auth.currentUser;
        if (user) {
          const uid = user.uid;
          const docuRef = doc(firestore, `todosUsuarios/${uid}`);
          const docuSnap = await getDoc(docuRef);
          const userData = docuSnap.data();
          console.log("User Data:", userData);
          if (userData && userData.rol === "Usuario") {
            navigate("/admin");
          } else if (userData && userData.rol === "Empleado") {
            navigate("/user");
          } else {
            setErrorMessage("Rol de usuario no válido.");
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Hubo un error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.");
    }
  }

  function limpiarCampos() {
    setEmail("");
    setPassword("");
    setPrimerNombre("");
    setPrimerApellido("");
    setCedula("");
  }

  function limpiarMensaje() {
    setSuccessMessage("");
    setErrorMessage("");
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginFormContainer}>
        <h1>{isRegistrando ? "Regístrate" : "Inicia sesión"}</h1>
        <form className={styles.loginForm} onSubmit={submitHandler}>
          <label>
            Correo electrónico:
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Contraseña:
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {isRegistrando && (
            <>
              <label>
                Rol:
                <select id="rol" value={rol} onChange={(e) => setRol(e.target.value)} required>
                  <option value="Administrador">Administrador</option>
                  <option value="Empleado">Empleado</option>
                </select>
              </label>
              {rol === "Empleado" && (
                <>
                  <label className={styles.employeeFields}>
                    Primer nombre:
                    <input type="text" id="primerNombre" value={primerNombre} onChange={(e) => setPrimerNombre(e.target.value)} required />
                  </label>
                  <label className={styles.employeeFields}>
                    Primer apellido:
                    <input type="text" id="primerApellido" value={primerApellido} onChange={(e) => setPrimerApellido(e.target.value)} required />
                  </label>
                  <label className={styles.employeeFields}>
                    Cédula:
                    <input type="text" id="cedula" value={cedula} onChange={(e) => setCedula(e.target.value)} required />
                  </label>
                </>
              )}
            </>
          )}
          <input type="submit" value={isRegistrando ? "Registrar" : "Iniciar sesión"} onClick={limpiarMensaje} />
          <button type="button" onClick={limpiarCampos}>Limpiar</button>
        </form>
        <button className={styles.switchButton} onClick={() => setIsRegistrando(!isRegistrando)}>
          {isRegistrando ? "Ya tengo cuenta" : "Quiero registrarme"}
        </button>
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    </div>
  );
}

export default Login;
