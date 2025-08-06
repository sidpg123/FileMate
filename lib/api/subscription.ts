import { axiosClient } from "../utils";

export const getSubscription = async () => {

    const res = await axiosClient.get(`/payment/subscriptions`);

    return res.data.subscription;
}   