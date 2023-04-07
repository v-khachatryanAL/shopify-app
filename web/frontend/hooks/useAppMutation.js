import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import axios from "axios"
import { useMemo } from "react";
import { useMutation } from "react-query"
import { checkHeadersForReauthorization, useAuthenticatedFetch } from "./useAuthenticatedFetch";

export const mutationRequest = (url, method, urlBody, type) => {
    const app = useAppBridge();
    const fetchFunction = authenticatedFetch(app);

    return {
        mutate: useMutation({
            mutationFn: (body) => apiRequest({ url, method, body, urlBody, fetchFunction, type })
        }),

    };
};
const apiRequest = async ({
    url,
    body,
    method,
    urlBody,
    fetchFunction,
    type
}) => {
    try {
        const options = { method };
        const uri = !type ? url + body + ".json" : url + ".json" + urlBody
        const response = await fetchFunction(uri, options);
        checkHeadersForReauthorization(response.headers, app);
        return response.json();
    } catch (err) {
        throw new Error(err.message || "Something went wrong");
    }
};
