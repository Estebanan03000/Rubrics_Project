import { Navigate, Outlet } from "react-router-dom";
import { LocalStorageProvider } from "../../storage/LocalStorageProvider";
import { STORAGE_KEYS } from "../../storage/storageKeys";

const storage = new LocalStorageProvider();

const isAuthenticated = (): boolean => {
  const token = storage.getItem(STORAGE_KEYS.TOKEN);
  return Boolean(token);
};

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/auth/signin" replace />;
};

export default ProtectedRoute;