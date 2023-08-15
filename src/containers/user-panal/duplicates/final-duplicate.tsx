import DoctorInfoCard from "../includes/doctor-info";
import { useNavigate } from "react-router-dom";
import { Field, FieldProps, Formik, FormikProps } from 'formik';
//@ts-ignore
import Files from 'react-files';
import { College, Country, Qualification, Serials, State, University } from '../../../types/common';
import { FinalFormType } from '../../../types/final';
import { ReactFilesError, ReactFilesFile } from '../../../types/files';
import { isLessThanTheMB } from '../../../lib/utils/lessthan-max-filesize';
import { Messages } from '../../../lib/constants/messages';
import Swal from 'sweetalert2';
import { routes } from '../../routes/routes-names';
import { LocalStorageManager } from '../../../lib/localStorage-manager';
import moment from 'moment';
import secureLocalStorage from 'react-secure-storage';
import { useCallback, useEffect, useState } from 'react';
import getValue from 'lodash/get';


const FinalDuplicate = () => {
    const navigate = useNavigate();
    const [next, setNext] = useState(false);
    const [finalSerial, setFinalSerial] = useState<Serials>();
    const [fmrNo, setFMRNo] = useState(0);
    const [duration, setDuration] = useState('');
    const [applicationForm, setApplicationForm] = useState<{ file?: File; error?: string } | null>(null);

    const initialFormData = {
        country: '',
        state: '',
        university: '',
        college: '',
        qualification: '',
        exam_month: '',
        exam_year: '',
        duration: '',
        edu_cert1: '',
        edu_cert2: '',
        edu_cert3: '',
        affidivit: '',
        testimonal1: '',
        testimonal2: '',
        reg_other_state: '',
        screen_test: '',
        intership_comp: '',
        mci_eligi: '',
        inter_verif_cert: '',
        mci_reg: '',
        imr_certificate: '',
        telanganapmrNo:'',
        calc_date:''
    }
    const submitForm = useCallback(
        async (values: FinalFormType) => {
            try {
                const doctorId = Number(LocalStorageManager.getDoctorSerialId());
                const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());

                const finalInfo = {
                    ...values,
                    createdon: moment().format('YYYY-MM-DD'),
                    duration: duration,
                    posttime: moment().format('h:mm:ss'),
                    doctor_id: doctorId && Number(doctorId),
                    prefix: 'TSMC',
                    approval_status: 'pen',
                    row_type: 'on',
                    reg_date: moment().format('YYYY-MM-DD'),
                    doctorPrimaryId: doctorPrimaryId,
                }
                secureLocalStorage.setItem("regType", 'final');
                secureLocalStorage.setItem("finalInfo", finalInfo);



                navigate(routes.payment, { state: { doctor_id: Number(doctorId), regType: 'final duplicate' } });


            } catch (err) {
                Swal.fire({
                    text: "Final registeration failed",
                    icon: "error",
                    confirmButtonText: "OK",
                })
            }
        },
        [finalSerial, fmrNo]
    );
    const getValidationSchema = () => {

    };

    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
                    <div className="col-9 m-auto">
                        <div className="card shadow border-0 mb-4">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <h1 className='fs-22 fw-700 me-2 mb-0'>Final Duplicate Registration</h1>
                                    <p className='mb-0 fs-13'>(Please check your personal details and click on next)</p>
                                </div>
                                <hr />
                                <DoctorInfoCard />
                            </div>
                            <div className="card-footer text-end">
                                <button type='submit' className='btn btn-primary'>Next <i className="bi-chevron-right"></i></button>
                            </div>
                        </div>
                    </div>
                    <div className="col-9 m-auto">
                        <div className="card shadow border-0 mb-4">
                            <div className="card-body">
                                <h1 className='fs-22 fw-700'>Final Duplicate Registration</h1>
                                <hr />
                                <Formik
                                    onSubmit={submitForm}
                                    enableReinitialize
                                    initialValues={initialFormData}
                                    validationSchema={getValidationSchema()}
                                >
                                    {(formikProps: FormikProps<FinalFormType>) => {
                                        const { errors, isValid, handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm, values } = formikProps;

                                        return (
                                            <>
                                                <form onSubmit={handleSubmit}>
                                                    <div className="row mb-2">
                                                        <div className="col-4">
                                                            <label className="mb-2">Reason</label>
                                                            <select name="reason" className="form-select form-select-sm" tabIndex={1}>
                                                                <option value="">Select</option>
                                                                <option value="notk">Not Known</option>
                                                                <option value="surr">Surrender</option>
                                                                <option value="lost">Lost</option>
                                                            </select>
                                                        </div>
                                                        
                                                    </div>
                                                    <div className="row mb-2 mt-4">
                                                        <div className="col-4">
                                                           
                                                                
                                                                    <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                        <Field name="edu_cert1">
                                                                            {(fieldProps: FieldProps) => {
                                                                                const { field, form } = fieldProps;
                                                                                const error =
                                                                                    getValue(form.touched, field.name) &&
                                                                                    getValue(form.errors, field.name);
                                                                                const file = applicationForm?.file
                                                                                    ? applicationForm?.file.name
                                                                                    : field.value || null;
                                                                                return file ? (
                                                                                    <p className="d-flex align-items-center">
                                                                                        <strong>Uploaded:</strong>
                                                                                        <span className="ms-1">{file}</span>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => {
                                                                                                setFieldValue(field.name, '');
                                                                                                setApplicationForm(null);
                                                                                            }}
                                                                                            title='Delete'
                                                                                            className="ms-2 lh-1"
                                                                                        >
                                                                                            <i className="bi-trash"></i>
                                                                                        </button>
                                                                                    </p>
                                                                                ) : (
                                                                                    <>
                                                                                        <Files
                                                                                            className="files-dropzone"
                                                                                            onChange={(files: ReactFilesFile[]) => {
                                                                                                if (files[0]) {
                                                                                                    const file = files[0];
                                                                                                    const isLess = isLessThanTheMB(files[0].size, 0.3);
                                                                                                    if (isLess) {
                                                                                                        setApplicationForm({ file });
                                                                                                        setFieldValue(field.name, file.name);
                                                                                                    }
                                                                                                    else {
                                                                                                        alert(Messages.isLessThanTheMB);
                                                                                                    }
                                                                                                }
                                                                                            }}
                                                                                            onError={(error: ReactFilesError) => {
                                                                                                console.log('error', error);
                                                                                                if (error.code === 1) {
                                                                                                }
                                                                                            }}
                                                                                            clickable
                                                                                        >
                                                                                            <div className="text-center">
                                                                                                <i className="bi-file-earmark-break fs-32"></i>
                                                                                                <p className='fs-13'>Upload Document </p>
                                                                                            </div>
                                                                                        </Files>
                                                                                        <small className="text-danger mt-1">
                                                                                            {applicationForm?.error}
                                                                                        </small>
                                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                                    </>
                                                                                );
                                                                            }}
                                                                        </Field>
                                                                    </div>
                                                                
                                                            
                                                        </div>
                                                        <div className="w-100 text-end mt-3">
                                                            {/* isValid? setNext(false):setNext(true) */}
                                                            <button type='button' onClick={() => { setNext(false) }} className='btn btn-primary me-3'><i className="bi-chevron-left"></i>Back </button>
                                                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                                                {isSubmitting && <span className="spinner-border spinner-border-sm" />} Submit
                                                            </button>
                                                        </div>
                                                        </div>
                                                </form>
                                            </>
                                        );
                                    }}
                                </Formik>
                            </div>
                        </div>
                    </div>
                    </div>
            </section>
        </>
    )
};

export default FinalDuplicate;