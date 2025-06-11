import { auth } from "./auth"


export const fetchClient = async (url: string, options: any) => {
    const session = await auth();

    console.log(`From the fetch client ${JSON.stringify(session?.user.accessToken)}`);

    return fetch(url, {
        ...options,
        headers: {
            ...options?.headers,
            ...(session && { Authorization: `Bearer ${session.user.accessToken}`})
        }
    })
}