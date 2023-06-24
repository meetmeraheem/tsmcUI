import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { date as dateYup, object as objectYup, string as stringYup, number as numberYup } from 'yup';
import { useCallback, useEffect, useState, useMemo } from 'react';
import getValue from 'lodash/get';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
//@ts-ignore
import Files from 'react-files';
import { College, Country, Qualification, Serials, State, University } from '../../types/common';
import { FinalEditFormType, FinalProfileType } from '../../types/final';
import { ReactFilesError, ReactFilesFile } from '../../types/files';
import { isLessThanTheMB } from '../../lib/utils/lessthan-max-filesize';
import { Messages } from '../../lib/constants/messages';
import { commonService } from '../../lib/api/common';
import Swal from 'sweetalert2';
import { routes } from '../routes/routes-names';
import { finalService } from '../../lib/api/final';
import { LocalStorageManager } from '../../lib/localStorage-manager';
import { doctorService } from '../../lib/api/doctot';
import { dateDuration } from '../../lib/utils/dateDuration';
import { provisionalService } from '../../lib/api/provisional';
import moment from 'moment';

const FinalDataEdit = () => {
    const navigate = useNavigate();
    const [final, setFinal] = useState<FinalProfileType>();
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [universities, setUniversities] = useState<University[]>([]);
    const [colleges, setColleges] = useState<College[]>([]);
    const [qualifications, setQualifications] = useState<Qualification[]>([]);
    const [applicationForm, setApplicationForm] = useState<{ file?: File; error?: string } | null>(null);
    const [mbbsCertificate, setMBBSCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [nocCertificate, setNOCCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [affidavitCertificate, setAffidavitCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [testimonal1, setTestimonal1] = useState<{ file?: File; error?: string } | null>(null);
    const [testimonal2, setTestimonal2] = useState<{ file?: File; error?: string } | null>(null);
    const [registrationOfOtherStateCertificate, setRegistrationOfOtherStateCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [screeningTestPassCertificate, setScreeningTestPassCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [internshipCompletionCertificate, setInternshipCompletionCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [mciEligibilityCertificate, setMCIEligibilityCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [intermediateVerificationCertificate, setIntermediateVerificationCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [mciRegisrationCertificate, setMCIRegisrationCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [imrCertificate, setIMRCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [duration, setDuration] = useState('');
    const [isIndia, setIsIndia] = useState(false);
    const [isPMRDateAbove15M, setIsPMRDateAbove15M] = useState(false);
    const [isPMRDateAbove18M, setIsPMRDateAbove18M] = useState(false);
    const [isTelangana, setIsTelangana] = useState(false);

    const initialFormData = useMemo(
        () => ({
            country: Number(final?.country) || 0,
            state: Number(final?.state) || 0,
            university: final?.university || '',
            college: final?.college || '',
            qualification: Number(final?.qualification) || 0,
            exam_month: final?.exam_month || '',
            exam_year: final?.exam_year || '',
            duration: final?.duration || '',
            edu_cert1: final?.edu_cert1 || '',
            edu_cert2: final?.edu_cert2 || '',
            edu_cert3: final?.edu_cert3 || '',
            affidivit: final?.affidivit || '',
            testimonal1: final?.testimonal1 || '',
            testimonal2: final?.testimonal2 || '',
            reg_other_state: final?.reg_other_state || '',
            screen_test: final?.screen_test || '',
            intership_comp: final?.internship_comp || '',
            mci_eligi: final?.mci_eligi || '',
            inter_verif_cert: final?.inter_verif_cert || '',
            mci_reg: final?.mci_reg || '',
            imr_certificate: final?.imr_certificate || '',
        }),
        [final]
    );

    const getFinalDetails = useCallback(async () => {
        try {
            const doctorSerialId = LocalStorageManager.getDoctorSerialId();
            if (doctorSerialId) {
                const { data } = await finalService.getFinal(doctorSerialId);
                if (data.length > 0) {
                    setFinal(data[0]);
                    if (data[0].country === 101) {
                        setIsIndia(true);
                    } else {
                        setIsIndia(false);
                    }
                    if (data[0].state === 36) {
                        setIsTelangana(true);
                    } else {
                        setIsTelangana(false);
                    }
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
        async (values: FinalEditFormType) => {
            try {
                const finalInfo = {
                    ...values,
                    modifiedon: moment().format('YYYY-MM-DD h:mm:ss'),
                    duration: duration.toUpperCase()
                }
                if (final) {
                    const formData = new FormData();
                    formData.append("finalInfo", JSON.stringify(finalInfo));
                    if (applicationForm?.file) {
                        formData.append("af", applicationForm?.file);
                    }
                    if (mbbsCertificate?.file) {
                        formData.append("mbbs", mbbsCertificate?.file);
                    }
                    if (nocCertificate?.file) {
                        formData.append("noc", nocCertificate?.file);
                    }
                    if (affidavitCertificate?.file) {
                        formData.append("affidavit", affidavitCertificate?.file);
                    }
                    if (testimonal1?.file) {
                        formData.append("testimonal1", testimonal1?.file);
                    }
                    if (testimonal2?.file) {
                        formData.append("testimonal2", testimonal2?.file);
                    }
                    if (registrationOfOtherStateCertificate?.file) {
                        formData.append("regOfOtherState", registrationOfOtherStateCertificate?.file);
                    }
                    if (screeningTestPassCertificate?.file) {
                        formData.append("screeningTestPass", screeningTestPassCertificate?.file);
                    }
                    if (internshipCompletionCertificate?.file) {
                        formData.append("internshipComp", internshipCompletionCertificate?.file);
                    }
                    if (mciEligibilityCertificate?.file) {
                        formData.append("mciEligibility", mciEligibilityCertificate?.file);
                    }
                    if (intermediateVerificationCertificate?.file) {
                        formData.append("interVerification", intermediateVerificationCertificate?.file);
                    }
                    if (mciRegisrationCertificate?.file) {
                        formData.append("mciReg", mciRegisrationCertificate?.file);
                    }
                    if (imrCertificate?.file) {
                        formData.append("imr", imrCertificate?.file);
                    }
                    const { success } = await finalService.updateFinalData(final?.id, formData);
                    if (success) {
                        Swal.fire({
                            title: "Success",
                            text: "Final successfully Updated",
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
                    text: "Final registeration failed",
                    icon: "error",
                    confirmButtonText: "OK",
                })
            }
        },
        [applicationForm,mbbsCertificate,nocCertificate,affidavitCertificate,testimonal1,testimonal2,registrationOfOtherStateCertificate,screeningTestPassCertificate,internshipCompletionCertificate,mciEligibilityCertificate,intermediateVerificationCertificate,mciRegisrationCertificate,imrCertificate,final, duration]
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
            edu_cert1: stringYup()
                .required('Application form is required.'),
            edu_cert2: stringYup()
                .required('MBBS certificate is required.'),
            edu_cert3: stringYup().when(['country', 'state'], {
                is: (country: any, state: any) => (country == 101 && state != 36 && !isPMRDateAbove15M),
                then: stringYup().required('NOC is required.'),
                otherwise: stringYup()
            }),
            reg_other_state: stringYup().when(['country', 'state'], {
                is: (country: any, state: any) => (country == 101 && state != 36 && !isPMRDateAbove15M),
                then: stringYup().required('Registration of other state certificate is required.'),
                otherwise: stringYup()
            }),
            affidivit: stringYup().when(['country', 'state'], {
                is: (country: any, state: any) => ((country != 101) || (country == 101 && state == 36 && isPMRDateAbove15M)),
                then: stringYup().required('affidivit is required.'),
                otherwise: stringYup()
            }),
            testimonal1: stringYup().when(['country', 'state'], {
                is: (country: any, state: any) => (country == 101 && state == 36 && isPMRDateAbove15M && isPMRDateAbove18M),
                then: stringYup().required('Testimonal1 is required.'),
                otherwise: stringYup()
            }),
            testimonal2: stringYup().when(['country', 'state'], {
                is: (country: any, state: any) => (country == 101 && state == 36 && isPMRDateAbove15M && isPMRDateAbove18M),
                then: stringYup().required('Testimonal2 is required.'),
                otherwise: stringYup()
            }),
            screen_test: stringYup().when(['country'], {
                is: (country: any) => (country != 101),
                then: stringYup().required('Screening test pass certificate is required.'),
                otherwise: stringYup()
            }),
            intership_comp: stringYup().when(['country'], {
                is: (country: any) => (country != 101),
                then: stringYup().required('Internship completion certificate is required.'),
                otherwise: stringYup()
            }),
            mci_eligi: stringYup().when(['country'], {
                is: (country: any) => (country != 101),
                then: stringYup().required('MCI eligibility certificate is required.'),
                otherwise: stringYup()
            }),
            inter_verif_cert: stringYup().when(['country'], {
                is: (country: any) => (country != 101),
                then: stringYup().required('Intermediate verification certificate is required.'),
                otherwise: stringYup()
            }),
            mci_reg: stringYup().when(['country'], {
                is: (country: any) => (country != 101),
                then: stringYup().required('MCI regisration certificate is required.'),
                otherwise: stringYup()
            }),
            imr_certificate: stringYup().when(['country'], {
                is: (country: any) => (country != 101),
                then: stringYup().required('IMR certificate is required.'),
                otherwise: stringYup()
            }),
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
                                    {(formikProps: FormikProps<FinalEditFormType>) => {
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
                                                                            <label className="mb-2">Exam Month</label>
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
                                                                            <label className="mb-2">Exam Year</label>
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
                                                    <div className="w-100 text-end mt-3">
                                                        <button type='button' onClick={() => { navigate(routes.userpanal); }} className='btn btn-primary me-3'><i className="bi-chevron-left"></i>Back </button>
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

