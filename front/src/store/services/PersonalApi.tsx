import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';



interface IPersonal {
  id: number
  username: string
  email: string
  password: string
  name?: string
  surname?: string
  role: string
  patronymic?: string;
  isActive: boolean;
  avatarLink: string;
  createdAt: string;
}


interface IPersonalInput {
  id: number
  username?: string
  email?: string
  password?: string
  name?: string
  surname?: string
  role: string
  patronymic?: string;
  isActive?: boolean;
}


interface QueryResult {
  success: boolean
  message: string
  data?: number
}

export const personalApi = createApi({
  reducerPath: 'personalApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/graphql',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Personal'],
  endpoints: (build) => ({
    // Получить всех пациентов
    getPersonal: build.query<{ data: { allPersonals: IPersonal[] } }, void>({
      query: () => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query {
              allPersonal {
                id
                username
                surname
                patronymic
                email
                password
                role
                isActive
                createdAt
              }
            }
          `
        },
      }),
      providesTags: ['Personal']
    }),
    
    // Получить одного пациента по ID
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
                isActive
                createdAt
              }
            }
          `,
          variables: { id }
        },
      }),
      providesTags: (result, error, id) => [{ type: 'Personal', id }]
    }),
    
    // Создать пациента
    createPersonal: build.mutation<{ data: { createPersonal: QueryResult } }, IPersonalInput>({
      query: (personalData) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation CreatePersonal($input: IPersonalInput!) {
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
              isActive: personalData.isActive,
              password: personalData.password,
              role: personalData.role,
              ava
              
            }
          }
        },
      }),
      invalidatesTags: ['Personal']
    }),
    
    updatePersonal: build.mutation<{ data: { updatePersonal: QueryResult } }, { id: number; input: IPersonalInput }>({
      query: ({ id, input }) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation UpdatePersonal($id: Int!, $input: IPersonalInput!) {
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
              dateOfBirth: input.dateOfBirth,
              avatarLink: input.avatarLink,
              gender: input.gender?.toUpperCase(),
              phoneNumber: input.phoneNumber,
              tg: input.tg
            }
          }
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Personal', id },
        'Personal'
      ]
    }),
    
    // Удалить пациента
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
          variables: { id }
        },
      }),
      invalidatesTags: ['Personal']
    }),
  }),
})

// Экспорт всех хуков
export const { 
  useGetPersonalsQuery,
  useGetPersonalQuery,
  useCreatePersonalMutation,
  useUpdatePersonalMutation,
  useDeletePersonalMutation
} = personalApi