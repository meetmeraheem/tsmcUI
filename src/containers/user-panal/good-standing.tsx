import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { routes } from '../routes/routes-names';
import { goodStandingUserType } from "../../types/common";
import Swal from "sweetalert2";
import getValue from 'lodash/get';
import { LocalStorageManager } from '../../lib/localStorage-manager';
import moment from 'moment';
//@ts-ignore
import Files from 'react-files';
import DoctorInfoCard from "./includes/doctor-info";

import secureLocalStorage from 'react-secure-storage';
import { Field, FieldProps, Formik, FormikProps } from "formik";
import { object as objectYup, string as stringYup, number as numberYup } from 'yup';
import { ReactFilesError, ReactFilesFile } from "../../types/files";
import { Messages } from "../../lib/constants/messages";
import { isLessThanTheMB } from "../../lib/utils/lessthan-max-filesize";

const GoodStandingRegistration = () => {
    const navigate = useNavigate();
    const [next, setNext] = useState(false);
    const [doctorId, setDoctorId] = useState(0);
    const [provisionalRequestType, setProvisionalRequestType] = useState<string>("nor");
    const [provisionalCertificate, setProvisionalCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [applicationForm, setApplicationForm] = useState<{ file?: File; error?: string } | null>(null);
    

    const initialFormData = {
        doctor_id: '',
        edu_cert1: '',
        edu_cert2: '',
        status:'',
        createdon:'',
        posttime:'',
        modifiedon:'', 
        added_by:0,
        approval_status:'',
        doctorPrimaryId:'',
        extra_col3:'',
    }

    const submitForm = useCallback(
        async (values: goodStandingUserType) => {
            try {
                const doctorPrimaryId = LocalStorageManager.getDoctorPrimaryId()
                const doctorId = LocalStorageManager.getDoctorSerialId();

                const goodstandingInfo = {
                    createdon: moment().format('YYYY-MM-DD'),
                    posttime: moment().format('h:mm:ss'),
                    prefix: 'TSMC',
                    approval_status: 'pen',
                    row_type: 'on',
                    reg_date: moment().format('YYYY-MM-DD'),
                    doctor_id: doctorId && Number(doctorId),
                    extra_col1: provisionalRequestType,
                    doctorPrimaryId: doctorPrimaryId
    
                }
               
                secureLocalStorage.setItem("regType", 'goodstandingInfo');
                secureLocalStorage.setItem("goodstandingInfo", goodstandingInfo);
                if (provisionalCertificate?.file) {
                    secureLocalStorage.setItem("gsRegCertificate", provisionalCertificate?.file);
                }
                if (applicationForm?.file) {
                    secureLocalStorage.setItem("gs_af", applicationForm?.file);
                }
                
            navigate(routes.payment, { state: { doctor_id: Number(doctorId), regType: 'goodstandingInfo' } });
               
               
                
            } catch (err) {
                Swal.fire({
                    //title: "Error",
                    text: "Good Standing  registered failed",
                    icon: "error",
                    confirmButtonText: "OK",
                })
                console.log('error in provisional registeration update', err);
            }
        },
        [doctorId, provisionalRequestType, provisionalCertificate, applicationForm]
    );

    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
                    {!next &&
                        <>
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
                                            <button type='submit' onClick={() => setNext(true)} className='btn btn-primary'>Next <i className="bi-chevron-right"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    {next &&
                        <>
                        <div className="col-9 m-auto">
                            <div className="card shadow border-0 mb-4">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h1 className='fs-22 fw-700 text-nowrap'>Good standing Registration</h1>
                                        <div>
                                            
                                        </div>
                                    </div>
                                    <hr />
                                    <Formik
                                        onSubmit={submitForm}
                                        enableReinitialize
                                        validationSchema={getValidationSchema}
                                        initialValues={initialFormData}
                                    >
                                        {(formikProps: FormikProps<goodStandingUserType>) => {
                                            const { isValid, handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm } = formikProps;

                                            return (
                                                <form onSubmit={handleSubmit}>
                                                    <div className="row mb-2">
                                                    <div className="col-sm-auto">
                                                            <label className="mb-2">Request Type</label>
                                                            <select
                                                                value={provisionalRequestType}
                                                                onChange={(ev) => {
                                                                    setProvisionalRequestType(ev.target.value);
                                                                }}
                                                                className="form-select"
                                                            >
                                                              {/*  <option value="">Select</option>*/}
                                                                <option value="nor">Normal</option>
                                                               {/*<option value="tat">Tatkal</option>*/}
                                                            </select>
                                                        </div>
                                                        </div>
                                                        <div className="row mb-2">
                                                       
                                                        

                                                    </div>
                                                    <div className="row mb-2">
                                                       

                                                    </div>

                                                    <div className="row mb-2 mt-4">
                                                            <div className='text-danger fs-10'>
                                                                Please upload images (.jpeg,.png) only, with less than 200 KB size.  
                                                            </div>
                                                            <div className='text-danger fs-10'>
                                                                File name should not contain any special charaters and should have less than 20 character length.
                                                            </div>
                                                        </div>
                                                    <div className="row mb-2 mt-4">
                                                        <div className="col">
                                                            <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                <Field name="edu_cert1">
                                                                    {(fieldProps: FieldProps) => {
                                                                        const { field, form } = fieldProps;
                                                                        const error =
                                                                            getValue(form.touched, field.name) &&
                                                                            getValue(form.errors, field.name);
                                                                        const file = provisionalCertificate?.file
                                                                            ? provisionalCertificate?.file.name
                                                                            : field.value || null;
                                                                        return file ? (
                                                                            <p className="d-flex align-items-center">
                                                                                <strong>Uploaded:</strong>
                                                                                <span className="ms-1">{file}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setFieldValue(field.name, '');
                                                                                        setProvisionalCertificate(null);
                                                                                    }}
                                                                                    title='Delete'
                                                                                    className="ms-2 lh-1"
                                                                                >
                                                                                    <i className="bi-trash" />
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
                                                                                                setProvisionalCertificate({ file });
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
                                                                                    accepts={['.jpeg', '.jpg','.png']}
                                                                                    clickable
                                                                                >
                                                                                    <div className="drag-drop-box mt-3">
                                                                                        <div className="text-center">
                                                                                            <i className="bi-file-earmark-break fs-32"></i>
                                                                                            <p className='fs-13'>Upload Degree Certificate</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </Files>
                                                                                <small className="text-danger mt-1">
                                                                                    {provisionalCertificate?.error}
                                                                                </small>
                                                                                {error && <small className="text-danger">{error.toString()}</small>}
                                                                            </>
                                                                        );
                                                                    }}
                                                                </Field>


                                                            </div>
                                                            <div className="col">
                                                            <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                <Field name="edu_cert2">
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
                                                                                    <i className="bi-trash" />
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
                                                                                    accepts={['.jpeg', '.jpg','.png']}
                                                                                    clickable
                                                                                >
                                                                                    <div className="drag-drop-box mt-3">
                                                                                        <div className="text-center">
                                                                                            <i className="bi-file-earmark-break fs-32"></i>
                                                                                            <p className='fs-13'>Other Supporting documents </p>
                                                                                        </div>
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
                                                        </div>
                                                        <div className="col">
                                                            
                                                        </div>
                                                    </div>
                                                    <div className="w-100 text-end mt-3">
                                                        {/* isValid? setNext(false):setNext(true) */}
                                                        <button type='button' onClick={() => { setNext(false) }} className='btn btn-primary me-3'><i className="bi-chevron-left"></i>Back </button>
                                                        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                                            {isSubmitting && <span className="spinner-border spinner-border-sm" />} Submit
                                                        </button>
                                                    </div>
                                                </form>
                                            );
                                        }}
                                    </Formik>
                                </div>
                                </div>
                                </div>
                        </>
                    }
                    </div>
                    
                
        </section >
            </>
    )
};


export default GoodStandingRegistration;

const getValidationSchema = () =>
    objectYup().shape({
        edu_cert1: stringYup()
            .required('Degree certificate is required.'),
         edu_cert2: stringYup()
            .required('Other Qualification/Renewal documents is required.'),
    });
