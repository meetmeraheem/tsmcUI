import { useCallback, useEffect, useMemo, useState } from 'react';
import React, { useRef, Ref } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { commonService } from '../../../lib/api/common';
import { finalService } from '../../../lib/api/final';
import { DoctorFormType } from '../../../types/doctor';
import { AdminFinalProfileType } from '../../../types/final';
import { doctorService } from '../../../lib/api/doctot';
import moment from 'moment';
import { LocalStorageManager } from '../../../lib/localStorage-manager';
import { authService } from '../../../lib/api/auth';
import DoctorInfoPrintCard from './../../user-panal/includes/doctor-info-print';

const FinalRegPrint = (props: any) => {
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
                        dd_amount: data[0].dd_amount,
                        transanctionId: data[0].transanctionId,
                        calc_date: data[0].calc_date,
                        visitDate:data[0].visitDate
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
        getFinalDetails();
    }, [props.state.finalPrimaryId]);
    return (
        <>
            <div className="col-9 m-auto mb-4">
                <DoctorInfoPrintCard />
                <table style={{ border: "1px solid rgb(0, 0, 0)", width: "100%" }} className="mt-4">
                    <tr style={{ alignContent: "center", width: "100%", backgroundColor: "#E2F4F5" }}>
                        <td colSpan={2} style={{ textAlign: "left", width: "100%", fontSize: "16px", fontWeight: "bold" }} >Final Registration Information</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Registration No:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>TSMC/FMR/{doctor?.fmr_no}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Registration Date:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{final?.reg_date ? moment(final?.reg_date).format('DD/MM/YYYY') : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Qualification:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{final?.qualification ? final?.qualification : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>InternShip Comp. Month:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{final?.exam_month ? final?.exam_month : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>InternShip Comp. Year :</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{final?.exam_year ? final?.exam_year : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Country:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{final?.country ? final?.country : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>State:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{final?.state ? final?.state : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>College Name:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{final?.college ? final?.college : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>University Name:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{final?.university ? final?.university : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}> Internship Completion/NOC  Date</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{final?.calc_date ? moment(final?.calc_date).format('DD/MM/YYYY') : 'NA'}</td>
                    </tr>
                    <tr className="fs-14">
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}> Payment Recieved</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{final?.dd_amount ? final?.dd_amount : 'NA'}</td>
                    </tr>
                    <tr className="fs-14">
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Payment Receipt No:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{final?.receipt_no ? final?.receipt_no : 'NA'}</td>
                    </tr>
                    <tr className="fs-14">
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Transaction Id:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{final?.transanctionId ? final?.transanctionId : 'NA'}</td>
                    </tr>
                </table>
                       <br/>
                        <div style={{border:"1px solid rgb(0, 0, 0)",marginTop:"30px"}}>
                        
                            <p style={{fontWeight:"bold", alignContent: "center", width: "100%", backgroundColor: "#E2F4F5" }}>
                            General Instructions
                        </p>
                        <p>
                        1.	Payment successful and Final Medical Registration applied successfully.
                        <br/>
                        {props.state.reqType === 'nor'?
                        <>
                        2.Please visit the TSMC office along with all original documents on 
                            <span className='fs-18 fw-700 p-2'>    
                        {(final?.visitDate ? final?.visitDate : 'NA')}</span>
                        </>:
                        <>
                        2. Please visit the TSMC office along with all original documents on Next working day within 24-48 hours for collection of certificates
                        </>
                        }
                        <br/>
                        3.	The Certificates verification for Final Medical Registration is must & after verification only the application will be processed.
                        <br/>
                        4.	Please print and carry this receipt while visiting TSMC office along with all the  originals and one set of Xerox copies.

                        </p> </div>
                        <br/>
                            <div style={{fontWeight:"bold", alignContent: "center", width: "100%", backgroundColor: "#E2F4F5" }}><p>
                            Note:
                            <br/>

                            1.	Candidates who applied under Tatkal basis has to apply on or before 12am of the day. Who applied under Tatkal, the candidate has to visit on Next working day within 24-48 hours for collection of certificates .Certificate issuing timings will be 1pm to 4.30pm. 
                            <br/>
                            2.	If the Candidate not came to the TSMC office to collect certificate who applied under Tatkal it shall be Dispatched by Courier /Post after 24 hours from the date of preparation of certificate. 
                            <br/>
                            3.	Candidates who applied under Non Tatkal ,the certificates will be dispatched to the address mentioned by Courier / Post after 10 working days.  
                            <br/>
                        </p></div>


            </div>
        </>
    )
}
export default FinalRegPrint;