import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { tokenManager } from '../lib/token-manager';
import { DoctorFormType } from '../types/doctor';

type InitialStateType = {
    loading: boolean;
    profile: DoctorFormType | null;
};

const initialState: InitialStateType = {
    loading: true,
    profile: null,
};

const doctorInfoSlice = createSlice({
    name: 'doctorInfo',
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setDoctorInfo(state, action: PayloadAction<DoctorFormType>) {
            state.profile = action.payload;
        },
        deleteDoctorInfo(state) {
            state = initialState;
        },
    },
});

export function getUser(doctor: any) {
    return async (dispatch: Dispatch) => {
        try {
            console.log('redux getUser');
            dispatch(doctorInfoSlice.actions.setLoading(true));
            if (doctor) {
                dispatch(doctorInfoSlice.actions.setDoctorInfo(doctor));
            }
        } catch (err) {
            console.log('error getUser', err);
        } finally {
            dispatch(doctorInfoSlice.actions.setLoading(false));
        }
    };
};

export function signOut() {
    return async (dispatch: Dispatch) => {
        dispatch(doctorInfoSlice.actions.deleteDoctorInfo());
        tokenManager.removeToken();
    };
};

export function useDoctorInfo() {
    return useSelector((state: any) => state.doctor)
}

export default doctorInfoSlice.reducer;
export const { setLoading, setDoctorInfo, deleteDoctorInfo } = doctorInfoSlice.actions;