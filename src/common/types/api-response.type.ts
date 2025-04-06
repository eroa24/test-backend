export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    path: string;
    [key: string]: any;
  };
};

export type PaginatedResponse<T> = ApiResponse<T> & {
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
