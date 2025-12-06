import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface IPersonal {
  id: number;
  username: string;
  email: string;
  name?: string;
  surname?: string;
  role: string;
  patronymic?: string;
  isActive: boolean;
  avatarUrl: string;
  createdAt: string;
  tg: string;
  phoneNumber: string;
  experience: number;
}

interface PersonalInput {
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  name?: string;
  surname?: string;
  role?: string;
  patronymic?: string;
  isActive?: boolean;
  tg?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  createdAt?: string;
  experience?: number;
}

interface QueryResult {
  success: boolean;
  message: string;
  data?: number;
}

export const personalApi = createApi({
  reducerPath: 'personalApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/graphql',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Personal'],
  endpoints: (build) => ({
    getPersonals: build.query<{ data: { allPersonal: IPersonal[] } }, void>({
      query: () => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query {
              allPersonal {
                id
                avatarUrl
                name
                surname
                patronymic
                role
                email
                username
                tg
                phoneNumber
                createdAt
                experience
              }
            }
          `,
        },
      }),
      providesTags: ['Personal'],
    }),

    getPersonal: build.query<{ data: { personal: IPersonal } }, number>({
      query: (id) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query GetPersonal($id: Int!) {
              personal(id: $id) {
                id
                username
                surname
                patronymic
                email
                password
                role
                avatarUrl
                username
                phoneNumber
                tg
                isActive
                createdAt
                experience
              }
            }
          `,
          variables: { id },
        },
      }),
      providesTags: (result, error, id) => [{ type: 'Personal', id }],
    }),

    createPersonal: build.mutation<{ data: { createPersonal: QueryResult } }, PersonalInput>({
      query: (personalData) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation CreatePersonal($input: PersonalWithPasswordInput!) {
              createPersonal(input: $input) {
                success
                message
                data
              }
            }
          `,
          variables: {
            input: {
              name: personalData.name,
              surname: personalData.surname,
              patronymic: personalData.patronymic,
              email: personalData.email,
              username: personalData.username,
              isActive: personalData.isActive,
              password: personalData.password,
              role: personalData.role,
              avatarUrl: personalData.avatarUrl,
              phoneNumber: personalData.phoneNumber,
              tg: personalData.tg,
              experience: personalData.experience,
            },
          },
        },
      }),
      invalidatesTags: ['Personal'],
    }),

    updatePersonal: build.mutation<{ data: { updatePersonal: QueryResult } }, { id: number; input: PersonalInput }>({
      query: ({ id, input }) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation UpdatePersonal($id: Int!, $input: PersonalInput!) {
              updatePersonal(id: $id, input: $input) {
                success
                message
                data
              }
            }
          `,
          variables: {
            id: id,
            input: {
              name: input.name,
              surname: input.surname,
              patronymic: input.patronymic,
              email: input.email,
              isActive: input.isActive,
              username: input.username,
              role: input.role,
              avatarUrl: input.avatarUrl,
              phoneNumber: input.phoneNumber,
              tg: input.tg,
              experience: input.experience,
            },
          },
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Personal', id }, 'Personal'],
    }),

    deletePersonal: build.mutation<{ data: { deletePersonal: QueryResult } }, number>({
      query: (id) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation DeletePersonal($id: Int!) {
              deletePersonal(id: $id) {
                success
                message
                data
              }
            }
          `,
          variables: { id },
        },
      }),
      invalidatesTags: ['Personal'],
    }),
  }),
});

export const {
  useGetPersonalsQuery,
  useGetPersonalQuery,
  useCreatePersonalMutation,
  useUpdatePersonalMutation,
  useDeletePersonalMutation,
} = personalApi;
