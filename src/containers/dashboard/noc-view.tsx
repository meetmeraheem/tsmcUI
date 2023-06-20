import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import DocDefultPic from '../../assets/images/doc-default-img.jpg';
import { commonService } from '../../lib/api/common';
import { doctorService } from '../../lib/api/doctot';
import { nocService } from "../../lib/api/noc";
import { DoctorFormType } from '../../types/doctor';
import { AdminFinalProfileType } from '../../types/final';
import { routes } from '../routes/routes-names';
import { serverUrl, serverImgUrl } from '../../config/constants';
import moment from 'moment';
import { assignmentService } from '../../lib/api/assignments';
import { LocalStorageManager } from '../../lib/localStorage-manager';
import { adminNocFormType } from "../../types/noc";

import { authService } from '../../lib/api/auth';

const FinalRegView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { nocPrimaryId, doctorPrimaryId,assignmentId } = location.state
    const dispatch = useDispatch();
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const [noc, setNoc] = useState<adminNocFormType>();
    const [remarks, setRemarks] = useState('');
    const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);
    const [lightBoxImagePath, setLightBoxImagePath] = useState('');
    const [userType, setUserType] = useState('');

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

    const getFinalDetails = useCallback(async () => {
        try {
            if (nocPrimaryId) {
                const { data } = await nocService.getNocById(nocPrimaryId);
                if (data.length > 0) {
                    const country = await commonService.getCountry(Number(data[0].country));
                    const state = await commonService.getState(Number(data[0].state));
                    setNoc({
                        councilname: data[0].councilname,
                        address1:data[0].address1,
                        address2:data[0].address2,
                        country: country.data[0].name,
                        councilpincode:data[0].councilpincode,
                        state: state.data[0].name,
                        city: data[0].city,
                        approval_status: data[0].status,
                        receipt_no: data[0].receipt_no,
                        dd_amount:data[0].dd_amount,
                        reg_date:data[0].reg_date
                    });
                }
            }
        } catch (err) {
            console.log('error getFinalDetails', err);
        }
    }, []);

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
            const nocInfo = {
                approval_status: status,
                remarks: remarks,
                assignmnetId:assignmentId
            }
            const { success } = await nocService.updateNoc(nocPrimaryId, nocInfo);
            if (success) {
                let msg="";
                let smsmsg="";
                if(status !== 'rej' ){
                    msg="NOC successfully approved";
                    smsmsg="Your  NOC Application has been Approved from Telangana State Medical Council.";
                }else{
                    msg="NOC Application Rejected";
                    smsmsg="Your NOC Application has been Rejected from Telangana State Medical Council.";
                }
                    Swal.fire({
                        title: "",
                        text: msg,
                        icon: status !== 'rej' ?"success":"error",
                        confirmButtonText: "OK",
                      }).then(async (result) => {
                    let userType= LocalStorageManager.getUserType();
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
                        text: "NOC registration rejected",
                        icon: "error",
                        confirmButtonText: "OK",
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            if (doctor?.mobileno) {
                                await authService.sendSMS(doctor?.mobileno, 'NOC Application has been Rejected from Telangana State Medical Council.').then((response) => {
                                    
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

    useEffect(() => {
        const userTypeValue = LocalStorageManager.getUserType();
        userTypeValue && setUserType(userTypeValue);
        getDoctorDetails();
        getFinalDetails();
    }, [nocPrimaryId, doctorPrimaryId]);
    return (
        <>
            <div className="col-8 m-auto mb-4">
                <div className="card">
                    <div className="card-body">
                    <div className="row mb-3">
                        <h3 className="col fs-18 fw-600">NOC View</h3>
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
                        <div className="w-100">
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Registration No:</label>
                                    <div className="fs-14">TSMC/FMR/{doctor?.fmr_no}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Registration Date:</label>
                                    <div className="fs-14">{noc?.reg_date ? moment(noc?.reg_date).format('DD/MM/YYYY') : 'NA'}</div>
                                </div>
                            </div>
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>councilname:</label>
                                    <div className="fs-14">{noc?.councilname ? noc?.councilname : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Council  Address:</label>
                                    <div className="fs-14">{noc?.address1 ? noc?.address1 + noc?.address2 : 'NA'}</div>
                                </div>
                            </div>
                            <div className="d-flex mb-2">
                               
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Country:</label>
                                    <div className="fs-14">{noc?.country ? noc?.country : 'NA'}</div>
                                </div>
                            </div>
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>State:</label>
                                    <div className="fs-14">{noc?.state ? noc?.state : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>City Name:</label>
                                    <div className="fs-14">{noc?.city ? noc?.city : 'NA'}</div>
                                </div>
                            </div>
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'> Payment Recieved</label>
                                    <div className="fs-14">{noc?.dd_amount ? noc?.dd_amount : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Pyament Reciept No:</label>
                                    <div className="fs-14">{noc?.receipt_no ? noc?.receipt_no : 'NA'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {userType === 'u' && noc?.approval_status === 'pen' &&
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
                </div>
            </div>
            <div>
                
            </div>
        </>
    )
}

export default FinalRegView;