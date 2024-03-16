import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import DocDefultPic from '../../assets/images/doc-default-img.jpg';
import { commonService } from '../../../lib/api/common';
import { doctorService } from '../../../lib/api/doctot';
import { DoctorFormType } from '../../../types/doctor';
import moment from 'moment';
import { LocalStorageManager } from '../../../lib/localStorage-manager';
import { additionalService } from '../../../lib/api/additional';
import { AdminAddQualDataFormType } from '../../../types/additionalQuali';
import DoctorInfoPrintCard from './../../user-panal/includes/doctor-info-print';

const AdditionalRegViewPrint = (props: any) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const [additionals, setAdditionals] = useState<AdminAddQualDataFormType>();
    const [userType, setUserType] = useState('');
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
                        dd_amount: data[0].dd_amount,
                        reg_date: data[0].reg_date,
                        edu_cert1: data[0].edu_cert1,
                        edu_cert2: data[0].edu_cert2,
                        transanctionId: data[0].transanctionId,
                        calc_date: data[0].calc_date,
                    });
                }
            }
        } catch (err) {
            console.log('error getAdditionalDetails', err);
        }
    }, []);

    useEffect(() => {
        const userTypeValue = LocalStorageManager.getUserType();
        userTypeValue && setUserType(userTypeValue);
        getDoctorDetails();
        getAdditionalDetails();
        
    }, [props.state.additionalPrimaryId, props.state.doctorPrimaryId]);

     
    return (
        
        <>
            <div className="col-9 m-auto mb-4">
                <DoctorInfoPrintCard />
                <table style={{ border: "1px solid rgb(0, 0, 0)", width: "100%" }} className="mt-4">
                    <tr style={{ alignContent: "center", width: "100%", backgroundColor: "#E2F4F5" }}>
                        <td colSpan={2} style={{ textAlign: "left", width: "100%", fontSize: "16px", fontWeight: "bold" }} >Additional Registration Information</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Registration No:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>TSMC/FMR/{doctor?.fmr_no}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Registration Date:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{additionals?.reg_date ? moment(additionals?.reg_date).format('DD/MM/YYYY') : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Qualification:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{additionals?.qualification ? additionals?.qualification : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Exam Month:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{additionals?.exam_month ? additionals?.exam_month : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Exam Year:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{additionals?.exam_year ? additionals?.exam_year : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Country:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{additionals?.country ? additionals?.country : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>State:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{additionals?.state ? additionals?.state : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>University Name:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{additionals?.university ? additionals?.university : 'NA'}</td>
                    </tr>


                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}> Date of Issue of Degree : </td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{additionals?.calc_date ? moment(additionals?.calc_date).format('DD/MM/YYYY') : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>College Name:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{additionals?.college ? additionals?.college : 'NA'}</td>
                    </tr>

                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}> Payment Recieved</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>
                            {additionals?.dd_amount ? additionals?.dd_amount : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Payment Receipt No:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>
                            {additionals?.receipt_no ? additionals?.receipt_no : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Transaction Id:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>
                            {additionals?.transanctionId ? additionals?.transanctionId : 'NA'}</td>
                    </tr>

                </table>
                <br/>
                        <div style={{border:"1px solid rgb(0, 0, 0)",marginTop:"30px"}} >
                        
                            <p style={{fontWeight:"bold", alignContent: "center", width: "100%", backgroundColor: "#E2F4F5" }}>
                            General Instructions
                        </p>
                        <p>
                        1.	Payment successful and  Additional Qualification (PG) Registration applied successfully.
                        <br/>
                        {props.state.reqType==='nor'?
                        <>
                        2.Please visit the TSMC office along with all original documents on
                        <span className='fs-18 fw-700 p-2'>  
                       {(additionals?.reg_date ? (moment(additionals?.reg_date).add(10,'days').format('DD/MM/YYYY')) : 'NA')}</span> 
                        </>:
                        <>
                        2. Please visit the TSMC office along with all original documents on Next working day within 24-48 hours for collection of certificates
                        </>}
                        <br/>
                        3.	The Certificates verification for  Additional Qualifications (PG) Registration is must & after verification only the application will be processed.
                        <br/>
                        4.	Please print and carry this receipt while visiting TSMC office along with all the originals and one set of Xerox copies.

                        </p> </div>
                        <br/>
                            <div style={{fontWeight:"bold", alignContent: "center", width: "100%", backgroundColor: "#E2F4F5" }}><p>
                            Note:
                            <br/>

                            1.	Candidates who applied under Tatkal basis has to apply on or before 12am of the day. Who applied under Tatkal, the candidate has to visit on Next working day within 24-48 hours for collection of certificates .Certificate issuing timings will be 1pm to 4.30pm. 
                            <br/>
                            2.	If the Candidate is not collecting the certificate  at TSMC office , under Tatkal it shall be Dispatched by Courier /Post after 24 hours from the date of preparation of certificate. 
                            <br/>
                            3.	Candidates who applied under Non Tatkal ,the certificates will be dispatched to the address mentioned by Courier / Post after 10 working days.  
                            <br/>
                        </p></div>

            </div>
        </>
    )
}

export default AdditionalRegViewPrint;