import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_USER_API_URL,
    }),
    endpoints(builder) {
        return {
            register: builder.mutation({
                query: (user) => {
                    return {
                        method: 'POST',
                        url: '/register',
                        body: user,
                    };
                },
            }),
            login: builder.mutation({
                query: (user) => {
                    return {
                        method: 'POST',
                        url: '/login',
                        body: user,
                    };
                },
            }),
            verify: builder.query({
                query: (token) => {
                    return {
                        method: 'GET',
                        url: '/verify',
                        params: {
                            token,
                        },
                    };
                },
            }),
            saveSettings: builder.mutation({
                query: (data) => {
                    return {
                        method: 'POST',
                        url: '/savesettings',
                        body: data,
                    };
                },
            }),
        };
    },
});

export { userApi };
export const { register, login, verify } = userApi.endpoints;
export const { useRegisterMutation, useLoginMutation, useLazyVerifyQuery, useSaveSettingsMutation } = userApi;
