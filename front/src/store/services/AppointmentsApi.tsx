import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


enum StatusEnum {
    Planned = "planned",
    Done = "done",
    Cancelled = "cancelled",
}

interface IAppointment {
  id: number;
  patientId: number;
  doctorId: number;
  serviceId: number;
  visitDate: string;
  createdAt: string;
  status: StatusEnum;
}

interface AppointmentInput {
  id?: number;
  patientId: number;
  doctorId: number;
  serviceId: number;
  visitDate: string;
  createdAt?: string;
  status: StatusEnum;
}

interface QueryResult {
  success: boolean;
  message: string;
  data?: number;
}

export const appointmentApi = createApi({
  reducerPath: 'appointmentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/graphql',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Appointment'],
  endpoints: (build) => ({
    getAppointments: build.query<{ data: { allAppointments: IAppointment[] } }, void>({
      query: () => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query {
              allAppointments {
                    id
                    patientId
                    doctorId
                    serviceId
                    createdAt
                    visitDate
                    status
                }
            }
          `,
        },
      }),
      providesTags: ['Appointment'],
    }),

    getAppointment: build.query<{ data: { appointment: IAppointment } }, number>({
      query: (id) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query GetPersonal($id: Int!) {
              appointment {
                    id
                    patientId
                    doctorId
                    serviceId
                    createdAt
                    visitDate
                    status
                }
            }
          `,
          variables: { id },
        },
      }),
      providesTags: (result, error, id) => [{ type: 'Appointment', id }],
    }),

    createAppointment: build.mutation<{ data: { createAppointment: QueryResult } }, AppointmentInput>({
      query: (appointmentData) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation CreateAppointment($input: AppointmentInput!) {
              createAppointment(input: $input) {
                success
                message
                data
              }
            }
          `,
          variables: {
            input: {
              patientId: appointmentData.patientId,
              doctorId: appointmentData.doctorId,
              serviceId: appointmentData.serviceId,
              visitDate: appointmentData.visitDate,
              status: appointmentData.status,
            },
          },
        },
      }),
      invalidatesTags: ['Appointment'],
    }),

    updateAppointment: build.mutation<{ data: { updateAppointment: QueryResult } }, { id: number; input: AppointmentInput }>({
      query: ({ id, input }) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation UpdatePersonal($id: Int!, $input: AppointmentInput!) {
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
              patientId: input.patientId,
              doctorId: input.doctorId,
              serviceId: input.serviceId,
              visitDate: input.visitDate,
              status: input.status,
            },
          },
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Appointment', id }, 'Appointment'],
    }),

    deleteAppointment: build.mutation<{ data: { deleteAppointment: QueryResult } }, number>({
      query: (id) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation DeleteAppointment($id: Int!) {
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
      invalidatesTags: ['Appointment'],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useGetAppointmentQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} = appointmentApi;
