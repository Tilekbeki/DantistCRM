import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Patient {
  id: number;
  name: string;
  surname: string;
  patronymic: string;
  email?: string;
  dateOfBirth?: string;
  gender: string;
  phoneNumber?: string;
  avatarLink: string;
  tg?: string;
  createdAt: string;
}

interface PersonSummary {
  id: number;
  name: string;
  surname: string;
  patronymic?: string;
  role: string;
}

interface ServiceSummary {
  id: number;
  name: string;
  description?: string;
  duration: number;
  price: number;
}

interface PatientMediaSummary {
  id: number;
  patientId: number;
  appointmentId?: number;
  type: string;
  fileUrl: string;
  uploadedAt: string;
}

interface PatientAppointmentSummary {
  id: number;
  visitDate: string;
  createdAt: string;
  status: string;
  doctor?: PersonSummary;
  service?: ServiceSummary;
  media: PatientMediaSummary[];
}

interface PatientRecordSummary {
  id: number;
  diagnose?: string;
  notes?: string;
  createdAt: string;
  doctor?: PersonSummary;
  service?: ServiceSummary;
}

interface PatientToothHistorySummary {
  id: number;
  diagnosis?: string;
  notes?: string;
  createdAt: string;
  doctor?: PersonSummary;
  service?: ServiceSummary;
}

interface PatientToothSummary {
  id: number;
  toothNumber: number;
  status: string;
  history: PatientToothHistorySummary[];
}

interface PatientTreatmentPlanSummary {
  id: number;
  title: string;
  diagnosis?: string;
  notes?: string;
  status: string;
  toothNumbers: number[];
  plannedAt?: string;
  createdAt: string;
  doctor?: PersonSummary;
  service?: ServiceSummary;
  appointment?: PatientAppointmentSummary;
  media: PatientMediaSummary[];
  teeth: PatientToothSummary[];
}

export interface PatientCard {
  patient: Patient;
  appointments: PatientAppointmentSummary[];
  records: PatientRecordSummary[];
  media: PatientMediaSummary[];
  teeth: PatientToothSummary[];
  treatmentPlans: PatientTreatmentPlanSummary[];
}

interface PatientInput {
  name?: string;
  surname?: string;
  patronymic?: string;
  email?: string;
  dateOfBirth?: string;
  avatarLink?: string;
  gender?: string;
  phoneNumber?: string;
  tg?: string;
}

interface TreatmentPlanInput {
  patientId: number;
  doctorId: number;
  title: string;
  serviceId?: number;
  appointmentId?: number;
  diagnosis?: string;
  notes?: string;
  status?: string;
  toothNumbers?: number[];
  plannedAt?: string;
}

interface QueryResult {
  success: boolean;
  message: string;
  data?: number;
}

export const patientApi = createApi({
  reducerPath: 'patientApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/graphql',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Patient'],
  endpoints: (build) => ({
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
          `,
        },
      }),
      providesTags: ['Patient'],
    }),

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
          variables: { id },
        },
      }),
      providesTags: (_result, _error, id) => [{ type: 'Patient', id }],
    }),

    getPatientCard: build.query<{ data: { patientCard: PatientCard } }, number>({
      query: (id) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query GetPatientCard($id: Int!) {
              patientCard(id: $id) {
                patient {
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
                appointments {
                  id
                  visitDate
                  createdAt
                  status
                  doctor { id name surname patronymic role }
                  service { id name description duration price }
                  media { id patientId appointmentId type fileUrl uploadedAt }
                }
                records {
                  id
                  diagnose
                  notes
                  createdAt
                  doctor { id name surname patronymic role }
                  service { id name description duration price }
                }
                media { id patientId appointmentId type fileUrl uploadedAt }
                teeth {
                  id
                  toothNumber
                  status
                  history {
                    id
                    diagnosis
                    notes
                    createdAt
                    doctor { id name surname patronymic role }
                    service { id name description duration price }
                  }
                }
                treatmentPlans {
                  id
                  title
                  diagnosis
                  notes
                  status
                  toothNumbers
                  plannedAt
                  createdAt
                  doctor { id name surname patronymic role }
                  service { id name description duration price }
                  appointment {
                    id
                    visitDate
                    createdAt
                    status
                    doctor { id name surname patronymic role }
                    service { id name description duration price }
                    media { id patientId appointmentId type fileUrl uploadedAt }
                  }
                  media { id patientId appointmentId type fileUrl uploadedAt }
                  teeth {
                    id
                    toothNumber
                    status
                    history {
                      id
                      diagnosis
                      notes
                      createdAt
                      doctor { id name surname patronymic role }
                      service { id name description duration price }
                    }
                  }
                }
              }
            }
          `,
          variables: { id },
        },
      }),
      providesTags: (_result, _error, id) => [{ type: 'Patient', id }],
    }),

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
              tg: patientData.tg,
            },
          },
        },
      }),
      invalidatesTags: ['Patient'],
    }),

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
              tg: input.tg,
            },
          },
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Patient', id }, 'Patient'],
    }),

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
          variables: { id },
        },
      }),
      invalidatesTags: ['Patient'],
    }),

    createTreatmentPlan: build.mutation<{ data: { createTreatmentPlan: QueryResult } }, TreatmentPlanInput>({
      query: (input) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation CreateTreatmentPlan($input: TreatmentPlanInput!) {
              createTreatmentPlan(input: $input) {
                success
                message
                data
              }
            }
          `,
          variables: { input },
        },
      }),
      invalidatesTags: (_result, _error, input) => [{ type: 'Patient', id: input.patientId }, 'Patient'],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useGetPatientQuery,
  useGetPatientCardQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useCreateTreatmentPlanMutation,
} = patientApi;
