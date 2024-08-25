const configureStore = require("@reduxjs/toolkit").configureStore;
const videoReducer = require("../features/singleVideo/singleVideoSlice")
const {createLogger}  = require("redux-logger")  // importing the logger 


// we need to create logger middleware by calling createLogger function

const logger = createLogger()


const store = configureStore({

    reducer:{
        video : videoReducer      
    },
    middleware : (getDefaultMiddlewares) => {

        return getDefaultMiddlewares().concat(logger)
    }
})

module.exports = store


