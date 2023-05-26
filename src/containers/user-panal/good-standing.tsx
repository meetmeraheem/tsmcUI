import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { date as dateYup, object as objectYup, string as stringYup, number as numberYup } from 'yup';
import { useCallback, useEffect, useState } from 'react';
import getValue from 'lodash/get';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
//@ts-ignore
import Files from 'react-files';
import { College, Country, Qualification, Serials, State, University } from '../../types/common';
import { FinalFormType } from '../../types/final';
import { ReactFilesError, ReactFilesFile } from '../../types/files';
import { isLessThanTheMB } from '../../lib/utils/lessthan-max-filesize';
import { Messages } from '../../lib/constants/messages';
import { commonService } from '../../lib/api/common';
import Swal from 'sweetalert2';
import { routes } from '../routes/routes-names';
import { additionalService } from '../../lib/api/additional';
import { LocalStorageManager } from '../../lib/localStorage-manager';
import { doctorService } from '../../lib/api/doctot';
import { dateDuration } from '../../lib/utils/dateDuration';
import { provisionalService } from '../../lib/api/provisional';
import moment from 'moment';
import { authService } from '../../lib/api/auth';
import DoctorInfoCard from "./includes/doctor-info";
import secureLocalStorage from 'react-secure-storage';

const GoodStandingRegistration = () => {
    const navigate = useNavigate();
    const [duration, setDuration] = useState('');
  
    useEffect(() => {
    }, []);

  const ContinueForm = useCallback(async () => {
        try {
            const doctorId = Number(LocalStorageManager.getDoctorSerialId());
            const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());
            const goodstandingInfo = {
                createdon: moment().format('YYYY-MM-DD'),
                posttime: moment().format('h:mm:ss'),
                doctor_id: doctorId && Number(doctorId),
                prefix: 'TSMC',
                approval_status: 'pen',
                row_type: 'on',
                reg_date: moment().format('YYYY-MM-DD'),
                doctorPrimaryId:doctorPrimaryId,
            }
            secureLocalStorage.setItem("regType", 'goodstandingInfo');
            secureLocalStorage.setItem("goodstandingInfo", goodstandingInfo);
            navigate(routes.payment, {state:{doctor_id:Number(doctorId),regType:'goodstandingInfo'}});
        } catch (err) {
            console.log('error in  registrartion.', err);
        }
    }, []);

    return (
        <>
            <section className='gray-banner'>
            <div className="container mt-4">
             <div className="col-9 m-auto">
                        <div className="card shadow border-0 mb-4">
                            <div className="card-body">
                            <div className="mt-3">
                                <div className="d-flex align-items-center">
                                    <h1 className='fs-22 fw-700 me-2 mb-0'>Good standing Registration</h1>
                                    <p className='mb-0 fs-13'>(Please check your personal details and click on next)</p>
                                    
                                </div>
                                <hr />
                                <DoctorInfoCard />
                            </div>
                            <div className="card-footer text-end">
                            <button type="button" onClick={() => ContinueForm()} className="btn btn-primary ps-2">Continue</button>
                            </div>
                        </div>
                        </div>
                    </div>  
                    
                    </div>
                </section>
            </>
    )
};


export default GoodStandingRegistration;