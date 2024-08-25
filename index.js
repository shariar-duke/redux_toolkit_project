const store = require("./app/store.js")
const { fetchVideos } = require("./features/singleVideo/singleVideoSlice.js");

// Subscribe to store updates
store.subscribe(() => {

});

// Dispatch the thunk action to fetch videos
store.dispatch(fetchVideos());
