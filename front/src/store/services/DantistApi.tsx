import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const patientApi = createApi({
  reducerPath: 'patientApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/graphql',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  endpoints: (build) => ({
    getPatients: build.query({
      query: () => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query {
              patients {
                id
                firstName
                lastName
                dateOfBirth
                gender
                address
                phoneNumber
                tgUsername
                status
                createdAt
              }
            }
          `
        },
      }),
    }),
    
    getPatient: build.query({
      query: (id: number) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query GetPatient($id: Int!) {
              patient(patient_id: $id) {
                id
                first_name
                last_name
                date_of_birth
                gender
                address
                phone_number
                tgUsername
                status
                created_at
              }
            }
          `,
          variables: {
            id: id
          }
        },
      }),
    }),
    
    createPatient: build.mutation({
      query: (patientData) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation CreatePatient($patientData: PatientInput!) {
              createPatient(patient_data: $patientData) {
                id
                first_name
                last_name
                date_of_birth
                gender
                address
                phone_number
                tgUsername
                status
                created_at
              }
            }
          `,
          variables: {
            patientData: patientData
          }
        },
      }),
    }),
    
    updatePatient: build.mutation({
      query: ({ id, patientData }) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation UpdatePatient($id: Int!, $patientData: PatientUpdateInput!) {
              updatePatient(patient_id: $id, patient_data: $patientData) {
                id
                first_name
                last_name
                date_of_birth
                gender
                address
                phone_number
                tgUsername
                status
                created_at
              }
            }
          `,
          variables: {
            id: id,
            patientData: patientData
          }
        },
      }),
    }),
    
    deletePatient: build.mutation({
      query: (id: number) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation DeletePatient($id: Int!) {
              deletePatient(patient_id: $id)
            }
          `,
          variables: {
            id: id
          }
        },
      }),
    }),
  }),
})

// Экспорт хуков
export const { 
  useGetPatientsQuery,
  useGetPatientQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation
} = patientApi