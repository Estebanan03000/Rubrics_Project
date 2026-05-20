import { Navigate, Outlet } from "react-router-dom";
import { LocalStorageProvider } from "../../storage/LocalStorageProvider";
import { STORAGE_KEYS } from "../../storage/storageKeys";

const storage = new LocalStorageProvider();

const ProtectedRoute = () => {
  const token = storage.getItem(STORAGE_KEYS.TOKEN);

  if (!token) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;