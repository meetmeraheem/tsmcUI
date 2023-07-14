import DoctorInfoCard from './includes/doctor-info';
import { Field, FieldProps, Formik, FormikProps } from 'formik';
import getValue from 'lodash/get';
import { nocUserFormType } from '../../types/noc';
import { date as dateYup, object as objectYup, string as stringYup, number as numberYup } from 'yup';
import Select from 'react-select';
import { City, Country, State } from "../../types/common";
import { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { routes } from '../routes/routes-names';
import { LocalStorageManager } from "../../lib/localStorage-manager";
import { commonService } from "../../lib/api/common";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from 'react-secure-storage';


const NocRegistration = () => {
    const navigate = useNavigate();
    const [next, setNext] = useState(false);
    const [countries, setCountries] = useState<Country[]>([]);
    const [doctorId, setDoctorId] = useState(0);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [provisionalRequestType, setProvisionalRequestType] = useState<string>('nor');
   

    const initialFormData = useMemo(
        () => ({
            councilname: '',
            address1: '',
            address2: '',
            country: '',
            state: '',
            city: '',
            councilpincode: '',
            createdon: '',
            posttime: '',
            modifiedon: '',
            status: '',
            added_by: 0,
            approval_status:'',
            extra_col3:'',
        }),
        []
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
    useEffect(() => {

        getCountries();
    }, []);
    const submitForm = useCallback(
        async (values: nocUserFormType) => {
            const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());
            const doctorId = Number(LocalStorageManager.getDoctorSerialId());
            try {
               
                const nocInfo = {
                    ...values,
                    modifiedon: moment().format('YYYY-MM-DD h:mm:ss'),
                    councilname: values.councilname,
                    councilpincode: values.councilpincode,
                    address1: values.address1.toUpperCase(),
                    address2: values.address2.toUpperCase(),
                    doctor_id: doctorId,
                    extra_col1:provisionalRequestType,
                    doctorPrimaryId:doctorPrimaryId
                }

                secureLocalStorage.setItem("regType", 'nocInfo');
                secureLocalStorage.setItem("nocInfo", nocInfo);
                navigate(routes.payment, { state: { doctor_id: Number(doctorId), regType: 'nocInfo' } });
                {/*
                const { success } = await nocService.nocRegistration(formData);
                if (success) {
                  
                    Swal.fire({
                        title: "Success",
                        text: "Successfully Updated",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                          //  navigate(routes.userpanal);
                        }
                    });
                }
            */}
            } catch (err) {
                console.log('error candidateService update', err);
            }
        },
        [doctorId,provisionalRequestType]
    );
    const getValidationSchema = () =>
        objectYup().shape({
            councilname: stringYup()
                .required('councilname  name is required.'),
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
            councilpincode: stringYup()
                .required('councilpincode is required.')
                .min(6, 'councilpincode 6 numbers'),
        });
    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
                    {!next &&
                        <div className="card-body">
                            <div className="col-9 m-auto">
                                <div className="card shadow border-0 mb-4">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <h1 className='fs-22 fw-700 me-2 mb-0'>NOC Registration Details</h1>
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
                        </div>
                    }
                    {next &&
                       
                            <div className="card-body">
                            <div className="col-9 m-auto">
                                <div className="card shadow border-0 mb-4">
                                <h1 className='fs-22 fw-700'>Council  Details</h1>
                                <hr />
                                <Formik
                                    onSubmit={submitForm}
                                    enableReinitialize
                                    initialValues={initialFormData}
                                    validationSchema={getValidationSchema}
                                >
                                    {(formikProps: FormikProps<nocUserFormType>) => {
                                        const { isValid, handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm, errors } = formikProps;
                                        return (
                                           
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="card-body">

                                                            <div className="px-3">
                                                            <div className="row mb-2">
                                                            <div className="col-sm-auto">
                                                            <label className="mb-2"> Noc Request Type</label>
                                                            <select
                                                                value={provisionalRequestType}
                                                                onChange={(ev) => {
                                                                    setProvisionalRequestType(ev.target.value);
                                                                }}
                                                                className="form-select"
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="nor">Normal</option>
                                                                <option value="tat">Tatkal</option>
                                                            </select>
                                                        </div>
                                                        </div>

                                                                <div className="row mb-3">
                                                                    <label className="col-sm-2 col-form-label">Council Name</label>
                                                                    <div className="col-sm-4">
                                                                        <Field name="councilname">
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
                                                                                            placeholder="Enter Council name"
                                                                                            tabIndex={3}
                                                                                        />
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
                                                                                            name="country"
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
                                                                    <label className="col-sm-2 col-form-label">Council Pincode</label>
                                                                    <div className="col-sm-4">
                                                                        <Field name="councilpincode">
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

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-footer">
                                                            <div className="w-100 text-end">
                                                                <button type='button' onClick={() => { setNext(false) }} className='btn btn-primary me-3'><i className="bi-chevron-left"></i>Back </button>
                                                                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                                                    {isSubmitting && <span className="spinner-border spinner-border-sm" />} Submit
                                                                </button>
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

export default NocRegistration;