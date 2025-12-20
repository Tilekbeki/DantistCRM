import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setAuth } from '../slices/authSlice';

interface UserInput {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  username: string;
  role: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/graphql',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (build) => ({
    login: build.mutation<{ data: { login: LoginResponse } }, UserInput>({
      query: (userData) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation Login($username: String!, $password: String!) {
              login(input: {
                username: $username,
                password: $password
              }) {
                accessToken
                expiresIn
                userId
                username
                role
              }
            }
          `,
          variables: userData,
        },
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        const loginData = data.data.login;

        // authCookies.set(loginData.accessToken, loginData.expiresIn);

        dispatch(
          setAuth({
            id: loginData.userId,
            username: loginData.username,
            role: loginData.role,
          })
        );
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;