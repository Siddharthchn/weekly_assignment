import { configureStore } from '@reduxjs/toolkit'
import jobReducer from '../store/jobSlicer'

export const store = configureStore ( {
    reducer: {
    job: jobReducer
    }
})