import { Field, FieldProps, Formik, FormikProps } from "formik";
import { object as objectYup, string as stringYup, number as numberYup } from 'yup';
import getValue from 'lodash/get';

import { useNavigate } from "react-router-dom";
//@ts-ignore
import Files from 'react-files';
import secureLocalStorage from "react-secure-storage";
import Swal from "sweetalert2";
import moment from "moment";
import { changeOfNameType } from "../../types/common";
import DoctorInfoCard from "./includes/doctor-info";
import { ReactFilesError, ReactFilesFile } from "../../types/files";
import { useCallback, useEffect, useState } from "react";
import { routes } from "../routes/routes-names";
import { isLessThanTheMB } from "../../lib/utils/lessthan-max-filesize";
import { Messages } from "../../lib/constants/messages";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import DatePicker from 'react-date-picker';


const ChangeofNameRegistration = () => {
    const navigate = useNavigate();
    const [next, setNext] = useState(false);
    const [provisionalCertificate, setProvisionalCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [provisionalRequestType, setProvisionalRequestType] = useState<string>('nor');
    const [reg_date, setReg_date] = useState(new Date());


    const initialFormData = {
        doctor_id: 0,
        edu_cert1: '',
        extra_col3:'',
        reg_date:'',
        status:'',
        Gazette_No:'',
        newName:'',
    }

    useEffect(() => {
        
    }, []);
  
    const  handleDateChangeRaw = (e:any) => {
        e.preventDefault();
    }
    

    const submitForm = useCallback(
        async (values: changeOfNameType) => {
            try {
                const doctorPrimaryId = LocalStorageManager.getDoctorPrimaryId()
                const doctorId = LocalStorageManager.getDoctorSerialId();

                const changeofNameInfo = {
                    ...values,
                    createdon: moment().format('YYYY-MM-DD'),
                    posttime: moment().format('h:mm:ss'),
                    doctor_id: doctorId,
                    prefix: 'TSMC',
                    approval_status: 'pen',
                    row_type: 'on',
                    gazzetNotificationDate: moment(values.reg_date).format('YYYY-MM-DD'),
                    gazzetNotificationNo:values.Gazette_No,
                    extra_col1:provisionalRequestType,
                    doctorPrimaryId:doctorPrimaryId,
                }
               
                secureLocalStorage.setItem("regType", 'changeofNameInfo');
                secureLocalStorage.setItem("changeofNameInfo", changeofNameInfo);
                if (provisionalCertificate?.file) {
                    secureLocalStorage.setItem("gazzettCertificate", provisionalCertificate?.file);
                }
                
               
                navigate(routes.payment, {state:{doctor_id:Number(doctorId),regType:'changeofNameInfo'}});
                
            } catch (err) {
                Swal.fire({
                    //title: "Error",
                    text: "final renewal registered failed",
                    icon: "error",
                    confirmButtonText: "OK",
                })
                console.log('error in provisional registeration update', err);
            }
        },
        [provisionalCertificate]
    );

    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
                    {!next &&
                        <div className="col-9 m-auto">
                            <div className="card shadow border-0 mb-4">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <h1 className='fs-22 fw-700 me-2 mb-0'>Change Of Name Registration</h1>
                                        <p className='mb-0 fs-13'>(Please check your personal details and click on next)</p>
                                    </div>
                                    <hr />
                                    <DoctorInfoCard />
                                </div>
                                <div className="card-footer text-end">

                                    <button type='button' onClick={() => setNext(true)} className='btn btn-primary'>Next <i className="bi-chevron-right"></i></button>
                                </div>
                            </div>
                        </div>
                    }
                    {next &&
                        <div className="col-9 m-auto">
                            <div className="card shadow border-0 mb-4">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h1 className='fs-22 fw-700 text-nowrap'>Change Of Name Registration</h1>
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
                                        {(formikProps: FormikProps<changeOfNameType>) => {
                                            const { isValid, handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm } = formikProps;

                                            return (
                                                <form onSubmit={handleSubmit}>
                                                    <div className="row mb-2">
                                                    <div className="col-sm-auto">
                                                            <label className="mb-2"> Request Type</label>
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
                                                        <div className="col-8">
                                                            <Field name="newName">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <label className="mb-2">New Name</label>
                                                                            <input
                                                                                type="text"
                                                                                value={field.value}
                                                                                onChange={(ev) => {
                                                                                    setFieldTouched(field.name);
                                                                                    setFieldValue(field.name, ev.target.value);
                                                                                }}
                                                                                className={`form-control ${error ? 'is-invalid' : ''
                                                                                    }`}
                                                                                placeholder="Enter New Name"
                                                                                maxLength={100}
                                                                            />

                                                                            {error && <small className="text-danger">{error.toString()}</small>}


                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>
                                                    </div>
                                                     <div className="row mb-2">
                                                        <div className="col-4">
                                                            <Field name="Gazette_No">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <label className="mb-2">Gazette Notification No</label>
                                                                            <input
                                                                                type="text"
                                                                                value={field.value}
                                                                                onChange={(ev) => {
                                                                                    setFieldTouched(field.name);
                                                                                    setFieldValue(field.name, ev.target.value);
                                                                                }}
                                                                                className={`form-control ${error ? 'is-invalid' : ''
                                                                                    }`}
                                                                                placeholder="Gazette Notification No"
                                                                                maxLength={20}
                                                                            />

                                                                            {error && <small className="text-danger">{error.toString()}</small>}


                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>
                                                   
                                                        <div className="col-sm-auto">
                                                        <label htmlFor="DateofGazette">Gazette Date </label>
                                                        <Field name="reg_date">
                                                                    {(fieldProps: FieldProps) => {
                                                                        const { field, form } = fieldProps;
                                                                        const error =
                                                                            getValue(form.touched, field.name) &&
                                                                            getValue(form.errors, field.name);
                                                                        return (
                                                                            <>
                                                                                <DatePicker
                                                                                    format='dd-MM-yyyy'
                                                                                    onChange={(date: any) => {
                                                                                        setFieldTouched(field.name);
                                                                                        setFieldValue(field.name, date);
                                                                                        setReg_date(date);
                                                                                    }}                       
                                                                                    onFocus={e => e.target.blur()}
                                                                                    clearIcon={null}
                                                                                   
                                                                                    value={reg_date}
                                                                                    className={`form-control ${error ? 'is-invalid' : ''}`}
                                                                                />
                                                                                {error && <small className="text-danger">{error.toString()}</small>}
                                                                            </>
                                                                        );
                                                                    }}
                                                                </Field>
                                                                
                                                        </div>
                                                    
                                                    </div>
                                                    <div className="row mb-2 mt-4">
                                                        <div className='text-danger fs-10'>
                                                                Please upload images (.jpeg,.png) only with less than 200 KB size.  
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
                                                                                            <p className='fs-13'>Upload Gazette Notification</p>
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
                    }
                </div>
            </section>
        </>
    )
};

export default ChangeofNameRegistration;

const getValidationSchema = () =>
    objectYup().shape({
        Gazette_No:stringYup()
        .required('Gazette No is required.')
        .matches(/^[a-zA-Z0-9]*$/, "Must be Alphanumeric only"),
        newName:stringYup()
        .required('New Name is required.'),
        
        reg_date: stringYup()
            .required('Gazette date is required.'),
            
        edu_cert1: stringYup()
            .required('Gazette  certificate is required.'),
       
      
    });

