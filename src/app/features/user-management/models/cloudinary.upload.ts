// Returned from GET /users/verifications/upload-urls
export interface CloudinaryUploadUrlResponse {
  front: CloudinaryUploadInfo;
  back: CloudinaryUploadInfo;
}

export interface CloudinaryUploadInfo {
  folder: string;
  signature: string;
  api_key: string;
  public_id: string;
  timestamp: number;
}