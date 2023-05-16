import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { date as dateYup, object as objectYup, string as stringYup, number as numberYup } from 'yup';
import { useCallback, useEffect, useState } from 'react';
import getValue from 'lodash/get';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
//@ts-ignore
import Files from 'react-files';
import { College, Country, Qualification, Serials, State, University } from '../../types/common';
import { AddQualFormType,AddQualDataFormType } from '../../types/additionalQuali';
import DoctorInfoCard from './includes/doctor-info';
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
import secureLocalStorage from 'react-secure-storage';


const AdditionalQualificationRegistration = () => {
    const navigate = useNavigate();
    const [next, setNext] = useState(false);
    const [finalSerial, setFinalSerial] = useState<Serials>();
    const [fmrNo, setFMRNo] = useState(0);
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [universities, setUniversities] = useState<University[]>([]);
    const [colleges, setColleges] = useState<College[]>([]);
    const [qualifications, setQualifications] = useState<Qualification[]>([]);
    const [studyCertificate, setStudyCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [DegreeCertificate, setDegreeCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [duration, setDuration] = useState('');
    const [isIndia, setIsIndia] = useState(false);
    const [isPMRDateAbove15M, setIsPMRDateAbove15M] = useState(false);
    const [isPMRDateAbove18M, setIsPMRDateAbove18M] = useState(false);
    const [isTelangana, setIsTelangana] = useState(false);

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
        appliedFor: '',
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
        approval_status:''
    }

    const getProvisionalDetails = useCallback(async () => {
        try {
            const doctorSerialId = LocalStorageManager.getDoctorSerialId();
            if (doctorSerialId) {
                const { data } = await provisionalService.getProvisionalByDoctorId(Number(doctorSerialId));
                if (data.length > 0) {
                    const date = moment(new Date(data[0].reg_date));
                    const currentDate = moment(new Date());
                    const diffMonths = currentDate.diff(date, 'months');
                    console.log('diffMonths' + diffMonths);
                    if (diffMonths > 15) {
                        setIsPMRDateAbove15M(true);
                        if (diffMonths > 18) {
                            setIsPMRDateAbove18M(true);
                        }
                    }
                }
            }
        } catch (err) {
            console.log('error getProvisionalDetails', err);
        }
    }, []);

    const getMtSerials = useCallback(async () => {
        try {
            const { data: fr } = await commonService.getMtSerials('FR');
            if (fr) {
                setFinalSerial({
                    ...fr,
                    created_date: moment(fr.created_date).format('YYYY-MM-DD h:mm:ss'),
                    serial_starts: Number(fr.serial_starts) + 1
                });
                setFMRNo(Number(fr.serial_starts) + 1);
            }
        } catch (err) {
            console.log('error getMtSerials', err);
        } finally {
            //setLoading(false);
        }
    }, [fmrNo]);

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

    useEffect(() => {
        getProvisionalDetails();
        getMtSerials();
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
        async (values: AddQualFormType) => {
            try {
                const doctorId = Number(LocalStorageManager.getDoctorSerialId());
                const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());
                const additionalInfo = {
                    ...values,
                    createdon: moment().format('YYYY-MM-DD'),
                    duration: duration,
                    posttime: moment().format('h:mm:ss'),
                    doctor_id: doctorId && Number(doctorId),
                    prefix: 'TSMC',
                    approval_status: 'pen',
                    row_type: 'on',
                    reg_date: moment().format('YYYY-MM-DD'),
                    doctorPrimaryId:doctorPrimaryId,
                }
                secureLocalStorage.setItem("regType", 'additionalInfo');
                secureLocalStorage.setItem("additionalInfo", additionalInfo);
              
              
                if (studyCertificate?.file) {
                    secureLocalStorage.setItem("additional_study", studyCertificate?.file);
                }
               
                if (DegreeCertificate?.file) {
                    secureLocalStorage.setItem("additional_Degree", DegreeCertificate?.file);
                }
                navigate(routes.payment, {state:{doctor_id:Number(doctorId),regType:'additionalInfo'}});
             
                
                
              {/*
                const { success } = await additionalService.additionalRegistration(formData);
                if (success) {
                    setStudyCertificate(null);
                    setDegreeCertificate(null);
                    Swal.fire({
                        title: "Success",
                        text: "Additional registration successfully completed",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            const doctorMobileno = LocalStorageManager.getDoctorMobileno();
                            if (doctorMobileno) {
                                await authService.sendSMS(doctorMobileno, 'Your Application Submitted for Additional Qualification Registration to Telangana State Medical Council is under Process.').then((response) => {

                                }).catch(() => {

                                });
                            }
                            navigate(routes.userpanal);
                        }
                    });
                }*/}
            } catch (err) {
                Swal.fire({
                    text: "Additional registeration failed",
                    icon: "error",
                    confirmButtonText: "OK",
                })
            }
        },
        [ studyCertificate,  DegreeCertificate,  finalSerial, fmrNo]
    );

    const getValidationSchema = () =>
        objectYup().shape({
            country: stringYup()
                .required('Country is required.'),
            state: stringYup()
                .required('State is required.'),
            university: stringYup()
                .required('University Name is required.'),
            college: stringYup()
                .required('College Name is required.'),
            qualification: stringYup()
                .required('Qualification is required.'),
            exam_month: stringYup()
                .required('Exam Month is required.'),
            exam_year: stringYup()
                .required('Exam year is required.')
                .min(4, 'Exam year must 4 numbers.'),
            appliedFor: stringYup()
            .required('applied For is required.'),    
            edu_cert1: stringYup()
                .required('Study certificate is required.'),
            edu_cert2: stringYup().when(['country', 'state'], {
                is: (country: any, state: any) => ((country != 101) || (country == 101 && state == 36 && isPMRDateAbove15M)),
                then: stringYup().required('Degree is required.'),
                otherwise: stringYup()
            }),
           
        });

    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
                    {!next && <div className="col-9 m-auto">
                        <div className="card shadow border-0 mb-4">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <h1 className='fs-22 fw-700 me-2 mb-0'>Additional Qualification Registration</h1>
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
                    }

                    
                {next &&  <div className="col-9 m-auto">
                            <div className="card shadow border-0 mb-4">
                                <div className="card-body">
                                    <h1 className='fs-22 fw-700'>Educational Institution Details</h1>
                                    <hr />
                                    <Formik
                                        onSubmit={submitForm}
                                        enableReinitialize
                                        initialValues={initialFormData}
                                        validationSchema={getValidationSchema()}
                                    >
                                        {(formikProps: FormikProps<AddQualFormType>) => {
                                            const { errors, isValid, handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm, values } = formikProps;

                                            return (
                                                <>
                                                    {/* {!isValid && JSON.stringify(errors)} */}
                                                    <form onSubmit={handleSubmit}>
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
                                                                                        setStates([]);
                                                                                        getStates(id);
                                                                                        if (name === 'India') {
                                                                                            setIsIndia(true);
                                                                                        } else {
                                                                                            setIsIndia(false);
                                                                                        }
                                                                                    }}
                                                                                    getOptionLabel={(option) => option.name}
                                                                                    getOptionValue={(option) => option.id.toString()}
                                                                                    tabIndex={1}
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
                                                                                        setUniversities([]);
                                                                                        getUniversityNames(id);
                                                                                        if (name === 'Telangana') {
                                                                                            setIsTelangana(true);
                                                                                        } else {
                                                                                            setIsTelangana(false);
                                                                                        }
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
                                                                                        setColleges([]);
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
                                                            <Field name="appliedFor">
                                                                    {(fieldProps: FieldProps) => {
                                                                        const { field, form } = fieldProps;
                                                                        const error =
                                                                            getValue(form.touched, field.name) &&
                                                                            getValue(form.errors, field.name);
                                                                        return (
                                                                            <>
                                                                        <label className="mb-2">AppliedFor </label>
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
                                                                    <option value="">Select </option>
                                                                    <option value="Diploma">Diploma</option>
                                                                    <option value="Post Graduation">Post Graduation</option>
                                                                    <option value="Super Speciality">Super Speciality</option>
                                                                </select>
                                                                {error && <small className="text-danger">{error.toString()}</small>}
                                                                            </>
                                                                            );
                                                                        }}
                                                                    </Field>
                                                               
                                                          </div>
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
                                                                                <input
                                                                                    type="text"
                                                                                    value={field.value}
                                                                                    onChange={(ev) => {
                                                                                        setFieldTouched(field.name);
                                                                                        setFieldValue(
                                                                                            field.name,
                                                                                            ev.target.value
                                                                                        );
                                                                                    }}
                                                                                    className={`form-control form-control-sm ${error ? 'is-invalid' : ''
                                                                                        }`}
                                                                                    placeholder="Enter Qualification"
                                                                                    
                                                                                />
                                                                                {error && <small className="text-danger">{error.toString()}</small>}
                                                                            </>
                                                                        );
                                                                    }}
                                                                </Field>
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
                                                                                <label className="mb-2"> Month</label>
                                                                                <select
                                                                                    value={field.value}
                                                                                    onChange={(ev) => {
                                                                                        setFieldTouched(field.name);
                                                                                        setFieldValue(
                                                                                            field.name,
                                                                                            ev.target.value
                                                                                        );
                                                                                        if (ev.target.value && values.exam_year.toString().length === 4) {
                                                                                            const getDuration = dateDuration(Number(values.exam_year), ev.target.value);
                                                                                            getDuration && setDuration(getDuration);
                                                                                        }
                                                                                        else {
                                                                                            setDuration('');
                                                                                        }
                                                                                    }}
                                                                                    className={`form-select ${error ? 'is-invalid' : ''
                                                                                        }`}>
                                                                                    <option value="">Select Month</option>
                                                                                    <option value="JAN">January</option>
                                                                                    <option value="FEB">February</option>
                                                                                    <option value="MAR">March</option>
                                                                                    <option value="APR">April</option>
                                                                                    <option value="MAY">May</option>
                                                                                    <option value="JUN">June</option>
                                                                                    <option value="JUL">July</option>
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
                                                                                <label className="mb-2">Year</label>
                                                                                <input
                                                                                    type="text"
                                                                                    value={field.value}
                                                                                    onChange={(ev) => {
                                                                                        setFieldTouched(field.name);
                                                                                        setFieldValue(
                                                                                            field.name,
                                                                                            ev.target.value
                                                                                        );
                                                                                    }}
                                                                                    className={`form-control form-control-sm ${error ? 'is-invalid' : ''
                                                                                        }`}
                                                                                    placeholder="Enter exam year"
                                                                                    tabIndex={7} minLength={4} maxLength={4}
                                                                                />
                                                                                {error && <small className="text-danger">{error.toString()}</small>}
                                                                            </>
                                                                        );
                                                                    }}
                                                                </Field>
                                                            </div>
                                                            
                                                            </div >
                                                        </div>
                                                        <div className="row mb-2 mt-4">
                                                           
                                                            <div className="col-4 mt-3">
                                                                <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                    <Field name="edu_cert1">
                                                                        {(fieldProps: FieldProps) => {
                                                                            const { field, form } = fieldProps;
                                                                            const error =
                                                                                getValue(form.touched, field.name) &&
                                                                                getValue(form.errors, field.name);
                                                                            const file = studyCertificate?.file
                                                                                ? studyCertificate?.file.name
                                                                                : field.value || null;
                                                                            return file ? (
                                                                                <p className="d-flex align-items-center">
                                                                                    <strong>Uploaded:</strong>
                                                                                    <span className="ms-1">{file}</span>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            setFieldValue(field.name, '');
                                                                                            setStudyCertificate(null);
                                                                                        }}
                                                                                        title='Delete'
                                                                                        className="ms-2 lh-1 lt-file-del-btn"
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
                                                                                                    setStudyCertificate({ file });
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
                                                                                            <p className='fs-13'>Study Certificate</p>
                                                                                        </div>
                                                                                    </Files>
                                                                                    <small className="text-danger mt-1">
                                                                                        {studyCertificate?.error}
                                                                                    </small>
                                                                                    {error && <small className="text-danger">{error.toString()}</small>}
                                                                                </>
                                                                            );
                                                                        }}
                                                                    </Field>
                                                                </div>
                                                            </div>
                                                            
                                                            {(!isIndia || (isIndia && isTelangana)) &&
                                                                <div className="col-4 mt-3">
                                                                    <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                        <Field name="edu_cert2">
                                                                            {(fieldProps: FieldProps) => {
                                                                                const { field, form } = fieldProps;
                                                                                const error =
                                                                                    getValue(form.touched, field.name) &&
                                                                                    getValue(form.errors, field.name);
                                                                                const file = DegreeCertificate?.file
                                                                                    ? DegreeCertificate?.file.name
                                                                                    : field.value || null;
                                                                                return file ? (
                                                                                    <p className="d-flex align-items-center ms-3">
                                                                                        <strong>Uploaded:</strong>
                                                                                        <span className="ms-1">{file}</span>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => {
                                                                                                setFieldValue(field.name, '');
                                                                                                setDegreeCertificate(null);
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
                                                                                                        setDegreeCertificate({ file });
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
                                                                                                <p className='fs-13'>Degree Certificate</p>
                                                                                            </div>
                                                                                        </Files>
                                                                                        <small className="text-danger mt-1">
                                                                                            {DegreeCertificate?.error}
                                                                                        </small>
                                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                                    </>
                                                                                );
                                                                            }}
                                                                        </Field>
                                                                    </div>
                                                                </div>
                                                            }
                                                            
                                                        </div>

                                                        <div className="w-100 text-end mt-3">
                                                            {/* isValid? setNext(false):setNext(true) */}
                                                            <button type='button' onClick={() => { setNext(false) }} className='btn btn-primary me-3'><i className="bi-chevron-left"></i>Back </button>
                                                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                                                {isSubmitting && <span className="spinner-border spinner-border-sm" />} Submit
                                                            </button>
                                                        </div>
                                                    </form>
                                                </>
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

export default AdditionalQualificationRegistration;