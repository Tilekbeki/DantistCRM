// store/services/DantistApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Типы данных
interface Patient {
  id: number
  name: string
  surname: string
  patronymic: string
  email?: string
  dateOfBirth?: string
  gender: string
  phoneNumber?: string
  avatarLink: string;
  tg?: string
  createdAt: string
}

interface PatientInput {
  name?: string
  surname?: string
  patronymic?: string
  email?: string
  dateOfBirth?: string
  avatarLink?: string
  gender?: string
  phoneNumber?: string
  tg?: string
}

interface QueryResult {
  success: boolean
  message: string
  data?: number
}

export const patientApi = createApi({
  reducerPath: 'patientApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/graphql',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Patient'],
  endpoints: (build) => ({
    // Получить всех пациентов
    getPatients: build.query<{ data: { allPatients: Patient[] } }, void>({
      query: () => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query {
              allPatients {
                id
                name
                surname
                patronymic
                email
                avatarLink
                dateOfBirth
                gender
                phoneNumber
                tg
                createdAt
              }
            }
          `
        },
      }),
      providesTags: ['Patient']
    }),
    
    // Получить одного пациента по ID
    getPatient: build.query<{ data: { patient: Patient } }, number>({
      query: (id) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query GetPatient($id: Int!) {
              patient(id: $id) {
                id
                name
                surname
                patronymic
                email
                dateOfBirth
                gender
                avatarLink
                phoneNumber
                tg
                createdAt
              }
            }
          `,
          variables: { id }
        },
      }),
      providesTags: (result, error, id) => [{ type: 'Patient', id }]
    }),
    
    // Создать пациента
    createPatient: build.mutation<{ data: { createPatient: QueryResult } }, PatientInput>({
      query: (patientData) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation CreatePatient($input: PatientInput!) {
              createPatient(input: $input) {
                success
                message
                data
              }
            }
          `,
          variables: {
            input: {
              name: patientData.name,
              surname: patientData.surname,
              patronymic: patientData.patronymic,
              email: patientData.email,
              avatarLink: patientData.avatarLink,
              dateOfBirth: patientData.dateOfBirth,
              gender: patientData.gender?.toUpperCase() || 'MALE',
              phoneNumber: patientData.phoneNumber,
              tg: patientData.tg
            }
          }
        },
      }),
      invalidatesTags: ['Patient']
    }),
    
    // Обновить пациента
    updatePatient: build.mutation<{ data: { updatePatient: QueryResult } }, { id: number; input: PatientInput }>({
      query: ({ id, input }) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation UpdatePatient($id: Int!, $input: PatientInput!) {
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
        { type: 'Patient', id },
        'Patient'
      ]
    }),
    
    // Удалить пациента
    deletePatient: build.mutation<{ data: { deletePatient: QueryResult } }, number>({
      query: (id) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation DeletePatient($id: Int!) {
              deletePatient(id: $id) {
                success
                message
                data
              }
            }
          `,
          variables: { id }
        },
      }),
      invalidatesTags: ['Patient']
    }),
  }),
})

// Экспорт всех хуков
export const { 
  useGetPatientsQuery,
  useGetPatientQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation
} = patientApi