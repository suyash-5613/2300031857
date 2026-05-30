declare module "axios" {
  export interface AxiosRequestConfig {
    baseURL?: string;
    timeout?: number;
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
    signal?: AbortSignal;
    method?: string;
    url?: string;
    data?: unknown;
  }

  export interface InternalAxiosRequestConfig extends AxiosRequestConfig {}

  export interface AxiosResponse<T = unknown> {
    data: T;
    status: number;
    config: AxiosRequestConfig;
  }

  export interface AxiosError<T = unknown> extends Error {
    response?: AxiosResponse<T>;
  }

  export interface AxiosInstance {
    get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    interceptors: {
      request: {
        use(
          onFulfilled: (value: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
          onRejected?: (error: unknown) => unknown,
        ): void;
      };
      response: {
        use(
          onFulfilled: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
          onRejected?: (error: AxiosError) => unknown,
        ): void;
      };
    };
  }

  export function create(config?: AxiosRequestConfig): AxiosInstance;

  const axios: {
    create: typeof create;
  };

  export default axios;
}