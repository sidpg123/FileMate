import { axiosClient } from "../utils";

interface FetchClientFeesParams {
  pageParam?: {
    cursorId?: string
    cursorCreatedAt?: string
  } | null
  search: string
  filter: 'all' | 'pending' | 'paid'
//   clientId: string,
//   feeCategoryId?: string // Optional for filtering by category
}

export const fetchClientDocuments = async ({
    pageParam,
    search,
    // clientId,
    year
} : {
    pageParam?: {uploadedAt: string; id: string } | null;
    search?: string;
    // clientId: string;
    year?: string;
}) => {
    const res = await axiosClient.get(`/client-dashboard/documents`, {
        params: {
            cursorUploadedAt: pageParam?.uploadedAt,
            cursorId: pageParam?.id,
            search,
            // clientId,
            year
        }
    })
    return res.data;
};  


export const getTotalPendingFees = async () =>{
    const res = await axiosClient.get(`/client-dashboard/totalpendingfees`)
    
    return res.data;
}

export const fetchClientFees = async ({
  pageParam,
  search,
  filter,
//   clientId,
//   feeCategoryId
}: FetchClientFeesParams) => {
  const params: Record<string, string> = {
    limit: '10'
  };

  if (pageParam?.cursorId && pageParam?.cursorCreatedAt) {
    params.cursorId = pageParam.cursorId;
    params.cursorCreatedAt = pageParam.cursorCreatedAt;
  }

  if (search) params.search = search;
//   if (feeCategoryId) params.feeCategoryId = feeCategoryId;
//   if (clientId) params.clientId = clientId;
  if (filter && filter !== 'all') params.status = filter;

  const res = await axiosClient.get(`/client-dashboard/fees`, { params });

  return {
    data: res.data.data || [],
    nextCursor: res.data.nextCursor || null,
    hasMore: res.data.hasMore || false,
    summary: res.data.summary || null
  };
};


