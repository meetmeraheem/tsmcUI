import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import DocDefultPic from '../../../assets/images/doc-default-img.jpg';
import { doctorService } from '../../../lib/api/doctot';
import { DoctorFormType } from '../../../types/doctor';
import { serverUrl, serverImgUrl } from '../../../config/constants';
import moment from 'moment';
import { LocalStorageManager } from '../../../lib/localStorage-manager';
import { goodstandingService } from "../../../lib/api/goodstanding";
import DoctorInfoPrintCard from './../../user-panal/includes/doctor-info-print';

const GoodStandingRegPrintView =   (props:any) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const [goodStanding, setGoodStanding] = useState<any>();
    const [userType, setUserType] = useState('');
    const [isEduCert1, setIsEduCert1] = useState(false);
    const [isEduCert2, setIsEduCert2] = useState(false);
    
    const getDoctorDetails = async () => {
        try {
            const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());
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

    useEffect(() => {
        const userTypeValue = LocalStorageManager.getUserType();
        userTypeValue && setUserType(userTypeValue);
        getDoctorDetails();
        getGSDetails();
    }, [props.state.gsPrimaryId, props.state.doctorPrimaryId]);
    return (
        <>
           <div className="col-9 m-auto mb-4">
                <DoctorInfoPrintCard />
                <table style={{ border: "1px solid rgb(0, 0, 0)", width: "100%" }} className="mt-4">
                    <tr style={{ alignContent: "center", width: "100%", backgroundColor: "#E2F4F5" }}>
                        <td colSpan={2} style={{ textAlign: "left", width: "100%", fontSize: "16px", fontWeight: "bold" }} >Good Standing Registration Information</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Registration No:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>TSMC/FMR/{doctor?.fmr_no}</td>
                      </tr>
                                <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                                     <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Registration Date:</td>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{goodStanding?.reg_date ? moment(goodStanding?.reg_date).format('DD/MM/YYYY') : 'NA'}</td>
                                    </tr>
                                <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                                     <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}> Payment Recieved</td>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{goodStanding?.dd_amount ? goodStanding?.dd_amount : 'NA'}</td>
                                    </tr>
                                <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                                     <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Pyament Receipt No:</td>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{goodStanding?.receipt_no ? goodStanding?.receipt_no : 'NA'}</td>
                                    </tr>
                                <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                                     <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Transaction Id:</td>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{goodStanding?.transanctionId ? goodStanding?.transanctionId : 'NA'}</td>
                                    </tr>
                                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                                     <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>ECFMG id/GMC RefNo/any other :</td>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{goodStanding?.ecfmgRefNo ? goodStanding?.ecfmgRefNo : 'NA'}</td>
                                    </tr>
                                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                                     <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>ECFMG/GMC-UK Email Id :</td>
                                    <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{goodStanding?.ecfmgEmail ? goodStanding?.ecfmgEmail : 'NA'}</td>
                                    </tr>
                    </table>

                    <br/>
                        <div style={{border:"1px solid rgb(0, 0, 0)",marginTop:"350px"}} >
                        
                            <p style={{fontWeight:"bold", alignContent: "center", width: "100%", backgroundColor: "#E2F4F5" }}>
                            General Instructions
                        </p>
                        <p>
                        	1.	Payment successful and Good Standing Certificate applied successfully.
                        <br/>
                        	2.	No need of certificates verification for Good Standing Certificate.  
                        <br/>
                        </p> </div>
                        <br/>
                            <div style={{fontWeight:"bold", alignContent: "center", width: "100%", backgroundColor: "#E2F4F5" }}><p>
                            Note:
                            <br/>
                            1.	Candidates who applied under Tatkal basis has to apply on or before 12am of the day. Who applied under Tatkal, the candidate has to visit on Next working day within 24-48 hours for collection of certificates .Certificate issuing timings will be 4 pm to 5 pm. 
                            <br/>
                            2.	If the Candidate is not collecting the certificate  at TSMC office , who applied under Tatkal it shall be Dispatched by Courier /Post after 24 hours from the date of preparation of certificate. 
                            <br/>
                            3.	Candidates who applied under Non Tatkal the certificates will be dispatched to the address mentioned by Courier / Post after 3 working days.  
                            <br/>
                                4.	And Email also will be sent to licensing authority as per candidate request from through Email of TSMC. 
                        </p></div>
                </div>
            
           
        </>
    )
}

export default GoodStandingRegPrintView;