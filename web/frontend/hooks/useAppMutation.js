import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import axios from "axios"
import { useMemo } from "react";
import { useMutation } from "react-query"
import { checkHeadersForReauthorization, useAuthenticatedFetch } from "./useAuthenticatedFetch";

export const mutationRequest = (url, method, urlBody, type, search, options = {}) => {
    const app = useAppBridge();
    const fetchFunction = authenticatedFetch(app);

    return {
        mutate: useMutation({
            mutationFn: async ({ body, url: urlFromBody }) => {
                options.onLoading && options.onLoading({ loading: true })
                const data = await apiRequest({ url: urlFromBody || url, method, body, urlBody, fetchFunction, type, search })
                options.onLoading && options.onLoading({ loading: false });
                return data;
            },
            ...options
        }),

    };
};

const apiRequest = async ({
    url,
    body,
    method,
    urlBody,
    fetchFunction,
    type,
    search
}) => {
    try {
        const options = { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
        const uri = !type ? url + body + ".json" : search ? url : url + ".json" + urlBody
        const response = await fetchFunction(uri, options);
        checkHeadersForReauthorization(response.headers, app);
        return response.json();
    } catch (err) {
        throw new Error(err.message || "Something went wrong");
    }
};
