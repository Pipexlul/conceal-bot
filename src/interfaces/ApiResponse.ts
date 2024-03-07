interface ApiResponse<T = TODO> {
  errorMsg: string | null;
  data: T | null;
}

export { ApiResponse };
