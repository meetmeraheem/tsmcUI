import { Field, FieldProps, Formik, FormikProps } from "formik";
import { object as objectYup, string as stringYup, number as numberYup } from 'yup';
import getValue from 'lodash/get';

import { useNavigate } from "react-router-dom";
//@ts-ignore
import Files from 'react-files';
import secureLocalStorage from "react-secure-storage";
import Swal from "sweetalert2";
import moment from "moment";
import { renewalsType } from "../../types/common";
import DoctorInfoCard from "./includes/doctor-info";
import { ReactFilesError, ReactFilesFile } from "../../types/files";
import { useCallback, useEffect, useState } from "react";

import { commonService } from "../../lib/api/common";
import { routes } from "../routes/routes-names";
import { isLessThanTheMB } from "../../lib/utils/lessthan-max-filesize";
import { Messages } from "../../lib/constants/messages";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import DatePicker from 'react-date-picker';


const RenewalRegistration = () => {
    const navigate = useNavigate();
    const [next, setNext] = useState(false);
    const [provisionalCertificate, setProvisionalCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [applicationForm, setApplicationForm] = useState<{ file?: File; error?: string } | null>(null);
    const [nocCertificate, setNOCCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [cmecredit6, setCmecredit6] = useState<{ file?: File; error?: string } | null>(null);
    const [cmecredit12, setCmecredit12] = useState<{ file?: File; error?: string } | null>(null);
    const [cmecredit18, setCmecredit18] = useState<{ file?: File; error?: string } | null>(null);
    const [cmecredit24, setCmecredit24] = useState<{ file?: File; error?: string } | null>(null);
    const [cmecredit30, setCmecredit30] = useState<{ file?: File; error?: string } | null>(null);
    const [provisionalRequestType, setProvisionalRequestType] = useState<string>('nor');
     const [renewalRequestType, setRenewalRequestType] = useState<string>('');
     const [cmeCreditStatus, setCmeCreditStatus] = useState<string>('Y');
    const [reg_date, setReg_date] = useState(new Date());
    const [showmaxdate, setShowmaxdate] = useState(new Date());
    const [disabled,setDisabled]=useState(false);


    const initialFormData = {
        doctor_id: 0,
        edu_cert1: '',
        edu_cert2: '',
        edu_cert3: '',
        cmecredit6:'',
        cmecredit12:'',
        cmecredit18:'',
        cmecredit24:'',
        cmecredit30:'',
        reg_date:'',
        status:'',
        renewal_date_type:'',
        cmecredit_status:'',
        cmecredit_value:0,
        
    }
    useEffect(() => {
        
    }, []);

    

    const submitForm = useCallback(
        async (values: renewalsType) => {
            try {
                if(cmeCreditStatus === 'Y'){
                    if(values.cmecredit_value === 0){
                        Swal.fire({
                            text: "Please Enter CME credit Points",
                            icon: "warning",
                            confirmButtonText: "OK",
                        });
                        return false;
                    }
                }

                const doctorPrimaryId = LocalStorageManager.getDoctorPrimaryId()
                const doctorId = LocalStorageManager.getDoctorSerialId();

                const renewalInfo = {
                    ...values,
                    createdon: moment().format('YYYY-MM-DD'),
                    posttime: moment().format('h:mm:ss'),
                    doctor_id: doctorId,
                    prefix: 'TSMC',
                    approval_status: 'pen',
                    row_type: 'on',
                    reg_date: moment(values.reg_date).format('YYYY-MM-DD'),
                    extra_col1:provisionalRequestType,
                    renewal_date_type:renewalRequestType,
                    doctorPrimaryId:doctorPrimaryId,
                    cmeCreditStatus:cmeCreditStatus,
                    cmeCreditValue:values.cmecredit_value,
                }
               
                secureLocalStorage.setItem("regType", 'finalrenewalsInfo');
                secureLocalStorage.setItem("finalrenewalsInfo", renewalInfo);
                if (provisionalCertificate?.file) {
                    secureLocalStorage.setItem("regCertificate", provisionalCertificate?.file);
                }
                if (applicationForm?.file) {
                    secureLocalStorage.setItem("renewal_af", applicationForm?.file);
                }
                if (nocCertificate?.file) {
                    secureLocalStorage.setItem("renewal_noc", nocCertificate?.file);
                }
                if (cmecredit6?.file) {
                    secureLocalStorage.setItem("cmecredit6", cmecredit6?.file);
                }
                if (cmecredit12?.file) {
                    secureLocalStorage.setItem("cmecredit12", cmecredit12?.file);
                }
                if (cmecredit18?.file) {
                    secureLocalStorage.setItem("cmecredit18", cmecredit18?.file);
                }
                if (cmecredit24?.file) {
                    secureLocalStorage.setItem("cmecredit24", cmecredit24?.file);
                }
                if (cmecredit30?.file) {
                    secureLocalStorage.setItem("cmecredit30", cmecredit30?.file);
                }
                navigate(routes.payment, {state:{doctor_id:Number(doctorId),regType:'finalrenewalsInfo'}});
                
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
        [provisionalCertificate, applicationForm, nocCertificate,cmecredit6,cmecredit12,cmecredit18,cmecredit24,cmecredit30,cmeCreditStatus]
    );

    const getTatkalUpdate = useCallback(async (value:any) => {
        try {
            if(value !== 'nor'){
                const { success, data, message } = await commonService.getTatkalCurrentStatus();
                    if (data === "YES") {
                        Swal.fire({
                            text: "You have selected Tatkal Service ,Additional charges applicable",
                            icon: "warning",
                            confirmButtonText: "OK",
                        })
                        setProvisionalRequestType('tat');
                        }else{
                            Swal.fire({
                                text: "TatKal Not allowed for Today (or) Day limit Reached",
                                icon: "warning",
                                confirmButtonText: "OK",
                            })
                            setProvisionalRequestType('nor');
                        }
                    }else{
                        setProvisionalRequestType('nor');
                    }
        } catch (err) {
            console.log('error countries getList', err);
        }
    }, []);
   


    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
                    {!next &&
                        <div className="col-9 m-auto">
                            <div className="card shadow border-0 mb-4">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <h1 className='fs-22 fw-700 me-2 mb-0'>Final Renewals Registration</h1>
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
                                        <h1 className='fs-22 fw-700 text-nowrap'>Final Renewals Registration</h1>
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
                                        {(formikProps: FormikProps<renewalsType>) => {
                                            const { isValid, handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm } = formikProps;

                                            return (
                                                <form onSubmit={handleSubmit}>
                                                    <div className="row mb-2">
                                                    <div className="col-sm-auto">
                                                            <label className="mb-2">Request Type (Normal or Tatkal)</label>
                                                            <select
                                                                value={provisionalRequestType}
                                                                onChange={(ev) => {
                                                                    getTatkalUpdate(ev.target.value);
                                                                }}
                                                                className="form-select"
                                                            >
                                                              {/*  <option value="">Select</option>*/}
                                                                <option value="nor">Normal</option>
                                                               <option value="tat">Tatkal</option>
                                                            </select>
                                                        </div>
                                                        </div>
                                                        <div className="row mb-2">
                                                       
                                                        

                                                    </div>
                                                  
                                                    <div className="row mb-2">
                                                      <div className="col-sm-auto">
                                                            <label className="mb-2"> Last Renewal Date / Noc Date </label>
                                                            <select
                                                                value={renewalRequestType}
                                                                onChange={(ev) => {
                                                                   setRenewalRequestType(ev.target.value);
                                                                   setShowmaxdate(new Date());
                                                                   if(ev.target.value !=='nocd'){
                                                                        setShowmaxdate(moment().add('years', -5).toDate());
                                                                   }else{
                                                                        setShowmaxdate(new Date());
                                                                   }
                                                                }}
                                                                className="form-select"
                                                                required={true}
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="lrd">Last Registration Date</option>
                                                                <option value="nocd">Noc Date</option>
                                                                
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="row mb-2">
                                                        <div className="col-sm-auto">
                                                        <label htmlFor="Dateofbirth">Enter last Registration/Renewal Date or Noc Date is required</label>
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
                                                                                    maxDate={showmaxdate}
                                                                                    clearIcon={null}
                                                                                    value={reg_date}
                                                                                    onFocus={e => e.target.blur()}
                                                                                    className={`form-control ${error ? 'is-invalid' : ''}`}
                                                                                />
                                                                                {error && <small className="text-danger">{error.toString()}</small>}
                                                                            </>
                                                                        );
                                                                    }}
                                                                </Field>
                                                                
                                                        </div>
                                                        <div className="row" style={{marginLeft:'12px', marginTop:'20px' ,border: "1px solid rgb(26, 174, 176)", width:"98%"}}>
                                                        <span className="text-danger fs-13">
                                                            Any Final Registration Renewal needs CME Credit hours  as per TSMC guidelines
                                                            Which is minimum of 6 till DEC-2024.Any shortage in credit hours  penality applicable
                                                            </span>
                                                        <div className="col">
                                                        <div className="col-sm-auto">
                                                            <label className="mb-2"> Is CME Credit Points Applicable(Y/N) </label>
                                                            <select
                                                                value={cmeCreditStatus}
                                                                onChange={(ev) => {
                                                                    if(ev.target.value==="N"){
                                                                        setDisabled(true);
                                                                    }else{
                                                                        setDisabled(false);
                                                                    }
                                                                    setCmeCreditStatus(ev.target.value);
                                                                }}
                                                                className="form-select"
                                                                required={true}
                                                            >
                                                                <option value="Y">Yes</option>
                                                                <option value="N">No</option>
                                                                
                                                            </select>
                                                                </div>
                                                            </div>

                                                        <div className="col">
                                                                <Field name="cmecredit_value">
                                                                    {(fieldProps: FieldProps) => {
                                                                        const { field, form } = fieldProps;
                                                                        const error =
                                                                            getValue(form.touched, field.name) &&
                                                                            getValue(form.errors, field.name);
                                                                        return (
                                                                            <>
                                                                                <label className="mb-2">Enter No of CME credit Points <span className="text-danger fs-8'">(value from 1-6 till DEC-2024)</span></label>
                                                                                <input
                                                                                    type="number"
                                                                                     onChange={(ev) => {
                                                                                         setFieldTouched(field.name);
                                                                                         setFieldValue(field.name, Number(ev.target.value));
                                                                                     }}
                                                                                    className={`form-control ${error ? 'is-invalid' : ''
                                                                                        }`}
                                                                                    placeholder="Enter No of CME credit Points (value 1-6)"
                                                                                    tabIndex={8}
                                                                                    disabled={disabled}
                                                                                    min="1" max="6"
                                                                                />

                                                                                {error && <small className="text-danger">{error.toString()}</small>}


                                                                            </>
                                                                        );
                                                                    }}
                                                                </Field>
                                                            </div>

                                                    </div>
                                                    
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
                                                                                            <p className='fs-13'>Upload Last Renewal Certificate</p>
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
                                                                                            <p className='fs-13'>Upload MBBS Certificate </p>
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
                                                        <div className="col">
                                                            <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                <Field name="edu_cert3">
                                                                    {(fieldProps: FieldProps) => {
                                                                        const { field, form } = fieldProps;
                                                                        const error =
                                                                            getValue(form.touched, field.name) &&
                                                                            getValue(form.errors, field.name);
                                                                        const file = nocCertificate?.file
                                                                            ? nocCertificate?.file.name
                                                                            : field.value || null;
                                                                        return file ? (
                                                                            <p className="d-flex align-items-center">
                                                                                <strong>Uploaded:</strong>
                                                                                <span className="ms-1">{file}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setFieldValue(field.name, '');
                                                                                        setNOCCertificate(null);
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
                                                                                                setNOCCertificate({ file });
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
                                                                                            <p className='fs-13'> Other relavant documents</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </Files>
                                                                                <small className="text-danger mt-1">
                                                                                    {nocCertificate?.error}
                                                                                </small>
                                                                                {error && <small className="text-danger">{error.toString()}</small>}
                                                                            </>
                                                                        );
                                                                    }}
                                                                </Field>
                                                            </div>
                                                            </div>
                                                            <div className="col">
                                                            <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                <Field name="cmecredit6">
                                                                    {(fieldProps: FieldProps) => {
                                                                        const { field, form } = fieldProps;
                                                                        const error =
                                                                            getValue(form.touched, field.name) &&
                                                                            getValue(form.errors, field.name);
                                                                        const file = cmecredit6?.file
                                                                            ? cmecredit6?.file.name
                                                                            : field.value || null;
                                                                        return file ? (
                                                                            <p className="d-flex align-items-center">
                                                                                <strong>Uploaded:</strong>
                                                                                <span className="ms-1">{file}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setFieldValue(field.name, '');
                                                                                        setCmecredit6(null);
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
                                                                                                setCmecredit6({ file });
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
                                                                                            <p className='fs-13'>CMEdoc1</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </Files>
                                                                                <small className="text-danger mt-1">
                                                                                    {cmecredit6?.error}
                                                                                </small>
                                                                                {error && <small className="text-danger">{error.toString()}</small>}
                                                                            </>
                                                                        );
                                                                    }}
                                                                </Field>
                                                                </div>
                                                              </div>  
                                                                
                                                            <div className="row mb-2 mt-4">
                                                            <div className="col">
                                                            <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                <Field name="cmecredit12">
                                                                    {(fieldProps: FieldProps) => {
                                                                        const { field, form } = fieldProps;
                                                                        const error =
                                                                            getValue(form.touched, field.name) &&
                                                                            getValue(form.errors, field.name);
                                                                        const file = cmecredit12?.file
                                                                            ? cmecredit12?.file.name
                                                                            : field.value || null;
                                                                        return file ? (
                                                                            <p className="d-flex align-items-center">
                                                                                <strong>Uploaded:</strong>
                                                                                <span className="ms-1">{file}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setFieldValue(field.name, '');
                                                                                        setCmecredit12(null);
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
                                                                                                setCmecredit12({ file });
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
                                                                                            <p className='fs-13'>CMEdoc2</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </Files>
                                                                                <small className="text-danger mt-1">
                                                                                    {cmecredit12?.error}
                                                                                </small>
                                                                                {error && <small className="text-danger">{error.toString()}</small>}
                                                                            </>
                                                                        );
                                                                    }}
                                                                </Field>
                                                            </div>
                                                            </div>
                                                            <div className="col">
                                                            <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                <Field name="cmecredit18">
                                                                    {(fieldProps: FieldProps) => {
                                                                        const { field, form } = fieldProps;
                                                                        const error =
                                                                            getValue(form.touched, field.name) &&
                                                                            getValue(form.errors, field.name);
                                                                        const file = cmecredit18?.file
                                                                            ? cmecredit18?.file.name
                                                                            : field.value || null;
                                                                        return file ? (
                                                                            <p className="d-flex align-items-center">
                                                                                <strong>Uploaded:</strong>
                                                                                <span className="ms-1">{file}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setFieldValue(field.name, '');
                                                                                        setCmecredit18(null);
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
                                                                                                setCmecredit18({ file });
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
                                                                                            <p className='fs-13'>CMEdoc3</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </Files>
                                                                                <small className="text-danger mt-1">
                                                                                    {cmecredit18?.error}
                                                                                </small>
                                                                                {error && <small className="text-danger">{error.toString()}</small>}
                                                                            </>
                                                                        );
                                                                    }}
                                                                </Field>
                                                            </div>
                                                            </div>
                                                            <div className="col">
                                                            <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                <Field name="cmecredit24">
                                                                    {(fieldProps: FieldProps) => {
                                                                        const { field, form } = fieldProps;
                                                                        const error =
                                                                            getValue(form.touched, field.name) &&
                                                                            getValue(form.errors, field.name);
                                                                        const file = cmecredit24?.file
                                                                            ? cmecredit24?.file.name
                                                                            : field.value || null;
                                                                        return file ? (
                                                                            <p className="d-flex align-items-center">
                                                                                <strong>Uploaded:</strong>
                                                                                <span className="ms-1">{file}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setFieldValue(field.name, '');
                                                                                        setCmecredit24(null);
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
                                                                                                setCmecredit24({ file });
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
                                                                                            <p className='fs-13'> CMEdoc4</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </Files>
                                                                                <small className="text-danger mt-1">
                                                                                    {cmecredit24?.error}
                                                                                </small>
                                                                                {error && <small className="text-danger">{error.toString()}</small>}
                                                                            </>
                                                                        );
                                                                    }}
                                                                </Field>
                                                            </div>
                                                            </div>
                                                            <div className="col">
                                                            <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                <Field name="cmecredit30">
                                                                    {(fieldProps: FieldProps) => {
                                                                        const { field, form } = fieldProps;
                                                                        const error =
                                                                            getValue(form.touched, field.name) &&
                                                                            getValue(form.errors, field.name);
                                                                        const file = cmecredit30?.file
                                                                            ? cmecredit30?.file.name
                                                                            : field.value || null;
                                                                        return file ? (
                                                                            <p className="d-flex align-items-center">
                                                                                <strong>Uploaded:</strong>
                                                                                <span className="ms-1">{file}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setFieldValue(field.name, '');
                                                                                        setCmecredit30(null);
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
                                                                                                setCmecredit30({ file });
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
                                                                                            <p className='fs-13'> CMEdoc5</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </Files>
                                                                                <small className="text-danger mt-1">
                                                                                    {cmecredit30?.error}
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

export default RenewalRegistration;

const getValidationSchema = () =>
    objectYup().shape({
     
        reg_date: stringYup()
            .required('Last registration/Renewal Date or Noc Date is required.'),
            
        edu_cert1: stringYup()
            .required('Last Renewal certificate is required.'),
         edu_cert2: stringYup()
            .required('MBBS Certificate is required.'),
        cmecredit_value:stringYup().when(['cmeCreditStatus'],{
            is:(cmeCreditStatus:any)=> (cmeCreditStatus === 'Y'),
            then:stringYup().required('cme credit value is required.'),
            otherwise: stringYup()
        }),
        cmecredit6:stringYup()
        .required('CME Certificate is required.'),
      
    });








































































{/* <select
    value={field.value}
    onChange={(ev) => {
        setFieldTouched(field.name);
        setFieldValue(
            field.name,
            ev.target.value
        );
    }}
    className={`form-select ${error ? 'is-invalid' : ''
        } form-select-sm`}
>
    <option value="">Select</option>
    {examYears.map(
        (item) => (
            <option key={item} value={item}>
                {item}
            </option>
        )
    )}
</select> */}