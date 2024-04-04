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
import { finalService } from '../../lib/api/final';
import { DoctorFormType } from '../../types/doctor';
import { AdminFinalProfileType } from '../../types/final';
import { routes } from '../routes/routes-names';
import { serverUrl, serverImgUrl } from '../../config/constants';
import moment from 'moment';
import { assignmentService } from '../../lib/api/assignments';
import { LocalStorageManager } from '../../lib/localStorage-manager';
import { authService } from '../../lib/api/auth';
import AdminDoctorInfoCard from './../dashboard/includes/admin-doctor-info';

const FinalRegView = (props:any) => {
    const location = useLocation();
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const [final, setFinal] = useState<AdminFinalProfileType>();
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

    const getFinalDetails = useCallback(async () => {
        try {
            if (props.state.finalPrimaryId) {
                const { data } = await finalService.getFinalById(props.state.finalPrimaryId);
                if (data.length > 0) {
                    const country = await commonService.getCountry(Number(data[0].country));
                    const state = await commonService.getState(Number(data[0].state));
                    setFinal({
                        serialno: data[0].serialno,
                        country: country.data[0].name,
                        state: state.data[0].name,
                        qualification: data[0].qualification,
                        exam_month: data[0].exam_month,
                        exam_year: data[0].exam_year,
                        university: data[0].university,
                        college: data[0].college,
                        approval_status: data[0].approval_status,
                        createdon: data[0].createdon,
                        reg_date: data[0].reg_date,
                        posttime: data[0].posttime,
                        edu_cert1: data[0].edu_cert1,
                        edu_cert2: data[0].edu_cert2,
                        edu_cert3: data[0].edu_cert3,
                        affidivit: data[0].affidivit,
                        testimonal1: data[0].testimonal1,
                        testimonal2: data[0].testimonal2,
                        reg_other_state: data[0].reg_other_state,
                        screen_test: data[0].screen_test,
                        internship_comp: data[0].intership_comp,
                        mci_eligi: data[0].mci_eligi,
                        inter_verif_cert: data[0].inter_verif_cert,
                        mci_reg: data[0].mci_reg,
                        imr_certificate: data[0].imr_certificate,
                        receipt_no: data[0].receipt_no,
                        dd_amount:data[0].dd_amount,
                        transanctionId:data[0].transanctionId,
                        calc_date:data[0].calc_date,
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
            const finalInfo = {
                approval_status: status,
                remarks: remarks,
                assignmnetId:props.state.assignmentId
            }
            const { success,message} = await finalService.updateFinal(props.state.finalPrimaryId, finalInfo);
            if (success) {
                let msg="";
                let smsmsg="";
                if(status === 'rej' ){
                    msg="Final Details Application Not-Approved";
                    smsmsg = "Not-Approved";
                }else if(status === 'apr') {
                    msg="Final Details successfully approved and FMR No is ::"+message;
                    smsmsg="Approved";
                }else{
                    msg="Final Details successfully Verified";
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
                        text: "Final registration rejected",
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
    }, [remarks,props.state.finalPrimaryId]);

    useEffect(() => {
        const userTypeValue = LocalStorageManager.getUserType();
        userTypeValue && setUserType(userTypeValue);
        getDoctorDetails();
        getFinalDetails();
    }, [props.state.finalPrimaryId, props.state.doctorPrimaryId]);
    return (
        <>
            <div className="col-8 m-auto mb-4">
                <div className="card">
                    <div className="card-body">
                    <div className="row mb-3">
                        <h3 className="col fs-18 fw-600">Final View</h3>
                        <div className="col-2 align-items-center justify-content-center ">
                                    <button type="button"
                                        onClick={() => {
                                            closewindow();
                                        }} className='btn btn-outline-dark'><i className="bi-x-circle-fill"></i> Close</button>
                                </div>
                            </div>                
                        <div className="row mb-3">
                            <AdminDoctorInfoCard doctorId={props.state.doctorPrimaryId} fmrView="NO" additionalView="NO" ></AdminDoctorInfoCard>
                        </div>
                        
                        <div className="w-100">
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Registration No:</label>
                                    <div className="fs-14">TSMC/FMR/{doctor?.fmr_no}</div>
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
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>InternShip Completion Month:</label>
                                    <div className="fs-14">{final?.exam_month ? final?.exam_month : 'NA'}</div>
                                </div>
                            </div>
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>InternShip Completion Year :</label>
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
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>College Name:</label>
                                    <div className="fs-14">{final?.college ? final?.college : 'NA'}</div>
                                </div>
                            </div>
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>University Name:</label>
                                    <div className="fs-14">{final?.university ? final?.university : 'NA'}</div>
                                </div>
                            </div>
                            
                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                <label htmlFor="" className='fs-14 fw-600 me-2'> Internship Completion/NOC  Date : </label>
                                    <div className="fs-14">{final?.calc_date? moment(final?.calc_date).format('DD/MM/YYYY')  : 'NA'}</div>
                                </div>
                               </div> 


                            <div className="d-flex mb-2">
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'> Payment Recieved</label>
                                    <div className="fs-14">{final?.dd_amount ? final?.dd_amount : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                <label htmlFor="" className='fs-14 fw-600 me-2'>Payment Receipt No:</label>
                                    <div className="fs-14">{final?.receipt_no ? final?.receipt_no : 'NA'}</div>
                                </div>
                                <div className="col d-flex">
                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Transaction Id:</label>
                                    <div className="fs-14">{final?.transanctionId ? final?.transanctionId : 'NA'}</div>
                                </div>
                            </div>
                           
                            <div className="row mt-3">
                                {final?.edu_cert1 &&
                                    <div className="col" onClick={() => { setIsLightBoxOpen(!isLightBoxOpen); setLightBoxImagePath(final?.edu_cert1) }}>
                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                            <p className="d-flex align-items-center">
                                                {final?.edu_cert1 ? <img src={serverImgUrl + 'final/' + final?.edu_cert1} alt="" className="w-100" /> : <img src={DocDefultPic} alt="" />}
                                            </p>
                                        </div>
                                    </div>
                                }
                                </div>
                                <div className="row mt-3">
                                    {final?.edu_cert2 &&
                                    <div className="col" onClick={() => { setIsLightBoxOpen(!isLightBoxOpen); setLightBoxImagePath(final?.edu_cert2) }}>
                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                            <p className="d-flex align-items-center">{final?.edu_cert2 && <img src={serverImgUrl + 'final/' + final?.edu_cert2} alt="" />}</p>
                                        </div>
                                    </div>
                                }
                                </div>
                                <div className="row mt-3">
                                {final?.edu_cert3 &&
                                    <div className="col" onClick={() => { setIsLightBoxOpen(!isLightBoxOpen); setLightBoxImagePath(final?.edu_cert3) }}>
                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                            <p className="d-flex align-items-center"><img width="100px" src={serverImgUrl + 'final/' + final?.edu_cert3} alt="" /></p>
                                        </div>
                                    </div>
                                }
                                </div>
                                <div className="row mt-3">
                                {final?.affidivit &&
                                    <div className="col" onClick={() => { setIsLightBoxOpen(!isLightBoxOpen); setLightBoxImagePath(final?.affidivit) }}>
                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                            <p className="d-flex align-items-center"><img src={serverImgUrl + 'final/' + final?.affidivit} alt="" /></p>
                                        </div>
                                    </div>
                                }
                                 </div>
                               <div className="row mt-3">
                                {final?.testimonal1 &&
                                    <div className="col" onClick={() => { setIsLightBoxOpen(!isLightBoxOpen); setLightBoxImagePath(final?.testimonal1) }}>
                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                            <p className="d-flex align-items-center"><img src={serverImgUrl + 'final/' + final?.testimonal1} alt="" /></p>
                                        </div>
                                    </div>
                                }
                                </div>
                                <div className="row mt-3">
                                {final?.testimonal2 &&
                                    <div className="col" onClick={() => { setIsLightBoxOpen(!isLightBoxOpen); setLightBoxImagePath(final?.testimonal2) }}>
                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                            <p className="d-flex align-items-center"><img src={serverImgUrl + 'final/' + final?.testimonal2} alt="" /></p>
                                        </div>
                                    </div>
                                }
                                 </div>
                                <div className="row mt-3">
                                {final?.reg_other_state &&
                                    <div className="col" onClick={() => { setIsLightBoxOpen(!isLightBoxOpen); setLightBoxImagePath(final?.reg_other_state) }}>
                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                            <p className="d-flex align-items-center"><img src={serverImgUrl + 'final/' + final?.reg_other_state} alt="" /></p>
                                        </div>
                                    </div>
                                }
                                </div>
                                <div className="row mt-3">
                                {final?.screen_test &&
                                    <div className="col" onClick={() => { setIsLightBoxOpen(!isLightBoxOpen); setLightBoxImagePath(final?.screen_test) }}>
                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                            <p className="d-flex align-items-center"><img src={serverImgUrl + 'final/' + final?.screen_test} alt="" /></p>
                                        </div>
                                    </div>
                                }
                                   </div>
                                <div className="row mt-3">
                                {final?.internship_comp &&
                                    <div className="col" onClick={() => { setIsLightBoxOpen(!isLightBoxOpen); setLightBoxImagePath(final?.internship_comp) }}>
                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                            <p className="d-flex align-items-center"><img src={serverImgUrl + 'final/' + final?.internship_comp} alt="" /></p>
                                        </div>
                                    </div>
                                }
                                </div>
                                <div className="row mt-3">
                                {final?.mci_eligi &&
                                    <div className="col" onClick={() => { setIsLightBoxOpen(!isLightBoxOpen); setLightBoxImagePath(final?.mci_eligi) }}>
                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                            <p className="d-flex align-items-center"><img src={serverImgUrl + 'final/' + final?.mci_eligi} alt="" /></p>
                                        </div>
                                    </div>
                                }
                                   </div>
                                <div className="row mt-3">
                                {final?.inter_verif_cert &&
                                    <div className="col" onClick={() => { setIsLightBoxOpen(!isLightBoxOpen); setLightBoxImagePath(final?.inter_verif_cert) }}>
                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                            <p className="d-flex align-items-center"><img src={serverImgUrl + 'final/' + final?.inter_verif_cert} alt="" /></p>
                                        </div>
                                    </div>
                                }
                                </div>
                                <div className="row mt-3">
                                {final?.mci_reg &&
                                    <div className="col" onClick={() => { setIsLightBoxOpen(!isLightBoxOpen); setLightBoxImagePath(final?.mci_reg) }}>
                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                            <p className="d-flex align-items-center"><img src={serverImgUrl + 'final/' + final?.mci_reg} alt="" /></p>
                                        </div>
                                    </div>
                                }
                                   </div>
                                <div className="row mt-3">
                                {final?.imr_certificate &&
                                    <div className="col" onClick={() => { setIsLightBoxOpen(!isLightBoxOpen); setLightBoxImagePath(final?.imr_certificate) }}>
                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                            <p className="d-flex align-items-center"><img src={serverImgUrl + 'final/' + final?.imr_certificate} alt="" /></p>
                                        </div>
                                    </div>
                                }
                            </div>  
                        </div>
                    </div>
                    {userType === 'u' && final?.approval_status === 'pen' &&
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
                    {userType === 'a' && final?.approval_status === 'ver' &&
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
                                src: serverImgUrl + 'final/' + lightBoxImagePath,
                                alt: "edu_cert1",
                                width: 3840,
                                height: 2560,
                                srcSet: [
                                    { src: serverImgUrl + 'final/' + lightBoxImagePath, width: 100, height: 100 },
                                ]
                            }
                        ]}
                    />
                </>
            </div>
        </>
    )
}

export default FinalRegView;