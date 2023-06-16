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


//type Props = OutletProps<{ id: string }>;
//const ProvisionalView: React.FC<Props> = ({match}: any) => {

const ProvisionalView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { provisionalPrimaryId, doctorPrimaryId,assignmentId } = location.state
    const dispatch = useDispatch();
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const [provisional, setProvisional] = useState<AdminProvisionalProfileType>();
    const [remarks, setRemarks] = useState('');
    const [isEduCert1, setIsEduCert1] = useState(false);
    const [isEduCert2, setIsEduCert2] = useState(false);
    const [isEduCert3, setIsEduCert3] = useState(false);
    const [numPages, setNumPages] = useState(null);

    const [userType, setUserType] = useState('');

    const getDoctorDetails = async () => {
        try {
            if (doctorPrimaryId) {
                const { data } = await doctorService.getDoctorById(doctorPrimaryId);
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
            if (provisionalPrimaryId) {
                const { data } = await provisionalService.getProvisionalById(Number(provisionalPrimaryId));
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
                        receipt_no: data[0].receipt_no
                    });
                }
            }
        } catch (err) {
            console.log('error getProvisionalDetails', err);
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
            const provisionalInfo = {
                approval_status: status,
                remarks: remarks,
                assignmnetId:assignmentId
            }

            const { success } = await provisionalService.updateProvisional(provisionalPrimaryId, provisionalInfo);
                if (success) {
                    let msg="";
                    let smsmsg="";
                    if(status !== 'rej' ){
                        msg="Provisional successfully approved";
                        smsmsg="Your Provisional  Application has been Approved from Telangana State Medical Council.";
                    }else{
                        msg="Provisional successfully Rejected";
                        smsmsg="Your Provisional Application has been Rejected from Telangana State Medical Council.";
                    }
                    Swal.fire({
                        title: "Success",
                        text: msg,
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then(async (result:any) => {
                        if (result.isConfirmed) {
                            if (doctor?.mobileno) {
                                await authService.sendSMS(doctor?.mobileno,smsmsg).then((response) => {
                                    
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
                        text: "Provisional registration rejected",
                        icon: "error",
                        confirmButtonText: "OK",
                    }).then(async (result:any) => {
                        if (result.isConfirmed) {
                            if (doctor?.mobileno) {
                                await authService.sendSMS(doctor?.mobileno, 'Your Provisional  Application has been Rejected from Telangana State Medical Council.').then((response) => {
                                    
                                }).catch(() => {

                                });
                            }
                            if (userType === 'a') {
                                navigate(routes.admin_dashboard);
                            }
                            if (userType === 'u') {
                                navigate(routes.admin_dashboard);
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
        getProvisionalDetails();
    }, [provisionalPrimaryId, doctorPrimaryId]);

  

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
                                    <label htmlFor="" className='fs-14 fw-600 me-2'> Payment Recieved</label>
                                    <div className="fs-14">{provisional?.dd_amount ? provisional?.dd_amount : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Pyament Reciept No:</label>
                                    <div className="fs-14">{provisional?.receipt_no ? provisional?.receipt_no : 'NA'}</div>
                                </div>
                            </div>
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>College Name:</label>
                                    <div className="fs-14">{provisional?.college ? provisional?.college : 'NA'}</div>
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