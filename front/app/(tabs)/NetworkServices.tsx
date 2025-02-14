
import { Platform } from 'react-native';
import { saveData, DATABASES, syncData } from './save';
import NetInfo from '@react-native-community/netinfo';

const isWeb = Platform.OS === 'web'

const apiUrl = isWeb ? "http://localhost:8100/api" : "http://10.0.2.2:8100/api";




type RequestOptions = {
  database: any;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  params?: Record<string, string>;
  headers?: HeadersInit;
  responseType?: "application/json" | "text/csv";
  ignoreUnauthorizedError?: boolean;
};

type RequestDownloadOptions = {
  url: string;
};

class _NetworkService {
  private _isOffline = false;

  async request({
    database,
    url,
    method,
    data,
    params,
    headers,
    responseType = "application/json",
    ignoreUnauthorizedError = false,
  }: RequestOptions): Promise<any> {
    const requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      Accept: responseType,
      ...headers,
    };
    const state = await NetInfo.fetch(); 

    if(state.isConnected) {
      await syncData()
    }else {
      await saveData(data, database)
      return;
    }
    
    try {
      const response = await fetch(`${apiUrl}/${url}`, {
        method,
        body: data ? JSON.stringify(data) : undefined,
        headers: requestHeaders,
      });
      console.log(response)
      if(response.ok) return response
      if (!response.ok) {
        const error = new Error("Request failed: " + response.status);
        (error as any).response = response;
        throw error;
      }

      if (responseType === "application/json") {
        let responseData;
        const responseBody = await response.text();
        try {
          responseData = JSON.parse(responseBody);
        } catch {
          responseData = responseBody;
        }

        this._isOffline = false;
        return responseData;
      }
      return response;
    } catch (reason: any) {
      if (reason?.response?.status === 502) {
        this._isOffline = true;
      }
      console.log("Request failed", reason.response);

      throw reason;
    }
  }

  isOffline(): boolean {
    return this._isOffline;
  }


  async requestDownload({ url: fileUrl }: RequestDownloadOptions): Promise<void> {
    try {
      const response = await fetch(`${apiUrl}/${fileUrl}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to download file.");
      }

      const disposition = response.headers.get("content-disposition");
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = disposition ? filenameRegex.exec(disposition) : null;
      const filename = matches && matches[1] ? matches[1].replace(/['"]/g, "") : "unknown.csv";

      const blob = await response.blob();
      const link = document.createElement("a");
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download file:", error);
      throw error;
    }
  }
}

export const NetworkService = new _NetworkService();