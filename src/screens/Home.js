import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import AdminView from "../components/AdminView";
import UserView from "../components/UserView";
import firebaseApp from "../firebase/Firebase";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth(firebaseApp);

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        return <Redirect to="/login" />;
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      Home
      <button onClick={handleLogout}>Cerrar sesión</button>
      {user.rol === "admin" ? <AdminView /> : <UserView />}
    </div>
  );
}

export default Home;
