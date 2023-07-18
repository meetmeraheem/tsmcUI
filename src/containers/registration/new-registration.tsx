import { Field, FieldProps, Formik, FormikProps } from "formik";
import { date as dateYup, object as objectYup, string as stringYup, number as numberYup } from 'yup';
import Select from 'react-select';
//@ts-ignore
import Files from 'react-files';
import getValue from 'lodash/get';
import { useCallback, useEffect, useState } from "react";
import { commonService } from "../../lib/api/common";
import { City, Country, State } from "../../types/common";
import { DoctorFormType } from "../../types/doctor";
import Userfooter from "../user-panal/includes/user-footer";
import UserHeader from "../user-panal/includes/user-header";
import { ReactFilesError, ReactFilesFile } from "../../types/files";
import { ReactComponent as IconTrash } from '../../../src/assets/images/trash.svg';
import { doctorService } from "../../lib/api/doctot";

const Newregistration = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [passportPhoto, setPassportPhoto] = useState<{ file?: File; error?: string } | null>(null);
    const [signature, setSignature] = useState<{ file?: File; error?: string } | null>(null);
    const initialFormData = {
        id: 0,
        serial_id: '',
        pmr_no: '',
        fmr_no: '',
        gs_id: '',
        gs_mci_id: '',
        noc_id: '',
        fullname: '',
        fathername: '',
        mothername: '',
        dateofbirth: '',
        gender: '',
        address1: '',
        address2: '',
        country: 0,
        state: 0,
        city: 0,
        pincode: '',
        emailid: '',
        stdcode: '',
        mobileno: '',
        phoneno: '',
        aadharcard: '',
        bloodgroup: '',
        passphoto: '',
        signature: '',
        fingerprint: '',
        createdon: '',
        posttime: '',
        modifiedon: '',
        status: '',
        adisnal1: '',
        adisnal2: '',
        adisnal3: '',
        added_by: 0,
        filestatus:false,
        original_fmr_no:'',
        
    }
    const getCountries = useCallback(async () => {
        try {
            const { data } = await commonService.getCountries();
            if (data.length) {
                setCountries(data);
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

    useEffect(() => {
        getCountries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitForm = useCallback(
        async (values: DoctorFormType) => {
            console.log('submitForm' + JSON.stringify(values));
            try {
                await doctorService.doctorRegistration(values);
                setPassportPhoto(null);
                setSignature(null);
            } catch (err) {
                console.log('error candidateService update', err);
            }
        },
        []
    );

    return (
        <>
            <UserHeader />
            <section className='gray-banner'>
                <div className="container mt-4">
                    <div className="card shadow border-0">

                        <Formik
                            onSubmit={submitForm}
                            enableReinitialize
                            initialValues={initialFormData}
                            validationSchema={getValidationSchema()}
                        >
                            {(formikProps: FormikProps<DoctorFormType>) => {
                                const { isValid, handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm, errors } = formikProps;

                                return (
                                    <form onSubmit={handleSubmit}>
                                        <div className="card-body">
                                            <div className="w-100">
                                                <h1 className='fs-22 fw-700'>Doctor Registration</h1>
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
                                                        <Field name="Fathername">
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
                                                        <Field name="Mothername">
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
                                                        <Field name="Dateofbirth">
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
                                                                            tabIndex={4}
                                                                            maxLength={10}
                                                                        />

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
                                                        <Field name="Gender">
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
                                                                        <option value="m">Male</option>
                                                                        <option value="f">FeMale</option>
                                                                        <option value="o">Others</option>
                                                                    </select>

                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>
                                                    <label className="col-sm-2 col-form-label pr-0">Address 1</label>
                                                    <div className="col-sm-4">
                                                        <Field name="Address1">
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
                                                        <Field name="Address2">
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
                                                        <Field name="Country">
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
                                                        <Field name="State">
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
                                                                            onChange={(selectedOption) => {
                                                                                const { id, name } =
                                                                                    selectedOption as State;
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(field.name, id);
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
                                                        <Field name="City">
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
                                                        <Field name="Pincode">
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
                                                        <Field name="Emailid">
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
                                                        <div className="input-group input-group-sm mb-3">
                                                            <Field name="Stdcode">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <input
                                                                                type="text"
                                                                                name="mobcode"
                                                                                value={field.value}
                                                                                onChange={(ev) => {
                                                                                    setFieldTouched(field.name);
                                                                                    setFieldValue(field.name, ev.target.value);
                                                                                }}
                                                                                className={`input-group-text col-2 ${error ? 'is-invalid' : ''
                                                                                    }`}
                                                                                placeholder="STD Code"
                                                                            />

                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                            <Field name="Mobileno">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <input
                                                                                type="text"
                                                                                name="mobileno"
                                                                                value={field.value}
                                                                                onChange={(ev) => {
                                                                                    setFieldTouched(field.name);
                                                                                    setFieldValue(field.name, ev.target.value);
                                                                                }}
                                                                                className={`form-control col-auto ${error ? 'is-invalid' : ''
                                                                                    }`}
                                                                                placeholder="Enter Mobile No"
                                                                                tabIndex={13}
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
                                                    <label className="col-sm-2 col-form-label">Landline</label>
                                                    <div className="col-sm-4">
                                                        <div className="input-group">
                                                            <Field name="Phoneno">
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
                                                        <Field name="Aadharcard">
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
                                                        <Field name="Bloodgroup">
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
                                                                            <option value="O+ve">O+ve</option>
                                                                            <option value="O-ve">O-ve</option>
                                                                            <option value="A+ve">A+ve</option>
                                                                            <option value="A-ve">A-ve</option>
                                                                            <option value="B+ve">B+ve</option>
                                                                            <option value="B-ve">B-ve</option>
                                                                            <option value="AB+ve">AB+ve</option>
                                                                            <option value="AB-ve">AB-ve</option>
                                                                        </select>
                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <label className="col-sm-2 col-form-label">Passport Photo</label>
                                                    <div className="col-sm-4">
                                                        <Field name="Passphoto">
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
                                                                                if (passportPhoto?.file) {
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

                                                                            accepts={['.jpeg', '.jpg']}
                                                                            clickable
                                                                        >
                                                                            <div className="drag-drop-box mt-3">
                                                                                <div className="text-center">
                                                                                    <i className="bi-file-earmark-break fs-32"></i>
                                                                                    <p className='fs-13'>Upload Passphoto</p>
                                                                                </div>
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
                                                    <label className="col-sm-2 col-form-label">Signature</label>
                                                    <div className="col-sm-4">
                                                        <Field name="Signature">
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
                                                                                if (signature?.file) {
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
                                                                            accepts={['.jpeg', '.jpg']}
                                                                            clickable
                                                                        >
                                                                            <div className="drag-drop-box mt-3">
                                                                                <div className="text-center">
                                                                                    <i className="bi-file-earmark-break fs-32"></i>
                                                                                    <p className='fs-13'>Upload Signature</p>
                                                                                </div>
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
                                            <div className="card-footer">
                                                <div className="w-100 text-end">
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
            </section>
        </>
    )
};

export default Newregistration;

const getValidationSchema = () =>
    objectYup().shape({
        fullname: stringYup()
            .required('Full name is required.'),
        fathername: stringYup()
            .required('Father name is required.'),
        mothername: stringYup()
            .required('Mother  name is required.'),
        Dateofbirth: stringYup()
            .required('Dateofbirth is required.'),
        Gender: stringYup()
            .required('Gender is required.'),
        Address1: stringYup()
            .required('Address1 is required.'),
        Address2: stringYup()
            .required('Address2 is required.'),
        Country: stringYup()
            .required('Country is required.'),
        State: stringYup()
            .required('State is required.'),
        City: stringYup()
            .required('State is required.'),
        Pincode: stringYup()
            .required('Pincode is required.')
            .min(6, 'Pincode 6 numbers'),
        Emailid: stringYup()
            .required('Emailid is required.'),
        Stdcode: stringYup()
            .required('Stdcode is required.'),
        Mobileno: stringYup()
            .required('Mobileno is required.')
            .min(10, 'Mobileno 10 numbers'),
        // Phoneno: stringYup()
        //     .required('Phoneno is required.')
        //     .min(10,'Phoneno 10 numbers'),
        Aadharcard: stringYup()
            .required('Aadharcard is required.')
            .min(14, 'Aadharcard 14 numbers'),
        Bloodgroup: stringYup()
            .required('Bloodgroup is required.'),
        Passphoto: stringYup()
            .required('Passphoto is required.'),
        Signature: stringYup()
            .required('Signature is required.')
    });