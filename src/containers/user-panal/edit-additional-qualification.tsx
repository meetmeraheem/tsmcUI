import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { date as dateYup, object as objectYup, string as stringYup, number as numberYup } from 'yup';
import { useCallback, useEffect, useState, useMemo } from 'react';
import getValue from 'lodash/get';
import Select from 'react-select';
import { useNavigate,useLocation } from "react-router-dom";
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
import { dateDuration } from '../../lib/utils/dateDuration';
import moment from 'moment';
import { authService } from '../../lib/api/auth';
import { AdminAddQualDataFormType} from '../../types/additionalQuali';



const EditAdditionalQualificationRegistration = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { additionalPrimaryId} = location.state
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [universities, setUniversities] = useState<University[]>([]);
    const [colleges, setColleges] = useState<College[]>([]);
    const [qualifications, setQualifications] = useState<Qualification[]>([]);
    const [additionals, setAdditionals] = useState<AddQualFormType>();
    const [studyCertificate, setStudyCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [DegreeCertificate, setDegreeCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [duration, setDuration] = useState('');
    const [isIndia, setIsIndia] = useState(false);
    const [isTelangana, setIsTelangana] = useState(false);

    const initialFormData =  useMemo(
        () => ({
        country: Number(additionals?.country) || 0,
        state:Number(additionals?.state) ||0,
        university: additionals?.university || '',
        college: additionals?.college || '',
        qualification :additionals?.qualification || '',
        exam_month: additionals?.exam_month || '',
        exam_year: additionals?.exam_year || '',
        duration: additionals?.duration || '',
        edu_cert1: additionals?.edu_cert1 || '',
        edu_cert2: additionals?.edu_cert2 || '',
        appliedFor: additionals?.appliedFor || '',
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

    }),
    [additionals]
);

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
        getAdditionalDetails();
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
                return data;
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
    const getAdditionalDetails = useCallback(async () => {
        try {
            if (additionalPrimaryId) {
                const { data } = await additionalService.getQualificationById(additionalPrimaryId);
                if (data.length > 0) {
                    const country = await commonService.getCountry(Number(data[0].country));
                    const state = await commonService.getState(Number(data[0].state));
                    setAdditionals({

                        country: data[0].country,
                        state: data[0].state,
                        university: data[0].university,
                        college: data[0].college,
                        qualification: data[0].qualification,
                        exam_month: data[0].exam_month,
                        exam_year: data[0].exam_year,
                        duration:data[0].duration,
                        edu_cert1:data[0].edu_cert1,
                        edu_cert2:data[0].edu_cert2,
                        appliedFor: data[0].appliedFor,
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
                       
                    });
                    setDuration(data[0]?.duration);
                    getStates(data[0]?.country);
                    const universityList = await getUniversityNames(data[0]?.state);
                    const univerOBJ = universityList.filter((obj: any) => obj.university == data[0]?.university);
                    getColleges(univerOBJ[0].id);
                }
            }
        } catch (err) {
            console.log('error getAdditionalDetails', err);
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
                const formData = new FormData();
                formData.append("additionalInfo", JSON.stringify(additionalInfo));
                
              
              
                if (studyCertificate?.file) {
                    formData.append("study", studyCertificate?.file);
                }
               
                if (DegreeCertificate?.file) {
                    formData.append("Degree", DegreeCertificate?.file);
                }
              
                const { success } = await additionalService.editQualification(additionalPrimaryId,formData);
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
                }
            } catch (err) {
                Swal.fire({
                    text: "Additional registeration failed",
                    icon: "error",
                    confirmButtonText: "OK",
                })
            }
        },
        [ studyCertificate,  DegreeCertificate]
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
            edu_cert2: stringYup() 
                .required('Degree is required.')
            });
           
        

    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
              <div className="col-9 m-auto">
                            <div className="card shadow border-0 mb-4">
                                <div className="card-body">
                                    <h1 className='fs-18 fw-700'>Additional Educational Institution Details</h1>
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
                                                                                    value={countries.find(
                                                                                        (item) => item.id === field.value
                                                                                    )}
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
                                                                                    value={states.find(
                                                                                        (item) => item.id === field.value
                                                                                    )}
                                                                                   
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
                                                                                    value={universities.find(
                                                                                        (item) => item.university === field.value
                                                                                    )}
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
                                                                                    value={colleges.find(
                                                                                        (item) => item.college === field.value
                                                                                    )}
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
                </div>
            </section>
        </>
    )
};

export default EditAdditionalQualificationRegistration;