import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk для получения пациентов
export const fetchPatients = createAsyncThunk(
  "patients/fetchPatients",
  async (_, { rejectWithValue }) => {
    try {
      const query = `
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
      `;

      const response = await fetch("http://localhost:8000/graphql/patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data.patients;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const patientSlice = createSlice({
  name: "patients",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = patientSlice.actions;
export default patientSlice.reducer;
