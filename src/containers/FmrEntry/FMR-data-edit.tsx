import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { object as objectYup, string as stringYup } from 'yup';
import { useCallback, useEffect, useState } from 'react';
import getValue from 'lodash/get';
import Select from 'react-select';
//@ts-ignore
import { College, Country, Qualification, State, University } from '../../types/common';
import { FinalRegOLDFormType } from '../../types/final';
import { LocalStorageManager } from "../../lib/localStorage-manager";
import { commonService } from '../../lib/api/common';
import Swal from 'sweetalert2';
import { dateDuration } from '../../lib/utils/dateDuration';
import DatePicker from 'react-date-picker';
import moment from 'moment';

const FMRDataEdit = (props: any) => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [universities, setUniversities] = useState<University[]>([]);
    const [colleges, setColleges] = useState<College[]>([]);
    const [reg_date, setReg_date] = useState(new Date());
    const [receipt_date,setReceipt_date]=useState(new Date());
    const [dd_date,setDd_date]=useState(new Date());
    const [qualifications, setQualifications] = useState<Qualification[]>([]);
    const [duration, setDuration] = useState('');
    

    const initialFormData: FinalRegOLDFormType = {
        country: 0,
        state: 0,
        university: "",
        college: "",
        qualification: 0,
        exam_month: "",
        exam_year: "",
        duration: "",
        edu_cert1: "",
        edu_cert2: "",
        edu_cert3: "",
        affidivit: "",
        testimonal1: "",
        testimonal2: "",
        reg_other_state: "",
        screen_test: "",
        intership_comp: "",
        mci_eligi: "",
        inter_verif_cert: "",
        mci_reg: "",
        imr_certificate: "",
        doctor_id: "",
        reg_date: null,
        receipt_no: "",
        receipt_date: null,
        dd_number: "",
        dd_date: null,
        serialno: 0,
        prefix:"",
        addedBy:0
      };


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

    const submitForm = useCallback(
        async (values: FinalRegOLDFormType) => {
            try {
                const adminPrimaryId = Number(LocalStorageManager.getAdminPrimaryId());
                const finalInfo = {
                    ...values,
                    modifiedon: moment().format('YYYY-MM-DD h:mm:ss'),
                    duration: duration.toUpperCase(),
                    doctor_id:props.doctor_id,
                    reg_date: moment(reg_date).format('YYYY-MM-DD'),
                    receipt_date:moment(receipt_date).format('YYYY-MM-DD'),
                    dd_date:moment(dd_date).format('YYYY-MM-DD'),
                    addedBy:adminPrimaryId
                }

                const formData = new FormData();
                formData.append("finalInfo", JSON.stringify(finalInfo));

                
                const { success, message } = await commonService.updateOldFinalReg(formData);
                if (success) {
                    Swal.fire({
                        title: "",
                        text: message,
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                }


            } catch (err) {
                Swal.fire({
                    text: "Final registeration failed",
                    icon: "error",
                    confirmButtonText: "OK",
                })
            }
        },
        [duration,reg_date,receipt_date,dd_date]
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
            prefix: stringYup()
                .required('Prefix is required.'),

        });

    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
                    <div className="col-9 m-auto">
                        <div className="card shadow border-0 mb-4">
                            <div className="card-body">
                                <h1 className='fs-22 fw-700'>Update Final Registration Data For Doctor :  {props.doctor_id}</h1>
                                <hr />
                                <Formik
                                    onSubmit={submitForm}
                                    enableReinitialize
                                    initialValues={initialFormData}
                                    validationSchema={getValidationSchema()}
                                >
                                    {(formikProps: FormikProps<FinalRegOLDFormType>) => {
                                        const {  handleSubmit, isSubmitting, setFieldTouched, setFieldValue,values } = formikProps;

                                        return (
                                            <>
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
                                                                                value={states.find(
                                                                                    (item) => item.id === field.value
                                                                                )}
                                                                                onChange={(selectedOption) => {
                                                                                    const { id, name } =
                                                                                        selectedOption as State;
                                                                                    setFieldTouched(field.name);
                                                                                    setFieldValue(field.name, id);
                                                                                    setUniversities([]);
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
                                                                                placeholder="Select college"
                                                                                value={colleges.find(
                                                                                    (item) => item.college === field.value
                                                                                )}
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
                                                                                <option value="">Select</option>
                                                                                {qualifications.map(
                                                                                    (item, index) => (
                                                                                        <option key={index} value={item.id.toString()}>
                                                                                            {item.name}
                                                                                        </option>
                                                                                    )
                                                                                )}
                                                                            </select>
                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>
                                                        <div className="col">
                                                            <Field name="exam_month">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <label className="mb-2">InternShip Exam  Month</label>
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
                                                                                    }`}
                                                                            >
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
                                                    </div>
                                                    <div className="row mb-2">
                                                        <div className="col">
                                                            <Field name="exam_year">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <label className="mb-2">InternShip Exam Year</label>
                                                                            <input
                                                                                type="text"
                                                                                value={field.value}
                                                                                onChange={(ev) => {
                                                                                    setFieldTouched(field.name);
                                                                                    setFieldValue(field.name, Number(ev.target.value));
                                                                                    if (ev.target.value.length === 4 && values.exam_month) {
                                                                                        const getDuration = dateDuration(Number(ev.target.value), values.exam_month);
                                                                                        getDuration && setDuration(getDuration);
                                                                                    }
                                                                                    else {
                                                                                        setDuration('');
                                                                                    }
                                                                                }}
                                                                                className={`form-control ${error ? 'is-invalid' : ''
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
                                                        <div className="col">
                                                            <Field name="duration">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <label className="mb-2">Duration</label>
                                                                            <input
                                                                                type="text"
                                                                                readOnly
                                                                                value={duration}
                                                                                // onChange={(ev) => {
                                                                                //     setFieldTouched(field.name);
                                                                                //     setFieldValue(field.name, Number(ev.target.value));
                                                                                // }}
                                                                                className={`form-control ${error ? 'is-invalid' : ''
                                                                                    }`}
                                                                                placeholder="Enter duration"
                                                                                tabIndex={8}
                                                                            />

                                                                            {error && <small className="text-danger">{error.toString()}</small>}


                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>
                                                    </div>
                                                    <div className="row mb-2">
                                                        <div className="col-sm-auto">
                                                            <label htmlFor="RegDate"> Registration Date </label>
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
                                                        <div className="row mb-2 "> 
                                                        <div className="col">
                                                            <Field name="prefix">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <label className="mb-2">Prefix</label>
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
                                                                                <option value="">Select Prefix</option>
                                                                                <option value="APMC/FMR/">APMC/FMR/</option>
                                                                                <option value="TSMC/FMR/">TSMC/FMR/</option>
                                                                                <option value="HMC">HMC</option>
                                                                                <option value="AMC">AMC</option>
                                                                                <option value=" ">Blank</option>
                                                                                
                                                                                
                                                                            </select>
                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>
                                                        <div className="col">
                                                            <Field name="serialno">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <label className="mb-2">FMR Number</label>
                                                                            <input
                                                                                type="text"
                                                                                value={field.value}
                                                                                 onChange={(ev) => {
                                                                                     setFieldTouched(field.name);
                                                                                     setFieldValue(field.name, ev.target.value);
                                                                                 }}
                                                                                className={`form-control ${error ? 'is-invalid' : ''
                                                                                    }`}
                                                                                placeholder="Enter FMR Number"
                                                                                tabIndex={8}
                                                                            />

                                                                            {error && <small className="text-danger">{error.toString()}</small>}


                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>
                                                        </div>
                                                        <div className="tsmc-text border border-warning mt-5"> 
                                                        <label htmlFor="" className="d-flex align-items-center ml-4"> Payment Details</label>
                                                        <div className="row mb-2">
                                                        <div className="col-sm-auto">
                                                            <label htmlFor="receiptDate">Reciept Date </label>
                                                            <Field name="receipt_date">
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
                                                                                    setReceipt_date(date);
                                                                                }}

                                                                                clearIcon={null}
                                                                                value={receipt_date}
                                                                                onFocus={e => e.target.blur()}
                                                                                className={`form-control ${error ? 'is-invalid' : ''}`}
                                                                            />
                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>

                                                        </div>
                                                        <div className="col">
                                                            <Field name="receipt_no">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <label className="mb-2">Reciept Number</label>
                                                                            <input
                                                                                type="text"
                                                                                value={field.value}
                                                                                 onChange={(ev) => {
                                                                                     setFieldTouched(field.name);
                                                                                     setFieldValue(field.name, ev.target.value);
                                                                                 }}
                                                                                className={`form-control ${error ? 'is-invalid' : ''
                                                                                    }`}
                                                                                placeholder="Enter Reciept Number"
                                                                                tabIndex={8}
                                                                            />

                                                                            {error && <small className="text-danger">{error.toString()}</small>}


                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>
                                                        <div className="row mb-2">
                                                        <div className="col-sm-auto">
                                                            <label htmlFor="ddDate">  DD Date </label>
                                                            <Field name="dd_date">
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
                                                                                    setDd_date(date);
                                                                                }}

                                                                                clearIcon={null}
                                                                                value={dd_date}
                                                                                onFocus={e => e.target.blur()}
                                                                                className={`form-control ${error ? 'is-invalid' : ''}`}
                                                                            />
                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>

                                                        </div>
                                                        <div className="col">
                                                            <Field name="dd_number">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <label className="mb-2"> DD Number</label>
                                                                            <input
                                                                                type="text"
                                                                                value={field.value}
                                                                                 onChange={(ev) => {
                                                                                     setFieldTouched(field.name);
                                                                                     setFieldValue(field.name, ev.target.value);
                                                                                 }}
                                                                                className={`form-control ${error ? 'is-invalid' : ''
                                                                                    }`}
                                                                                placeholder="Enter DD Number"
                                                                                tabIndex={8}
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
                                                    </div>

                                                    <div className="w-100 text-end mt-3">
                                                        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                                            {isSubmitting && <span className="spinner-border spinner-border-sm" />} Update
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

export default FMRDataEdit;

