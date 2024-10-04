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
import { routes } from '../routes/routes-names';
import { serverUrl, serverImgUrl } from '../../config/constants';
import moment from 'moment';
import { assignmentService } from '../../lib/api/assignments';
import { LocalStorageManager } from '../../lib/localStorage-manager';
import { adminNocFormType } from "../../types/noc";
import { goodStandingFormType } from "../../types/common";
import { goodstandingService } from "../../lib/api/goodstanding";
import { authService } from '../../lib/api/auth';
import AdminDoctorInfoCard from './../dashboard/includes/admin-doctor-info';

const GoodStandingRegView =   (props:any) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const [goodStanding, setGoodStanding] = useState<any>();
    const [remarks, setRemarks] = useState('');
    const [userType, setUserType] = useState('');
    const [isEduCert1, setIsEduCert1] = useState(false);
    const [isEduCert2, setIsEduCert2] = useState(false);
    const [disablebtn, setDisablebtn] = useState(false);
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

    const getGSDetails = useCallback(async () => {
        try {
            if (props.state.gsPrimaryId) {
                const { data } = await goodstandingService.getGoodstandingById(props.state.gsPrimaryId);
                if (data.length > 0) {
                   
                    setGoodStanding({
                        approval_status: data[0].status,
                        receipt_no: data[0].receipt_no,
                        dd_amount:data[0].dd_amount,
                        reg_date:data[0].regDate,
                        edu_cert1: data[0].edu_cert1,
                        edu_cert2: data[0].edu_cert2,
                        transanctionId:data[0].transanctionId,
                        ecfmgRefNo:data[0].ecfmgRefNo,
                        ecfmgEmail:data[0].ecfmgEmail,
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
            const gsInfo = {
                approval_status: status,
                remarks: remarks,
                assignmnetId:props.state.assignmentId
            }
            const { success } = await goodstandingService.updateGoodStanding(props.state.gsPrimaryId, gsInfo);
            if (success) {
                let msg="";
                let smsmsg="";
                
                if(status === 'rej' ){
                    msg="Good Standing Details Application Not-Approved";
                    smsmsg = "Not-Approved";
                }else if(status === 'apr') {
                    msg="Good Standing Details successfully approved";
                    smsmsg="Approved";
                }else{
                    msg="Good Standing Details successfully Verified";
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
                        text: "Good Standing registration rejected",
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
        getGSDetails();
    }, [props.state.gsPrimaryId, props.state.doctorPrimaryId]);
    return (
        <>
            <div className="col-8 m-auto mb-4">
                <div className="card">
                    <div className="card-body">
                    <div className="row mb-3">
                        <h3 className="col fs-18 fw-600">GoodStanding View</h3>
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
                                    <div className="fs-14">{goodStanding?.reg_date ? moment(goodStanding?.reg_date).format('DD/MM/YYYY') : 'NA'}</div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>ECFMG id/GMC RefNo/any other :</label>
                                    <div className="fs-14">{goodStanding?.ecfmgRefNo ? goodStanding?.ecfmgRefNo : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>ECFMG/GMC-UK Email Id:</label>
                                    <div className="fs-14">{goodStanding?.ecfmgEmail ? goodStanding?.ecfmgEmail : 'NA'}</div>
                                </div>
                                </div>
                            <div className="d-flex mb-2 mt-3">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'> Payment Recieved</label>
                                    <div className="fs-14">{goodStanding?.dd_amount ? goodStanding?.dd_amount : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Pyament Receipt No:</label>
                                    <div className="fs-14">{goodStanding?.receipt_no ? goodStanding?.receipt_no : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Transaction Id:</label>
                                    <div className="fs-14">{goodStanding?.transanctionId ? goodStanding?.transanctionId : 'NA'}</div>
                                </div>
                                </div>    
                                
                            
                            <div className="row mt-3">
                                <div className="col">
                                    <div className="drag-img-box d-flex align-items-center justify-content-center">
                                        <p className="d-flex align-items-center" onClick={() => setIsEduCert1(!isEduCert1)}>
                                            {goodStanding?.edu_cert1 ? <img src={serverImgUrl + 'gs/' + goodStanding?.edu_cert1} alt="" className="w-100" /> : <img src={DocDefultPic} alt="" />}
                                        </p>
                                    </div>
                                </div>
                                </div>
                                <div className="row mt-3">
                                <div className="col">
                                    <div className="drag-img-box d-flex align-items-center justify-content-center">
                                        <p className="d-flex align-items-center" onClick={() => setIsEduCert2(!isEduCert2)}>
                                            {goodStanding?.edu_cert2 ? <img src={serverImgUrl + 'gs/' + goodStanding?.edu_cert2} alt="" className="w-100" /> : <img src={DocDefultPic} alt="" />}
                                        </p>
                                    </div>
                                </div>
                                </div>
                        </div>
                    </div>
                    {userType === 'u' && goodStanding?.approval_status === 'pen' &&
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
                     {userType === 'a' && goodStanding?.approval_status === 'ver' &&
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
                <>

                                            <Lightbox
                                                open={isEduCert1}
                                                plugins={[Zoom]}
                                                close={() => setIsEduCert1(false)}
                                                slides={[
                                                    {
                                                        src: serverImgUrl + 'gs/' + goodStanding?.edu_cert1,
                                                        alt: "edu_cert1",
                                                        width: 3840,
                                                        height: 2560,
                                                        srcSet: [
                                                            { src: serverImgUrl + 'gs/' + goodStanding?.edu_cert1, width: 100, height: 100 },
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
                                                        src: serverImgUrl + 'gs/' + goodStanding?.edu_cert2,
                                                        alt: "edu_cert2",
                                                        width: 3840,
                                                        height: 2560,
                                                        srcSet: [
                                                            { src: serverImgUrl + 'gs/' + goodStanding?.edu_cert2, width: 100, height: 100 },
                                                        ]
                                                    }
                                                ]}
                                            />
                                            </>
            </div>
           
        </>
    )
}

export default GoodStandingRegView;