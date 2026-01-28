/* eslint-disable */
import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [helpers, setHelpers] = useState([]);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data.stats || {});
    } catch (e) {
      console.error(e);
    }
  };

  const loadUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data.users || []);
  };

  const loadHelpers = async () => {
    const res = await api.get("/admin/helpers");
    setHelpers(res.data.helpers || []);
  };

  useEffect(() => {
    loadDashboard();
    loadUsers();
    loadHelpers();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      <h3>Stats</h3>
      <p>Total Users: {stats.users}</p>
      <p>Total Helpers: {stats.helpers}</p>
      <p>Total Requests: {stats.requests}</p>

      <h3>Users</h3>
      {users.map((u) => (
        <div key={u._id}>
          {u.name} - {u.phone}
        </div>
      ))}

      <h3>Helpers</h3>
      {helpers.map((h) => (
        <div key={h._id}>
          {h.name} - {h.serviceType}
        </div>
      ))}
    </div>
  );
}
