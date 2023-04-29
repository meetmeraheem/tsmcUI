import { Field, FieldProps, Formik, FormikProps } from "formik";
import { object as objectYup, string as stringYup, number as numberYup } from 'yup';
import getValue from 'lodash/get';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
//@ts-ignore
import Files from 'react-files';
import { ProvisionalEditFormType, ProvisionalProfileType } from "../../types/provisional";
import { ReactFilesError, ReactFilesFile } from "../../types/files";
import { useCallback, useEffect, useMemo, useState } from "react";
import { commonService } from "../../lib/api/common";
import { College, Country, Qualification, Serials, State, University } from "../../types/common";
import { provisionalService } from "../../lib/api/provisional";
import { routes } from "../routes/routes-names";
import { isLessThanTheMB } from "../../lib/utils/lessthan-max-filesize";
import { Messages } from "../../lib/constants/messages";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import Swal from "sweetalert2";
import moment from "moment";

const EditProvisional = () => {
    const navigate = useNavigate();
    const [provisional, setProvisional] = useState<ProvisionalProfileType | null>(null);
    const [qualifications, setQualifications] = useState<Qualification[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [universities, setUniversities] = useState<University[]>([]);
    const [colleges, setColleges] = useState<College[]>([]);
    const [provisionalCertificate, setProvisionalCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [applicationForm, setApplicationForm] = useState<{ file?: File; error?: string } | null>(null);
    const [nocCertificate, setNOCCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [provisionalRequestType, setProvisionalRequestType] = useState<string>('nor');

    const initialFormData = useMemo(
        () => ({
            qualification: Number(provisional?.qualification) || 0,
            exam_month: provisional?.exam_month || '',
            exam_year: provisional?.exam_year || '',
            country: Number(provisional?.country) || 0,
            state: Number(provisional?.state) || 0,
            university: provisional?.university || '',
            college: provisional?.college || '',
            edu_cert1: provisional?.edu_cert1 || '',
            edu_cert2: provisional?.edu_cert2 || '',
            edu_cert3: provisional?.edu_cert3 || ''
        }),
        [provisional]
    );

    const getProvisionalDetails = useCallback(async () => {
        try {
            const doctorSerialId = LocalStorageManager.getDoctorSerialId();
            if (doctorSerialId) {
                const { data } = await provisionalService.getProvisionalByDoctorId(Number(doctorSerialId));
                if (data.length > 0) {
                    setProvisional(data[0]);
                    getStates(data[0]?.country);
                    const universityList = await getUniversityNames(data[0]?.state);
                    const univerOBJ = universityList.filter((obj: any) => obj.university == data[0]?.university);
                    getColleges(univerOBJ[0].id);
                }
            }
        } catch (err) {
            console.log('error getProvisionalDetails', err);
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
        getProvisionalDetails();
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
    }, [universities]);

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
        async (values: ProvisionalEditFormType) => {
            try {
                const provisionalInfo = {
                    ...values,
                    modifiedon: moment().format('YYYY-MM-DD h:mm:ss'),
                    extra_col1:provisionalRequestType
                }
                const formData = new FormData();
                formData.append("provisionalInfo", JSON.stringify(provisionalInfo));
                if (provisionalCertificate?.file) {
                    formData.append("pc", provisionalCertificate?.file);
                }
                if (applicationForm?.file) {
                    formData.append("af", applicationForm?.file);
                }
                if (nocCertificate?.file) {
                    formData.append("noc", nocCertificate?.file);
                }
                if (provisional) {
                    const { success } = await provisionalService.updateSingleProvisional(Number(provisional?.id), formData);
                    if (success) {
                        Swal.fire({
                            title: "Success",
                            text: "Provisional successfully Updated",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                navigate(routes.userpanal);
                            }
                        });
                    }
                }
            } catch (err) {
                Swal.fire({
                    //title: "Error",
                    text: "Provisional registered failed",
                    icon: "error",
                    confirmButtonText: "OK",
                })
                console.log('error in provisional registeration update', err);
            }
        },
        [provisional, provisionalCertificate, applicationForm, nocCertificate]
    );

    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
                    <div className="col-9 m-auto">
                        <div className="card shadow border-0 mb-4">
                            <div className="card-body">
                                <h1 className='fs-22 fw-700'>Update Provisional</h1>
                                <label className="mb-2">Provisional Request Type</label>
                                <select
                                    value={provisionalRequestType}
                                    onChange={(ev) => {
                                        setProvisionalRequestType(ev.target.value);
                                    }}
                                >
                                    <option value="nor">Normal</option>
                                    <option value="tat">Tatkal</option>
                                </select>
                                <hr />
                                <Formik
                                    onSubmit={submitForm}
                                    enableReinitialize
                                    initialValues={initialFormData}
                                >
                                    {(formikProps: FormikProps<ProvisionalEditFormType>) => {
                                        const { isValid, handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm } = formikProps;

                                        return (
                                            <form onSubmit={handleSubmit}>
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
                                                                                } form-select-sm`}
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
                                                                        <label className="mb-2">Exam Month</label>
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
                                                                                } form-select-sm`}
                                                                        >
                                                                            <option value="">Select Month</option>
                                                                            <option value="JAN">January</option>
                                                                            <option value="FEB">February</option>
                                                                            <option value="MAR">March</option>
                                                                            <option value="APR">April</option>
                                                                            <option value="MAY">May</option>
                                                                            <option value="JUNE">June</option>
                                                                            <option value="JULY">July</option>
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
                                                                        <label className="mb-2">Exam Year</label>
                                                                        <input
                                                                            type="text"
                                                                            value={field.value}
                                                                            onChange={(ev) => {
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(field.name, Number(ev.target.value));
                                                                            }}
                                                                            className={`form-control ${error ? 'is-invalid' : ''
                                                                                }`}
                                                                            placeholder="Enter exam year"
                                                                            maxLength={4}
                                                                        />

                                                                        {error && <small className="text-danger">{error.toString()}</small>}


                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>
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
                                                <div className="row mb-2">
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

                                                </div>
                                                <div className="row mb-2">
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
                                                    <div className="col">

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
                                                                                    // if (provisionalCertificate?.file) {
                                                                                    //     setFieldValue(field.name, '');
                                                                                    //     setProvisionalCertificate(null);
                                                                                    // }
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
                                                                                clickable
                                                                            >
                                                                                <div className="drag-drop-box mt-3">
                                                                                    <div className="text-center">
                                                                                        <i className="bi-file-earmark-break fs-32"></i>
                                                                                        <p className='fs-13'>Upload Provisional Certificate</p>
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
                                                                                clickable
                                                                            >
                                                                                <div className="drag-drop-box mt-3">
                                                                                    <div className="text-center">
                                                                                        <i className="bi-file-earmark-break fs-32"></i>
                                                                                        <p className='fs-13'>Upload Application Form</p>
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
                                                    <div className="col">
                                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                            <Field name="edu_cert3">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    const file = nocCertificate?.file
                                                                        ? nocCertificate?.file.name
                                                                        : field.value || null;
                                                                    return file ? (
                                                                        <p className="d-flex align-items-center">
                                                                            <strong>Uploaded:</strong>
                                                                            <span className="ms-1">{file}</span>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    setFieldValue(field.name, '');
                                                                                    setNOCCertificate(null);
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
                                                                                            setNOCCertificate({ file });
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
                                                                                <div className="drag-drop-box mt-3">
                                                                                    <div className="text-center">
                                                                                        <i className="bi-file-earmark-break fs-32"></i>
                                                                                        <p className='fs-13'>Upload NOC</p>
                                                                                    </div>
                                                                                </div>
                                                                            </Files>
                                                                            <small className="text-danger mt-1">
                                                                                {nocCertificate?.error}
                                                                            </small>
                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-100 text-end mt-3">
                                                    <button type='button' onClick={() => { navigate(routes.userpanal); }} className='btn btn-primary me-3'><i className="bi-chevron-left"></i>Back </button>
                                                    <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                                        {isSubmitting && <span className="spinner-border spinner-border-sm" />} Update
                                                    </button>
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

export default EditProvisional;

const getValidationSchema = () =>
    objectYup().shape({
        qualification: stringYup()
            .required('Qualification is required.'),
        exam_month: stringYup()
            .required('Exam Month is required.'),
        exam_year: stringYup()
            .required('Exam year is required.')
            .min(4, 'Exam year must 4 numbers.'),
        country: stringYup()
            .required('Country is required.'),
        state: stringYup()
            .required('State is required.'),
        university: stringYup()
            .required('University Name is required.'),
        college: stringYup()
            .required('College Name is required.'),
        edu_cert1: stringYup()
            .required('Provisional certificate is required.'),
        edu_cert2: stringYup()
            .required('Application Form is required.'),
        edu_cert3: stringYup()
            .required('NOC is required.'),
    });