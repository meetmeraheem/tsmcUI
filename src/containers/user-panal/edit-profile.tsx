import { Field, FieldProps, Formik, FormikProps } from "formik";
import { date as dateYup, object as objectYup, string as stringYup, number as numberYup } from 'yup';
import Select from 'react-select';
//@ts-ignore
import Files from 'react-files';
import getValue from 'lodash/get';
import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-date-picker';
import { commonService } from "../../lib/api/common";
import { City, Country, State } from "../../types/common";
import { DoctorFormType, DoctorProfileType } from "../../types/doctor";
import { ReactFilesError, ReactFilesFile } from "../../types/files";
import { doctorService } from "../../lib/api/doctot";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import { routes } from "../routes/routes-names";
import moment from "moment";


const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];
//import moment from "moment";

const UserEditProfile = () => {
    const navigate = useNavigate();
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [doctorPrimaryId, setDoctorPrimaryId] = useState(0);
    const [doctor, setDoctor] = useState<DoctorProfileType | null>(null);
    const [passportPhoto, setPassportPhoto] = useState<{ file?: File; error?: string } | null>(null);
    const [signature, setSignature] = useState<{ file?: File; error?: string } | null>(null);
    const [files, setFiles] = useState<File[] | null>(null);
    const [selectedOption, setSelectedOption] = useState(null);

    const initialFormData = useMemo(
        () => ({
            fullname: doctor?.fullname || '',
            fathername: doctor?.fathername || '',
            mothername: doctor?.mothername || '',
            dateofbirth: (doctor?.dateofbirth && new Date(doctor?.dateofbirth)) || new Date(),
            //dateofbirth: new Date(),
            gender: doctor?.gender || '',
            address1: doctor?.address1 || '',
            address2: doctor?.address2 || '',
            country: Number(doctor?.country) || 0,
            state: Number(doctor?.state) || 0,
            city: Number(doctor?.city) || 0,
            pincode: doctor?.pincode || '',
            emailid: doctor?.emailid || '',
            stdcode: doctor?.stdcode || '+91',
            mobileno: doctor?.mobileno || '',
            phoneno: doctor?.phoneno || '',
            aadharcard: doctor?.aadharcard || '',
            bloodgroup: doctor?.bloodgroup || '',
            passphoto: doctor?.passphoto || '',
            signature: doctor?.signature || '',
            fingerprint: doctor?.fingerprint || '',
        }),
        [doctor]
    );

    const getCountries = useCallback(async () => {
        try {
            const { data } = await commonService.getCountries();
            if (data.length) {
                // const cityOptions = data.map((item: any) => ({
                //     label: item.name,
                //     value: item.id
                // }));
                setCountries(data);
                setStates([]);
                setCities([]);
            }
        } catch (err) {
            console.log('error countries getList', err);
        }
    }, []);

    const getStates = useCallback(async (countryId: any) => {
        try {
            const { data } = await commonService.getStatesByCountryId(countryId);
            if (data.length) {
                setStates(data);
                setCities([]);
            }
        } catch (err) {
            console.log('error states getList', err);
        }
    }, []);

    const getCities = useCallback(async (stateId: any) => {
        try {
            const { data } = await commonService.getCitiesByStateId(stateId);
            if (data.length) {
                setCities(data);
            }
        } catch (err) {
            console.log('error cities getList', err);
        }
    }, []);

    const getDoctorProfile = useCallback(async () => {
        try {
            const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());
            if (doctorPrimaryId) {
                setDoctorPrimaryId(doctorPrimaryId);
                const getDoctor = await doctorService.getDoctorById(doctorPrimaryId);
                if (getDoctor.data.length > 0) {
                    getStates(getDoctor.data[0]?.country);
                    getCities(getDoctor.data[0]?.state);
                    setDoctor(getDoctor.data[0]);
                }
            }
        } catch (err: any) {
            console.log('candidateService getProfile error', err.response);
        } finally {
            //setLoading(false);
        }
    }, []);

    useEffect(() => {
        getDoctorProfile();
        getCountries();
    }, []);

    const submitForm = useCallback(
        async (values: DoctorProfileType) => {
            console.log('submitForm' + JSON.stringify(values));
            try {
                const doctorInfo = {
                    ...values,
                    modifiedon: moment().format('YYYY-MM-DD h:mm:ss'),
                    fullname: values.fullname.toUpperCase(),
                    emailid: values.emailid.toUpperCase(),
                    fathername: values.fathername.toUpperCase(),
                    mothername: values.mothername.toUpperCase(),
                    bloodgroup: values.bloodgroup.toUpperCase(),
                    address1: values.address1.toUpperCase(),
                    address2: values.address2.toUpperCase(),
                    dateofbirth: moment(values.dateofbirth).format('YYYY-MM-DD')
                }
                const formData = new FormData();
                formData.append("doctorInfo", JSON.stringify(doctorInfo));
                
                if (passportPhoto?.file) {
                    formData.append("passphoto", passportPhoto?.file);
                }
                if (signature?.file) {
                    formData.append("signature", signature?.file);
                }
                const { success } = await doctorService.updateDoctorInfo(doctorPrimaryId, formData);
                if (success) {
                    setPassportPhoto(null);
                    setSignature(null);
                    Swal.fire({
                        title: "Success",
                        text: "Successfully Updated",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate(routes.userpanal);
                        }
                    });
                }

            } catch (err) {
                console.log('error candidateService update', err);
            }
        },
        [doctorPrimaryId, passportPhoto, signature, files]
    );
    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
                    <Formik
                        onSubmit={submitForm}
                        enableReinitialize
                        initialValues={initialFormData}
                        validationSchema={getValidationSchema()}
                    >
                        {(formikProps: FormikProps<DoctorProfileType>) => {
                            const { isValid, handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm, errors } = formikProps;
                            return (
                                <div className="card shadow border-0">
                                    <form onSubmit={handleSubmit}>
                                        <div className="card-body">
                                            <div className="w-100">
                                                <h1 className='fs-22 fw-700'>Edit Profile</h1>
                                                <hr />
                                            </div>
                                            <div className="px-3">
                                                <div className="row mb-3">
                                                    <label className="col-sm-2 col-form-label">Full Name</label>
                                                    <div className="col-sm-4">
                                                        <Field name="fullname">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                return (
                                                                    <>
                                                                        <input
                                                                            type="text"
                                                                            value={field.value}
                                                                            onChange={(ev) => {
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(field.name, ev.target.value);
                                                                            }}
                                                                            className={`form-control ${error ? 'is-invalid' : ''
                                                                                }`}
                                                                            placeholder="Enter full name"
                                                                            tabIndex={1}
                                                                        />

                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>
                                                    <label className="col-sm-2 col-form-label">Father Name</label>
                                                    <div className="col-sm-4">
                                                        <Field name="fathername">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                return (
                                                                    <>
                                                                        <input
                                                                            type="text"
                                                                            value={field.value}
                                                                            onChange={(ev) => {
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(field.name, ev.target.value);
                                                                            }}
                                                                            className={`form-control ${error ? 'is-invalid' : ''
                                                                                }`}
                                                                            placeholder="Enter father name"
                                                                            tabIndex={2}
                                                                        />

                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <label className="col-sm-2 col-form-label">Mother Name</label>
                                                    <div className="col-sm-4">
                                                        <Field name="mothername">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                return (
                                                                    <>
                                                                        <input
                                                                            type="text"
                                                                            value={field.value}
                                                                            onChange={(ev) => {
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(field.name, ev.target.value);
                                                                            }}
                                                                            className={`form-control ${error ? 'is-invalid' : ''
                                                                                }`}
                                                                            placeholder="Enter mother name"
                                                                            tabIndex={3}
                                                                        />

                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>
                                                    <label className="col-sm-2 col-form-label">Date Of Birth</label>
                                                    <div className="col-sm-4">
                                                        <Field name="dateofbirth">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                return (
                                                                    <>
                                                                        <DatePicker
                                                                            format='dd/MM/yyyy'
                                                                            onChange={(date: any) => {
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(field.name, new Date(date));
                                                                                //setStartDate(date);
                                                                            }}
                                                                            clearIcon={null}
                                                                            value={field.value}
                                                                            className={`form-control ${error ? 'is-invalid' : ''}`}
                                                                        />
                                                                        {/* <input
                                                                            type="date"
                                                                            //value={moment(field.value).format('yyyy-MM-DD')}
                                                                            value={field.value}
                                                                            onChange={(ev) => {
                                                                                setFieldTouched(field.name);
                                                                                //moment(ev.target.value, 'YYYY-MM-DD')
                                                                                setFieldValue(field.name, ev.target.value);
                                                                            }}
                                                                            className={`form-control ${error ? 'is-invalid' : ''
                                                                                }`}
                                                                            tabIndex={4}
                                                                            maxLength={10}
                                                                        /> */}

                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <label className="col-sm-2 col-form-label">Gender</label>
                                                    <div className="col-sm-4">
                                                        <Field name="gender">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                return (
                                                                    <><select
                                                                        value={field.value}
                                                                        name="gender"
                                                                        onChange={(ev) => {
                                                                            setFieldTouched(field.name);
                                                                            setFieldValue(
                                                                                field.name,
                                                                                ev.target.value
                                                                            );
                                                                        }}
                                                                        tabIndex={5}
                                                                        className={`form-select ${error ? 'is-invalid' : ''
                                                                            }`}
                                                                    >
                                                                        <option value="">Select Gender</option>
                                                                        <option value="m">MALE</option>
                                                                        <option value="f">FEMALE</option>
                                                                        <option value="o">OTHERS</option>
                                                                    </select>

                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>
                                                    <label className="col-sm-2 col-form-label pr-0">Address 1</label>
                                                    <div className="col-sm-4">
                                                        <Field name="address1">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                return (
                                                                    <>
                                                                        <input
                                                                            type="text"
                                                                            name="address1"
                                                                            value={field.value}
                                                                            onChange={(ev) => {
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(field.name, ev.target.value);
                                                                            }}
                                                                            className={`form-control ${error ? 'is-invalid' : ''
                                                                                }`}
                                                                            placeholder="Enter Address 1"
                                                                            tabIndex={6}
                                                                        />

                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <label className="col-sm-2 col-form-label pr-0">Address 2</label>
                                                    <div className="col-sm-4">
                                                        <Field name="address2">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                return (
                                                                    <>
                                                                        <input
                                                                            type="text"
                                                                            name="address2"
                                                                            value={field.value}
                                                                            onChange={(ev) => {
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(field.name, ev.target.value);
                                                                            }}
                                                                            className={`form-control ${error ? 'is-invalid' : ''
                                                                                }`}
                                                                            placeholder="Enter Address 2"
                                                                            tabIndex={7}
                                                                        />

                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>
                                                    <label className="col-sm-2 col-form-label">Country</label>
                                                    <div className="col-sm-4">
                                                        <Field name="country">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                return (
                                                                    <>
                                                                        <Select
                                                                            name="Country"
                                                                            id="Country"
                                                                            className="react-select"
                                                                            classNamePrefix="react-select"
                                                                            value={countries.find(
                                                                                (item) => item.id === field.value
                                                                            )}
                                                                            isSearchable
                                                                            options={countries}
                                                                            placeholder="Select country"
                                                                            onChange={(selectedOption) => {
                                                                                const { id, name } =
                                                                                    selectedOption as Country;
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(field.name, id);
                                                                                setStates([]);
                                                                                setCities([]);
                                                                                getStates(id);
                                                                            }}
                                                                            tabIndex={8}
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
                                                <div className="row mb-3">
                                                    <label className="col-sm-2 col-form-label">State</label>
                                                    <div className="col-sm-4">
                                                        <Field name="state">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                return (
                                                                    <>
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
                                                                                setCities([]);
                                                                                getCities(id);
                                                                            }}
                                                                            tabIndex={9}
                                                                            getOptionLabel={(option) => option.name}
                                                                            getOptionValue={(option) => option.id.toString()}
                                                                        />
                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>
                                                    <label className="col-sm-2 col-form-label">District / City</label>
                                                    <div className="col-sm-4">
                                                        <Field name="city">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                return (
                                                                    <>
                                                                        <Select
                                                                            name="city"
                                                                            className="react-select"
                                                                            classNamePrefix="react-select"
                                                                            isSearchable
                                                                            options={cities}
                                                                            placeholder="Select city"
                                                                            value={cities.find(
                                                                                (item) => item.id === field.value
                                                                            )}
                                                                            onChange={(selectedOption) => {
                                                                                const { id, name } =
                                                                                    selectedOption as City;
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(field.name, id);
                                                                            }}
                                                                            tabIndex={10}
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
                                                <div className="row mb-3">
                                                    <label className="col-sm-2 col-form-label">Pincode</label>
                                                    <div className="col-sm-4">
                                                        <Field name="pincode">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                return (
                                                                    <>
                                                                        <input
                                                                            type="text"
                                                                            name="pincode"
                                                                            value={field.value}
                                                                            onChange={(ev) => {
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(field.name, Number(ev.target.value));
                                                                            }}
                                                                            className={`form-control ${error ? 'is-invalid' : ''
                                                                                }`}
                                                                            placeholder="Enter Postal Code"
                                                                            tabIndex={11}
                                                                            maxLength={6}
                                                                        />

                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>
                                                    <label className="col-sm-2 col-form-label">Email ID</label>
                                                    <div className="col-sm-4">
                                                        <Field name="emailid">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                return (
                                                                    <>
                                                                        <input
                                                                            type="text"
                                                                            name="emailid"
                                                                            value={field.value}
                                                                            onChange={(ev) => {
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(field.name, ev.target.value);
                                                                            }}
                                                                            className={`form-control ${error ? 'is-invalid' : ''
                                                                                }`}
                                                                            placeholder="Enter Email Address"
                                                                            tabIndex={12}
                                                                        />

                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <label className="col-sm-2 col-form-label pr-0">Mobile No</label>
                                                    <div className="col-sm-4">
                                                        <div className="form-control mb-3">{doctor?.mobileno}</div>
                                                    </div>
                                                    <label className="col-sm-2 col-form-label">Landline</label>
                                                    <div className="col-sm-4">
                                                        <div className="input-group">
                                                            <Field name="phoneno">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <input
                                                                                type="text"
                                                                                name="phoneno"
                                                                                value={field.value}
                                                                                onChange={(ev) => {
                                                                                    setFieldTouched(field.name);
                                                                                    setFieldValue(field.name, ev.target.value);
                                                                                }}
                                                                                className={`form-control ${error ? 'is-invalid' : ''
                                                                                    }`}
                                                                                placeholder="Enter Landline No"
                                                                                tabIndex={14}
                                                                                maxLength={10}
                                                                                minLength={10}
                                                                            />

                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <label className="col-sm-2 col-form-label pr-0">Aadhar No</label>
                                                    <div className="col-sm-4">
                                                        <Field name="aadharcard">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                return (
                                                                    <>
                                                                        <input
                                                                            type="text"
                                                                            name="aadharcard"
                                                                            id="adharun"
                                                                            value={field.value}
                                                                            onChange={(ev) => {
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(field.name, ev.target.value);
                                                                            }}
                                                                            className={`form-control ${error ? 'is-invalid' : ''
                                                                                }`}
                                                                            placeholder="Enter Aadhar Card Number"
                                                                            tabIndex={15}
                                                                            maxLength={14}
                                                                        />

                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                        <span id="adharid"></span>
                                                    </div>
                                                    <label className="col-sm-2 col-form-label pr-0">Blood Group</label>
                                                    <div className="col-sm-4">
                                                        <Field name="bloodgroup">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                return (
                                                                    <>
                                                                        <select
                                                                            value={field.value}
                                                                            name="bloodgroup"
                                                                            onChange={(ev) => {
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(
                                                                                    field.name,
                                                                                    ev.target.value
                                                                                );
                                                                            }}
                                                                            tabIndex={16}
                                                                            className={`form-select ${error ? 'is-invalid' : ''
                                                                                }`}
                                                                        >
                                                                            <option value="">Select Blood Group</option>
                                                                            <option value="O+">O+</option>
                                                                            <option value="O-">O-</option>
                                                                            <option value="A+">A+</option>
                                                                            <option value="A-">A-</option>
                                                                            <option value="B+">B+</option>
                                                                            <option value="B-">B-</option>
                                                                            <option value="AB+">AB+</option>
                                                                            <option value="AB-">AB-</option>
                                                                        </select>
                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-center my-5">
                                                    <div className="col-3 pe-3">
                                                        <Field name="passphoto">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                const file = passportPhoto?.file
                                                                    ? passportPhoto?.file.name
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
                                                                                    setPassportPhoto(null);
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
                                                                                if (files) {
                                                                                    setFiles(files);
                                                                                }
                                                                                if (files[0]) {
                                                                                    const file = files[0];
                                                                                    setPassportPhoto({ file });
                                                                                    setFieldValue(field.name, file.name);
                                                                                }
                                                                            }}
                                                                            onError={(error: ReactFilesError) => {
                                                                                console.log('error', error);
                                                                                if (error.code === 1) {
                                                                                }
                                                                            }}
                                                                            //accepts={['.jpeg', '.jpg', '.png']}
                                                                            clickable
                                                                        >
                                                                            <div className="file-upload-box">
                                                                                <i className="bi-plus-lg fs-22"></i>
                                                                                <p className="fs-13">Upload Passport Photo</p>
                                                                            </div>
                                                                        </Files>
                                                                        <small className="text-danger mt-1">
                                                                            {passportPhoto?.error}
                                                                        </small>
                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>
                                                    <div className="col-3 ps-3">
                                                        <Field name="signature">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                const file = signature?.file
                                                                    ? signature?.file.name
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
                                                                                    setSignature(null);
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
                                                                                    setSignature({ file });
                                                                                    setFieldValue(field.name, file.name);
                                                                                }
                                                                            }}
                                                                            onError={(error: ReactFilesError) => {
                                                                                console.log('error', error);
                                                                                if (error.code === 1) {
                                                                                }
                                                                            }}
                                                                            //accepts={['.jpeg', '.jpg','.png']}
                                                                            clickable
                                                                        >
                                                                            <div className="file-upload-box">
                                                                                <i className="bi-plus-lg fs-22"></i>
                                                                                <p className='fs-13'>Upload Signature</p>
                                                                            </div>
                                                                        </Files>
                                                                        <small className="text-danger mt-1">
                                                                            {passportPhoto?.error}
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
                                        <div className="card-footer">
                                            <div className="w-100 text-end">
                                                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                                    {isSubmitting && <span className="spinner-border spinner-border-sm" />} Submit
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            );
                        }}
                    </Formik>
                </div>
            </section>
        </>
    )
};

export default UserEditProfile;

const getValidationSchema = () =>
    objectYup().shape({
        fullname: stringYup()
            .required('Full name is required.'),
        fathername: stringYup()
            .required('Father name is required.'),
        mothername: stringYup()
            .required('Mother  name is required.'),
        dateofbirth: stringYup()
            .required('Date of birth is required.'),
        gender: stringYup()
            .required('Gender is required.'),
        address1: stringYup()
            .required('Address1 is required.'),
        address2: stringYup()
            .required('Address2 is required.'),
        country: stringYup()
            .required('Country is required.'),
        state: stringYup()
            .required('State is required.'),
        city: stringYup()
            .required('State is required.'),
        pincode: stringYup()
            .required('Pincode is required.')
            .min(6, 'Pincode 6 numbers'),
        emailid: stringYup()
            .required('Emailid is required.'),
        stdcode: stringYup()
            .required('Stdcode is required.'),
        mobileno: stringYup()
            .required('Mobileno is required.')
            .min(10, 'Mobileno 10 numbers'),
        // Phoneno: stringYup()
        //     .required('Phoneno is required.')
        //     .min(10,'Phoneno 10 numbers'),
        aadharcard: stringYup()
            .required('Aadhar card is required.')
            .min(14, 'Aadhar card 14 numbers'),
        bloodgroup: stringYup()
            .required('Blood group is required.'),
        passphoto: stringYup()
            .required('Pass photo is required.'),
        signature: stringYup()
            .required('Signature is required.')
    });