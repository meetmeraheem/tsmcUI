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
import AdminDoctorInfoCard from './../dashboard/includes/admin-doctor-info';
import { authService } from '../../lib/api/auth';

const NocRegView =  (props:any) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const dispatch = useDispatch();
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const [noc, setNoc] = useState<adminNocFormType>();
    const [remarks, setRemarks] = useState('');
    const [userType, setUserType] = useState('');
    const [disablebtn, setDisablebtn] = useState(false);
    const [isEduCert1, setIsEduCert1] = useState(false);
    const [isEduCert2, setIsEduCert2] = useState(false);
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

    const getNocDetails = useCallback(async () => {
        try {
            if (props.state.nocPrimaryId) {
                const { data } = await nocService.getNocById(props.state.nocPrimaryId);
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
                        city: data[0].cityName,
                        approval_status: data[0].status,
                        receipt_no: data[0].receipt_no,
                        dd_amount:data[0].dd_amount,
                        reg_date:data[0].reg_date,
                        edu_cert1: data[0].edu_cert1,
                        edu_cert2: data[0].edu_cert2,
                        transanctionId:data[0].transanctionId,
                        ecfmgEmail:data[0].ecfmgEmail
                    });
                }
            }
        } catch (err) {
            console.log('error getFinalDetails', err);
        }
    }, []);

    const closewindow = useCallback(async () => {
        props.greet();
    }, []);

    const submit = useCallback(async (status: any) => {
        if (status) {
            setDisablebtn(true);
            const nocInfo = {
                approval_status: status,
                remarks: remarks,
                assignmnetId:props.state.assignmentId
            }
            const { success } = await nocService.updateNoc(props.state.nocPrimaryId, nocInfo);
            if (success) {
                let msg="";
                let smsmsg="";
                if(status === 'rej' ){
                    msg="NOC  Application Not-Approved";
                    smsmsg = "Not-Approved";
                }else if(status === 'apr') {
                    msg="NOC Application successfully approved";
                    smsmsg="Approved";
                }else{
                    msg="NOC Application successfully Verified";
                    smsmsg="Verified";
                }
                    Swal.fire({
                        title: "",
                        text: msg,
                        icon: status === 'rej' ?"error":"success",
                        confirmButtonText: "OK",
                      }).then(async (result) => {
                    let userType= LocalStorageManager.getUserType();
                        if (result.isConfirmed) {
                            if (doctor?.mobileno) {
                                await authService.sendApproval(doctor?.mobileno, smsmsg).then((response) => {
                                    
                                }).catch(() => {

                                });
                            }
                            setDisablebtn(false);
                            props.greet();
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

    useEffect(() => {
        const userTypeValue = LocalStorageManager.getUserType();
        userTypeValue && setUserType(userTypeValue);
        getDoctorDetails();
        getNocDetails();
    }, [props.state.nocPrimaryId, props.state.doctorPrimaryId]);
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
                            <AdminDoctorInfoCard doctorId={props.state.doctorPrimaryId}></AdminDoctorInfoCard>
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
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Council Name:</label>
                                    <div className="fs-14">{noc?.councilname ? noc?.councilname : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Council  Address:</label>
                                    <div className="fs-14">  <div className="col fs-14">{noc?.address1},{noc?.address2}
                                                               </div></div>
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
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Pyament Receipt No:</label>
                                    <div className="fs-14">{noc?.receipt_no ? noc?.receipt_no : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Transaction Id:</label>
                                    <div className="fs-14">{noc?.transanctionId ? noc?.transanctionId : 'NA'}</div>
                                </div>
                               
                            </div>
                        </div>
                        <div className="row mt-3">
                        <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>ECFMG/GMC-UK Email Id: </label>
                                    <div className="fs-14">{noc?.ecfmgEmail ? noc?.ecfmgEmail : 'NA'}</div>
                                </div>
                        </div>
                        <div className="row mt-3">
                                <div className="col">
                                    <div className="drag-img-box d-flex align-items-center justify-content-center">
                                        <p className="d-flex align-items-center" onClick={() => setIsEduCert1(!isEduCert1)}>
                                            {noc?.edu_cert1 ? <img src={serverImgUrl + 'noc/' + noc?.edu_cert1} alt="" className="w-100" /> : <img src={DocDefultPic} alt="" />}
                                        </p>
                                    </div>
                                </div>
                                </div>
                                <div className="row mt-3">
                                <div className="col">
                                    <div className="drag-img-box d-flex align-items-center justify-content-center">
                                        <p className="d-flex align-items-center" onClick={() => setIsEduCert2(!isEduCert2)}>
                                            {noc?.edu_cert2 ? <img src={serverImgUrl + 'noc/' + noc?.edu_cert2} alt="" className="w-100" /> : <img src={DocDefultPic} alt="" />}
                                        </p>
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
                                    <button type="submit"
                                    disabled={disablebtn}
                                    onClick={() => {
                                        submit('rej');
                                    }} className='btn btn-danger'><i className="bi-x-circle"></i> Reject</button>
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
                     {userType === 'a' && noc?.approval_status === 'ver' &&
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
                                    }} className='btn btn-danger'><i className="bi-x-circle"></i> Reject</button>
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
                </div>
            </div>
            <div>
            <>

<Lightbox
    open={isEduCert1}
    plugins={[Zoom]}
    close={() => setIsEduCert1(false)}
    slides={[
        {
            src: serverImgUrl + 'noc/' + noc?.edu_cert1,
            alt: "edu_cert1",
            width: 3840,
            height: 2560,
            srcSet: [
                { src: serverImgUrl + 'noc/' + noc?.edu_cert1, width: 100, height: 100 },
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
            src: serverImgUrl + 'noc/' + noc?.edu_cert2,
            alt: "edu_cert2",
            width: 3840,
            height: 2560,
            srcSet: [
                { src: serverImgUrl + 'noc/' + noc?.edu_cert2, width: 100, height: 100 },
            ]
        }
    ]}
/>
</>
                
            </div>
        </>
    )
}

export default NocRegView;