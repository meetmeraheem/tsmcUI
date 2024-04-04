import { Field, FieldProps, Formik, FormikProps } from 'formik';
import getValue from 'lodash/get';
import { nocUserFormType } from "../../types/noc";
import { date as dateYup, object as objectYup, string as stringYup, number as numberYup } from 'yup';
import Select from 'react-select';
import { City, Country, State } from "../../types/common";
import { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { nocService } from "../../lib/api/noc";
import { doctorService } from "../../lib/api/doctot";
import { routes } from '../routes/routes-names';
import Swal from "sweetalert2";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import { commonService } from "../../lib/api/common";
import secureLocalStorage from 'react-secure-storage';
import { useLocation, useNavigate } from 'react-router-dom';
import { DoctorFormType } from '../../types/doctor';
import { serverUrl, serverImgUrl } from '../../config/constants';
import DocDefultPic from '../../assets/images/doc-default-img.jpg';
import { renewalService } from "../../lib/api/renewals";
import { AdminrenewalsType } from "../../types/common";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { authService } from '../../lib/api/auth';
import AdminDoctorInfoCard from './../dashboard/includes/admin-doctor-info';



const RenewalsViews = (props:any) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [next, setNext] = useState(false);
    const [isEduCert1, setIsEduCert1] = useState(false);
    const [isEduCert2, setIsEduCert2] = useState(false);
    const [isEduCert3, setIsEduCert3] = useState(false);
    const [renewalsData, setRenewalsData] = useState<AdminrenewalsType>();
    const [doctor, setDoctor] = useState<DoctorFormType>();
    
    const [userType, setUserType] = useState('');
    const [remarks, setRemarks] = useState('');
    const [disablebtn, setDisablebtn] = useState(false);

    const initialFormData = useMemo(
        () => ({
            councilname: '',
            address1: '',
            address2: '',
            country: 0,
            state: 0,
            city: 0,
            councilpincode: '',
            createdon: '',
            posttime: '',
            modifiedon: '',
            status: '',
            added_by: 0,
            approval_status: ''
        }),
        []
    );

    const getDoctorDetails = async () => {
                try {
                    
                    if (props.state.doctorPrimaryId) {
                        const { data } = await doctorService.getDoctorById(props.state.doctorPrimaryId);
                        if (data.length > 0) {
                            setDoctor(data[0]);
                        }
                    }
                } catch (err) {
                    console.log('error countries getList', err);
                }
            };
    const getRenewalDetails = useCallback(async () => {
        try {
            if (props.state.renewalPrimaryId) {
                const { data } = await renewalService.getRenewalById(props.state.renewalPrimaryId);
                if (data.status != null) {

                    setRenewalsData({
                        status: data.status,
                        reg_date: data.createdon,
                        doctor_id: data.doctorId,
                        edu_cert1: data.document1,
                        edu_cert2: data.document2,
                        edu_cert3: data.document3,
                        dd_amount: data.dd_amount,
                        receipt_no: data.receipt_no,
                        transanctionId: data.transanctionId,
                    });
                }
            }
        } catch (err) {
            console.log('error getProvisionalDetails', err);
        }
    }, []);
    useEffect(() => {
        const userTypeValue = LocalStorageManager.getUserType();
        userTypeValue && setUserType(userTypeValue);
        getDoctorDetails();
        getRenewalDetails();
    }, [props.state.renewalPrimaryId, props.state.doctorPrimaryId]);

    const closewindow = useCallback(async () => {
        props.greet();
    }, []);

    const submit = useCallback(async (status: any) => {
        if (status) {
            setDisablebtn(true);
            const renewalInfo = {
                approval_status: status,
                remarks: remarks,
                assignmnetId: props.state.assignmentId
            }

            const { success } = await renewalService.updateRenewal(props.state.renewalPrimaryId, renewalInfo);
            if (success) {
                let msg = "";
                let smsmsg = "";

                if (status === 'rej') {
                    msg = "Renewal Details Application Not-Approved";
                    smsmsg = "Not-Approved";
                } else if (status === 'apr') {
                    msg = "Renewal Details successfully approved";
                    smsmsg = "Approved";
                } else {
                    msg = "Renewal Details successfully Verified";
                    smsmsg = "Verified";
                }
                Swal.fire({
                    title: "",
                    text: msg,
                    icon: status === 'rej' ? "error" : "success",
                    confirmButtonText: "OK",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        if (doctor?.mobileno) {
                            await authService.sendApproval(doctor?.mobileno, smsmsg).then((response) => {
                            }).catch(() => {
                            });
                        }
                        props.greet();
                    }
                });
            }
            else {
                Swal.fire({
                    title: "",
                    text: "Renewal registration rejected",
                    icon: "error",
                    confirmButtonText: "OK",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        props.greet();
                    }
                });
            }

        }
        else {
            Swal.fire({
                //title: "Error",
                text: "something went wrong",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    }, [remarks]);

    return (
        <>
            <div className="col-8 m-auto mb-4">
                <div className="card">
                    <div className="card-body">
                        <div className="row mb-3">
                            <h3 className="col fs-18 fw-600">Renewals View</h3>
                            <div className="col-2 align-items-center justify-content-center ">
                                <button type="button"
                                    onClick={() => {
                                        closewindow();
                                    }} className='btn btn-outline-dark'><i className="bi-x-circle-fill"></i> Close</button>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <AdminDoctorInfoCard doctorId={props.state.doctorPrimaryId}></AdminDoctorInfoCard>
                        </div>

                        <div className="container mt-4">
                            {renewalsData &&
                                <div className="row tsmc-timeline mb-5">
                                    <h1 className='col fs-18 fw-700 mb-0'>Renwal Details</h1>

                                    <div className="col   mb-5">
                                        {renewalsData?.status == 'apr' &&
                                            <span className='alert alert-success px-2 py-1 fs-12 rounded-pill me-3'>
                                                <i className='bi-check-circle'></i> Approved
                                            </span>
                                        }
                                        {renewalsData?.status == 'pen' &&
                                            <span className='alert alert-warning px-2 py-1 fs-12 rounded-pill me-3'>
                                                <i className='bi-exclamation-circle'></i> Pending
                                            </span>
                                        }
                                        {renewalsData?.status == 'rej' &&
                                            <span className='alert alert-danger px-2 py-1 fs-12 rounded-pill me-3'>
                                                <i className='bi-exclamation-circle'></i> Rejected
                                            </span>
                                        }

                                    </div>
                                    <div className="d-flex row">
                                        <div className="col d-flex">
                                            <label htmlFor="" className='fs-14 fw-600 me-2'> Payment Recieved</label>
                                            <div className="fs-14">{renewalsData?.dd_amount ? renewalsData?.dd_amount : 'NA'}</div>
                                        </div>
                                        <div className="col d-flex">
                                            <label htmlFor="" className='fs-14 fw-600 me-2'>Payment Receipt No:</label>
                                            <div className="fs-14">{renewalsData?.receipt_no ? renewalsData?.receipt_no : 'NA'}</div>
                                        </div>

                                        <div className="col d-flex ml-3">
                                            <label htmlFor="" className='fs-14 fw-600 me-2'>Transaction Id:</label>
                                            <div className="fs-14">{renewalsData?.transanctionId ? renewalsData?.transanctionId : 'NA'}</div>
                                        </div>

                                    </div>

                                    <div>
                                        <div className="row mt-3">
                                            <div className="col">
                                                <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                    <p className="d-flex align-items-center" onClick={() => setIsEduCert1(!isEduCert1)}>
                                                        {renewalsData?.edu_cert1 ? <img src={serverImgUrl + 'renewal/' + renewalsData?.edu_cert1} alt="" className="w-100" /> : <img src={DocDefultPic} alt="" />}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col">
                                                <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                    <p className="d-flex align-items-center" onClick={() => setIsEduCert2(!isEduCert2)}>
                                                        {renewalsData?.edu_cert2 ? <img src={serverImgUrl + 'renewal/' + renewalsData?.edu_cert2} alt="" className="w-100" /> : <img src={DocDefultPic} alt="" />}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col">
                                                <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                    <p className="d-flex align-items-center" onClick={() => setIsEduCert3(!isEduCert3)}>
                                                        {renewalsData?.edu_cert3 ? <img src={serverImgUrl + 'renewal/' + renewalsData?.edu_cert3} alt="" className="w-100" /> : <img src={DocDefultPic} alt="" />}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {userType === 'u' && renewalsData?.status === 'pen' &&
                                            <div className="card-footer">
                                                <div className="mb-3">
                                                    <label htmlFor="" className='mb-2'>Reason <span className='fs-12'>{'(Enter reason if you are rejecting application)'}</span></label>
                                                    <textarea className='form-control fs-14' onChange={(e) => setRemarks(e.target.value)} name="" id="" placeholder='Enter Reason'></textarea>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className="col">
                                                        <button type="submit"
                                                            disabled={disablebtn}
                                                            onClick={() => {
                                                                submit('rej');
                                                            }} className='btn btn-danger'><i className="bi-x-circle"></i> Not Accepted</button>
                                                    </div>
                                                    <div className="col text-end">
                                                        <button type="submit"
                                                            disabled={disablebtn}
                                                            onClick={() => {
                                                                submit('ver');
                                                            }} className='btn btn-success'><i className="bi-check-circle"></i> Verified</button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {userType === 'a' && renewalsData?.status === 'ver' &&
                                            <div className="card-footer">
                                                <div className="mb-3">
                                                    <label htmlFor="" className='mb-2'>Reason <span className='fs-12'>{'(Enter reason if you are rejecting application)'}</span></label>
                                                    <textarea className='form-control fs-14' onChange={(e) => setRemarks(e.target.value)} name="" id="" placeholder='Enter Reason'></textarea>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className="col">
                                                        <button type="submit"
                                                            disabled={disablebtn}
                                                            onClick={() => {
                                                                submit('rej');
                                                            }} className='btn btn-danger'><i className="bi-x-circle"></i> Not Accepted</button>
                                                    </div>
                                                    <div className="col text-end">
                                                        <button type="submit"
                                                            disabled={disablebtn}
                                                            onClick={() => {
                                                                submit('apr');
                                                            }} className='btn btn-success'><i className="bi-check-circle"></i> Approve</button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        <>

                                            <Lightbox
                                                open={isEduCert1}
                                                plugins={[Zoom]}
                                                close={() => setIsEduCert1(false)}
                                                slides={[
                                                    {
                                                        src: serverImgUrl + 'renewal/' + renewalsData?.edu_cert1,
                                                        alt: "edu_cert1",
                                                        width: 3840,
                                                        height: 2560,
                                                        srcSet: [
                                                            { src: serverImgUrl + 'renewal/' + renewalsData?.edu_cert1, width: 100, height: 100 },
                                                        ]
                                                    }
                                                ]}
                                            />
                                            <Lightbox
                                                open={isEduCert2}
                                                plugins={[Zoom]}
                                                close={() => setIsEduCert2(false)}
                                                slides={[
                                                    {
                                                        src: serverImgUrl + 'renewal/' + renewalsData?.edu_cert2,
                                                        alt: "edu_cert2",
                                                        width: 3840,
                                                        height: 2560,
                                                        srcSet: [
                                                            { src: serverImgUrl + 'renewal/' + renewalsData?.edu_cert2, width: 100, height: 100 },
                                                        ]
                                                    }
                                                ]}
                                            />
                                            <Lightbox
                                                open={isEduCert3}
                                                plugins={[Zoom]}
                                                close={() => setIsEduCert3(false)}
                                                slides={[
                                                    {
                                                        src: serverImgUrl + 'renewal/' + renewalsData?.edu_cert3,
                                                        alt: "edu_cert3",
                                                        width: 3840,
                                                        height: 2560,
                                                        srcSet: [
                                                            { src: serverImgUrl + 'renewal/' + renewalsData?.edu_cert3, width: 100, height: 100 },
                                                        ]
                                                    }
                                                ]}
                                            />
                                        </>
                                    </div>
                                </div>


                            }

                        </div>
                    </div>
                </div>
            </div>



        </>
    )
};

export default RenewalsViews;