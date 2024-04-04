import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import DocDefultPic from '../../assets/images/doc-default-img.jpg';
import { authService } from '../../lib/api/auth';
import { commonService } from '../../lib/api/common';
import { doctorService } from '../../lib/api/doctot';
import { provisionalService } from '../../lib/api/provisional';
import { LocalStorageManager } from '../../lib/localStorage-manager';
import { setDoctorInfo } from '../../redux/doctor';
import { DoctorFormType } from '../../types/doctor';
import { AdminProvisionalProfileType } from '../../types/provisional';
import { routes } from '../routes/routes-names';
import { serverUrl, serverImgUrl } from '../../config/constants';
import moment from 'moment';
import { assignmentService } from '../../lib/api/assignments';
import AdminDoctorInfoCard from './../dashboard/includes/admin-doctor-info';


//type Props = OutletProps<{ id: string }>;
//const ProvisionalView: React.FC<Props> = ({match}: any) => {

const ProvisionalView = (props:any) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const [provisional, setProvisional] = useState<AdminProvisionalProfileType>();
    const [remarks, setRemarks] = useState('');
    const [isEduCert1, setIsEduCert1] = useState(false);
    const [isEduCert2, setIsEduCert2] = useState(false);
    const [isEduCert3, setIsEduCert3] = useState(false);
    const [disablebtn, setDisablebtn] = useState(false);
    const [userType, setUserType] = useState('');

    const getDoctorDetails = async () => {
        try {
            if (props.state.doctorPrimaryId) {
                const { data } = await doctorService.getDoctorById(props.state.doctorPrimaryId);
                if (data.length > 0) {
                    setDoctor(data[0]);
                    dispatch(setDoctorInfo(data[0]));
                }
            }
        } catch (err) {
            console.log('error countries getList', err);
        }
    };

    const getProvisionalDetails = useCallback(async () => {
        try {
            if (props.state.provisionalPrimaryId) {
                const { data } = await provisionalService.getProvisionalById(Number(props.state.provisionalPrimaryId));
                if (data.length > 0) {
                    const country = await commonService.getCountry(Number(data[0].country));
                    const state = await commonService.getState(Number(data[0].state));
                    setProvisional({
                        doctor_id: data[0].DoctorId,
                        country: country.data[0].name,
                        state: state.data[0].name,
                        qualification: data[0].qualification,
                        exam_month: data[0].exam_month,
                        exam_year: data[0].exam_year,
                        university: data[0].university,
                        reg_date: data[0].reg_date,
                        college: data[0].college,
                        approval_status:data[0].approval_status,
                        edu_cert1: data[0].edu_cert1,
                        edu_cert2: data[0].edu_cert2,
                        edu_cert3: data[0].edu_cert3,
                        dd_amount:data[0].dd_amount,
                        receipt_no: data[0].receipt_no,
                        transanctionId:data[0].transanctionId,
                        calc_date:data[0].calc_date,
                    });
                }
            }
        } catch (err) {
            console.log('error getProvisionalDetails', err);
        }
    }, []);

    const closewindow = useCallback(async () => {
        props.greet();
    }, []);

    const submit = useCallback(async (status: any) => {
        if (status) {
            setDisablebtn(true);
            const provisionalInfo = {
                approval_status: status,
                remarks: remarks,
                assignmnetId:props.state.assignmentId
            }

            const { success,message} = await provisionalService.updateProvisional(props.state.provisionalPrimaryId, provisionalInfo);
                if (success) {
                    let msg="";
                    let smsmsg="";
                    if(status === 'rej' ){
                        msg="Provisional Details Application Not-Approved";
                        smsmsg = "Not-Approved";
                    }else if(status === 'apr') {
                        msg="Provisional Details successfully approved and PMR No is ::"+message;
                        smsmsg="Approved";
                    }else{
                        msg="Provisional Details successfully Verified";
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
                                await authService.sendApproval(doctor?.mobileno,smsmsg).then((response) => {
                                    
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
                        text: "Provisional registration rejected",
                        icon: "error",
                        confirmButtonText: "OK",
                    }).then(async (result:any) => {
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
        getProvisionalDetails();
    }, [props.state.provisionalPrimaryId, props.state.doctorPrimaryId]);

  

    return (
        <>
            <div className="col-8 m-auto mb-4">
                <div className="card">
                    <div className="card-body">
                    <div className="row mb-3">
                        <h3 className="col fs-18 fw-600">Provisional View</h3>
                        
                                <div className="col-2 align-items-center justify-content-center ">
                                    <button type="button"
                                        onClick={() => {
                                            closewindow();
                                        }} className='btn btn-outline-dark'><i className="bi-x-circle-fill"></i> Close</button>
                                </div>
                          </div>  
                        <div className="row mb-3"> 
                        <div className="row mb-3">
                            <AdminDoctorInfoCard doctorId={props.state.doctorPrimaryId} fmrView="NO" additionalView="NO" ></AdminDoctorInfoCard>
                        </div>
                        </div>
                        <div className="w-100">
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Registration No:</label>
                                    <div className="fs-14"><span>TSMC/PMR/{doctor?.pmr_no}</span></div>
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
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>University Name:</label>
                                    <div className="fs-14">{provisional?.university ? provisional?.university : 'NA'}</div>
                                </div>
                            </div>
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>College Name:</label>
                                    <div className="fs-14">{provisional?.college ? provisional?.college : 'NA'}</div>
                                </div>
                            </div>
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                <label htmlFor="" className='fs-14 fw-600 me-2'> Provisional Certificate Issue Date  : </label>
                                    <div className="fs-14">{provisional?.calc_date? moment(provisional?.calc_date).format('DD/MM/YYYY')  : 'NA'}</div>
                                </div>
                               </div> 
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'> Payment Recieved</label>
                                    <div className="fs-14">{provisional?.dd_amount ? provisional?.dd_amount : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Pyament Receipt No:</label>
                                    <div className="fs-14">{provisional?.receipt_no ? provisional?.receipt_no : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Transaction Id:</label>
                                    <div className="fs-14">{provisional?.transanctionId ? provisional?.transanctionId : 'NA'}</div>
                                </div>
                            </div>
                            
                            <div className="row mt-3">
                                <div className="col">
                                    <div className="drag-img-box d-flex align-items-center justify-content-center">
                                        <p className="d-flex align-items-center" onClick={() => setIsEduCert1(!isEduCert1)}>
                                            {provisional?.edu_cert1 ? <img src={serverImgUrl + 'provisional/' + provisional?.edu_cert1} alt="" className="w-100" /> : <img src={DocDefultPic} alt="" />}
                                        </p>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="drag-img-box d-flex align-items-center justify-content-center">
                                        <p className="d-flex align-items-center" onClick={() => setIsEduCert2(!isEduCert2)}>
                                            {provisional?.edu_cert2 ? <img src={serverImgUrl + 'provisional/' + provisional?.edu_cert2} alt="" className="w-100" /> : <img src={DocDefultPic} alt="" />}
                                        </p>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="drag-img-box d-flex align-items-center justify-content-center">
                                        <p className="d-flex align-items-center" onClick={() => setIsEduCert3(!isEduCert3)}>
                                   
  
                                            {provisional?.edu_cert3 ? <img src={serverImgUrl + 'provisional/' + provisional?.edu_cert3} alt="" className="w-100" />  : <img src={DocDefultPic} alt="" />}
                                    
                                        </p>
                                    </div>
                                    

                                </div>
                                {/* <div className="col">
                                    <div className="drag-img-box d-flex align-items-center justify-content-center">
                                        <p className="d-flex align-items-center"><strong>Doc View</strong></p>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                   
                    {userType === 'u' && provisional?.approval_status === 'pen' &&
                        <div className="card-footer pb-3">
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
                   {userType === 'a' && provisional?.approval_status === 'ver' &&
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
                                src: serverImgUrl + 'provisional/' + provisional?.edu_cert1,
                                alt: "edu_cert1",
                                width: 3840,
                                height: 2560,
                                srcSet: [
                                    { src: serverImgUrl + 'provisional/' + provisional?.edu_cert1, width: 100, height: 100 },
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
                                src: serverImgUrl + 'provisional/' + provisional?.edu_cert2,
                                alt: "edu_cert2",
                                width: 3840,
                                height: 2560,
                                srcSet: [
                                    { src: serverImgUrl + 'provisional/' + provisional?.edu_cert2, width: 100, height: 100 },
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
                                src: serverImgUrl + 'provisional/' + provisional?.edu_cert3,
                                alt: "edu_cert3",
                                width: 3840,
                                height: 2560,
                                srcSet: [
                                    { src: serverImgUrl + 'provisional/' + provisional?.edu_cert3, width: 100, height: 100 },
                                ]
                            }
                        ]}
                    />
                </>
            </div>
        </>
    )
}

export default ProvisionalView;