import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Service {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: string;
  categoryId: number;
}

interface ServiceInput {
  name: string;
  description: string;
  duration: string;
  price: string;
  categoryId: number;
}

// interface Category {
//     id: number;
//     name: string;
// }

interface QueryResult {
  success: boolean;
  message: string;
  data?: number;
}

export const serviceApi = createApi({
  reducerPath: 'serviceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/graphql',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Service'],
  endpoints: (build) => ({
    getServices: build.query<{ data: { allServices: Service[] } }, void>({
      query: () => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query {
              allServices {
                id
                name
                description
                duration
                price
                categoryId
              }
            allCategories {
                    id
                    name
              }
            }
          `,
        },
      }),
      providesTags: ['Service'],
    }),
    getServiceByCategory: build.query<{ data: { service: Service } }, number>({
      query: (id) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query servicesByCategory($id: Int!) {
              servicesByCategory(categoryId: $id) {
                id
                name
                description
                duration
                price
                categoryId
              }
            }
          `,
          variables: { id },
        },
      }),
      providesTags: (result, error, id) => [{ type: 'Service', id }],
    }),

    createService: build.mutation<{ data: { createService: QueryResult } }, ServiceInput>({
      query: (serviceData) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation CreateService($input: ServiceInput!) {
              createService(input: $input) {
                success
                message
                data
              }
            }
          `,
          variables: {
            input: {
              name: serviceData.name,
              duration: serviceData.duration,
              description: serviceData.description,
              price: serviceData.price,
              categoryId: serviceData.categoryId,
            },
          },
        },
      }),
      invalidatesTags: ['Service'],
    }),

    updateService: build.mutation<{ data: { updateService: QueryResult } }, { id: number; input: ServiceInput }>({
      query: ({ id, input }) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation UpdateService($id: Int!, $input: ServiceInput!) {
              updatePatient(id: $id, input: $input) {
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
              description: input.description,
              duration: input.duration,
              price: input.price,
              categoryId: input.categoryId,
            },
          },
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Service', id }, 'Service'],
    }),

    deleteService: build.mutation<{ data: { deleteService: QueryResult } }, number>({
      query: (id) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation DeleteService($id: Int!) {
              deleteService(id: $id) {
                success
                message
                data
              }
            }
          `,
          variables: { id },
        },
      }),
      invalidatesTags: ['Service'],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceByCategoryQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi;
