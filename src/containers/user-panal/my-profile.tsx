import moment from 'moment';
import React,{ useCallback, useEffect, useState,useRef } from 'react';
import { Link } from 'react-router-dom';
import DocDefultPic from '../../assets/images/doc-default-img.jpg';
import { doctorService } from '../../lib/api/doctot';
import { finalService } from '../../lib/api/final';
import { provisionalService } from '../../lib/api/provisional';
import { LocalStorageManager } from '../../lib/localStorage-manager';
import { DoctorFormType } from '../../types/doctor';
import { FinalMyProfileType } from '../../types/final';
import { ProvisionalMyProfileType } from '../../types/provisional';
import { serverImgUrl } from '../../config/constants';
import { additionalService } from '../../lib/api/additional';
import { AddQualDataFormType } from '../../types/additionalQuali';
import { nocService } from "../../lib/api/noc";
import { goodstandingService } from "../../lib/api/goodstanding";
import { renewalService } from "../../lib/api/renewals";
import { changeofnameService } from '../../lib/api/changeofname';
import { revalidationService } from "../../lib/api/revalidation";
import FinalRegPrint from'../../containers/user-panal/printouts/final-reg-print';
import AdditionalRegViewPrint from'../../containers/user-panal/printouts/additional-view-print';
import RenewalsViewPrint from'../../containers/user-panal/printouts/renewals-view-print';
import NocRegViewPrint from'../../containers/user-panal/printouts/noc-view-print';
import GoodStandingRegPrintView from '../../containers/user-panal/printouts/goodstanding-view-print';
import ProvisionalViewPrint from '../../containers/user-panal/printouts/provisional-view-print';
import ReactToPrint from 'react-to-print';

const Myprofile = () => {
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const [provisional, setProvisional] = useState<ProvisionalMyProfileType>();
    const [final, setFinal] = useState<FinalMyProfileType>();
    const [NocdataList, setNocdataList] = useState<any>([]);
    const [GoodStandingList, setGoodStandingList] = useState<any>([]);
    const [renewalsList, setRenewalsList] = useState<any>([]);
    const [nameChangeList, setNameChangeList] = useState<any>([]);
    const [revalidationList, setRevalidationList] = useState<any>([]);
    const [additionslGridList, setAdditionalGridList] = useState<any>([]);

    const [loading, setLoading] = useState(false)
    const greet=()=> {
       
       }
    const provisionalcomponentRef = useRef<HTMLDivElement>(null);   
    const finalcomponentRef = useRef<HTMLDivElement>(null);
    const additionalcomponentRef = useRef<HTMLDivElement>(null);
    const renewlcomponentRef = useRef<HTMLDivElement>(null);
    const noccomponentRef = useRef<HTMLDivElement>(null);
    const gscomponentRef = useRef<HTMLDivElement>(null);
    const doctorSerialId = LocalStorageManager.getDoctorSerialId();
    const getDoctorDetails = useCallback(async () => {
        try {
            const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());
            if (doctorPrimaryId) {
                const getDoctor = await doctorService.getDoctorMyprofileById(doctorPrimaryId);
                if (getDoctor.data.length > 0) {
                    setDoctor(getDoctor.data[0]);
                }
            }
        } catch (err) {
            console.log('error getDoctorDetails', err);
        }
    }, []);

    const getProvisionalDetails = useCallback(async () => {
        try {
            const doctorSerialId = LocalStorageManager.getDoctorSerialId();
            if (doctorSerialId) {
                const { data } = await provisionalService.getProvisionalByDoctorId(doctorSerialId);
                if (data.length > 0) {
                   
                    setProvisional({
                        id: data[0].id,
                        doctor_id: data[0].doctorId,
                        reg_date: data[0].reg_date,
                        receipt_no: data[0].receipt_no,
                        country: data[0].countryName,
                        state: data[0].stateName,
                        qualification: data[0].qualificationName,
                        exam_month: data[0].exam_month,
                        exam_year: data[0].exam_year,
                        university: data[0].university,
                        approval_status: data[0].approval_status,
                        college: data[0].college,
                        edu_cert1: data[0].edu_cert1,
                        edu_cert2: data[0].edu_cert2,
                        edu_cert3: data[0].edu_cert3,
                        extra_col3: data[0].extra_col3,
                        extra_col1: data[0].extra_col1
                    });
                }
            }
        } catch (err) {
            console.log('error getProvisionalDetails', err);
        }
    }, []);
    const getFinalDetails = useCallback(async () => {
        try {
            const doctorSerialId = LocalStorageManager.getDoctorSerialId();
            if (doctorSerialId) {
                const { data } = await finalService.getFinal(doctorSerialId);
                if (data.length > 0) {
                   
                    setFinal({
                        id: data[0].id,
                        serialno: data[0].serialno,
                        reg_date: data[0].reg_date,
                        country: data[0].countryName,
                        state: data[0].stateName,
                        qualification: data[0].qualificationName,
                        exam_month: data[0].exam_month,
                        exam_year: data[0].exam_year,
                        university: data[0].university,
                        college: data[0].college,
                        approval_status: data[0].approval_status,
                        createdon: data[0].createdon,
                        posttime: data[0].posttime,
                        extra_col3: data[0].extra_col3,
                        extra_col1: data[0].extra_col1,
                        row_type:''
                    });
                }
            }
        } catch (err) {
            console.log('error getProvisionalDetails', err);
        }
    }, []);
    const getAdditionalDetails = useCallback(async () => {
        try {
            const doctorSerialId = LocalStorageManager.getDoctorSerialId();
            if (doctorSerialId) {
                const { data } = await additionalService.getAdditionalData(doctorSerialId);
                if (data.length > 0) {
                    setAdditionalGridList(data);
                    {};
                }
            }
        } catch (err) {
            console.log('error getProvisionalDetails', err);
        }
    }, []);
    const getNocDetails = useCallback(async () => {
        try {
            const doctorSerialId = LocalStorageManager.getDoctorSerialId();
            if (doctorSerialId) {
                const { data } = await nocService.nocDataByDoctorId(doctorSerialId);
                if (data.length > 0) {
                    setNocdataList(data);
                    {}
                }
            }
        } catch (err) {
            console.log('error getProvisionalDetails', err);
        }
    }, []);

    const getgoodStandingDetails = useCallback(async () => {
        try {
            const doctorSerialId = LocalStorageManager.getDoctorSerialId();
            if (doctorSerialId) {
                const { data } = await goodstandingService.getGoodstandingByDoctorId(doctorSerialId);
                if (data.length > 0) {
                    
                    setGoodStandingList(data);
                    {}
                }
            }
        } catch (err) {
            console.log('error getProvisionalDetails', err);
        }
    }, []);
    const getFinalRenewalDetails = useCallback(async () => {
        try {
            const doctorSerialId = LocalStorageManager.getDoctorSerialId();
            if (doctorSerialId) {
                const { data } = await renewalService.getRenewalsByDoctorId(doctorSerialId);
                if (data.length > 0) {
                    setRenewalsList(data);
                }
            }
        } catch (err) {
            console.log('error getProvisionalDetails', err);
        }
    }, []);

    const getChangeNameDetails = useCallback(async () => {
        try {
            const doctorSerialId = LocalStorageManager.getDoctorSerialId();
            if (doctorSerialId) {
                const { data } = await changeofnameService.getNameChangeByDoctorId(doctorSerialId);
                if (data.length > 0) {
                    setNameChangeList(data);
                }
            }
        } catch (err) {
            console.log('error getProvisionalDetails', err);
        }
    }, []);

    const getRevalidationList = useCallback(async () => {
        try {
            const doctorSerialId = LocalStorageManager.getDoctorSerialId();
            if (doctorSerialId) {
                const { data } = await revalidationService.getRevalidationByDoctorId(doctorSerialId);
                if (data.length > 0) {
                    setRevalidationList(data);
                }
            }
        } catch (err) {
            console.log('error getProvisionalDetails', err);
        }
    }, []);
    
    const [isReady, setIsReady] = useState("none");
    useEffect(() => {
        
        setLoading(true);
        getDoctorDetails();
        getProvisionalDetails();
        getFinalDetails();
        getAdditionalDetails();
        getNocDetails();
        getgoodStandingDetails();
        getFinalRenewalDetails();
        getChangeNameDetails();
        getRevalidationList();
        setLoading(false);
    }, []);
   
      

    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
                    <div className="row">
                        <div className="col-10 m-auto">
                            <div className="card shadow border-0 mb-4">

                                {(!doctor?.serial_id || doctor?.adisnal3 === 'E') ?
                                    <div className="card-header text-end">
                                        <Link to={'edit-profile'} className='btn btn-primary btn-sm'>Edit Profile</Link>
                                    </div> : ""
                                }
                                <div className="card-body">
                                    <div className="tsmc-timeline-box">
                                        <div className="tsmc-timeline mb-5">
                                            <div className="tsmc-text">
                                                <h1 className='fs-18 fw-700'>Doctor Information</h1>
                                                <div className="d-flex">
                                                    <div className="flex-shrink-1 pe-3">
                                                        <div className="tsmc-doc-profile-box border-bottom-0">
                                                            <div className='tsmc-doc-img mb-3'>
                                                                {doctor?.passphoto ?
                                                                    <>
                                                                        {doctor?.filestatus === true ?
                                                                            <img src={serverImgUrl + 'files/' + doctor?.passphoto} alt="" /> :
                                                                            <img src={'http://admin.regonlinetsmc.in/forms/uploads/' + doctor?.passphoto} alt="" />
                                                                        }
                                                                    </>
                                                                    : <img src={DocDefultPic} alt="" />}
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center border rounded p-1 signature">

                                                                {doctor?.signature ?
                                                                    <>
                                                                        {doctor?.filestatus === true ?
                                                                            <img src={serverImgUrl + 'files/' + doctor?.signature} alt="" /> :
                                                                            <img src={'http://admin.regonlinetsmc.in/forms/uploads/' + doctor?.signature} alt="" />}
                                                                    </>
                                                                    :

                                                                    <>
                                                                        <div><i className="bi-pencil-square fs-22 px-2"></i></div>
                                                                        <div><h2 className="fs-18 fw-700 mb-0 pe-2">Signature</h2></div>
                                                                    </>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-2 w-100">
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Full Name:</label>
                                                                <div className="fs-14">{doctor?.fullname}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Father Name:</label>
                                                                <div className="fs-14">{doctor?.fathername}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Mother Name:</label>
                                                                <div className="fs-14">{doctor?.mothername}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Aadhar No:</label>
                                                                <div className="fs-14">{doctor?.aadharcard}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Date of Birth:</label>
                                                                <div className="fs-14">{moment(doctor?.dateofbirth).format('DD/MM/YYYY')}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Gender:</label>
                                                                <div className="fs-14">{doctor?.gender == 'M' ? 'MALE' : doctor?.gender == 'F' ? 'FEMALE' : 'OTHERS'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Mobile No:</label>
                                                                <div className="fs-14">{doctor?.mobileno}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Email Address:</label>
                                                                <div className="fs-14">{doctor?.emailid}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Blood Group:</label>
                                                                <div className="fs-14">{doctor?.bloodgroup}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Address:</label>
                                                                <div className="fs-14">{doctor?.address1} {doctor?.address2}
                                                                    {doctor?.cityName},{doctor?.stateName}-{doctor?.pincode}

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {provisional &&
                                            <div className="tsmc-timeline mb-5">
                                                <div className="tsmc-text">
                                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                                        <h1 className='fs-18 fw-700 mb-0'>Provisional Registration</h1>
                                                        <div>
                                                            {provisional?.approval_status == 'ver' &&
                                                                <span className='alert alert-success px-2 py-1 fs-12 rounded-pill me-3'>
                                                                    <i className='bi-check-circle'></i> Verified
                                                                </span>
                                                            }
                                                            {provisional?.approval_status == 'apr' &&
                                                                <span className='alert alert-success px-2 py-1 fs-12 rounded-pill me-3'>
                                                                    <i className='bi-check-circle'></i> Approved
                                                                </span>
                                                            }
                                                            {provisional?.approval_status == 'pen' &&
                                                                <span className='alert alert-warning px-2 py-1 fs-12 rounded-pill me-3'>
                                                                    <i className='bi-exclamation-circle'></i> Pending
                                                                </span>
                                                            }
                                                            {provisional?.approval_status == 'rej' &&
                                                                <span className='alert alert-danger px-2 py-1 fs-12 rounded-pill me-3'>
                                                                    <i className='bi-exclamation-circle'></i> Rejected
                                                                </span>
                                                            }
                                                            {(provisional?.approval_status == 'pen' || provisional?.approval_status == 'rej') && 
                                                            
                                                            <Link to={'edit-provisional'} className='btn btn-primary btn-sm me-3'>Edit</Link>
                                                          
                                                            }
                                                            {(provisional?.extra_col1=='nor'|| provisional?.extra_col1=='tat')&&
                                                            <>
                                                             <ReactToPrint
                                                                    trigger={() => <button className='btn btn-info btn-sm me-3'>Print Receipt</button>}
                                                                    content={() => provisionalcomponentRef.current}
                                                                />
                                                                <div ref={provisionalcomponentRef} className='hideComponentScreen'>
                                                                <ProvisionalViewPrint state={{ provisionalPrimaryId:provisional.id}}  />
                                                                </div> 
                                                          </>}
                                                        </div>
                                                    </div>
                                                    <div className="w-100">
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Registration No:</label>
                                                                <div className="fs-14">TSMC/PMR/{doctor?.pmr_no}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Registration Date:</label>
                                                                <div className="fs-14">{provisional?.reg_date ? moment(provisional?.reg_date).format('DD/MM/YYYY') : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Qualification:</label>
                                                                <div className="fs-14">{provisional?.qualification ? provisional?.qualification : 'NA'}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Exam Month:</label>
                                                                <div className="fs-14">{provisional?.exam_month ? provisional?.exam_month : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Exam Year:</label>
                                                                <div className="fs-14">{provisional?.exam_year ? provisional?.exam_year : 'NA'}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Country:</label>
                                                                <div className="fs-14">{provisional?.country ? provisional?.country : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>State:</label>
                                                                <div className="fs-14">{provisional?.state ? provisional?.state : 'NA'}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>University:</label>
                                                                <div className="fs-14">{provisional?.university ? provisional?.university : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>College:</label>
                                                                <div className="fs-14">{provisional?.college ? provisional?.college : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                        {provisional?.approval_status === 'rej' ? <div className="d-flex mb-2">

                                                            <div className='col-5 alert alert-danger  fs-14'>
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Reject Reason:</label>
                                                                {provisional?.extra_col3 ? provisional?.extra_col3 : 'NA'}
                                                            </div>
                                                        </div>
                                                            : ""}


                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {final &&
                                            <><div className="tsmc-timeline mb-5">
                                                <div className="tsmc-text">
                                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                                        <h1 className='fs-18 fw-700 mb-0'>Final Registration</h1>
                                                        <div>
                                                            {final?.approval_status == 'ver' &&
                                                                <span className='alert alert-success px-2 py-1 fs-12 rounded-pill me-3'>
                                                                    <i className='bi-check-circle'></i> Verified
                                                                </span>
                                                            }
                                                            {final?.approval_status == 'apr' &&
                                                                <span className='alert alert-success px-2 py-1 fs-12 rounded-pill me-3'>
                                                                    <i className='bi-check-circle'></i> Approved
                                                                </span>
                                                            }
                                                            {final?.approval_status == 'pen' &&
                                                                <span className='alert alert-warning px-2 py-1 fs-12 rounded-pill me-3'>
                                                                    <i className='bi-exclamation-circle'></i> Pending
                                                                </span>
                                                            }
                                                            {final?.approval_status == 'rej' &&
                                                                <span className='alert alert-danger px-2 py-1 fs-12 rounded-pill me-3'>
                                                                    <i className='bi-exclamation-circle'></i> Rejected
                                                                </span>
                                                            }
                                                            {(final?.approval_status == 'apr' || final?.approval_status == 'rej') && 
                                                            <Link to={'edit-final'} className='btn btn-primary btn-sm me-3'>Edit</Link>
                                                            }
                                                                        
                                                        </div>
                                                        {(final?.extra_col1=='nor'|| final?.extra_col1=='tat')&&
                                                            <>
                                                            <ReactToPrint
                                                                    trigger={() => <button className='btn btn-info btn-sm me-3'>Print Receipt</button>}
                                                                    content={() => finalcomponentRef.current}
                                                                />
                                                                <div ref={finalcomponentRef} className='hideComponentScreen'>
                                                                <FinalRegPrint state={{ finalPrimaryId:final.id}}  />
                                                                </div>                                            
                                                          </>}
                                                    </div>
                                                    <div className="w-100">
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Registration No:</label>
                                                                <div className="fs-14">{doctor?.original_fmr_no?doctor?.original_fmr_no:'NA'}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Registration Date:</label>
                                                                <div className="fs-14">{final?.reg_date ? moment(final?.reg_date).format('DD/MM/YYYY') : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Qualification:</label>
                                                                <div className="fs-14">{final?.qualification ? final?.qualification : 'NA'}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Exam Month:</label>
                                                                <div className="fs-14">{final?.exam_month ? final?.exam_month : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Exam Year:</label>
                                                                <div className="fs-14">{final?.exam_year ? final?.exam_year : 'NA'}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Country:</label>
                                                                <div className="fs-14">{final?.country ? final?.country : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>State:</label>
                                                                <div className="fs-14">{final?.state ? final?.state : 'NA'}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>University Name:</label>
                                                                <div className="fs-14">{final?.university ? final?.university : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>College Name:</label>
                                                                <div className="fs-14">{final?.college ? final?.college : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                        {final?.approval_status === 'rej' ? <div className="d-flex mb-2">

                                                            <div className='col-5 alert alert-danger  fs-14'>
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Reject Reason:</label>
                                                                {final?.extra_col3 ? final?.extra_col3 : 'NA'}
                                                            </div>
                                                        </div>
                                                            : ""}
                                                    </div>
                                                </div>
                                            </div></>
                                        }


                                        {additionslGridList.length > 0 &&
                                            <>
                                                <div className="tsmc-timeline mb-5">
                                                    <div className="tsmc-text">
                                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                                            <h1 className='fs-18 fw-700 mb-0'>Additional Qualification</h1>
                                                        </div>
                                                    </div>

                                                    <table className="table table-hover fs-10 table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th>Qualification</th>
                                                                <th>Exam month,year</th>
                                                                <th>State,Country</th>
                                                                <th>Applied For</th>
                                                                <th>college-University</th>
                                                                <th>Registration Date</th>
                                                                <th>Approval Status</th>
                                                                <th>Reason </th>
                                                                <th> </th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {additionslGridList?.map((obj: any) => {
                                                                return (<tr>
                                                                    <td>{obj.qualification}</td>
                                                                    <td>{obj.exam_month},{obj.exam_year}</td>
                                                                    <td>{obj.countryName},{obj.stateName}</td>
                                                                    <td>{obj.appliedFor}</td>
                                                                    <td>{obj.college} - {obj.university}</td>
                                                                    <td>{moment(obj.reg_date).format('DD/MM/YYYY')}</td>

                                                                    <td>
                                                                        {obj.approval_status === 'ver' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Verified</span>}
                                                                        {obj.approval_status === 'apr' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Approved</span>}
                                                                        {obj.approval_status === 'pen' && <span className="alert alert-warning rounded-pill py-0 px-2 fs-12">Pending</span>}
                                                                        {obj.approval_status === 'rej' && <span className='alert alert-danger px-2 py-1 fs-12 rounded-pill me-3'>Rejected</span>}

                                                                    </td>
                                                                    {(obj.approval_status == 'pen' || obj.approval_status == 'rej') ? <td> <Link to={'edit_additional-qualification-registration'} state={{ additionalPrimaryId: obj.id }} className='btn btn-primary btn-sm me-3'>Edit</Link></td> : <td></td>}

                                                                    {obj.approval_status === 'rej' ? <td>{obj.extra_col3}</td> : <td></td>}
                                                                    {(obj.extra_col1 === 'nor'||obj.extra_col1 === 'tat') ?<td> <ReactToPrint
                                                                            trigger={() => <button className='btn btn-info btn-sm me-3'>Print Receipt</button>}
                                                                            content={() => additionalcomponentRef.current}
                                                                        />
                                                                     <div ref={additionalcomponentRef} className='hideComponentScreen'>
                                                                    <AdditionalRegViewPrint state={{ additionalPrimaryId:obj.id}}  />
                                                                    </div> </td>:""}

                                                                </tr>);
                                                            })}
                                                        </tbody></table>
                                                </div>
                                            </>
                                        }
                                        {renewalsList.length > 0 &&
                                            <>
                                                <div className="tsmc-timeline mb-5">
                                                    <div className="tsmc-text">
                                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                                            <h1 className='fs-18 fw-700 mb-0'>Renewal Details</h1>
                                                        </div>
                                                    </div>

                                                    <table className="table table-hover fs-11 table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th>Registration Date</th>
                                                                <th>Approval Status</th>
                                                                <th>Reason </th>
                                                                <th> </th>
                                                                <th> </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {renewalsList?.map((obj: any) => {
                                                                return (<tr>
                                                                    <td>{moment(obj.reg_date).format('DD/MM/YYYY')}</td>

                                                                    <td>
                                                                        {obj.status === 'ver' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Verified</span>}
                                                                        {obj.status === 'apr' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Approved</span>}
                                                                        {obj.status === 'pen' && <span className="alert alert-warning rounded-pill py-0 px-2 fs-12">Pending</span>}
                                                                        {obj.status === 'rej' && <span className='alert alert-danger px-2 py-1 fs-12 rounded-pill me-3'>Rejected</span>}
                                                                    </td>


                                                                    {obj.status === 'rej' ? <td>{obj.document10}</td> : <td></td>}
                                                                    {(obj.status == 'pen' || obj.status == 'rej') ? <td> <Link to={'edit-final-renewal'} state={{ renwalPrimaryId: obj.id }} className='btn btn-primary btn-sm me-3'>Edit</Link></td> : <td></td>}
                                                                    {(obj.document9 === 'nor'||obj.document9 === 'tat') ? <td> <ReactToPrint
                                                                            trigger={() => <button className='btn btn-info btn-sm me-3'>Print Receipt</button>}
                                                                            content={() => renewlcomponentRef.current}
                                                                        />
                                                                     <div ref={renewlcomponentRef} className='hideComponentScreen'>
                                                                    <RenewalsViewPrint state={{renewalPrimaryId:obj.id}}  />
                                                                    </div> </td>:""}

                                                                </tr>);
                                                            })}
                                                        </tbody></table>
                                                </div>
                                            </>
                                        }
                                        {GoodStandingList.length > 0 &&
                                            <>
                                                <div className="tsmc-timeline mb-5">
                                                    <div className="tsmc-text">
                                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                                            <h1 className='fs-18 fw-700 mb-0'>GoodStanding Details</h1>
                                                        </div>
                                                    </div>

                                                    <table className="table table-hover fs-11 table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th>Registration Date</th>
                                                                <th>Approval Status</th>
                                                                <th>Reason </th>
                                                                <th> </th>
                                                                <th> </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {GoodStandingList?.map((obj: any) => {
                                                                return (<tr>
                                                                    <td>{moment(obj.regDate).format('DD/MM/YYYY')}</td>

                                                                    <td>
                                                                        {obj.status === 'ver' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Verified</span>}
                                                                        {obj.status === 'apr' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Approved</span>}
                                                                        {obj.status === 'pen' && <span className="alert alert-warning rounded-pill py-0 px-2 fs-12">Pending</span>}
                                                                        {obj.status === 'rej' && <span className='alert alert-danger px-2 py-1 fs-12 rounded-pill me-3'>Rejected</span>}
                                                                    </td>
                                                                    {obj.status === 'rej' ? <td>{obj.extra3}</td> : <td></td>}
                                                                    {(obj.status == 'pen' || obj.status == 'rej') ? <td> <Link to={'good-standing-edit'} state={{ gsPrimaryId: obj.id }} className='btn btn-primary btn-sm me-3'>Edit</Link></td> : <td></td>}
                                                                    {(obj.extra1 === 'nor'||obj.extra1 === 'tat') ?<td> <ReactToPrint
                                                                            trigger={() => <button className='btn btn-info btn-sm me-3'> Print Receipt</button>}
                                                                            content={() => gscomponentRef.current}
                                                                        />
                                                                     <div ref={gscomponentRef} className='hideComponentScreen'>
                                                                    <GoodStandingRegPrintView state={{gsPrimaryId:obj.id}}  />
                                                                    </div> </td>:""}

                                                                </tr>);
                                                            })}
                                                        </tbody></table>
                                                </div>
                                            </>

                                        }

                                        {NocdataList.length > 0 &&
                                            <>
                                                <div className="tsmc-timeline mb-5">
                                                    <div className="tsmc-text">
                                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                                            <h1 className='fs-18 fw-700 mb-0'>Noc Details</h1>
                                                        </div>
                                                    </div>

                                                    <table className="table table-hover fs-11 table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th>Council Name</th>
                                                                <th>Council Address</th>
                                                                <th>Registration Date</th>
                                                                <th>Approval Status</th>
                                                                <th>Reason </th>
                                                                <th> </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {NocdataList?.map((obj: any) => {
                                                                return (<tr>
                                                                    <td>{obj.councilname}</td>
                                                                    <td>{obj.address1},{obj.address2}
                                                                    <br/>
                                                                   <b> City:</b>{obj.city},
                                                                    <br/>
                                                                    <b>State:</b>{obj.stateName},
                                                                    <br/>
                                                                    <b>Country:</b>{obj.countryName}
                                                                    <br/>
                                                                    </td>
                                                                    
                                                                    <td>{moment(obj.reg_date).format('DD/MM/YYYY')}</td>
                                                                    <td>
                                                                        {obj.status === 'ver' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Verified</span>}
                                                                        {obj.status === 'apr' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Approved</span>}
                                                                        {obj.status === 'pen' && <span className="alert alert-warning rounded-pill py-0 px-2 fs-12">Pending</span>}
                                                                        {obj.status === 'rej' && <span className='alert alert-danger px-2 py-1 fs-12 rounded-pill me-3'>Rejected</span>}
                                                                    </td>
                                                                    {obj.status === 'rej' ? <td>{obj.extracol_3}</td> : <td></td>}
                                                                    {(obj.status == 'pen' || obj.status == 'rej') ? <td> <Link to={'edit-noc-registration'} state={{ nocPrimaryId: obj.id }} className='btn btn-primary btn-sm me-3'>Edit</Link></td> : <td></td>}

                                                                    {(obj.extracol_1 === 'nor'||obj.extracol_1 === 'tat') ? <td> <ReactToPrint
                                                                            trigger={() => <button className='btn btn-info btn-sm me-3'>Print Receipt</button>}
                                                                            content={() => noccomponentRef.current}
                                                                        />
                                                                     <div ref={noccomponentRef} className='hideComponentScreen'>
                                                                    <NocRegViewPrint state={{nocPrimaryId:obj.id}}  />
                                                                    </div> </td>:""}
                                                                </tr>);
                                                            })}
                                                        </tbody></table>
                                                </div>
                                            </>

                                        }
                                        {nameChangeList.length > 0 &&
                                            <>
                                                <div className="tsmc-timeline mb-5">
                                                    <div className="tsmc-text">
                                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                                            <h1 className='fs-18 fw-700 mb-0'>Change of Name List</h1>
                                                        </div>
                                                    </div>

                                                    <table className="table table-hover fs-11 table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th>Registration Date</th>
                                                                <th>Approval Status</th>
                                                                <th>Reason </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {nameChangeList?.map((obj: any) => {
                                                                return (<tr>
                                                                    <td>{moment(obj.reg_date).format('DD/MM/YYYY')}</td>
                                                                    <td>
                                                                        {obj.approval_status === 'ver' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Verified</span>}
                                                                        {obj.approval_status === 'apr' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Approved</span>}
                                                                        {obj.approval_status === 'pen' && <span className="alert alert-warning rounded-pill py-0 px-2 fs-12">Pending</span>}
                                                                        {obj.approval_status === 'rej' && <span className='alert alert-danger px-2 py-1 fs-12 rounded-pill me-3'>Rejected</span>}
                                                                    </td>
                                                                    {obj.approval_status === 'rej' ? <td>{obj.extracol_3}</td> : <td></td>}
                                                                    {(obj.approval_status == 'pen' || obj.status == 'rej') ? <td> <Link to={'edit_change_of_name'} state={{ changeofNamePrimaryId: obj.id }} className='btn btn-primary btn-sm me-3'>Edit</Link></td> : <td></td>}
                                                                </tr>);
                                                            })}
                                                        </tbody></table>
                                                </div>
                                           </>
                                        }

                                        {revalidationList.length > 0 &&
                                            <>
                                                <div className="tsmc-timeline mb-5">
                                                    <div className="tsmc-text">
                                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                                            <h1 className='fs-18 fw-700 mb-0'>Revalidation List</h1>
                                                        </div>
                                                    </div>

                                                    <table className="table table-hover fs-11 table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th>Registration Date</th>
                                                                <th>Approval Status</th>
                                                                <th>Reason </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {revalidationList?.map((obj: any) => {
                                                                return (<tr>
                                                                    <td>{moment(obj.reg_date).format('DD/MM/YYYY')}</td>
                                                                    <td>
                                                                        {obj.approval_status === 'ver' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Verified</span>}
                                                                        {obj.approval_status === 'apr' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Approved</span>}
                                                                        {obj.approval_status === 'pen' && <span className="alert alert-warning rounded-pill py-0 px-2 fs-12">Pending</span>}
                                                                        {obj.approval_status === 'rej' && <span className='alert alert-danger px-2 py-1 fs-12 rounded-pill me-3'>Rejected</span>}
                                                                    </td>
                                                                    {obj.approval_status === 'rej' ? <td>{obj.extracol_3}</td> : <td></td>}
                                                                    {(obj.approval_status == 'pen' || obj.status == 'rej') ? <td> <Link to={'edit_prov_revalidation'} state={{ revalidationPrimaryId: obj.id }} className='btn btn-primary btn-sm me-3'>Edit</Link></td> : <td></td>}
                                                                </tr>);
                                                            })}
                                                        </tbody></table>
                                                </div>
                                           </>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Myprofile;