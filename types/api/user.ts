

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
