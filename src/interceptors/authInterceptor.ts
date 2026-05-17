import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { LocalStorageProvider } from "../storage/LocalStorageProvider";
import { StorageProvider } from "../storage/StorageProvider";
import { STORAGE_KEYS } from "../storage/storageKeys";

export class AuthInterceptor {
  private api: AxiosInstance;
  private storage: StorageProvider;

  private EXCLUDED_ROUTES = ["/api/auth/login", "/api/auth/register-admin"];

  constructor() {
    this.storage = new LocalStorageProvider();

    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "/",
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.initializeInterceptors();
  }

  private handleRequest(config: InternalAxiosRequestConfig) {
    const token = this.storage.getItem(STORAGE_KEYS.TOKEN);

    if (this.EXCLUDED_ROUTES.some((route) => config.url?.includes(route))) {
      return config;
    }

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }

  private handleResponseError(error: any) {
    if (error.response?.status === 401) {
      this.storage.removeItem(STORAGE_KEYS.TOKEN);
      window.location.href = "/auth/signin";
    }

    return Promise.reject(error);
  }

  private initializeInterceptors() {
    this.api.interceptors.request.use(
      this.handleRequest.bind(this),
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      this.handleResponseError.bind(this)
    );
  }

  public get instance(): AxiosInstance {
    return this.api;
  }
}

export const api = new AuthInterceptor().instance;