

import { DataProvider, HttpError } from "@refinedev/core";
import { stringify } from "query-string";
import { axiosInstance } from "./utils"

export const dataProvider = (apiUrl: string): DataProvider => ({

    getList: async ({ resource , pagination, sorters }) => {
        const url = `${apiUrl}/${resource}`;
        const { current = 1, pageSize = 10 } = pagination ?? {};

        const query: {
            limit?: number;
            page?: number;
        } = {
            page: current,
            limit: pageSize,
        };

        const { data } = await axiosInstance.get(
            `${url}?${stringify(query)}`,
        );

        return {
            data: data?.items,
            total: data?.total_items,
        };
    },
    create: async ({ resource, variables }) => {
        const url = `${apiUrl}/${resource}`;

        const { data } = await axiosInstance.post(url, variables);

        return {
            data,
        };
    },
    update: async ({ resource, id, variables }) => {
        const url = `${apiUrl}/${resource}/${id}`;
        const { data } = await axiosInstance.patch(url, variables);

        return {
            data,
        };
    },
    deleteOne: async ({ resource, id, variables }) => {
        const url = `${apiUrl}/${resource}/${id}`;

        const { data } = await axiosInstance.delete(url, {
            data: variables,
        });

        return {
            data,
        };
    },
    getOne: async ({ resource, id }) => {
        const url = `${apiUrl}/${resource}/${id}`;

        const { data } = await axiosInstance.get(url);

        return {
            data,
        };
    },
    getApiUrl: () => apiUrl,


});