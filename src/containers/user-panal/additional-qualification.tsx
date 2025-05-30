import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { date as dateYup, object as objectYup, string as stringYup, number as numberYup } from 'yup';
import { useCallback, useEffect, useState, useRef } from 'react';
import getValue from 'lodash/get';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
//@ts-ignore
import Files from 'react-files';
import { College, Country, Qualification, Serials, State, University } from '../../types/common';
import { AddQualFormType, AddQualDataFormType } from '../../types/additionalQuali';
import DoctorInfoCard from './includes/doctor-info';
import { ReactFilesError, ReactFilesFile } from '../../types/files';
import { isLessThanTheMB } from '../../lib/utils/lessthan-max-filesize';
import { Messages } from '../../lib/constants/messages';
import { commonService } from '../../lib/api/common';
import Swal from 'sweetalert2';
import { routes } from '../routes/routes-names';

import { LocalStorageManager } from '../../lib/localStorage-manager';

import { dateDuration } from '../../lib/utils/dateDuration';
import { provisionalService } from '../../lib/api/provisional';
import moment from 'moment';

import secureLocalStorage from 'react-secure-storage';
import DatePicker from 'react-date-picker';
import Appointments from '../user-panal/Appointments';
import { slotbookingService } from '../../lib/api/slotbooking';


const AdditionalQualificationRegistration = () => {
    const navigate = useNavigate();
    const [next, setNext] = useState<String>("docInfo");
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
    const [additionalRequestType, setAdditionalRequestType] = useState<string>('nor');
    const [calc_date, setCalc_date] = useState(new Date());
    const [slotValue, setSlotValue] = useState<any>("");
    const formikRef = useRef<any>(null);

    const updateSlotValue = async (slotdate: any, slottime: any) =>   {
        setSlotValue("");
        let day = slotdate.getDate();
        let month = slotdate.getMonth() + 1;
        let year = slotdate.getFullYear();

        const slotDate = `${day}_${month}_${year}_${slottime}`;
        //   alert(slotDate+slottime);
        console.log(slotDate);
        setSlotValue(slotDate);
    };


    const initialFormData = {
        country: 0,
        state: 0,
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
        approval_status: '',
        calc_date: ''
    }

    const saveSlot = useCallback(async () => {
        try{
            console.log('slotValue',slotValue);
            const parts = slotValue.split('_');
            let day=parts[0];
            let month=parts[1];
            let year=parts[2];
            let slottime= parts[3];
           let slotdate=`${day}-${month}-${year}`;
            console.log('slottime',slottime);
            console.log('slotdate',slotdate);
            const doctor_id = LocalStorageManager.getDoctorSerialId();
            const { data } = await slotbookingService.validateSlot(slotdate,slottime);
            if(data === "SUCCESS"){
                console.log('slot data ', data);
                secureLocalStorage.setItem("additionalInfo_slotValue", slotValue);
                navigate(routes.payment, { state: { doctor_id: Number(doctor_id), regType: 'additionalInfo' } });
            }else{
                Swal.fire({
                    text: data,
                    icon: "warning",
                    confirmButtonText: "OK",
                })
            }

            } catch (err) {
            console.log('error saveSlot', err);
          } finally {
            //setLoading(false);
        }
    }, [slotValue]);

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
                console.log('in submitForm');
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
                    calc_date: moment(values.calc_date).format('YYYY-MM-DD'),
                    extra_col1: additionalRequestType,
                    doctorPrimaryId: doctorPrimaryId,
                    slotDateTime: slotValue
                }
                secureLocalStorage.setItem("regType", 'additionalInfo');
                secureLocalStorage.setItem("additionalInfo", additionalInfo);


                if (studyCertificate?.file) {
                    secureLocalStorage.setItem("additional_study", studyCertificate?.file);
                }

                if (DegreeCertificate?.file) {
                    secureLocalStorage.setItem("additional_Degree", DegreeCertificate?.file);
                }
              
                if(additionalRequestType==='tat'){
                    secureLocalStorage.removeItem("additionalInfo_slotValue");
                    navigate(routes.payment, { state: { doctor_id: Number(doctorId), regType: 'additionalInfo' } });
                }else{
                    setNext("slotInfo");
                }


            } catch (err) {
                Swal.fire({
                    text: "Additional registeration failed",
                    icon: "error",
                    confirmButtonText: "OK",
                })
            }
        },
        [studyCertificate, DegreeCertificate, finalSerial, fmrNo]
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
            calc_date: stringYup()
                .required('Date of Issue of Degree is required.'),
            exam_year: stringYup()
                .required('Exam year is required.')
                .min(4, 'Exam year must 4 numbers.'),
            appliedFor: stringYup()
                .required('applied For is required.'),
            edu_cert1: stringYup()
                .required('Study certificate is required.'),
            edu_cert2: stringYup().required('Degree is required.'),


        });

    const getTatkalUpdate = useCallback(async (value: any) => {
        try {
            if (value !== 'nor') {
                const {data} = await slotbookingService.getTatkalCurrentStatus();
                if (data === "YES") {
                    Swal.fire({
                        text: "You have selected Tatkal Service ,Additional charges applicable",
                        icon: "warning",
                        confirmButtonText: "OK",
                    })
                    setAdditionalRequestType('tat');
                } else {
                    Swal.fire({
                        text: "TatKal Not allowed for Today (or) Day limit Reached",
                        icon: "warning",
                        confirmButtonText: "OK",
                    })
                    setAdditionalRequestType('nor');
                }
            } else {
                setAdditionalRequestType('nor');
            }
        } catch (err) {
            console.log('error countries getList', err);
        }
    }, []);

    
    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
                    {next === 'docInfo' && <div className="col-9 m-auto">
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
                                <button type='submit' onClick={() => setNext("edInfo")} className='btn btn-primary'>Next <i className="bi-chevron-right"></i></button>
                            </div>
                        </div>
                    </div>
                    }


                    {next === "edInfo" && <div className="col-9 m-auto">
                        <div className="card shadow border-0 mb-4">
                            <div className="card-body">
                                <h1 className='fs-22 fw-700 me-2 mb-0'> Additional Qualification Registration</h1>
                                <h1 className='fs-22 fw-700'>Educational Institution Details</h1>
                                <hr />
                                <Formik
                                    onSubmit={submitForm}
                                    innerRef={formikRef} 
                                    enableReinitialize
                                    initialValues={initialFormData}
                                    validationSchema={getValidationSchema()}
                                >
                                    {(formikProps: FormikProps<AddQualFormType>) => {
                                        const { errors, isValid, handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm, values, validateForm, setTouched,
                                            setErrors } = formikProps;

                                        return (
                                            <>
                                                {/* {!isValid && JSON.stringify(errors)} */}
                                                <form onSubmit={handleSubmit}>
                                                    <div className="row mb-2">
                                                        <div className="col-sm-auto">
                                                            <label className="mb-2">Qualification Request Type</label>
                                                            <select
                                                                value={additionalRequestType}
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
                                                                                <option value="DIPLOMA">DIPLOMA</option>
                                                                                <option value="POST GRADUATION">POST GRADUATION</option>
                                                                                <option value="SUPER SPECIALITY">SUPER SPECIALITY</option>
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
                                                            <div className="row mb-2">
                                                                <div className="col-sm-auto">
                                                                    <label htmlFor="CalcDate">Enter Date of Issue of Degree</label>
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
                                                                                        onFocus={e => e.target.blur()}
                                                                                        maxDate={new Date()}
                                                                                        clearIcon={null}
                                                                                        value={calc_date}
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

                                                    </div>
                                                    <div className="row mb-2 mt-4">
                                                        <div className='text-danger fs-10'>
                                                            Please upload images (.jpeg,.png) only, with less than 200 KB size.
                                                        </div>
                                                        <div className='text-danger fs-10'>
                                                            File name should not contain any special charaters and should have less than 20 character length.
                                                        </div>
                                                    </div>
                                                    <div className="row mb-2 mt-4 align-items-center justify-content-center">
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
                                                                                        if (field.value) {
                                                                                            setFieldValue(field.name, '');
                                                                                            setStudyCertificate(null);
                                                                                        }
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
                                                                                    accepts={['.jpeg', '.jpg', '.png']}
                                                                                    clickable
                                                                                >
                                                                                    <div className="drag-drop-box mt-3">
                                                                                        <div className="text-center">
                                                                                            <i className="bi-file-earmark-break fs-32"></i>

                                                                                            <p className='fs-13'>Upload Study Certificate</p>
                                                                                        </div>
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

                                                        <div className="row mb-2 mt-4 align-items-center justify-content-center">
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
                                                                                <p className="d-flex align-items-center">
                                                                                    <strong>Uploaded:</strong>
                                                                                    <span className="ms-1">{file}</span>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            if (field.value) {
                                                                                                setFieldValue(field.name, '');
                                                                                                setDegreeCertificate(null);
                                                                                            }
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
                                                                                        accepts={['.jpeg', '.jpg', '.png']}
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
                                                                                        {DegreeCertificate?.error}
                                                                                    </small>
                                                                                    {error && <small className="text-danger">{error.toString()}</small>}
                                                                                </>
                                                                            );
                                                                        }}
                                                                    </Field>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="w-100 text-end mt-3">
                                                        {/* isValid? setNext(false):setNext(true) */}
                                                        <button type='button' onClick={() => { setNext("docInfo") }} className='btn btn-primary me-3'><i className="bi-chevron-left"></i>Back </button>
                                                        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                                                            {isSubmitting && <span className="spinner-border spinner-border-sm" />} Next
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

                {next === "slotInfo" && <div>
                    <div className="col-9 m-auto">
                        <div className="card shadow border-0 mb-4">
                            <div className="card-body">
                                <Appointments method={updateSlotValue}></Appointments>
                                <div className="w-100 text-end mt-3">
                                    <button type="button" id="printPageButton" onClick={() => { navigate(routes.userpanal); }} className="btn btn-primary">Back to Profile</button>
                                    <button
                                        type="button"
                                         className='btn btn-primary ml-3'
                                        onClick={() => {
                                            saveSlot();
                                        }}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                }
            </section>
        </>
    )
};

export default AdditionalQualificationRegistration;