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
import { ReactFilesError, ReactFilesFile } from '../../types/files';
import { isLessThanTheMB } from '../../lib/utils/lessthan-max-filesize';
import { Messages } from '../../lib/constants/messages';
import { commonService } from '../../lib/api/common';
import Swal from 'sweetalert2';
import { routes } from '../routes/routes-names';
import { additionalService } from '../../lib/api/additional';
import { LocalStorageManager } from '../../lib/localStorage-manager';
import { doctorService } from '../../lib/api/doctot';
import { dateDuration } from '../../lib/utils/dateDuration';
import { provisionalService } from '../../lib/api/provisional';
import moment from 'moment';
import { authService } from '../../lib/api/auth';
import DoctorInfoCard from "./includes/doctor-info";
import secureLocalStorage from 'react-secure-storage';

const GoodStandingRegistration = () => {
    const navigate = useNavigate();
    const [next, setNext] = useState(false);
    const [finalSerial, setFinalSerial] = useState<Serials>();
    const [fmrNo, setFMRNo] = useState(0);
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [universities, setUniversities] = useState<University[]>([]);
    const [colleges, setColleges] = useState<College[]>([]);
    const [qualifications, setQualifications] = useState<Qualification[]>([]);
    const [studyCertificate, setStudyCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [DegreeCertificate, setDegreeCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [duration, setDuration] = useState('');
    const [isIndia, setIsIndia] = useState(false);
    const [isPMRDateAbove15M, setIsPMRDateAbove15M] = useState(false);
    const [isPMRDateAbove18M, setIsPMRDateAbove18M] = useState(false);
    const [isTelangana, setIsTelangana] = useState(false);

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
        imr_certificate: ''
    }

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
                const goodstandingInfo = {
                    createdon: moment().format('YYYY-MM-DD'),
                    duration: duration,
                    posttime: moment().format('h:mm:ss'),
                    doctor_id: doctorId && Number(doctorId),
                    prefix: 'TSMC',
                    approval_status: 'pen',
                    row_type: 'on',
                    reg_date: moment().format('YYYY-MM-DD'),
                    doctorPrimaryId:doctorPrimaryId,
                }
                secureLocalStorage.setItem("regType", 'goodstandingInfo');
                secureLocalStorage.setItem("goodstandingInfo", goodstandingInfo);
                navigate(routes.payment, {state:{doctor_id:Number(doctorId),regType:'goodstandingInfo'}});

                {/*
                const { success } = await additionalService.additionalRegistration(formData);
                if (success) {
                    const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());
                  

                    setStudyCertificate(null);
                    setDegreeCertificate(null);

                    Swal.fire({
                        title: "Success",
                        text: "Good standing Info registration successfully completed",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            const doctorMobileno = LocalStorageManager.getDoctorMobileno();
                            if (doctorMobileno) {
                                await authService.sendSMS(doctorMobileno, 'Your Application Submitted for Additional Qualification Registration to Telangana State Medical Council is under Process.').then((response) => {

                                }).catch(() => {

                                });
                            }
                            navigate(routes.userpanal);
                        }
                    });
                }*/}
            } catch (err) {
                Swal.fire({
                    text: "Good standing  registeration failed",
                    icon: "error",
                    confirmButtonText: "OK",
                })
            }
        },
        [ studyCertificate,  DegreeCertificate,  finalSerial, fmrNo]
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
                .required('Study certificate is required.'),
            edu_cert2: stringYup().when(['country', 'state'], {
                is: (country: any, state: any) => ((country != 101) || (country == 101 && state == 36 && isPMRDateAbove15M)),
                then: stringYup().required('Degree is required.'),
                otherwise: stringYup()
            }),

        });

    return (
        <>
            <section className='gray-banner'>
            <div className="container mt-4">
            {!next && <div className="col-9 m-auto">
                        <div className="card shadow border-0 mb-4">
                            <div className="card-body">
                            <div className="mt-3">
                                <div className="d-flex align-items-center">
                                    <h1 className='fs-22 fw-700 me-2 mb-0'>Good standing Registration</h1>
                                    <p className='mb-0 fs-13'>(Please check your personal details and click on next)</p>
                                    
                                </div>
                                <hr />
                                <DoctorInfoCard />
                            </div>
                            <div className="card-footer text-end">
                                <button type='submit' onClick={() => submitForm} className='btn btn-primary'>Next <i className="bi-chevron-right"></i></button>
                            </div>
                        </div>
                        </div>
                    </div>  
                    }
                    </div>
                </section>
            </>
    )
};


export default GoodStandingRegistration;