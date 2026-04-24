const defaultApiBaseUrl = "/api";

const apiBaseUrl = (process.env.VUE_APP_API_URL || defaultApiBaseUrl).replace(/\/$/, "");

export default apiBaseUrl;
