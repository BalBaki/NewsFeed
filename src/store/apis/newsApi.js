import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const newsApi = createApi({
    reducerPath: 'newsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_USER_API_URL,
    }),
    endpoints(builder) {
        return {
            search: builder.mutation({
                query: (data) => {
                    return {
                        method: 'POST',
                        url: '/search',
                        body: data,
                    };
                },
            }),
            fetchApis: builder.query({
                query: () => {
                    return {
                        method: 'GET',
                        url: '/apis',
                    };
                },
            }),
            fetchFilterOptions: builder.query({
                query: (filterName) => {
                    return {
                        method: 'GET',
                        url: '/filterData',
                        params: {
                            name: filterName,
                        },
                    };
                },
            }),
        };
    },
});

export { newsApi };
export const { useSearchMutation, useFetchApisQuery, useFetchFilterOptionsQuery } = newsApi;
