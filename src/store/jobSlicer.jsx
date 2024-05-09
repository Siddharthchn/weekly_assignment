import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchJob = createAsyncThunk("fetchTodo", async () => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const body = JSON.stringify({
    limit: 64,
    offset: 0,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body,
  };

  try {
    const response = await fetch(
      "https://api.weekday.technology/adhoc/getSampleJdJSON",
      requestOptions
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
});

const jobSlice = createSlice({
  name: "job",
  initialState: {
    isLoading: false,
    data: [],
    error: null,
    totalCount: 0,
  },
  reducers: {
    updateFilteredData(state, action) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJob.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Reset error state
      })
      .addCase(fetchJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.jdList; 
        state.totalCount = action.payload.totalCount; 
      })
      .addCase(fetchJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

// Export the action creator from jobSlice
export const { updateFilteredData } = jobSlice.actions;

export default jobSlice.reducer;

