import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
const AdminRoute = () => {
  const data = localStorage.getItem("auth");
  const parseData = JSON.parse(data);
  const token = parseData.token;
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();
  const authCheck = async () => {
    const res = await fetch("http://localhost:5000/api/auth/user-auth", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();
    if (result.ok) {
      setOk(true);
    } else {
      setOk(false);
    }
  };
  useEffect(() => {
    authCheck();
  }, [auth.token]);
  return ok ? <Outlet /> : "spinner";
};

export default AdminRoute;
