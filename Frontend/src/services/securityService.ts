import { User } from "../models/User";
import { StorageProvider } from "../storage/StorageProvider";
import { LocalStorageProvider } from "../storage/LocalStorageProvider";
import { STORAGE_KEYS } from "../storage/storageKeys";
import { store } from "../store/store";
import { setUser } from "../store/userSlice";
import { api } from "../interceptors/authInterceptor";

export interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user?: User;
}

class SecurityService extends EventTarget {
  private user: User | null;
  private storage: StorageProvider;

  constructor(storage: StorageProvider = new LocalStorageProvider()) {
    super();
    this.storage = storage;
    this.user = null;
  }

  async login(credentials: LoginCredentials): Promise<User | null> {
    const response = await api.post<LoginResponse>("/login", credentials);

    const { token, user } = response.data;

    if (!token) {
      throw new Error("El backend no devolvió token de autenticación.");
    }

    this.storage.setItem(STORAGE_KEYS.TOKEN, token);

    this.user = user ?? null;

    store.dispatch(setUser(this.user));

    this.dispatchEvent(
      new CustomEvent("userChange", {
        detail: this.user,
      })
    );

    return this.user;
  }

  getUser(): User | null {
    return this.user;
  }

  logout(): void {
    this.user = null;

    this.storage.removeItem(STORAGE_KEYS.TOKEN);

    store.dispatch(setUser(null));

    this.dispatchEvent(
      new CustomEvent("userChange", {
        detail: null,
      })
    );

    window.location.href = "/auth/signin";
  }

  isAuthenticated(): boolean {
    return this.storage.getItem(STORAGE_KEYS.TOKEN) !== null;
  }

  getToken(): string | null {
    return this.storage.getItem(STORAGE_KEYS.TOKEN);
  }
}

export const userService = new SecurityService();
export default userService;