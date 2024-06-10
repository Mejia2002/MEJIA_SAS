import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./screens/Login";
import AdminView from "./componentsAdmin/AdminView";
import UserView from "./componentsEmpleado/UserView";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebaseApp from "./firebase/Firebase";
import 'bootstrap/dist/css/bootstrap.min.css';


const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const uid = currentUser.uid;
        const docuRef = doc(firestore, `todosUsuarios/${uid}`);
        const docuSnap = await getDoc(docuRef);
        setUserData(docuSnap.data());
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              userData ? (
                userData.rol === "Usuario" ? (
                  <Navigate to="/admin" />
                ) : (
                  <Navigate to="/user" />
                )
              ) : (
                <div>Loading...</div>
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminView />} />
        <Route path="/user" element={<UserView />} />
      </Routes>
    </Router>
  );
}

export default App;
