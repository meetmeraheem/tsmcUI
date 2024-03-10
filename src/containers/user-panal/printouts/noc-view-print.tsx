import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import DocDefultPic from '../../../assets/images/doc-default-img.jpg';
import { commonService } from '../../../lib/api/common';
import { doctorService } from '../../../lib/api/doctot';
import { nocService } from "../../../lib/api/noc";
import { DoctorFormType } from '../../../types/doctor';
import { serverUrl, serverImgUrl } from '../../../config/constants';
import moment from 'moment';
import { LocalStorageManager } from '../../../lib/localStorage-manager';
import { adminNocFormType } from "../../../types/noc";
import DoctorInfoPrintCard from './../../user-panal/includes/doctor-info-print';


const NocRegViewPrint = (props: any) => {
    const location = useLocation();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const [noc, setNoc] = useState<adminNocFormType>();
    const [remarks, setRemarks] = useState('');
    const [userType, setUserType] = useState('');
    const [disablebtn, setDisablebtn] = useState(false);
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

    const getNocDetails = useCallback(async () => {
        try {
            if (props.state.nocPrimaryId) {
                const { data } = await nocService.getNocById(props.state.nocPrimaryId);
                if (data.length > 0) {
                    const country = await commonService.getCountry(Number(data[0].country));
                    const state = await commonService.getState(Number(data[0].state));
                    setNoc({
                        councilname: data[0].councilname,
                        address1: data[0].address1,
                        address2: data[0].address2,
                        country: country.data[0].name,
                        councilpincode: data[0].councilpincode,
                        state: state.data[0].name,
                        city: data[0].cityName,
                        approval_status: data[0].status,
                        receipt_no: data[0].receipt_no,
                        dd_amount: data[0].dd_amount,
                        reg_date: data[0].reg_date,
                        edu_cert1: data[0].edu_cert1,
                        edu_cert2: data[0].edu_cert2,
                        transanctionId: data[0].transanctionId
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

    useEffect(() => {
        const userTypeValue = LocalStorageManager.getUserType();
        userTypeValue && setUserType(userTypeValue);
        getDoctorDetails();
        getNocDetails();
    }, [props.state.nocPrimaryId, props.state.doctorPrimaryId]);
    return (
        <>
            <div className="col-9 m-auto mb-4">
                <DoctorInfoPrintCard />
                <table style={{ border: "1px solid rgb(0, 0, 0)", width: "100%" }} className="mt-4">
                    <tr style={{ alignContent: "center", width: "100%", backgroundColor: "#E2F4F5" }}>
                        <td colSpan={2} style={{ textAlign: "left", width: "100%", fontSize: "16px", fontWeight: "bold" }} >NOC Registration Information</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Registration No:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>TSMC/FMR/{doctor?.fmr_no}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Registration Date:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{noc?.reg_date ? moment(noc?.reg_date).format('DD/MM/YYYY') : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>councilname:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{noc?.councilname ? noc?.councilname : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Council  Address:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{noc?.address1},{noc?.address2}
                        </td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>City Name:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{noc?.city ? noc?.city : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>State:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{noc?.state ? noc?.state : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Country:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{noc?.country ? noc?.country : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}> Payment Recieved</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{noc?.dd_amount ? noc?.dd_amount : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Pyament Receipt No:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{noc?.receipt_no ? noc?.receipt_no : 'NA'}</td>
                    </tr>
                    <tr style={{ border: "1px solid rgb(0, 0, 0)" }}>
                        <td style={{ border: "1px solid rgb(0, 0, 0)", fontWeight: "bold" }}>Transaction Id:</td>
                        <td style={{ border: "1px solid rgb(0, 0, 0)" }}>{noc?.transanctionId ? noc?.transanctionId : 'NA'}</td>
                    </tr>
                </table>
                <br/>
                        <div style={{border:"1px solid rgb(0, 0, 0)",marginTop:"350px"}} >
                        
                            <p style={{fontWeight:"bold", alignContent: "center", width: "100%", backgroundColor: "#E2F4F5" }}>
                            General Instructions
                        </p>
                        <p>
                        1.	Payment successful and NOC  Certificate applied successfully.
                        <br/>
                        2.	No need of certificates verification for NOC.  
                        <br/>
                        3.	After preparation of NOC the hard copy (certificate) will be dispatched to concerned councilname
                        <br/>
                        4.	Email will be sent to concerned Council  & Candidate. 
                        </p> </div>
                        <br/>
                            <div style={{fontWeight:"bold", alignContent: "center", width: "100%", backgroundColor: "#E2F4F5" }}><p>
                            Note:
                           <br/>
                            1.	Candidates who applied under Tatkal basis has to apply on or before 12am of the day . Who applied under Tatkal, the candidate will receive Email on the Next working day. 
                            <br/>
                            2.	Candidates who applied under Non Tatkal he will get the email after 3 working days from the date of submission of NOC .
                            <br/>
                            
                            <br/>
                        </p></div>
            </div>
        </>
    )
}

export default NocRegViewPrint;