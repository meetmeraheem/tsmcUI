import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import DocDefultPic from '../../assets/images/doc-default-img.jpg';
import { authService } from '../../../lib/api/auth';
import { commonService } from '../../../lib/api/common';
import { doctorService } from '../../../lib/api/doctot';
import { provisionalService } from '../../../lib/api/provisional';
import { LocalStorageManager } from '../../../lib/localStorage-manager';
import { setDoctorInfo } from '../../../redux/doctor';
import { DoctorFormType } from '../../../types/doctor';
import { AdminProvisionalProfileType } from '../../../types/provisional';
import { routes } from '../../routes/routes-names';
import { serverUrl, serverImgUrl } from '../../../config/constants';
import moment from 'moment';
import { assignmentService } from '../../../lib/api/assignments';
import DoctorInfoPrintCard from './../../user-panal/includes/doctor-info-print';


//type Props = OutletProps<{ id: string }>;
//const ProvisionalView: React.FC<Props> = ({match}: any) => {

const ProvisionalViewPrint = (props:any) => {
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

    useEffect(() => {
        const userTypeValue = LocalStorageManager.getUserType();
        userTypeValue && setUserType(userTypeValue);
        getDoctorDetails();
        getProvisionalDetails();
    }, [props.state.provisionalPrimaryId, props.state.doctorPrimaryId]);

    return (
        <>
            <div className="col-9 m-auto mb-4">
                <DoctorInfoPrintCard />
                <table style={{ border: "1px solid rgb(0, 0, 0)", width: "100%" }} className="mt-4">
                    <tr style={{ alignContent: "center", width: "100%", backgroundColor: "#E2F4F5" }}>
                        <td colSpan={2} style={{ textAlign: "left", width: "100%", fontSize: "16px", fontWeight: "bold" }} >Provisional Registration Information</td>
                    </tr>
                        
                        <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Registration No:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}><span>TSMC/PMR/{doctor?.pmr_no}</span></td>
                            </tr>
                                <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Registration Date:</td>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{provisional?.reg_date ? moment(provisional?.reg_date).format('DD/MM/YYYY') : 'NA'}</td>
                                </tr>
                            
                                <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Qualification:</td>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{provisional?.qualification ? provisional?.qualification : 'NA'}</td>
                                </tr>
                                <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Exam Month:</td>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{provisional?.exam_month ? provisional?.exam_month : 'NA'}</td>
                                </tr>
                            
                            
                                <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Exam Year:</td>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{provisional?.exam_year ? provisional?.exam_year : 'NA'}</td>
                                </tr>
                                <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Country:</td>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{provisional?.country ? provisional?.country : 'NA'}</td>
                                </tr>
                            
                            
                                <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>State:</td>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{provisional?.state ? provisional?.state : 'NA'}</td>
                                </tr>
                                <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>University Name:</td>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{provisional?.university ? provisional?.university : 'NA'}</td>
                                </tr>
                            
                                <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>College Name:</td>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{provisional?.college ? provisional?.college : 'NA'}</td>
                                </tr>
                          
                                <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                                <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}> Provisional Certificate Issue Date  : </td>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{provisional?.calc_date? moment(provisional?.calc_date).format('DD/MM/YYYY')  : 'NA'}</td>
                                </tr>
                               
                            
                                <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}> Payment Recieved</td>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{provisional?.dd_amount ? provisional?.dd_amount : 'NA'}</td>
                                </tr>
                                <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Pyament Receipt No:</td>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{provisional?.receipt_no ? provisional?.receipt_no : 'NA'}</td>
                                </tr>
                                <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Transaction Id:</td>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{provisional?.transanctionId ? provisional?.transanctionId : 'NA'}</td>
                                </tr>
                            </table>
                            <br/>
                        <div style={{border:"1px solid rgb(0, 0, 0)"}} className='mt-5'>
                        
                            <p style={{fontWeight:"bold", alignContent: "center", width: "100%", backgroundColor: "#E2F4F5" }}>
                            General Instructions
                        </p>
                        <p>
                        1.	Payment successful and  Provisional Medical Registration applied successfully.
                        <br/>
                        2.	The Certificates verification for  Provisional Medical Registration is must & after verification only the application will be processed.
                        <br/>
                        3.	Please print and carry this receipt while visiting TSMC office along with all the originals and one set of Xerox copies.

                        </p> </div>
                        <br/>
                            <div style={{fontWeight:"bold", alignContent: "center", width: "100%", backgroundColor: "#E2F4F5" }}><p>
                            Note:
                            <br/>

                            1.	Candidates who applied under Tatkal basis has to apply on or before 12am of the day. Who applied under Tatkal, the candidate has to visit the Next working day within 24-48 hours for collection of certificates .Certificate issuing timings will be 1pm to 4.30pm. 
                            <br/>
                            2.	If the Candidate is not collecting the certificate  at TSMC office , who applied under Tatkal it shall be Dispatched by Courier /Post after 24 hours from the date of preparation of certificate. 
                            <br/>
                            3.	Candidates who applied under Non Tatkal the certificates will be dispatched to the address mentioned by Courier / Post after 10 working days.  
                            <br/>
                        </p></div>
            </div>
        </>
    )
}

export default ProvisionalViewPrint;