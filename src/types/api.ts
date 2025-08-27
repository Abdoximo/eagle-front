export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: number;
  // Add other common response properties here if needed
}

// You can add other API related types here 