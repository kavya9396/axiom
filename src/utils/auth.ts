// import { clearSessionMasters } from "./masterDataSession";

export const auth = {
  isAuthenticated: () => !!localStorage.getItem("token"),

  login: (token: string) => localStorage.setItem("token", token),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("roleType");
    // clearSessionMasters();
  },
};
