import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialStateType = {
    count: number;
    todos: string[];
};

const initialState: InitialStateType = {
    count: 0,
    todos: ['снять видео', 'смотнировать', 'рассказать'],
};

const toolkitSlice = createSlice({
    name: 'toolkit',
    initialState,
    reducers: {
        increment(state) {
            state.count = state.count + 1;
        },
        decrement(state) {
            state.count = state.count - 1;
        },
        addTodo(state, action: PayloadAction<string>) {
            console.log(state);
            state.todos.push(action.payload);
        },
    },
});

export default toolkitSlice.reducer;
export const { increment, decrement, addTodo } = toolkitSlice.actions;
