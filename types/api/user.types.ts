

// /user/info
export type UserInfo = {
  totalClients: number;
  totalPendingFees: number;
  storageUsed: number;
  allocatedStorage: number
};

export type UserInfoResponse = {
  success: boolean;
  data: UserInfo;
};

// types.ts
export interface FileData {
  id: string;
  userId: string;
  fileName: string;
  fileKey: string;
  year: string;
  fileSize: number;
  thumbnailKey: string | null;
  uploadedAt: string; // Keep string for API response
  categoryId: string | null;
  visibleToAdmin: boolean;
}

export interface PaginatedFilesResponse {
  success: boolean;
  data: FileData[];
  nextCursor?: {
    uploadedAt: string; // string, not Date
    id: string;
  } | null;
}
