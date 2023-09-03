import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { date as dateYup, object as objectYup, string as stringYup, number as numberYup } from 'yup';
import { useCallback, useEffect, useState, useMemo } from 'react';
import getValue from 'lodash/get';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import { College, Country, Qualification, Serials, State, University } from '../../../types/common';
import { adminFinalType} from '../../../types/adminEdit';
import { commonService } from '../../../lib/api/common';
import Swal from 'sweetalert2';
import { finalService } from '../../../lib/api/final';
import { adminEditService } from '../../../lib/api/adminedits';
import { dateDuration } from '../../../lib/utils/dateDuration';
import { LocalStorageManager } from '../../../lib/localStorage-manager';
import DatePicker from 'react-date-picker';
import moment from 'moment';

const FinalDataEdit = (props:any) => {
    const navigate = useNavigate();
    const [final, setFinal] = useState<adminFinalType>();
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [universities, setUniversities] = useState<University[]>([]);
    const [colleges, setColleges] = useState<College[]>([]);
    const [qualifications, setQualifications] = useState<Qualification[]>([]);
    const [duration, setDuration] = useState('');
    

    const initialFormData = useMemo(
        () => ({
            id: Number(final?.id),
            doctor_id: Number(final?.doctor_id),
            serialno: Number(final?.serialno),
            country: Number(final?.country) || 0,
            state: Number(final?.state) || 0,
            university: final?.university || '',
            college: final?.college || '',
            qualification: Number(final?.qualification) || 0,
            exam_month: final?.exam_month || '',
            exam_year: final?.exam_year || '',
            duration: final?.duration || '',
            reg_date:final?.reg_date || '',
        }),
        [final]
    );

    const getFinalDetails = useCallback(async () => {
        try {
            const doctorSerialId = props.doctorId;
            if (doctorSerialId) {
                const { data } = await finalService.getFinal(doctorSerialId);
                if (data.length > 0) {
                    setFinal(data[0]);
                    setDuration(data[0]?.duration);
                    getStates(data[0]?.country);
                    const universityList = await getUniversityNames(data[0]?.state);
                    const univerOBJ = universityList.filter((obj: any) => obj.university == data[0]?.university);
                    getColleges(univerOBJ[0].id);
                }
            }
        } catch (err) {
            console.log('error getFinalDetails', err);
        }
    }, []);

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
        getFinalDetails();
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
        async (values: adminFinalType) => {
            try {
                const adminPrimaryId = Number(LocalStorageManager.getAdminPrimaryId());
                const finalInfo = {
                    ...values,
                    modifiedon: moment().format('YYYY-MM-DD h:mm:ss'),
                    duration: duration.toUpperCase(),
                    reg_date: moment(values.reg_date).format('YYYY-MM-DD'),
                    adminPrimaryId:adminPrimaryId,
                }
                if (final) {
                    const formData = new FormData();
                    formData.append("finalInfo", JSON.stringify(finalInfo));
                    const { success } = await adminEditService.updateDoctorFMRByAdmin(final?.id, formData);
                    if (success) {
                        Swal.fire({
                            title: "Success",
                            text: "Final successfully Updated",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then((result) => {
                            if (result.isConfirmed) {
                            }
                        });
                    }else{
                        Swal.fire({
                            text: "Final registeration failed",
                            icon: "error",
                            confirmButtonText: "OK",
                        })
                    }
                }

            } catch (err) {
                Swal.fire({
                    text: "Final registeration failed",
                    icon: "error",
                    confirmButtonText: "OK",
                })
            }
        },
        [final, duration]
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
        });

    return (
        <>
       
                <div className="container mt-4">
                        <div className="card shadow border-0">
                            <div className="card-body">
                                <h1 className='fs-22 fw-700'>Edit Final</h1>
                                <hr />
                                <Formik
                                    onSubmit={submitForm}
                                    enableReinitialize
                                    initialValues={initialFormData}
                                    validationSchema={getValidationSchema()}
                                >
                                    {(formikProps: FormikProps<adminFinalType>) => {
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
                                                            <Field name="exam_month">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <label className="mb-2">InternShip  Month</label>
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
                                                    
                                                        <div className="col">
                                                            <Field name="exam_year">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <label className="mb-2">InternShip Year</label>
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
                                                     </div>   
                                                     </div>
                                                     <div className="row mb-2">
                                                        <div className="col-sm-auto">
                                                        <label htmlFor="Dateofbirth"> Registration Date</label>
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
                                                                                    }}


                                                                                    maxDate={new Date()}
                                                                                    clearIcon={null}
                                                                                    value={field.value}
                                                                                    className={`form-control ${error ? 'is-invalid' : ''}`}
                                                                                />


                                                                                {error && <small className="text-danger">{error.toString()}</small>}
                                                                            </>
                                                                        );
                                                                    }}
                                                                </Field>
                                                                
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
        </>
    )
};

export default FinalDataEdit;

