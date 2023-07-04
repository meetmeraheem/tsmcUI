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
import { DoctorFormType } from '../../types/doctor';
import { routes } from '../routes/routes-names';
import { serverUrl, serverImgUrl } from '../../config/constants';
import moment from 'moment';
import { assignmentService } from '../../lib/api/assignments';
import { LocalStorageManager } from '../../lib/localStorage-manager';
import { changeofnameService } from "../../lib/api/changeofname";
import { AdminChangeOfNameType} from '../../types/common';
import { authService } from '../../lib/api/auth';


const ChangeofNameRegView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { nameChangeId, doctorPrimaryId ,assignmentId} = location.state
    const dispatch = useDispatch();
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const [changeofname, setChangeofname] = useState<AdminChangeOfNameType>();
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

    const getAdditionalDetails = useCallback(async () => {
        try {
            if (nameChangeId) {
                const { data } = await changeofnameService.getNameChangeById(nameChangeId);
                if (data && data.approval_status !=  null) {
                    setChangeofname({
                        approval_status: data.approval_status,
                        gazzetNotificationDate: data.gazzetNotificationDate,
                        doctor_id: data.doctor_id,
                        gazzetNotificationDocument: data.gazzetNotificationDocument,
                        gazzetNotificationNo:data.gazzetNotificationNo,
                        extra_col1:data.extraCol1,
                        newName:data.newName,
                        currentName:data.currentName,
                        dd_amount:data.dd_amount,
                        receipt_no:data.receipt_no
                    });
                }
            }
        } catch (err) {
            console.log('error getAdditionalDetails', err);
        }
    }, []);

    const submit = useCallback(async (status: any) => {
        if (status) {
            const changeofnameInfo = {
                doctorPrimaryId:doctorPrimaryId,
                approval_status: status,
                remarks: remarks,
                assignmnetId:assignmentId

            }
            const { success } = await changeofnameService.updateNameChange(nameChangeId, changeofnameInfo);
            if (success) {
                let msg="";
                let smsmsg="";
                if(status === 'rej' ){
                    msg="Change of Name Details Application Rejected";
                    smsmsg="Rejected";
                }else if(status === 'apr') {
                    msg="Change of Name Details successfully approved";
                    smsmsg="Approved";
                }else{
                    msg="Change of Name Details successfully Verified";
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
                            if (userType === 'a') {
                                navigate(routes.admin_dashboard);
                            }
                            if (userType === 'u') {
                                navigate(routes.admin_dashboard);
                            }
                        }
                    });
                }
                else {
                    Swal.fire({
                        title: "",
                        text: "AdditionalDetails registration rejected",
                        icon: "error",
                        confirmButtonText: "OK",
                    }).then(async (result) => {
                        if (result.isConfirmed) {
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
    const closewindow = useCallback(async () => {
        if (userType === 'a') {
            navigate(routes.admin_dashboard);
        }
        if (userType === 'u') {
            navigate(routes.admin_dashboard);
        }
    },[userType]);
    useEffect(() => {
        const userTypeValue = LocalStorageManager.getUserType();
        userTypeValue && setUserType(userTypeValue);
        getDoctorDetails();
        getAdditionalDetails();
    }, [nameChangeId, doctorPrimaryId]);
    return (
        <>
            <div className="col-8 m-auto mb-4">
                <div className="card">
                    <div className="card-body">
                    <div className="row mb-3">
                        <h3 className="col fs-18 fw-600">Change Of Name Details</h3>
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
                                
                            </div>
                            <div className="d-flex mb-2">
                            <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Current Name</label>
                                    <div className="fs-14">{changeofname?.currentName ? changeofname?.currentName : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>New Name:</label>
                                    <div className="fs-14">{changeofname?.newName ? changeofname?.newName : 'NA'}</div>
                                </div>
                               
                            </div>
                            <div className="d-flex mb-2">
                            <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Gazzet Notification Number:</label>
                                    <div className="fs-14">{changeofname?.gazzetNotificationNo ? changeofname?.gazzetNotificationNo : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Gazzet Notification Date:</label>
                                    <div className="fs-14">{changeofname?.gazzetNotificationDate ? moment(changeofname?.gazzetNotificationDate).format('DD/MM/YYYY') : 'NA'}</div>
                                </div>
                               
                            </div>
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'> Payment Recieved</label>
                                    <div className="fs-14">{changeofname?.dd_amount ? changeofname?.dd_amount : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Pyament Reciept No:</label>
                                    <div className="fs-14">{changeofname?.receipt_no ? changeofname?.receipt_no : 'NA'}</div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                {changeofname?.gazzetNotificationDocument &&
                                    <div className="col" onClick={() => { setIsLightBoxOpen(!isLightBoxOpen); setLightBoxImagePath(changeofname?.gazzetNotificationDocument) }}>
                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                            <p className="d-flex align-items-center">
                                                {changeofname?.gazzetNotificationDocument ? <img src={serverImgUrl + 'namechange/' + changeofname?.gazzetNotificationDocument} alt="" className="w-100" /> : <img src={DocDefultPic} alt="" />}
                                            </p>
                                        </div>
                                    </div>
                                }
                             </div>
                               
                        </div>
                    </div>
                    {userType === 'u' && changeofname?.approval_status === 'pen' &&
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
                                            submit('ver');
                                        }} className='btn btn-success'><i className="bi-check-circle"></i> Verified</button>
                                </div>
                            </div>
                        </div>
                    }
                    {userType === 'a' && changeofname?.approval_status === 'ver' &&
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
                <>
                    <Lightbox
                        open={isLightBoxOpen}
                        plugins={[Zoom]}
                        close={() => setIsLightBoxOpen(false)}
                        slides={[
                            {
                                src: serverImgUrl + 'namechange/' + lightBoxImagePath,
                                alt: "edu_cert1",
                                width: 3840,
                                height: 2560,
                                srcSet: [
                                    { src: serverImgUrl + 'namechange/' + lightBoxImagePath, width: 100, height: 100 },
                                ]
                            }
                        ]}
                    />
                </>
            </div>
        </>
    )
}

export default ChangeofNameRegView;