// constants/config.ts

import { Platform } from "react-native";

// 안드로이드 에뮬레이터는 10.0.2.2, iOS나 실기기는 localhost 또는 특정 IP
const API_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:4000" : "http://localhost:4000";

export const BASE_URL = {
  API_URL: API_BASE_URL,
  ENDPOINTS: {
    SHOPS_LOCATIONS: "/shops/locations",
  },
};
