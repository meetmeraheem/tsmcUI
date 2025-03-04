import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { date as dateYup, object as objectYup, string as stringYup, number as numberYup } from 'yup';
import { useCallback, useEffect, useState } from 'react';
import getValue from 'lodash/get';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
//@ts-ignore
import Files from 'react-files';
import { College, Country, Qualification, Serials, State, University } from '../../types/common';
import { FinalFormType } from '../../types/final';
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

const FinalRegistration = () => {
    const navigate = useNavigate();
    const [next, setNext] = useState<String>("docInfo");
    const [finalSerial, setFinalSerial] = useState<Serials>();
    const [fmrNo, setFMRNo] = useState(0);
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
    const [statepmrNo, setStatepmrNo] = useState('');
    const [isIndia, setIsIndia] = useState(false);
    const [countryselected, setCountryselected] = useState(false);
    const [isPMRDateAbove15M, setIsPMRDateAbove15M] = useState(false);
    const [isPMRDateAbove18M, setIsPMRDateAbove18M] = useState(false);
    const [isTelangana, setIsTelangana] = useState(false);
    const [finalRequestType, setFinalRequestType] = useState<string>('nor');
    const [localRequestType, setLocalRequestType] = useState<string>('telangana');
    const [calc_date, setCalc_date] = useState(new Date());
    const [slotValue, setSlotValue] = useState<any>("");

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
        country: '',
        state: '',
        university: '',
        college: '',
        qualification: '',
        exam_month: '',
        exam_year: '',
        duration: '',
        edu_cert1: '',
        edu_cert2: '',
        edu_cert3: '',
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
        telanganapmrNo:'',
        calc_date:''
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
            const doctorId = LocalStorageManager.getDoctorSerialId();
            const { data } = await slotbookingService.validateSlot(slotdate,slottime);
            if(data === "SUCCESS"){
                console.log('slot data ', data);
                secureLocalStorage.setItem("finalInfo_slotValue", slotValue);
                navigate(routes.payment, {state:{doctor_id:Number(doctorId),regType:'final'}});
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
        async (values: FinalFormType) => {
            try {
                const doctorId = Number(LocalStorageManager.getDoctorSerialId());
                const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());
                if(parseInt(values.country)!==101 && finalRequestType==='tat'){
                    Swal.fire({
                        text: "TatKal Not allowed for Other Countries",
                        icon: "warning",
                        confirmButtonText: "OK",
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            window.location.href = "/my-panal/final-registration";
                        }});
                    return false;    
                }

                const finalInfo = {
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
                    extra_col1:finalRequestType,
                    doctorPrimaryId:doctorPrimaryId,
                }
                secureLocalStorage.setItem("regType", 'final');
                secureLocalStorage.setItem("finalInfo", finalInfo);

                if (applicationForm?.file) {
                    secureLocalStorage.setItem("af", applicationForm?.file);
                }
                if (mbbsCertificate?.file) {
                    secureLocalStorage.setItem("mbbs", mbbsCertificate?.file);
                }
                if (nocCertificate?.file) {
                    secureLocalStorage.setItem("noc", nocCertificate?.file);
                }
                if (affidavitCertificate?.file) {
                    secureLocalStorage.setItem("affidavit", affidavitCertificate?.file);
                }
                if (testimonal1?.file) {
                    secureLocalStorage.setItem("testimonal1", testimonal1?.file);
                }
                if (testimonal2?.file) {
                    secureLocalStorage.setItem("testimonal2", testimonal2?.file);
                }
                if (registrationOfOtherStateCertificate?.file) {
                    secureLocalStorage.setItem("regOfOtherState", registrationOfOtherStateCertificate?.file);
                }
                if (screeningTestPassCertificate?.file) {
                    secureLocalStorage.setItem("screeningTestPass", screeningTestPassCertificate?.file);
                }
                if (internshipCompletionCertificate?.file) {
                    secureLocalStorage.setItem("internshipComp", internshipCompletionCertificate?.file);
                }
                if (mciEligibilityCertificate?.file) {
                    secureLocalStorage.setItem("mciEligibility", mciEligibilityCertificate?.file);
                }
                if (intermediateVerificationCertificate?.file) {
                    secureLocalStorage.setItem("interVerification", intermediateVerificationCertificate?.file);
                }
                if (mciRegisrationCertificate?.file) {
                    secureLocalStorage.setItem("mciReg", mciRegisrationCertificate?.file);
                }
                if (imrCertificate?.file) {
                    secureLocalStorage.setItem("imr", imrCertificate?.file);
                }
                
                
                if(finalRequestType==='tat'){
                    secureLocalStorage.removeItem("finalInfo_slotValue");
                    navigate(routes.payment, {state:{doctor_id:Number(doctorId),regType:'final'}});
                }else{
                    setNext("slotInfo");
                }
                
            } catch (err) {
                Swal.fire({
                    text: "Final registeration failed",
                    icon: "error",
                    confirmButtonText: "OK",
                })
            }
        },
        [applicationForm, mbbsCertificate, nocCertificate, affidavitCertificate, testimonal1, testimonal2, registrationOfOtherStateCertificate, screeningTestPassCertificate, internshipCompletionCertificate, mciEligibilityCertificate, intermediateVerificationCertificate, mciRegisrationCertificate, imrCertificate, finalSerial, fmrNo]
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
                .required('Internship Certificate is required.'),
            calc_date: stringYup()
                .required('Internship Completion/NOC  Date is required.'),    
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
            //(!isIndia || (isIndia && isTelangana && isPMRDateAbove15M))
            // edu_cert3: stringYup()
            //     .required('NOC is required.'),
            // AffidavitCertificate: stringYup()
            //     .required('Affidavit certificate is required.'),
            // Testimonal1: stringYup()
            //     .required('Testimonal1 is required.'),
            // Testimonal2: stringYup()
            //     .required('Testimonal2 is required.'),
            // RegistrationOfOtherStateCertificate: stringYup()
            //     .required('Registration of other state certificate is required.'),
            // ScreeningTestPassCertificate: stringYup()
            //     .required('Screening test pass certificate is required.'),
            // InternshipCompletionCertificate: stringYup()
            //     .required('Internship completion certificate is required.'),
            // MCIEligibilityCertificate: stringYup()
            //     .required('MCI eligibility certificate is required.'),
            // IntermediateVerificationCertificate: stringYup()
            //     .required('Intermediate verification certificate is required.'),
            // MCIRegisrationCertificate: stringYup()
            //     .required('MCI regisration certificate is required.'),
            // IMRCertificate: stringYup()
            //     .required('IMR certificate is required.')
        });

        
    const getTatkalUpdate = useCallback(async (value:any) => {
        try {
            if(value !== 'nor'){
                const {data} = await slotbookingService.getTatkalCurrentStatus();
                    if (data === "YES") {
                        Swal.fire({
                            text: "You have selected Tatkal Service ,Additional charges applicable",
                            icon: "warning",
                            confirmButtonText: "OK",
                        })
                        setFinalRequestType('tat');
                        }else{
                            Swal.fire({
                                text: "TatKal Not allowed for Today (or) Day limit Reached",
                                icon: "warning",
                                confirmButtonText: "OK",
                            })
                            setFinalRequestType('nor');
                        }
                    }else{
                        setFinalRequestType('nor');
                    }
        } catch (err) {
            console.log('error countries getList', err);
        }
    }, []);
    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
                    {next === 'docInfo' &&  <div className="col-9 m-auto">
                        <div className="card shadow border-0 mb-4">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <h1 className='fs-22 fw-700 me-2 mb-0'>Final Registration</h1>
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

        {next === "edInfo" &&
                        <div className="col-9 m-auto">
                            <div className="card shadow border-0 mb-4">
                                <div className="card-body">
                                    <h1 className='fs-22 fw-700'>Final Registration</h1>
                                    <hr />
                                    <Formik
                                        onSubmit={submitForm}
                                        enableReinitialize
                                        initialValues={initialFormData}
                                        validationSchema={getValidationSchema()}
                                    >
                                        {(formikProps: FormikProps<FinalFormType>) => {
                                            const { errors, isValid, handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm, values } = formikProps;

                                            return (
                                                <>
                                                    {/* {!isValid && JSON.stringify(errors)} */}
                                                    <form onSubmit={handleSubmit}>
                                                    <div className="row mb-2">
                                                    <div className="col-sm-auto">
                                                            <label className="mb-2"> UG(MBBS) Completed From</label>
                                                            <select
                                                                value={localRequestType}
                                                                onChange={(ev) => {
                                                                    setLocalRequestType(ev.target.value);
                                                                }}
                                                                className="form-select"
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="telangana">Telangana</option>
                                                                <option value="non-telangana">Other State  within India </option>
                                                                <option value="other-country">Other countries</option>
                                                            </select>
                                                        </div>
                                                {(localRequestType==='telangana')?      
                                                       <div className="col-8">
                                                       <Field name="telanganapmrNo">
                                                           {(fieldProps: FieldProps) => {
                                                               const { field, form } = fieldProps;
                                                               const error =
                                                                   getValue(form.touched, field.name) &&
                                                                   getValue(form.errors, field.name);
                                                               return (
                                                                   <>
                                                                       <label className="mb-2">Telangana Provisional Registration Number  </label>
                                                                       <input
                                                                           type="text"
                                                                           value={field.value}
                                                                           onChange={(ev) => {
                                                                               setFieldTouched(field.name);
                                                                               setFieldValue(field.name, ev.target.value);
                                                                           }}
                                                                           className={`form-control ${error ? 'is-invalid' : ''
                                                                               }`}
                                                                           placeholder="Enter Telangana Provisional Registration Number"
                                                                           maxLength={100}
                                                                           required
                                                                       />
                                                                       {error && <small className="text-danger">{error.toString()}</small>}
                                                                   </>
                                                               );
                                                           }}
                                                       </Field>
                                                   </div>:""}
                                                         </div>
                                                         <div className="row mb-2">
                                                    <div className="col-sm-auto">
                                                            <label className="mb-2">Final Request Type</label>
                                                            <select
                                                                value={finalRequestType}
                                                                onChange={(ev) => {
                                                                    getTatkalUpdate(ev.target.value);
                                                                }}
                                                                className="form-select"
                                                            >
                                                                {/*  <option value="">Select</option>*/}
                                                                <option value="nor">Normal</option>
                                                                {localRequestType !=="other-country"? <option value="tat">Tatkal</option>:""}
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
                                                                                    hideSelectedOptions={countryselected}
                                                                                    placeholder="Select country"
                                                                                    onChange={(selectedOption) => {
                                                                                        const { id, name } =
                                                                                            selectedOption as Country;
                                                                                       
                                                                                        setStates([]);
                                                                                        getStates(id);
                                                                                        if (name === 'India') {
                                                                                            setIsIndia(true);
                                                                                            setFieldTouched(field.name);
                                                                                            setFieldValue(field.name, id);
                                                                                        } else {
                                                                                            if(finalRequestType==='tat'){
                                                                                                Swal.fire({
                                                                                                    text: "TatKal Not allowed for Other Countries",
                                                                                                    icon: "warning",
                                                                                                    confirmButtonText: "OK",
                                                                                                }).then(async (result) => {
                                                                                                    if (result.isConfirmed) {
                                                                                                        window.location.href = "/my-panal/final-registration";
                                                                                                    }});
                                                                                                
                                                                                                
                                                                                            }else{
                                                                                                setFieldTouched(field.name);
                                                                                                setFieldValue(field.name, id);
                                                                                            }
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
                                                                <Field name="qualification">
                                                                    {(fieldProps: FieldProps) => {
                                                                        const { field, form } = fieldProps;
                                                                        const error =
                                                                            getValue(form.touched, field.name) &&
                                                                            getValue(form.errors, field.name);
                                                                        return (
                                                                            <>
                                                                                <label className="mb-2">Qualification (as per UG Certificate)</label>
                                                                                <Select
                                                                                name="qualification"
                                                                                className="react-select"
                                                                                classNamePrefix="react-select"
                                                                                isSearchable
                                                                                options={qualifications}
                                                                                placeholder="Select Qualification"
                                                                                onChange={(selectedOption) => {
                                                                                    const { id, name } =
                                                                                        selectedOption as Qualification;
                                                                                    setFieldTouched(field.name);
                                                                                    setFieldValue(field.name, id);
                                                                                   
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
                                                            <div className="col">
                                                                <Field name="exam_month">
                                                                    {(fieldProps: FieldProps) => {
                                                                        const { field, form } = fieldProps;
                                                                        const error =
                                                                            getValue(form.touched, field.name) &&
                                                                            getValue(form.errors, field.name);
                                                                        return (
                                                                            <>
                                                                                <label className="mb-2">InternShip Completion Month</label>
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
                                                                                <label className="mb-2"> InternShip Completion Year</label>
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
                                                            <div className="row mb-2">
                                                        <div className="col-sm-auto">
                                                        <label htmlFor="CalcDate">Enter Internship Completion/NOC Date(for other states)</label>
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
                                                                                    maxDate={new Date()}
                                                                                    clearIcon={null}
                                                                                    value={calc_date}
                                                                                    onFocus={e => e.target.blur()}
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
                                                        <div className="row mb-2 mt-4">
                                                        <div className='text-danger fs-10'>
                                                                Please upload images (.jpeg,.png) only, with less than 200 KB size.  
                                                            </div>
                                                            <div className='text-danger fs-10'>
                                                                File name should not contain any special charaters and should have less than 20 character length.
                                                            </div>
                                                        </div>
                                                        <div className="row mb-2 mt-4">
                                                            <div className="col-4 mt-3">
                                                                <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                    <Field name="edu_cert1">
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
                                                                                        <i className="bi-trash"></i>
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
                                                                                        <div className="text-center">
                                                                                            <i className="bi-file-earmark-break fs-32"></i>
                                                                                            <p className='fs-13'>Upload Internship Certificate </p>
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
                                                            <div className="col-4 mt-3">
                                                                <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                    <Field name="edu_cert2">
                                                                        {(fieldProps: FieldProps) => {
                                                                            const { field, form } = fieldProps;
                                                                            const error =
                                                                                getValue(form.touched, field.name) &&
                                                                                getValue(form.errors, field.name);
                                                                            const file = mbbsCertificate?.file
                                                                                ? mbbsCertificate?.file.name
                                                                                : field.value || null;
                                                                            return file ? (
                                                                                <p className="d-flex align-items-center">
                                                                                    <strong>Uploaded:</strong>
                                                                                    <span className="ms-1">{file}</span>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            setFieldValue(field.name, '');
                                                                                            setMBBSCertificate(null);
                                                                                        }}
                                                                                        title='Delete'
                                                                                        className="ms-2 lh-1 lt-file-del-btn"
                                                                                    >
                                                                                        <i className="bi-trash"></i>
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
                                                                                                    setMBBSCertificate({ file });
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
                                                                                        <div className="text-center">
                                                                                            <i className="bi-file-earmark-break fs-32"></i>
                                                                                            <p className='fs-13'>MBBS Certificate</p>
                                                                                        </div>
                                                                                    </Files>
                                                                                    <small className="text-danger mt-1">
                                                                                        {mbbsCertificate?.error}
                                                                                    </small>
                                                                                    {error && <small className="text-danger">{error.toString()}</small>}
                                                                                </>
                                                                            );
                                                                        }}
                                                                    </Field>
                                                                </div>
                                                            </div>
                                                            {isIndia && !isTelangana && !isPMRDateAbove15M &&
                                                                <div className="col-4 mt-3">
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
                                                                                            <i className="bi-trash"></i>
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
                                                                                            accepts={['.jpeg', '.jpg','.png']}
                                                                                            clickable
                                                                                        >
                                                                                            <div className="text-center">
                                                                                                <i className="bi-file-earmark-break fs-32"></i>
                                                                                                <p className='fs-13'>Upload NOC</p>
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
                                                            }
                                                            {(!isIndia || (isIndia && isTelangana && isPMRDateAbove15M)) &&
                                                                <div className="col-4 mt-3">
                                                                    <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                        <Field name="affidivit">
                                                                            {(fieldProps: FieldProps) => {
                                                                                const { field, form } = fieldProps;
                                                                                const error =
                                                                                    getValue(form.touched, field.name) &&
                                                                                    getValue(form.errors, field.name);
                                                                                const file = affidavitCertificate?.file
                                                                                    ? affidavitCertificate?.file.name
                                                                                    : field.value || null;
                                                                                return file ? (
                                                                                    <p className="d-flex align-items-center ms-3">
                                                                                        <strong>Uploaded:</strong>
                                                                                        <span className="ms-1">{file}</span>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => {
                                                                                                setFieldValue(field.name, '');
                                                                                                setAffidavitCertificate(null);
                                                                                            }}
                                                                                            title='Delete'
                                                                                            className="ms-2 lh-1"
                                                                                        >
                                                                                            <i className="bi-trash"></i>
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
                                                                                                        setAffidavitCertificate({ file });
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
                                                                                            <div className="text-center">
                                                                                                <i className="bi-file-earmark-break fs-32"></i>
                                                                                                <p className='fs-13'>Upload Affidavit Certificate</p>
                                                                                            </div>
                                                                                        </Files>
                                                                                        <small className="text-danger mt-1">
                                                                                            {affidavitCertificate?.error}
                                                                                        </small>
                                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                                    </>
                                                                                );
                                                                            }}
                                                                        </Field>
                                                                    </div>
                                                                </div>
                                                            }
                                                            {isIndia && isTelangana && isPMRDateAbove15M && isPMRDateAbove18M &&
                                                                <><div className="col-4 mt-3">
                                                                    <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                        <Field name="testimonal1">
                                                                            {(fieldProps: FieldProps) => {
                                                                                const { field, form } = fieldProps;
                                                                                const error = getValue(form.touched, field.name) &&
                                                                                    getValue(form.errors, field.name);
                                                                                const file = testimonal1?.file
                                                                                    ? testimonal1?.file.name
                                                                                    : field.value || null;
                                                                                return file ? (
                                                                                    <p className="d-flex align-items-center ms-3">
                                                                                        <strong>Uploaded:</strong>
                                                                                        <span className="ms-1">{file}</span>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => {
                                                                                                setFieldValue(field.name, '');
                                                                                                setTestimonal1(null);
                                                                                            }}
                                                                                            title='Delete'
                                                                                            className="ms-2 lh-1"
                                                                                        >
                                                                                            <i className="bi-trash"></i>
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
                                                                                                        setTestimonal1({ file });
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
                                                                                            <div className="text-center">
                                                                                                <i className="bi-file-earmark-break fs-32"></i>
                                                                                                <p className='fs-13'>Testimonal 1</p>
                                                                                            </div>
                                                                                        </Files>
                                                                                        <small className="text-danger mt-1">
                                                                                            {testimonal1?.error}
                                                                                        </small>
                                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                                    </>
                                                                                );
                                                                            }}
                                                                        </Field>
                                                                    </div>
                                                                </div><div className="col-4 mt-3">
                                                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                            <Field name="testimonal2">
                                                                                {(fieldProps: FieldProps) => {
                                                                                    const { field, form } = fieldProps;
                                                                                    const error = getValue(form.touched, field.name) &&
                                                                                        getValue(form.errors, field.name);
                                                                                    const file = testimonal2?.file
                                                                                        ? testimonal2?.file.name
                                                                                        : field.value || null;
                                                                                    return file ? (
                                                                                        <p className="d-flex align-items-center ms-3">
                                                                                            <strong>Uploaded:</strong>
                                                                                            <span className="ms-1">{file}</span>
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => {
                                                                                                    setFieldValue(field.name, '');
                                                                                                    setTestimonal2(null);
                                                                                                }}
                                                                                                title='Delete'
                                                                                                className="ms-2 lh-1"
                                                                                            >
                                                                                                <i className="bi-trash"></i>
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
                                                                                                            setTestimonal2({ file });
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
                                                                                                <div className="text-center">
                                                                                                    <i className="bi-file-earmark-break fs-32"></i>
                                                                                                    <p className='fs-13'>Testimonal 2</p>
                                                                                                </div>
                                                                                            </Files>
                                                                                            <small className="text-danger mt-1">
                                                                                                {testimonal2?.error}
                                                                                            </small>
                                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                                        </>
                                                                                    );
                                                                                }}
                                                                            </Field>
                                                                        </div>
                                                                    </div></>
                                                            }
                                                            {isIndia && !isTelangana && !isPMRDateAbove15M &&
                                                                <div className="col-4 mt-3">
                                                                    <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                        <Field name="reg_other_state">
                                                                            {(fieldProps: FieldProps) => {
                                                                                const { field, form } = fieldProps;
                                                                                const error =
                                                                                    getValue(form.touched, field.name) &&
                                                                                    getValue(form.errors, field.name);
                                                                                const file = registrationOfOtherStateCertificate?.file
                                                                                    ? registrationOfOtherStateCertificate?.file.name
                                                                                    : field.value || null;
                                                                                return file ? (
                                                                                    <p className="d-flex align-items-center ms-3">
                                                                                        <strong>Uploaded:</strong>
                                                                                        <span className="ms-1">{file}</span>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => {
                                                                                                setFieldValue(field.name, '');
                                                                                                setRegistrationOfOtherStateCertificate(null);
                                                                                            }}
                                                                                            title='Delete'
                                                                                            className="ms-2 lh-1"
                                                                                        >
                                                                                            <i className="bi-trash"></i>
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
                                                                                                        setRegistrationOfOtherStateCertificate({ file });
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
                                                                                            <div className="text-center">
                                                                                                <i className="bi-file-earmark-break fs-32"></i>
                                                                                                <p className='fs-13'>Registration of Other State</p>
                                                                                            </div>
                                                                                        </Files>
                                                                                        <small className="text-danger mt-1">
                                                                                            {registrationOfOtherStateCertificate?.error}
                                                                                        </small>
                                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                                    </>
                                                                                );
                                                                            }}
                                                                        </Field>
                                                                    </div>
                                                                </div>
                                                            }
                                                            {!isIndia &&
                                                                <><div className="col-4 mt-3">
                                                                    <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                        <Field name="screen_test">
                                                                            {(fieldProps: FieldProps) => {
                                                                                const { field, form } = fieldProps;
                                                                                const error = getValue(form.touched, field.name) &&
                                                                                    getValue(form.errors, field.name);
                                                                                const file = screeningTestPassCertificate?.file
                                                                                    ? screeningTestPassCertificate?.file.name
                                                                                    : field.value || null;
                                                                                return file ? (
                                                                                    <p className="d-flex align-items-center ms-3">
                                                                                        <strong>Uploaded:</strong>
                                                                                        <span className="ms-1">{file}</span>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => {
                                                                                                setFieldValue(field.name, '');
                                                                                                setScreeningTestPassCertificate(null);
                                                                                            }}
                                                                                            title='Delete'
                                                                                            className="ms-2 lh-1"
                                                                                        >
                                                                                            <i className="bi-trash"></i>
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
                                                                                                        setScreeningTestPassCertificate({ file });
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
                                                                                            <div className="text-center">
                                                                                                <i className="bi-file-earmark-break fs-32"></i>
                                                                                                <p className='fs-13'>Screening Test Pass Certificate</p>
                                                                                            </div>
                                                                                        </Files>
                                                                                        <small className="text-danger mt-1">
                                                                                            {screeningTestPassCertificate?.error}
                                                                                        </small>
                                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                                    </>
                                                                                );
                                                                            }}
                                                                        </Field>
                                                                    </div>
                                                                </div><div className="col-4 mt-3">
                                                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                            <Field name="intership_comp">
                                                                                {(fieldProps: FieldProps) => {
                                                                                    const { field, form } = fieldProps;
                                                                                    const error = getValue(form.touched, field.name) &&
                                                                                        getValue(form.errors, field.name);
                                                                                    const file = internshipCompletionCertificate?.file
                                                                                        ? internshipCompletionCertificate?.file.name
                                                                                        : field.value || null;
                                                                                    return file ? (
                                                                                        <p className="d-flex align-items-center ms-3">
                                                                                            <strong>Uploaded:</strong>
                                                                                            <span className="ms-1">{file}</span>
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => {
                                                                                                    setFieldValue(field.name, '');
                                                                                                    setInternshipCompletionCertificate(null);
                                                                                                }}
                                                                                                title='Delete'
                                                                                                className="ms-2 lh-1"
                                                                                            >
                                                                                                <i className="bi-trash"></i>
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
                                                                                                            setInternshipCompletionCertificate({ file });
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
                                                                                                <div className="text-center">
                                                                                                    <i className="bi-file-earmark-break fs-32"></i>
                                                                                                    <p className='fs-13'>Internship Completion</p>
                                                                                                </div>
                                                                                            </Files>
                                                                                            <small className="text-danger mt-1">
                                                                                                {internshipCompletionCertificate?.error}
                                                                                            </small>
                                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                                        </>
                                                                                    );
                                                                                }}
                                                                            </Field>
                                                                        </div>
                                                                    </div><div className="col-4 mt-3">
                                                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                            <Field name="mci_eligi">
                                                                                {(fieldProps: FieldProps) => {
                                                                                    const { field, form } = fieldProps;
                                                                                    const error = getValue(form.touched, field.name) &&
                                                                                        getValue(form.errors, field.name);
                                                                                    const file = mciEligibilityCertificate?.file
                                                                                        ? mciEligibilityCertificate?.file.name
                                                                                        : field.value || null;
                                                                                    return file ? (
                                                                                        <p className="d-flex align-items-center ms-3">
                                                                                            <strong>Uploaded:</strong>
                                                                                            <span className="ms-1">{file}</span>
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => {
                                                                                                    setFieldValue(field.name, '');
                                                                                                    setMCIEligibilityCertificate(null);
                                                                                                }}
                                                                                                title='Delete'
                                                                                                className="ms-2 lh-1"
                                                                                            >
                                                                                                <i className="bi-trash"></i>
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
                                                                                                            setMCIEligibilityCertificate({ file });
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
                                                                                                <div className="text-center">
                                                                                                    <i className="bi-file-earmark-break fs-32"></i>
                                                                                                    <p className='fs-13'>MCI Eligibility</p>
                                                                                                </div>
                                                                                            </Files>
                                                                                            <small className="text-danger mt-1">
                                                                                                {mciEligibilityCertificate?.error}
                                                                                            </small>
                                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                                        </>
                                                                                    );
                                                                                }}
                                                                            </Field>

                                                                        </div>
                                                                    </div><div className="col-4 mt-3">
                                                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                            <Field name="inter_verif_cert">
                                                                                {(fieldProps: FieldProps) => {
                                                                                    const { field, form } = fieldProps;
                                                                                    const error = getValue(form.touched, field.name) &&
                                                                                        getValue(form.errors, field.name);
                                                                                    const file = intermediateVerificationCertificate?.file
                                                                                        ? intermediateVerificationCertificate?.file.name
                                                                                        : field.value || null;
                                                                                    return file ? (
                                                                                        <p className="d-flex align-items-center ms-3">
                                                                                            <strong>Uploaded:</strong>
                                                                                            <span className="ms-1">{file}</span>
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => {
                                                                                                    setFieldValue(field.name, '');
                                                                                                    setIntermediateVerificationCertificate(null);
                                                                                                }}
                                                                                                title='Delete'
                                                                                                className="ms-2 lh-1"
                                                                                            >
                                                                                                <i className="bi-trash"></i>
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
                                                                                                            setIntermediateVerificationCertificate({ file });
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
                                                                                                <div className="text-center">
                                                                                                    <i className="bi-file-earmark-break fs-32"></i>
                                                                                                    <p className='fs-13'>Board of Intermediate Verification Certificate</p>
                                                                                                </div>
                                                                                            </Files>
                                                                                            <small className="text-danger mt-1">
                                                                                                {intermediateVerificationCertificate?.error}
                                                                                            </small>
                                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                                        </>
                                                                                    );
                                                                                }}
                                                                            </Field>

                                                                        </div>
                                                                    </div><div className="col-4 mt-3">
                                                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                            <Field name="mci_reg">
                                                                                {(fieldProps: FieldProps) => {
                                                                                    const { field, form } = fieldProps;
                                                                                    const error = getValue(form.touched, field.name) &&
                                                                                        getValue(form.errors, field.name);
                                                                                    const file = mciRegisrationCertificate?.file
                                                                                        ? mciRegisrationCertificate?.file.name
                                                                                        : field.value || null;
                                                                                    return file ? (
                                                                                        <p className="d-flex align-items-center ms-3">
                                                                                            <strong>Uploaded:</strong>
                                                                                            <span className="ms-1">{file}</span>
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => {
                                                                                                    setFieldValue(field.name, '');
                                                                                                    setMCIRegisrationCertificate(null);
                                                                                                }}
                                                                                                title='Delete'
                                                                                                className="ms-2 lh-1"
                                                                                            >
                                                                                                <i className="bi-trash"></i>
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
                                                                                                            setMCIRegisrationCertificate({ file });
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
                                                                                                <div className="text-center">
                                                                                                    <i className="bi-file-earmark-break fs-32"></i>
                                                                                                    <p className='fs-13'>MCI Registration</p>
                                                                                                </div>
                                                                                            </Files>
                                                                                            <small className="text-danger mt-1">
                                                                                                {mciRegisrationCertificate?.error}
                                                                                            </small>
                                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                                        </>
                                                                                    );
                                                                                }}
                                                                            </Field>
                                                                        </div>
                                                                    </div><div className="col-4 mt-3">
                                                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                            <Field name="imr_certificate">
                                                                                {(fieldProps: FieldProps) => {
                                                                                    const { field, form } = fieldProps;
                                                                                    const error = getValue(form.touched, field.name) &&
                                                                                        getValue(form.errors, field.name);
                                                                                    const file = imrCertificate?.file
                                                                                        ? imrCertificate?.file.name
                                                                                        : field.value || null;
                                                                                    return file ? (
                                                                                        <p className="d-flex align-items-center ms-3">
                                                                                            <strong>Uploaded:</strong>
                                                                                            <span className="ms-1">{file}</span>
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => {
                                                                                                    setFieldValue(field.name, '');
                                                                                                    setIMRCertificate(null);
                                                                                                }}
                                                                                                title='Delete'
                                                                                                className="ms-2 lh-1"
                                                                                            >
                                                                                                <i className="bi-trash"></i>
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
                                                                                                            setIMRCertificate({ file });
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
                                                                                                <div className="text-center">
                                                                                                    <i className="bi-file-earmark-break fs-32"></i>
                                                                                                    <p className='fs-13'>IMR</p>
                                                                                                </div>
                                                                                            </Files>
                                                                                            <small className="text-danger mt-1">
                                                                                                {imrCertificate?.error}
                                                                                            </small>
                                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                                        </>
                                                                                    );
                                                                                }}
                                                                            </Field>
                                                                        </div>
                                                                    </div></>
                                                            }
                                                        </div>

                                                        <div className="w-100 text-end mt-3">
                                                            {/* isValid? setNext(false):setNext(true) */}
                                                            <button type='button' onClick={() => {  setNext("docInfo")  }} className='btn btn-primary me-3'><i className="bi-chevron-left"></i>Back </button>
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

export default FinalRegistration;