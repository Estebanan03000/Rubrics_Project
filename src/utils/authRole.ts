export type AppRole = "ADMIN" | "TEACHER" | "STUDENT";

/*
  Mientras el login real no esté funcionando, puedes cambiar este valor
  para probar la interfaz como ADMIN, TEACHER o STUDENT.
*/
const TEMPORARY_DEFAULT_ROLE: AppRole = "ADMIN";

const normalizeRole = (role?: unknown): AppRole | null => {
  if (!role || typeof role !== "string") return null;

  const normalized = role.trim().toUpperCase();

  if (
    normalized === "ADMIN" ||
    normalized === "ADMINISTRADOR" ||
    normalized === "ADMINISTRATOR"
  ) {
    return "ADMIN";
  }

  if (
    normalized === "TEACHER" ||
    normalized === "DOCENTE" ||
    normalized === "PROFESOR"
  ) {
    return "TEACHER";
  }

  if (
    normalized === "STUDENT" ||
    normalized === "ESTUDIANTE" ||
    normalized === "ALUMNO"
  ) {
    return "STUDENT";
  }

  return null;
};

const getJsonFromLocalStorage = (key: string): any | null => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return null;

    return JSON.parse(value);
  } catch {
    return null;
  }
};

const decodeJwtPayload = (token: string): any | null => {
  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => {
          return "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const getCurrentUserRole = (): AppRole => {
  /*
    Para pruebas temporales puedes ejecutar en consola:
    localStorage.setItem("dev_role", "ADMIN")
    localStorage.setItem("dev_role", "TEACHER")
    localStorage.setItem("dev_role", "STUDENT")
  */
  const devRole = normalizeRole(localStorage.getItem("dev_role"));
  if (devRole) return devRole;

  const localUser =
    getJsonFromLocalStorage("user") ||
    getJsonFromLocalStorage("auth_user") ||
    getJsonFromLocalStorage("social_user");

  const roleFromUser = normalizeRole(
    localUser?.role || localUser?.user?.role || localUser?.data?.user?.role
  );

  if (roleFromUser) return roleFromUser;

  const token = localStorage.getItem("token");

  if (token) {
    const payload = decodeJwtPayload(token);

    const roleFromToken = normalizeRole(
      payload?.role ||
        payload?.user?.role ||
        payload?.data?.role ||
        payload?.data?.user?.role
    );

    if (roleFromToken) return roleFromToken;
  }

  return TEMPORARY_DEFAULT_ROLE;
};

export const getRoleLabel = (role: AppRole): string => {
  const labels: Record<AppRole, string> = {
    ADMIN: "Administrador",
    TEACHER: "Docente",
    STUDENT: "Estudiante",
  };

  return labels[role];
};