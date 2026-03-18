export const authStorage = {
  getToken: () => localStorage.getItem("token"),
  setToken: (token: string) => localStorage.setItem("token", token),
  clear: () => localStorage.removeItem("token"),
};
