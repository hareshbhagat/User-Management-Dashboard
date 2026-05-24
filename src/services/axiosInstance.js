import axios from 'axios';

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isRetryableError = (error) => {
  if (!error?.config || error.config.__retryCount >= MAX_RETRIES) {
    return false;
  }

  const isTimeout =
    error.code === 'ECONNABORTED' ||
    error.message?.toLowerCase().includes('timeout');
  const isNetworkError = error.code === 'ERR_NETWORK';
  const isServerError = error.response?.status >= 500;

  return isTimeout || isNetworkError || isServerError;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (isRetryableError(error)) {
      config.__retryCount = (config.__retryCount || 0) + 1;
      await wait(RETRY_DELAY_MS * config.__retryCount);

      if (import.meta.env.DEV) {
        console.warn(
          `[API] Retrying request (${config.__retryCount}/${MAX_RETRIES}):`,
          config.url
        );
      }

      return axiosInstance(config);
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
