import axios from "axios";

export const fetcher = async (payload: {
  url: string;
  method?: string;
  data?: Record<string, unknown>;
  params?: Record<string, unknown>;
  responseType?: "json" | "blob" | "text" | "arraybuffer" | "document";
}) => {
  try {
    const { url, method = "GET", data, params, responseType } = payload;

    const response = await axios({
      method,
      url,
      data,
      params,
      responseType,
    });

    return {
      data: response.data,
      error: null,
      headers: response.headers,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      data: null,
      error: error.response?.data || {
        message: "Something went wrong",
      },
    };
  }
};
