import { Field, FieldProps, Formik, FormikProps } from "formik";
import { object as objectYup, string as stringYup, number as numberYup } from 'yup';
import getValue from 'lodash/get';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
//@ts-ignore
import Files from 'react-files';
import secureLocalStorage from "react-secure-storage";
import Swal from "sweetalert2";
import moment from "moment";
import { ProvisionalFormType } from "../../types/provisional";
import DoctorInfoCard from "./includes/doctor-info";
import { ReactFilesError, ReactFilesFile } from "../../types/files";
import { useCallback, useEffect, useState } from "react";
import { commonService } from "../../lib/api/common";
import { College, Country, Qualification, Serials, State, University } from "../../types/common";
import { routes } from "../routes/routes-names";
import { isLessThanTheMB } from "../../lib/utils/lessthan-max-filesize";
import { Messages } from "../../lib/constants/messages";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import DatePicker from 'react-date-picker';

const ProvisionalRegistration = () => {
    const navigate = useNavigate();
    const [next, setNext] = useState(false);
    const [qualifications, setQualifications] = useState<Qualification[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [universities, setUniversities] = useState<University[]>([]);
    const [colleges, setColleges] = useState<College[]>([]);
    const [provisionalCertificate, setProvisionalCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [applicationForm, setApplicationForm] = useState<{ file?: File; error?: string } | null>(null);
    const [nocCertificate, setNOCCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [provisionalRequestType, setProvisionalRequestType] = useState<string>('nor');
    const [localRequestType, setLocalRequestType] = useState<string>('telangana');
    const [calc_date, setCalc_date] = useState(new Date());

    const initialFormData = {
        doctor_id: 0,
        qualification: '',
        exam_month: '',
        exam_year: '',
        country: '',
        state: '',
        university: '',
        college: '',
        edu_cert1: '',
        edu_cert2: '',
        edu_cert3: '',
        calc_date:''
    }

    const getQualifications = useCallback(async () => {
        try {
            const { data } = await commonService.getQualifications();
            if (data.length > 0) {
                setQualifications(data);
            }
        } catch (err) {
            console.log('error qualifications getList', err);
        } finally {
            //setLoading(false);
        }
    }, []);

    const getCountries = useCallback(async () => {
        try {
            const { data } = await commonService.getCountries();
            if (data.length) {
                setCountries(data);
                setStates([]);
            }
        } catch (err) {
            console.log('error countries getList', err);
        } finally {
            //setLoading(false);
        }
    }, []);


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


    useEffect(() => {
        Swal.fire({
            text: "Doctors who completed the degree and about to start their internship should register for provisional.",
            icon: "warning",
            confirmButtonText: "OK",
        })
        getQualifications();
        getCountries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getStates = useCallback(async (countryId: any) => {
        try {
            const { data } = await commonService.getStatesByCountryId(countryId);
            if (data.length) {
                setStates(data);
            }
        } catch (err) {
            console.log('error states getList', err);
        }
    }, []);

    const getUniversityNames = useCallback(async (stateId: any) => {
        try {
            const { data } = await commonService.getUniversitiesByStateId(stateId);
            if (data.length > 0) {
                setUniversities(data);
                setColleges([]);
            }
        } catch (err) {
            console.log('error university getList', err);
        }
    }, []);

    const getColleges = useCallback(async (universityId: any) => {
        try {
            const { data } = await commonService.getCollegesByUniversityId(universityId);
            if (data.length > 0) {
                setColleges(data);
            }
        } catch (err) {
            console.log('error colleges getList', err);
        }
    }, []);

    const submitForm = useCallback(
        async (values: ProvisionalFormType) => {
            try {
                const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());
                const doctorId = Number(LocalStorageManager.getDoctorSerialId());
                const provisionalInfo = {
                    ...values,
                    createdon: moment().format('YYYY-MM-DD'),
                    posttime: moment().format('h:mm:ss'),
                    doctor_id: doctorId && Number(doctorId),
                    prefix: 'TSMC',
                    approval_status: 'pen',
                    row_type: 'on',
                    reg_date: moment().format('YYYY-MM-DD'),
                    calc_date: moment(values.calc_date).format('YYYY-MM-DD'),
                    extra_col1:provisionalRequestType,
                    doctorPrimaryId:doctorPrimaryId,
                }
               
                secureLocalStorage.setItem("regType", 'provisional');
                secureLocalStorage.setItem("provisionalInfo", provisionalInfo);
                if (provisionalCertificate?.file) {
                    secureLocalStorage.setItem("pc", provisionalCertificate?.file);
                }
                if (applicationForm?.file) {
                    secureLocalStorage.setItem("af", applicationForm?.file);
                }
                if (nocCertificate?.file) {
                    secureLocalStorage.setItem("noc", nocCertificate?.file);
                }
                navigate(routes.payment, {state:{doctor_id:Number(doctorId),regType:'provisional'}});
                
            } catch (err) {
                Swal.fire({
                    //title: "Error",
                    text: "Provisional registered failed",
                    icon: "error",
                    confirmButtonText: "OK",
                })
                console.log('error in provisional registeration update', err);
            }
        },
        [ provisionalCertificate, applicationForm]
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
                                        <h1 className='fs-22 fw-700 me-2 mb-0'>Provisional Registration</h1>
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
                                        <h1 className='fs-22 fw-700 text-nowrap'>Provisional Registration</h1>
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
                                        {(formikProps: FormikProps<ProvisionalFormType>) => {
                                            const { isValid, handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm } = formikProps;

                                            return (
                                                <form onSubmit={handleSubmit}>
                                                    <div className="row mb-2">
                                                    <div className="col-sm-auto">
                                                            <label className="mb-2"> Local/Non Local</label>
                                                            <select
                                                                value={localRequestType}
                                                                onChange={(ev) => {
                                                                    if(ev.target.value==='non-telangana'){
                                                                        Swal.fire({
                                                                            //title: "Error",
                                                                            text: "Provisional Not allowed for Other States",
                                                                            icon: "error",
                                                                            confirmButtonText: "OK",
                                                                         }).then(async (result) => {
                                                                            if (result.isConfirmed) {
                                                                                navigate(routes.userpanal);
                                                                            }
                                                                        });
                                                                    }else{
                                                                    setLocalRequestType(ev.target.value);
                                                                     }
                                                                }}
                                                                className="form-select"
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="telangana">Telangana</option>
                                                                <option value="non-telangana">Non Telangana</option>
                                                                <option value="other-country">Other countries</option>
                                                            </select>
                                                        </div>
                                                    <div className="col-sm-auto">
                                                            <label className="mb-2">Provisional Request Type</label>
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
                                                        <div className="col">
                                                            <Field name="exam_month">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <label className="mb-2">Exam Month</label>
                                                                            <select
                                                                                value={field.value}
                                                                                onChange={(ev) => {
                                                                                    setFieldTouched(field.name);
                                                                                    setFieldValue(
                                                                                        field.name,
                                                                                        ev.target.value
                                                                                    );
                                                                                }}
                                                                                className={`form-select ${error ? 'is-invalid' : ''
                                                                                    }`}
                                                                            >
                                                                                <option value="">Select Month</option>
                                                                                <option value="JAN">January</option>
                                                                                <option value="FEB">February</option>
                                                                                <option value="MAR">March</option>
                                                                                <option value="APR">April</option>
                                                                                <option value="MAY">May</option>
                                                                                <option value="JUNE">June</option>
                                                                                <option value="JULY">July</option>
                                                                                <option value="AUG">August</option>
                                                                                <option value="SEP">September</option>
                                                                                <option value="OCT">October</option>
                                                                                <option value="NOV">November</option>
                                                                                <option value="DEC">December</option>
                                                                            </select>
                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>

                                                    
                                                        <div className="col">
                                                            <Field name="exam_year">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <label className="mb-2">Exam Year</label>
                                                                            <input
                                                                                type="text"
                                                                                value={field.value}
                                                                                onChange={(ev) => {
                                                                                    setFieldTouched(field.name);
                                                                                    setFieldValue(field.name, Number(ev.target.value));
                                                                                }}
                                                                                className={`form-control ${error ? 'is-invalid' : ''
                                                                                    }`}
                                                                                placeholder="Enter exam year"
                                                                                maxLength={4}
                                                                            />

                                                                            {error && <small className="text-danger">{error.toString()}</small>}


                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>
                                                        
                                                        <div className="row mb-2">
                                                        <div className="col">
                                                            <Field name="country">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <label className="mb-2">Country</label>
                                                                            <Select
                                                                                name="Country"
                                                                                className="react-select"
                                                                                classNamePrefix="react-select"
                                                                                isSearchable
                                                                                options={countries}
                                                                                placeholder="Select country"
                                                                                onChange={(selectedOption) => {
                                                                                    const { id, name } =
                                                                                        selectedOption as Country;
                                                                                    setFieldTouched(field.name);
                                                                                    setFieldValue(field.name, id);
                                                                                    getStates(id);
                                                                                }}
                                                                                getOptionLabel={(option) => option.name}
                                                                                getOptionValue={(option) => option.id.toString()}
                                                                            />
                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>

                                                    
                                                    
                                                        <div className="col">
                                                            <Field name="state">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <label className="mb-2">State</label>
                                                                            <Select
                                                                                name="state"
                                                                                className="react-select"
                                                                                classNamePrefix="react-select"
                                                                                isSearchable
                                                                                options={states}
                                                                                placeholder="Select state"
                                                                                onChange={(selectedOption) => {
                                                                                    const { id, name } =
                                                                                        selectedOption as State;
                                                                                    setFieldTouched(field.name);
                                                                                    setFieldValue(field.name, id);
                                                                                    getUniversityNames(id);
                                                                                }}
                                                                                getOptionLabel={(option) => option.name}
                                                                                getOptionValue={(option) => option.id.toString()}
                                                                            />
                                                                            {error && <small className="text-danger">{error.toString()}</small>}


                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>
                                                       </div> 
                                                        <div className="row mb-2">
                                                        <div className="col">
                                                            <Field name="university">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <label className="mb-2">University Name</label>
                                                                            <Select
                                                                                name="university"
                                                                                className="react-select"
                                                                                classNamePrefix="react-select"
                                                                                isSearchable
                                                                                options={universities}
                                                                                placeholder="Select university"
                                                                                onChange={(selectedOption) => {
                                                                                    const { id, university } =
                                                                                        selectedOption as University;
                                                                                    setFieldTouched(field.name);
                                                                                    setFieldValue(field.name, university);
                                                                                    getColleges(id);
                                                                                }}
                                                                                getOptionLabel={(option) => option.university}
                                                                                getOptionValue={(option) => option.id.toString()}
                                                                            />
                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>

                                                        <div className="col">
                                                            <Field name="college">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <label className="mb-2">College Name</label>
                                                                            <Select
                                                                                name="collegeName"
                                                                                className="react-select"
                                                                                classNamePrefix="react-select"
                                                                                isSearchable
                                                                                options={colleges}
                                                                                placeholder="Select college"
                                                                                onChange={(selectedOption) => {
                                                                                    const { id, college } =
                                                                                        selectedOption as College;
                                                                                    setFieldTouched(field.name);
                                                                                    setFieldValue(field.name, college);
                                                                                }}
                                                                                getOptionLabel={(option) => option.college}
                                                                                getOptionValue={(option) => option.id.toString()}
                                                                            />
                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>
                                                       </div> 
                                                        <div className="row mb-2">
                                                        <div className="col">
                                                            <Field name="qualification">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <label className="mb-2">Qualification</label>
                                                                            <Select
                                                                                name="qualification"
                                                                                className="react-select"
                                                                                classNamePrefix="react-select"
                                                                                isSearchable
                                                                                options={qualifications}
                                                                                placeholder="Select Qualification"
                                                                                onChange={(selectedOption) => {
                                                                                    const { id, name } =
                                                                                        selectedOption as Qualification;
                                                                                    setFieldTouched(field.name);
                                                                                    setFieldValue(field.name, id);
                                                                                   
                                                                                }}
                                                                                getOptionLabel={(option) => option.name}
                                                                                getOptionValue={(option) => option.id.toString()}
                                                                            />
                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>
                                                       
                                                        <div className="col">
                                                        <label htmlFor="CalcDate">Enter Provisional Certificate Issue Date</label>
                                                        <Field name="calc_date">
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
                                                                                        setCalc_date(date);
                                                                                    }}
                                                                                    maxDate={new Date()}
                                                                                    clearIcon={null}
                                                                                    value={calc_date}
                                                                                    onFocus={e => e.target.blur()}
                                                                                    className={`form-control ${error ? 'is-invalid' : ''}`}
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
                                                    <div className="d-flex  justify-content-center my-2">
                                                        <div className="col-3 pe-3 drag-img-box ">
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
                                                                                            <p className='fs-13'>Upload Provisional Certificate</p>
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
                                                        </div>
                                                        <div className="row mb-2 mt-4">
                                                        <div className="d-flex  justify-content-center">
                                                        <div className="col-3 pe-3 drag-img-box">
                                                           
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
                                                                                            {(localRequestType === 'other-country')?
                                                                                            <p className='fs-13'>Upload Marks List</p>:
                                                                                            <p className='fs-13'>Upload Date of Birth proof</p>
                                                                                            }
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
                                                        <div className="row mb-2 mt-4">
                                                        <div className=" d-flex  justify-content-center">
                                                        <div className="col-3 pe-3 drag-img-box">
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
                                                                                            <p className='fs-13'>Upload NOC</p>
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

export default ProvisionalRegistration;

const getValidationSchema = () =>
    objectYup().shape({
        qualification: stringYup()
            .required('Qualification is required.'),
        exam_month: stringYup()
            .required('Exam Month is required.'),
        exam_year: stringYup()
            .required('Exam year is required.')
            .min(4, 'Exam year must 4 numbers.'),
        country: stringYup()
            .required('Country is required.'),
        state: stringYup()
            .required('State is required.'),
        university: stringYup()
            .required('University Name is required.'),
        college: stringYup()
            .required('College Name is required.'),
        calc_date: stringYup()
            .required('Provisional Certifiate Issue Date is required.'),     
        edu_cert1: stringYup()
            .required('Provisional certificate is required.'),
        edu_cert2: stringYup()
            .required('Date of Birth proof is required.'),
       /* edu_cert3: stringYup()
            .required('NOC is required.')*/
    });

