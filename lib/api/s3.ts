import { axiosClient } from "../utils";

export const getUploadUrl = async({
    key,
    contentType,
    fileSize
}: {
    key: string;
    contentType:string; 
    fileSize: number
}) => {
    console.log("received in api function: key: ", key)
    console.log("received in api function: contentType:", contentType)
    const res = await axiosClient.post(`/s3/upload-url`, {
        key, 
        contentType,
        fileSize
    })

    console.log("AWS url: ",res);
    return res;
}

export const deleteFile = async({
    key,
    clientId, 
    fileId
}: {
    key: string;
    clientId: string;
    fileId: string;
}) => {
    const res = await axiosClient.delete(`/s3/delete-file`, {
        data: { key, clientId, fileId }
    });

    console.log("deleteFile response: ", res.data);
    return res.data;
}