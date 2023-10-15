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
import { LocalStorageManager } from '../../lib/localStorage-manager';
import { additionalService } from '../../lib/api/additional';
import { AdminAddQualDataFormType} from '../../types/additionalQuali';
import { authService } from '../../lib/api/auth';
import AdminDoctorInfoCard from './../dashboard/includes/admin-doctor-info';

const AdditionalRegView = (props:any) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const [additionals, setAdditionals] = useState<AdminAddQualDataFormType>();
    const [remarks, setRemarks] = useState('');
    const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);
    const [lightBoxImagePath, setLightBoxImagePath] = useState('');
    const [userType, setUserType] = useState('');
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

    const getAdditionalDetails = useCallback(async () => {
        try {
            if (props.state.additionalPrimaryId) {
                const { data } = await additionalService.getQualificationById(props.state.additionalPrimaryId);
                if (data.length > 0) {
                    const country = await commonService.getCountry(Number(data[0].country));
                    const state = await commonService.getState(Number(data[0].state));
                    setAdditionals({
                        country: country.data[0].name,
                        state: state.data[0].name,
                        university: data[0].university,
                        college: data[0].college,
                        qualification: data[0].qualification,
                        exam_month: data[0].exam_month,
                        exam_year: data[0].exam_year,
                        approval_status: data[0].approval_status,
                        appliedFor: data[0].appliedFor,
                        receipt_no: data[0].receipt_no,
                        dd_amount:data[0].dd_amount,
                        reg_date:data[0].reg_date,
                        edu_cert1:data[0].edu_cert1,
                        edu_cert2:data[0].edu_cert2,
                        transanctionId:data[0].transanctionId,
                        calc_date:data[0].calc_date,
                    });
                }
            }
        } catch (err) {
            console.log('error getAdditionalDetails', err);
        }
    }, []);

    const submit = useCallback(async (status: any) => {
        if (status) {
            setDisablebtn(true);
            const additionalsInfo = {
                approval_status: status,
                remarks: remarks,
                assignmnetId:props.state.assignmentId

            }
            const { success } = await additionalService.updateQualification(props.state.additionalPrimaryId, additionalsInfo);
            if (success) {
                let msg="";
                let smsmsg="";
                if(status === 'rej' ){
                    msg="Additional Details Application Rejected";
                    smsmsg="Rejected";
                }else if(status === 'apr') {
                    msg="Additional Details successfully approved";
                    smsmsg="Approved";
                }else{
                    msg="Additional Details successfully Verified";
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
                        text: "AdditionalDetails registration rejected",
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
    }, [remarks,props.state.additionalPrimaryId]);

    const closewindow = useCallback(async () => {
        props.greet();
    }, []);

    useEffect(() => {
        const userTypeValue = LocalStorageManager.getUserType();
        userTypeValue && setUserType(userTypeValue);
        getDoctorDetails();
        getAdditionalDetails();
    }, [props.state.additionalPrimaryId, props.state.doctorPrimaryId]);
    return (
        <>
            <div className="col-8 m-auto mb-4">
                <div className="card">
                    <div className="card-body">
                    <div className="row mb-3">
                        <h3 className="col fs-18 fw-600">Additional View</h3>
                        <div className="col-2 align-items-center justify-content-center ">
                                    <button type="button"
                                        onClick={() => {
                                            closewindow();
                                        }} className='btn btn-outline-dark'><i className="bi-x-circle-fill"></i> Close</button>
                                </div>
                            </div> 
                              
                                <div className="row mb-3">
                                    <AdminDoctorInfoCard doctorId={props.state.doctorPrimaryId} ></AdminDoctorInfoCard>
                                </div>
                            
                        
                        <div className="w-100">
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Registration No:</label>
                                    <div className="fs-14">TSMC/FMR/{doctor?.fmr_no}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Registration Date:</label>
                                    <div className="fs-14">{additionals?.reg_date ? moment(additionals?.reg_date).format('DD/MM/YYYY') : 'NA'}</div>
                                </div>
                            </div>
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Qualification:</label>
                                    <div className="fs-14">{additionals?.qualification ? additionals?.qualification : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Exam Month:</label>
                                    <div className="fs-14">{additionals?.exam_month ? additionals?.exam_month : 'NA'}</div>
                                </div>
                            </div>
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Exam Year:</label>
                                    <div className="fs-14">{additionals?.exam_year ? additionals?.exam_year : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Country:</label>
                                    <div className="fs-14">{additionals?.country ? additionals?.country : 'NA'}</div>
                                </div>
                            </div>
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>State:</label>
                                    <div className="fs-14">{additionals?.state ? additionals?.state : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>University Name:</label>
                                    <div className="fs-14">{additionals?.university ? additionals?.university : 'NA'}</div>
                                </div>
                            </div>

                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                <label htmlFor="" className='fs-14 fw-600 me-2'> Date of Issue of Degree : </label>
                                    <div className="fs-14">{additionals?.calc_date? moment(additionals?.calc_date).format('DD/MM/YYYY') : 'NA'}</div>
                                </div>
                               </div> 
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'> Payment Recieved</label>
                                    <div className="fs-14">{additionals?.dd_amount ? additionals?.dd_amount : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                <label htmlFor="" className='fs-14 fw-600 me-2'>Payment Receipt No:</label>
                                    <div className="fs-14">{additionals?.receipt_no ? additionals?.receipt_no : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Transaction Id:</label>
                                    <div className="fs-14">{additionals?.transanctionId ? additionals?.transanctionId : 'NA'}</div>
                                </div>
                            </div>
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>College Name:</label>
                                    <div className="fs-14">{additionals?.college ? additionals?.college : 'NA'}</div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                {additionals?.edu_cert1 &&
                                    <div className="col" onClick={() => { setIsLightBoxOpen(!isLightBoxOpen); setLightBoxImagePath(additionals?.edu_cert1) }}>
                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                            <p className="d-flex align-items-center">
                                                {additionals?.edu_cert1 ? <img src={serverImgUrl + 'additional/' + additionals?.edu_cert1} alt="" className="w-100" /> : <img src={DocDefultPic} alt="" />}
                                            </p>
                                        </div>
                                    </div>
                                }
                                {additionals?.edu_cert2 &&
                                    <div className="col" onClick={() => { setIsLightBoxOpen(!isLightBoxOpen); setLightBoxImagePath(additionals?.edu_cert2) }}>
                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                            <p className="d-flex align-items-center">{additionals?.edu_cert2 && <img src={serverImgUrl + 'additional/' + additionals?.edu_cert2} alt="" />}</p>
                                        </div>
                                    </div>
                                }
                             </div>
                               
                        </div>
                    </div>
                    {userType === 'u' && additionals?.approval_status === 'pen' &&
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

            {userType === 'a' && additionals?.approval_status === 'ver' &&
                        <div className="card-footer">
                            <div className="mb-3">
                                <label htmlFor="" className='mb-2'>Reason <span className='fs-12'>{'(Enter reason if you are rejecting application)'}</span></label>
                                <textarea className='form-control fs-14' onChange={(e) => setRemarks(e.target.value)} name="" id="" placeholder='Enter Reason'></textarea>
                            </div>
                            <div className='d-flex'>
                                <div className="col">
                                    <button type="submit" disabled={disablebtn}  onClick={() => {
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
                                src: serverImgUrl + 'additional/' + lightBoxImagePath,
                                alt: "edu_cert1",
                                width: 3840,
                                height: 2560,
                                srcSet: [
                                    { src: serverImgUrl + 'additional/' + lightBoxImagePath, width: 100, height: 100 },
                                ]
                            }
                        ]}
                    />
                </>
            </div>
        </>
    )
}

export default AdditionalRegView;