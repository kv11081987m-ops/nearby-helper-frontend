export const saveAuth = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const clearAuth = () => {
  localStorage.clear();
};
