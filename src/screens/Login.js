import React, { useState } from "react";
import firebaseApp from "../firebase/Firebase";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  async function registrarUsuario() {
    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtener el UID del usuario
      const uid = user.uid;

      // Guardar datos del usuario en Firestore
      const userData = {
        rol: rol,
        // Otros campos de usuario aquí
      };

      // Guardar datos del usuario en la colección correspondiente
      if (rol === "Administrador") {
        await setDoc(doc(firestore, `usuariosAdmin/${uid}`), userData);
      } else if (rol === "Empleado") {
        await setDoc(doc(firestore, `usuariosEmpleados/${uid}`), userData);
      }

      // Guardar datos del usuario en la colección de todos los usuarios
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
          const docuRef = doc(firestore, `usuarios/${uid}`);
          const docuSnap = await getDoc(docuRef);
          const userData = docuSnap.data();
          if (userData && userData.rol === "Administrador") {
            navigate("/admin");
          } else if (userData && userData.rol === "Empleado") {
            navigate("/user");
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
    <div>
      <h1>{isRegistrando ? "Regístrate" : "Inicia sesión"}</h1>
      <form onSubmit={submitHandler}>
        <label>
          Correo electrónico:
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <br></br>
        <label>
          Contraseña:
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {isRegistrando && (
          <>
            <br></br>
            <label>
              Rol:
              <select id="rol" value={rol} onChange={(e) => setRol(e.target.value)} required>
                <option value="Administrador">Administrador</option>
                <option value="Empleado">Empleado</option>
              </select>
            </label>
            {rol === "Empleado" && (
              <>
                <br></br>
                <label>
                  Primer nombre:
                  <input type="text" id="primerNombre" value={primerNombre} onChange={(e) => setPrimerNombre(e.target.value)} required />
                </label>
                <br></br>
                <label>
                  Primer apellido:
                  <input type="text" id="primerApellido" value={primerApellido} onChange={(e) => setPrimerApellido(e.target.value)} required />
                </label>
                <br></br>
                <label>
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
      <button onClick={() => setIsRegistrando(!isRegistrando)}>
        {isRegistrando ? "Ya tengo una cuenta" : "Quiero registrarme"}
      </button>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}

export default Login;
