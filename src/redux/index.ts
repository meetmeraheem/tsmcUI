import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';
import history from '../history';
import reducer from './reducer';
import doctor from './doctor';

export type RootState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
    router: connectRouter(history),
    doctor,
    toolkit: reducer,
});

export const store = configureStore({
    reducer: rootReducer,
});

// export const store = configureStore({
//     reducer: {
//         router: connectRouter(history),
//         doctor: doctor,
//         toolkit: reducer
//     }
// })

// Infer the `RootState` and `AppDispatch` types from the store itself
//export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
