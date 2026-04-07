export const fetchGet = async (
    url: string,
    headers?: Record<string, string>,
) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    });
    console.log("Response:", response);
    if(response.ok) {
        const answerData = await response.json();
        return answerData;
    } else {
        throw new Error(`Request troubles: ${url}`);
    }
};

export const fetchPost = async (
    url: string,
    body: any,
) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if(response.ok) {
        const answerData = await response.json();
        return answerData;
    } else {
        throw new Error(`Request troubles: ${url}`);
    }
};