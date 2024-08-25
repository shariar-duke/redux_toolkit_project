const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

// Initial state for a single video and related videos
const initialState = {
    video: {
        loading: false,
        data: null, // Initialize as null
        error: "",
    },
    relatedVideos: {
        loading: false,
        videos: [], // Initialize as an empty array
        error: "",
    },
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

// Create async thunk to fetch related videos based on tags
const fetchRelatedVideos = createAsyncThunk(
    "video/fetchRelatedVideos",
    async (tags) => {
        const queryString = tags.map(tag => `tags_like=${tag}`).join('&');
        const response = await fetch(`http://localhost:9000/videos?${queryString}`);
        if (!response.ok) {
            throw new Error("Failed to fetch related videos");
        }
        const relatedVideos = await response.json();
        return relatedVideos;
    }
);

// Create slice for video state
const videoSlice = createSlice({
    name: "video",
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchVideos.pending, (state) => {
            state.video.loading = true;
            state.video.error = "";
        });

        builder.addCase(fetchVideos.fulfilled, (state, action) => {
            state.video.loading = false;
            state.video.error = "";
            state.video.data = action.payload;

            // Trigger fetching of related videos based on tags from the main video
            if (action.payload.tags) {
                state.relatedVideos.loading = true;
                state.relatedVideos.error = "";
            }
        });

        builder.addCase(fetchVideos.rejected, (state, action) => {
            state.video.loading = false;
            state.video.error = action.error.message;
            state.video.data = null; // Reset to null on error
        });

        builder.addCase(fetchRelatedVideos.fulfilled, (state, action) => {
            state.relatedVideos.loading = false;
            state.relatedVideos.error = "";
            state.relatedVideos.videos = action.payload;
        });

        builder.addCase(fetchRelatedVideos.rejected, (state, action) => {
            state.relatedVideos.loading = false;
            state.relatedVideos.error = action.error.message;
            state.relatedVideos.videos = []; // Reset to empty array on error
        });
    },
});

// Export the reducer to be used in the store
module.exports = videoSlice.reducer;

// Export the thunks to be used for dispatching
module.exports.fetchVideos = fetchVideos;
module.exports.fetchRelatedVideos = fetchRelatedVideos;
