import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const uploadImage = createAsyncThunk(
  "Images/uploadImage",
  async (args, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/uploadImage",
        args
      );
      console.log("response", response);
      return (await response).data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const FetchImage = createAsyncThunk(
  "Images/fetchImage",
  async (args, { rejectWithValue }) => {
    console.log("FetchImage");
    try {
      const response = await axios.get("http://localhost:5000/FetchImage");
      console.log("response from FetchImage", response.data);
      return (await response).data;
    } catch (error) {
      console.log("error");
      rejectWithValue(error.response.message);
    }
  }
);

export const IncrementViewCount = createAsyncThunk(
  "Images/IncrementCount",
  async (args, { rejectWithValue }) => {
    try {
      console.log("IncrementViewCountHit");
      console.log("args", args);
      const response = await axios.put(
        `http://localhost:5000/incrementCount/${args}/view`
      );
      console.log("view updated");
      FetchImage();
      return (await response).data;
    } catch (error) {
      console.error("Error Incrementing View Count", error);
    }
  }
);

const initialState = {
  loading: false,
  isSuccess: false,
  message: "",
  ImageGallary: [],
};

export const imageSlicer = createSlice({
  name: "images",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.ImageGallary.push(action.payload);
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = false;
        state.message = action.error.message;
      })
      .addCase(FetchImage.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(FetchImage.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.ImageGallary = action.payload;
      })
      .addCase(FetchImage.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = false;
        state.message = action.error.message;
      })
      .addCase(IncrementViewCount.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.pending = false;
      })
      .addCase(IncrementViewCount.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export default imageSlicer.reducer;
