import { Field, FieldProps, Formik, FormikProps } from 'formik';
import getValue from 'lodash/get';
import { nocEditFormType } from "../../types/noc";
import { date as dateYup, object as objectYup, string as stringYup, number as numberYup } from 'yup';
import Select from 'react-select';
import { City, Country, State } from "../../types/common";
import { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { nocService } from "../../lib/api/noc";
import { routes } from '../routes/routes-names';
import { LocalStorageManager } from "../../lib/localStorage-manager";
import { commonService } from "../../lib/api/common";
import { useLocation,useNavigate } from "react-router-dom";
//@ts-ignore
import Files from 'react-files';
import { ReactFilesError, ReactFilesFile } from "../../types/files";
import { Messages } from "../../lib/constants/messages";
import { isLessThanTheMB } from "../../lib/utils/lessthan-max-filesize";
import Swal from 'sweetalert2';


const EditNocViews = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [noc, setNoc] = useState<nocEditFormType>();
    const {nocPrimaryId} = location.state
    const [provisionalCertificate, setProvisionalCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [applicationForm, setApplicationForm] = useState<{ file?: File; error?: string } | null>(null);
    
    const initialFormData = useMemo(
        () => ({
            councilname:noc?.councilname|| '',
            address1: noc?.address1|| '',
            address2: noc?.address2|| '',
            country: Number(noc?.country)||0,
            state: Number(noc?.state)||0,
            city:Number(noc?.city)||0,
            councilpincode: noc?.councilpincode|| '',
            edu_cert1:noc?.edu_cert1||'',
            edu_cert2:noc?.edu_cert2||''
        }),
        [noc,provisionalCertificate,applicationForm]
    );
    const getNocDetails = useCallback(async () => {
        try {
            if (nocPrimaryId) {
                const { data } = await nocService.getNocById(nocPrimaryId);
                if (data.length > 0) {
                    setNoc({
                        councilname: data[0].councilname,
                        address1:data[0].address1,
                        address2:data[0].address2,
                        country: data[0].country,
                        councilpincode:data[0].councilpincode,
                        state: data[0].state,
                        city: data[0].city,
                        edu_cert1:data[0].edu_cert1,
                        edu_cert2:data[0].edu_cert2
                    });
                    getStates(data[0]?.country);
                    getCities(data[0].state);
                    
                }
            }
        } catch (err) {
            console.log('error getFinalDetails', err);
        }
    }, []);

    const getCountries = useCallback(async () => {
        try {
            const { data } = await commonService.getCountries();
            if (data.length) {
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
        getNocDetails();
    }, []);
    const submitForm = useCallback(
        async (values: nocEditFormType) => {
            console.log('submitForm' + JSON.stringify(values));
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
                    doctorPrimaryId:doctorPrimaryId
                }
                const formData = new FormData();
                formData.append("nocInfo", JSON.stringify(nocInfo));
                if (provisionalCertificate?.file) {
                    formData.append("nocRegCertificate", provisionalCertificate?.file);
                }
                if (applicationForm?.file) {
                    formData.append("noc_af", applicationForm?.file);
                }
                
                const { success } = await nocService.nocEditRegistration(nocPrimaryId,formData);
                if (success) {
                  
                    Swal.fire({
                        title: "Success",
                        text: "Noc Details Successfully Updated",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            if (result.isConfirmed) {
                                navigate(routes.userpanal);
                            }
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
        [noc,nocPrimaryId,provisionalCertificate,applicationForm]
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
            edu_cert1: stringYup()
                .required(' certificate is required.'),
            edu_cert2: stringYup() 
                .required('certificate is required.')
        });
    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
                            <div className="card-body">
                            <div className="col-9 m-auto">
                                <div className="card shadow border-0 mb-4">
                                <h1 className='fs-22 fw-700 m-3'>Edit Council Details</h1>
                                <hr />
                                <Formik
                                    onSubmit={submitForm}
                                    enableReinitialize
                                    initialValues={initialFormData}
                                    validationSchema={getValidationSchema()}
                                >
                                    {(formikProps: FormikProps<nocEditFormType>) => {
                                        const { errors, isValid, handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm, values } = formikProps;
                                        return (
                                           
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="card-body">

                                                            <div className="px-3">

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
                                                                                tabIndex={8}
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
                                                                                            <p className='fs-13'>Upload Certificate</p>
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
                                                                                            <p className='fs-13'>Upload  Certificate </p>
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
                                                        </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-footer">
                                                            <div className="w-100 text-end">
                                                                <button type='button'  onClick={() => { navigate(routes.userpanal); }}  className='btn btn-primary me-3'><i className="bi-chevron-left"></i>Back </button>
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
                </div>
            </section>


        </>
    )
};

export default EditNocViews;