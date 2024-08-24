const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

// Initial state for a single video
const initialState = {
    loading: false,
    video: null, // Initialize as null
    error: ""
};

// Create async thunk to fetch video data
const fetchVideos = createAsyncThunk("video/fetchVideos", async () => {
    const response = await fetch("http://localhost:9000/videos");
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    const newVideo = await response.json();
    return newVideo;
});

// Create slice for video state
const videoSlice = createSlice({
    name: "video",
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchVideos.pending, (state) => {
            state.loading = true;
            state.error = "";
        });

        builder.addCase(fetchVideos.fulfilled, (state, action) => {
            state.loading = false;
            state.error = "";
            state.video = action.payload;
        });

        builder.addCase(fetchVideos.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.video = null; // Reset to null on error
        });
    }
});

// Export the reducer to be used in the store
module.exports = videoSlice.reducer;

// Export the thunk to be used for dispatching
module.exports.fetchVideos = fetchVideos;
