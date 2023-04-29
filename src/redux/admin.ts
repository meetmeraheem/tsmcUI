import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { tokenManager } from '../lib/token-manager';
import { AdminFormType } from '../types/admin';

type InitialStateType = {
    loading: boolean;
    profile: AdminFormType | null;
};

const initialState: InitialStateType = {
    loading: true,
    profile: null,
};

const adminInfoSlice = createSlice({
    name: 'adminInfo',
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setAdminInfo(state, action: PayloadAction<AdminFormType>) {
            state.profile = action.payload;
        },
        deleteAdminInfo(state) {
            state = initialState;
        },
    },
});

export function getUser(admin: any) {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(adminInfoSlice.actions.setLoading(true));
            if (admin) {
                dispatch(adminInfoSlice.actions.setAdminInfo(admin));
            }
        } catch (err) {
            console.log('error getUser', err);
        } finally {
            dispatch(adminInfoSlice.actions.setLoading(false));
        }
    };
};

export function signOut() {
    return async (dispatch: Dispatch) => {
        dispatch(adminInfoSlice.actions.deleteAdminInfo());
        tokenManager.removeToken();
    };
};

export default adminInfoSlice.reducer;
export const { setAdminInfo, deleteAdminInfo } = adminInfoSlice.actions;