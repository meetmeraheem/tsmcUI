
import { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { doctorService } from "../../../lib/api/doctot";
import { LocalStorageManager } from "../../../lib/localStorage-manager";
import { useLocation, useNavigate } from 'react-router-dom';
import { DoctorFormType } from '../../../types/doctor';
import { serverUrl, serverImgUrl } from '../../../config/constants';
import DocDefultPic from '../../../assets/images/doc-default-img.jpg';
import { renewalService } from "../../../lib/api/renewals";
import { AdminrenewalsType } from "../../../types/common";
import DoctorInfoPrintCard from './../../user-panal/includes/doctor-info-print';

const RenewalsViewPrint = (props: any) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [next, setNext] = useState(false);
    const [isEduCert1, setIsEduCert1] = useState(false);
    const [isEduCert2, setIsEduCert2] = useState(false);
    const [isEduCert3, setIsEduCert3] = useState(false);
    const [renewalsData, setRenewalsData] = useState<AdminrenewalsType>();
    const [doctor, setDoctor] = useState<DoctorFormType>();

    const [userType, setUserType] = useState('');
    const [remarks, setRemarks] = useState('');
    const [disablebtn, setDisablebtn] = useState(false);

    const initialFormData = useMemo(
        () => ({
            councilname: '',
            address1: '',
            address2: '',
            country: 0,
            state: 0,
            city: 0,
            councilpincode: '',
            createdon: '',
            posttime: '',
            modifiedon: '',
            status: '',
            added_by: 0,
            approval_status: ''
        }),
        []
    );

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
    const getRenewalDetails = useCallback(async () => {
        try {
            if (props.state.renewalPrimaryId) {
                const { data } = await renewalService.getRenewalById(props.state.renewalPrimaryId);
                if (data.status != null) {

                    setRenewalsData({
                        status: data.status,
                        reg_date: data.createdon,
                        doctor_id: data.doctorId,
                        edu_cert1: data.document1,
                        edu_cert2: data.document2,
                        edu_cert3: data.document3,
                        edu_cert4: data.document4,
                        edu_cert5: data.document5,
                        edu_cert6: data.document6,
                        edu_cert7: data.document7,
                        edu_cert8: data.document8,
                        dd_amount: data.dd_amount,
                        receipt_no: data.receipt_no,
                        transanctionId: data.transanctionId,
                        cmecredit_status:'',
                        cmecredit_value:'',
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
        getRenewalDetails();
    }, [props.state.renewalPrimaryId]);

    return (
        <>
            <div className="col-9 m-auto mb-4">
                <DoctorInfoPrintCard />
                {renewalsData && <table style={{ border: "1px solid rgb(0, 0, 0)", width: "100%" }} className="mt-4">
                    <tr style={{ alignContent: "center", width: "100%", backgroundColor: "#E2F4F5" }}>
                        <td colSpan={2} style={{ textAlign: "left", width: "100%", fontSize: "16px", fontWeight: "bold" }} >Renewal Registration Information</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Registration Date:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{renewalsData?.reg_date ? moment(renewalsData?.reg_date).format('DD/MM/YYYY') : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}> Payment Recieved</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{renewalsData?.dd_amount ? renewalsData?.dd_amount : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}> Payment Receipt No:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}> {renewalsData?.receipt_no ? renewalsData?.receipt_no : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Transaction Id:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>  {renewalsData?.transanctionId ? renewalsData?.transanctionId : 'NA'}</td>
                    </tr>
                </table>
                }


                        <div style={{border:"1px solid rgb(0, 0, 0)",marginTop:"350px"}} >
                        
                            <p style={{fontWeight:"bold", alignContent: "center", width: "100%", backgroundColor: "#E2F4F5" }}>
                            General Instructions
                        </p>
                        <p>
                        1.	Payment successful and Renewal Registration applied successfully.
                        <br/>
                        2.	No need of certificates verification for the  renewal of registration.
                        <br/>
                        3.	Please print and carry this receipt while visiting TSMC office.

                        </p> </div>
                        <br/>
                            <div style={{fontWeight:"bold", alignContent: "center", width: "100%", backgroundColor: "#E2F4F5" }}><p>
                            Note:
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
};

export default RenewalsViewPrint;