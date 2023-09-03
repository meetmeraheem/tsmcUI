import { Field, FieldProps, Formik, FormikProps } from "formik";
import { date as dateYup, object as objectYup, string as stringYup, number as numberYup } from 'yup';
import Select from 'react-select';
//@ts-ignore
import Files from 'react-files';
import getValue from 'lodash/get';
import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { commonService } from "../../../lib/api/common";
import { City, Country, State } from "../../../types/common";
import { DoctorFormType, DoctorProfileType } from "../../../types/doctor";
import { adminEditService } from '../../../lib/api/adminedits';
import { doctorService} from '../../../lib/api/doctot';
import { LocalStorageManager } from '../../../lib/localStorage-manager';
import moment from "moment";

const ProfileDataEdit = (props: any) => {

    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [doctorPrimaryId, setDoctorPrimaryId] = useState(0);
    const [doctor, setDoctor] = useState<DoctorProfileType | null>(null);


    const initialFormData = useMemo(
        () => ({
            fullname: doctor?.fullname || '',
            fathername: doctor?.fathername || '',
            mothername: doctor?.mothername || '',
            dateofbirth: (doctor?.dateofbirth && new Date(doctor?.dateofbirth)) || new Date(),
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
            const doctorPrimaryId = Number(props.doctorId);
            if (doctorPrimaryId) {
                setDoctorPrimaryId(doctorPrimaryId);
                const getDoctor = await doctorService.getDoctorById(doctorPrimaryId);
                if (getDoctor.data.length > 0) {
                    if (getDoctor.data[0]?.country !== null) {
                        getStates(getDoctor.data[0]?.country);
                        getCities(getDoctor.data[0]?.state);
                    }
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
                const adminPrimaryId = Number(LocalStorageManager.getAdminPrimaryId());
                const doctorInfo = {
                    ...values,
                    modifiedon: moment().format('YYYY-MM-DD h:mm:ss'),
                    fathername: values.fathername.toUpperCase(),
                    mothername: values.mothername.toUpperCase(),
                    address1: values.address1.toUpperCase(),
                    address2: values.address2.toUpperCase(),
                    dateofbirth: moment(values.dateofbirth).format('YYYY-MM-DD'),
                    adminPrimaryId:adminPrimaryId,
                    
                }
                const formData = new FormData();
                formData.append("doctorInfo", JSON.stringify(doctorInfo));
                const { success } = await adminEditService.updateDoctorProfileByAdmin(doctorPrimaryId, formData);
                if (success) {
                    Swal.fire({
                        title: "Success",
                        text: "Successfully Updated",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            
                        }
                    });
                }

            } catch (err) {
                console.log('error candidateService update', err);
            }
        },
        [doctorPrimaryId]
    );
    return (
        <>

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
                            <div className="card  border">
                                <form onSubmit={handleSubmit}>
                                    <div className="card-body">
                                        <div className="w-100">
                                            <h1 className='fs-22 fw-700'>Edit Profile</h1>
                                            <hr />
                                        </div>
                                        <div className="px-3">
                                            <div className="row mb-3">
                                                <label className="col-sm-2 col-form-label">Full Name <p className="fs-10 text-secondary" >(As per MBBS certificate)</p></label>
                                                <div className="col-sm-4">
                                                    <div className="form-control mb-3">{doctor?.fullname}</div>
                                                </div>

                                                <label className="col-sm-2 col-form-label">Mobile No</label>
                                                <div className="col-sm-4">
                                                    <div className="form-control mb-3">{doctor?.mobileno}</div>
                                                </div>

                                                <div className="row mb-3">
                                                    <label className="col-sm-2 col-form-label">Gender</label>
                                                    <div className="col-sm-4">
                                                        <div className="form-control mb-3">{doctor?.gender == 'M' ? 'Male' : doctor?.gender == 'F' ? 'FeMale' : ''}</div>
                                                    </div>
                                                    <label className="col-sm-2 col-form-label">Date Of Birth<p className="fs-10 text-secondary" >(As per SSC certificate)</p></label>
                                                    <div className="col-sm-4">
                                                        <div className="form-control mb-3">{moment(doctor?.dateofbirth).format('DD/MM/YYYY')}</div>

                                                    </div>
                                                </div>
                                                <div className="border border-info" > 
                                                <div className="row mb-3">
                                                    <label className="col-sm-2 col-form-label">Father Name<p className="fs-10 text-secondary" >(As per SSC certificate/passport)</p></label>
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


                                                    <label className="col-sm-2 col-form-label">Mother Name<p className="fs-10 text-secondary" >(As per SSC certificate/passport)</p></label>
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
                                                </div>
                                                <div className="row mb-3">
                                                <label className="col-sm-2 col-form-label pr-0">Address 1</label>
                                                <div className="col">
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
                                                <div className="col">
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
                                                </div>
                                                <div className="row mb-3">
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
                                                </div>
                                                <div className="row mb-3">
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
                                            </div>
                                            </div>
                                        </div>
                                        </div>

                                    </div>
                                    <div className="card-footer">
                                        <div className="w-100 text-end">
                                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                                {isSubmitting && <span className="spinner-border spinner-border-sm" />} Update
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        );
                    }}
                </Formik>
            </div>

        </>
    )
};

export default ProfileDataEdit;

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