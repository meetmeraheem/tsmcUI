import React from 'react';
import { addTodo, decrement, increment } from '../redux/reducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux';
import { Dispatch } from '@reduxjs/toolkit';

const addAsyncTodo = () => {
    return async (dispatch: Dispatch) => {
        setTimeout(() => {
            dispatch(addTodo('async'));
        }, 2000);
    };
};

const Redux = () => {
    const count = useSelector((state: RootState) => state.toolkit.count);
    const todos = useSelector((state: RootState) => state.toolkit.todos);
    const dispatch = useDispatch();
    console.log(todos);
    return (
        <div>
            {count}
            <button onClick={() => dispatch(increment())}>increment</button>
            <button onClick={() => dispatch(decrement())}>decrement</button>
            <button onClick={() => addAsyncTodo()}>add</button>
        </div>
    );
};

export default Redux;
