import { axiosClient } from "../utils";

export const getUploadUrl = async({
    key,
    contentType
}: {
    key: string;
    contentType:string; 
}) => {
    console.log("received in api function: key: ", key)
    console.log("received in api function: contentType:", contentType)
    const res = await axiosClient.post(`/s3/upload-url`, {
        key, 
        contentType
    })

    console.log("AWS url: ",res);
    return res;
}