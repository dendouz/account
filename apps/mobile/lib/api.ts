import { getToken, saveTokens, clearTokens } from "./auth";
import { API_BASE } from "./config";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private async getHeaders(
    contentType?: string
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};
    if (contentType) {
      headers["Content-Type"] = contentType;
    }
    const token = await getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      await clearTokens();
      throw new Error("SESSION_EXPIRED");
    }

    const json: ApiResponse<T> = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error || json.message || "Une erreur est survenue");
    }

    return json.data as T;
  }

  async get<T>(path: string): Promise<T> {
    const headers = await this.getHeaders("application/json");
    const response = await fetch(`${API_BASE}${path}`, {
      method: "GET",
      headers,
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const headers = await this.getHeaders("application/json");
    const response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    const headers = await this.getHeaders("application/json");
    const response = await fetch(`${API_BASE}${path}`, {
      method: "PUT",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string): Promise<T> {
    const headers = await this.getHeaders("application/json");
    const response = await fetch(`${API_BASE}${path}`, {
      method: "DELETE",
      headers,
    });
    return this.handleResponse<T>(response);
  }

  async upload<T>(path: string, uri: string, fileName: string, mimeType: string, fields?: Record<string, string>): Promise<T> {
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: fileName,
      type: mimeType,
    } as unknown as Blob);

    if (fields) {
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const token = await getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers,
      body: formData,
    });
    return this.handleResponse<T>(response);
  }

  // Auth endpoints (no token needed for login/register)
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.error || json.message || "Échec de la connexion");
    }

    const data = json.data as {
      user: unknown;
      accessToken: string;
      refreshToken: string;
    };
    await saveTokens(data.accessToken, data.refreshToken);
    return data;
  }

  async register(body: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    studentStatus: string;
    region: string;
  }) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(
        json.error || json.message || "Échec de l'inscription"
      );
    }

    const data = json.data as {
      user: unknown;
      accessToken: string;
      refreshToken: string;
    };
    await saveTokens(data.accessToken, data.refreshToken);
    return data;
  }
}

export const api = new ApiClient();
