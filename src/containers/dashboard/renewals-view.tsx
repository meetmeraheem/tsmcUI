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
import { renewalsType } from "../../types/common";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { authService } from '../../lib/api/auth';



const RenewalsViews = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [next, setNext] = useState(false);
    const [isEduCert1, setIsEduCert1] = useState(false);
    const [isEduCert2, setIsEduCert2] = useState(false);
    const [isEduCert3, setIsEduCert3] = useState(false);
    const [renewalsData, setRenewalsData] = useState<renewalsType>();
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const { renewalPrimaryId, doctorPrimaryId, assignmentId } = location.state
    const [userType, setUserType] = useState('');
    const [remarks, setRemarks] = useState('');

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
            if (doctorPrimaryId) {
                const { data } = await doctorService.getDoctorById(doctorPrimaryId);
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
            if (renewalPrimaryId) {
                const { data } = await renewalService.getRenewalById(renewalPrimaryId);
                if (data.status != null) {

                    setRenewalsData({
                        status: data.status,
                        reg_date: data.createdon,
                        doctor_id: data.doctorId,
                        edu_cert1: data.document1,
                        edu_cert2: data.document2,
                        edu_cert3: data.document3,
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
    }, [renewalPrimaryId, doctorPrimaryId]);

    const closewindow = useCallback(async () => {
        if (userType === 'a') {
            navigate(routes.admin_dashboard);
        }
        if (userType === 'u') {
            navigate(routes.admin_my_work_items);
        }
    },[userType]);

    const submit = useCallback(async (status: any) => {
        if (status) {
            const renewalInfo = {
                approval_status: status,
                remarks: remarks,
                assignmnetId:assignmentId
            }

            const { success } = await renewalService.updateRenewal(renewalPrimaryId, renewalInfo);
                if (success) {
                    let msg="";
                    let smsmsg="";
                    if(status !== 'rej' ){
                        msg="Renewal successfully approved";
                        smsmsg="Your Renewal  Application has been Approved from Telangana State Medical Council.";
                    }else{
                        msg="Renewal successfully Rejected";
                        smsmsg="Your Renewal Application has been Rejected from Telangana State Medical Council.";
                    }
                    Swal.fire({
                        title: "Success",
                        text: msg,
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            if (doctor?.mobileno) {
                                await authService.sendSMS(doctor?.mobileno, smsmsg).then((response) => {
                                    
                                }).catch(() => {

                                });
                            }
                            if (userType === 'a') {
                                navigate(routes.admin_dashboard);
                            }
                            if (userType === 'u') {
                                navigate(routes.admin_my_work_items);
                            }
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
                            if (doctor?.mobileno) {
                                await authService.sendSMS(doctor?.mobileno, 'Your Renewal  Application has been Rejected from Telangana State Medical Council.').then((response) => {
                                    
                                }).catch(() => {

                                });
                            }
                            if (userType === 'a') {
                                navigate(routes.admin_dashboard);
                            }
                            if (userType === 'u') {
                                navigate(routes.admin_my_work_items);
                            }
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
                            <div className="col-3">
                                <div className="tsmc-doc-profile-box border-bottom-0">
                                    <div className='tsmc-doc-img mb-3'>
                                        {doctor?.passphoto ? <img src={serverImgUrl + 'files/' + doctor?.passphoto} alt="" /> : <img src={DocDefultPic} alt="" />}
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center border rounded p-1">
                                        {doctor?.signature ? <img src={serverImgUrl + 'files/' + doctor?.signature} alt="" width="100%" /> :
                                            <>
                                                <div><i className="bi-pencil-square fs-22 px-2"></i></div>
                                                <div><h2 className="fs-18 fw-700 mb-0 pe-2">Signature</h2></div>
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                {/* <h2 className='fs-16 fw-600 mb-3'>{doctor?.fullname}</h2> */}
                                <div className="d-flex">
                                    <div className="col">
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-700 me-2'>Full Name:</label>
                                            <div className="col fs-14">{doctor?.fullname}</div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-700 me-2'>Father Name:</label>
                                            <div className="col fs-14">{doctor?.fathername}</div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-700 me-2'>Mother Name:</label>
                                            <div className="col fs-14">{doctor?.mothername}</div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-700 me-2'>Date of Birth:</label>
                                            <div className="col fs-14">{doctor?.dateofbirth}</div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-700 me-2'>Gender:</label>
                                            <div className="col fs-14">{doctor?.gender == 'm' ? 'Male' : doctor?.gender == 'f' ? 'FeMale' : ''}</div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-700 me-2'>Mobile No:</label>
                                            <div className="col fs-14">{doctor?.mobileno}</div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-700 me-2'>EmailId:</label>
                                            <div className="col fs-14">{doctor?.emailid}</div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-700 me-2'>Blood Group:</label>
                                            <div className="col fs-14">{doctor?.bloodgroup}</div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-00 me-2'>Doctor Id:</label>
                                            <div className="col fs-14">{doctor?.serial_id}</div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-00 me-2'>Landline:</label>
                                            <div className="col fs-14">{doctor?.phoneno}</div>
                                        </div>
                                        <div className="d-flex mb-1">
                                            <label htmlFor="" className='fs-14 fw-00 me-2'>Aadhar No:</label>
                                            <div className="col fs-14">{doctor?.aadharcard}</div>
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="" className='fs-14 fw-00 me-2'>Address:</label>
                                            <div className="col fs-14">{doctor?.address1} {doctor?.address2}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container mt-4">
                            {renewalsData && 
                                        <div className="row tsmc-timeline mb-5">
                                          <h1 className='col fs-18 fw-700 mb-0'>Renwal Details</h1>
                                      
                                            <div className="col text-end">
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
                                    <button type="submit" onClick={() => {
                                        submit('rej');
                                    }} className='btn btn-danger'><i className="bi-x-circle"></i> Reject</button>
                                </div>
                                <div className="col text-end">
                                    <button type="submit"
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