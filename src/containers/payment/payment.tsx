import { Field, FieldProps, Formik, FormikProps } from "formik";
import { RootState } from "../../redux";
import getValue from 'lodash/get';
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { commonService } from "../../lib/api/common";
import { PaymentFormType } from "../../types/payment";
import { routes } from "../routes/routes-names";
import UserHeader from "../user-panal/includes/user-header";
import moment from "moment";
import { Base64 } from 'js-base64';
import { SMS } from '../../lib/utils/sms/sms';
import { LocalStorageManager } from "../../lib/localStorage-manager";
import visalogo from "../../assets/images/visa.jpg";
import payglogo from "../../assets/images/payg.jpg";
import sslsecurelogo from "../../assets/images/ssl-secure.jpg";
import mastercardlogo from "../../assets/images/mastercard.jpg";
import rupaylogo from "../../assets/images/rupay.jpg";
import { doctorService } from "../../lib/api/doctot";
import { DoctorProfileType } from "../../types/doctor";
import secureLocalStorage from "react-secure-storage";
import { ProvisionalPaymentProfileType } from "../../types/provisional";
import { FinalPaymentFormType } from "../../types/final";

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { doctor_id, regType } = location.state
    const doctorProfile = useSelector((state: RootState) => state.doctor.profile);
    const getDate = moment().format('YYYY-MM-DD');
    const [doctor, setDoctor] = useState<DoctorProfileType | null>(null);
    const [isNormalReg, setIsNormalReg] = useState(true);
    const [registrationFee, setRegistrationFee] = useState(0);
    const [penalityAmount, setPenalityAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [extraCharges, setExtraCharges] = useState(0);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo, setPhoneNo] = useState('');

    //const authString = '0ca4cd6e43204581ac6efeba64ea7d56:16d3605e36ef429bb2c5dcd1e238bff8:M:8463';
    //const authString = '0ca4cd6e43204581ac6efeba64ea7d56:16d3605e36ef429bb2c5dcd1e238bff8:M:11130';
    const authString = '87a2f682241e47638129d323d5e72a5d:43c185a15b904305ac8c68bc646e0b10:M:31921';
    const payg = ({
        key: 'EhYB37',
        salt: 'Dud9MZY05pnwC6rpOZ3qh9gw0Jn0O2lm'
    });

   
    const uatPayLoad = {
        "OrderKeyId": null,
        "MerchantKeyId": 8463,
        "MID": null,
        "ApiKey": null,
        "UniqueRequestId": SMS.generateOTP(),
        "OrderAmount": 1.0,
        "OrderType": "PAYMENT",
        "OrderId": "1666935309214804",
        "RedirectUrl": "https://regonlinetsmc.in/paymentsuccess/",
        "OrderStatus": null,
        "OrderAmountData": null,
        "ProductData": "{'GameName':'b1149239b72457cdb24814a930de39ba'}",
        "TransactionData": {
            "AcceptedPaymentTypes": "",
            "PaymentType": "",
            "TransactionType": null,
            "SurchargeType": "",
            "SurchargeValue": 0.0,
            "Card": null,
            "Ach": null,
            "Wallet": null,
            "Upi": null,
            "NetBanking": null,
            "Card3DSecure": null,
            "RefTransactionId": "",
            "IndustrySpecicationCode": null,
            "PartialPaymentOption": "",
            "StopDeclinedRetryFlag": false
        },
        "SplitPaymentData": null,
        // "CustomerData": {
        //     "CustomerId": "DP_ID-214804",
        //     "FirstName": "",
        //     "LastName": "",
        //     "MobileNo": "9979891148",
        //     "Email": "jaydeep.parekh@gmail.com",
        // }
    }
    const generateOrderId = SMS.generateNumber();
    const payLoad = {
        "OrderKeyId": null,
        "MerchantKeyId": 31921, //11130,  // 8463 UAT
        "MID": null,
        "ApiKey": null,
        "UniqueRequestId": SMS.generateOTP(),
        "OrderAmount": 1.0,
        "OrderType": "PAYMENT",
        "OrderId": generateOrderId,
        "RedirectUrl": "https://regonlinetsmc.in/paymentsuccess?orderid=" + generateOrderId,
        "OrderStatus": 'Initiating',
        "OrderAmountData": null,
        "ProductData": "{'GameName':'b1149239b72457cdb24814a930de39ba'}",
        "TransactionData": {
            "AcceptedPaymentTypes": "",
            "PaymentType": "",
            "TransactionType": null,
            "SurchargeType": "",
            "SurchargeValue": 0.0,
            "Card": null,
            "Ach": null,
            "Wallet": null,
            "Upi": null,
            "NetBanking": null,
            "Card3DSecure": null,
            "RefTransactionId": "",
            "IndustrySpecicationCode": null,
            "PartialPaymentOption": "",
            "StopDeclinedRetryFlag": false
        },
        "SplitPaymentData": null,
        // "CustomerData": {
        //     "CustomerId": "DP_ID-214804",
        //     "FirstName": "",
        //     "LastName": "",
        //     "MobileNo": "9979891148",
        //     "Email": "jaydeep.parekh@gmail.com",
        // }
    }

   

    const getDoctorProfile = useCallback(async () => {
        try {
            const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());
            if (doctorPrimaryId) {
                const getDoctor = await doctorService.getDoctorById(doctorPrimaryId);
                if (getDoctor.data.length > 0) {
                    setDoctor(getDoctor.data[0]);
                    setFullName(getDoctor.data[0].fullname,);
                    setEmail(getDoctor.data[0].emailid);
                    setPhoneNo(getDoctor.data[0].stdcode +' '+getDoctor.data[0].mobileno);
                }
            }
        } catch (err: any) {
            console.log('candidateService getProfile error', err.response);
        } finally {
            //setLoading(false);
        }
    }, []);

    useEffect(
       
        () => {
            getDoctorProfile();
        if (regType === 'provisional') {
            const provisionalInfo = secureLocalStorage.getItem("provisionalInfo");
            const provisionalPaymentInfo = {
                ...provisionalInfo as ProvisionalPaymentProfileType,
            }

            provisionalPaymentInfo.extra_col1 === 'nor' ? setIsNormalReg(true) : setIsNormalReg(false);
            const currentYear = moment().year();
            const yearDiff = currentYear - Number(provisionalPaymentInfo.exam_year);
            const penality = yearDiff > 1 ? ((yearDiff-1) * 500) : 0;
            setPenalityAmount(penality);
            const regFee = Number(provisionalPaymentInfo.country) === 101 ? 2000 : 5000;
            const totalRegFee = provisionalPaymentInfo.extra_col1 === 'nor' ? regFee : (regFee + 2000);
            setRegistrationFee(totalRegFee);
            const amountValue = totalRegFee + penalityAmount;
            const postalCharge = 100;
            let amountRange = 4000;
            let onlineCharge = 0;
            if (amountValue < amountRange) {
                onlineCharge = 100;
            }
            else {
                onlineCharge = (Math.floor(amountValue / amountValue) + 1) * 100;
            }
            //const charges = amountValue > 4000 ? 200 : 100;
            setExtraCharges(postalCharge + onlineCharge);
            setTotalAmount(amountValue + postalCharge + onlineCharge);
        }
        if (regType === 'final') {
            const finalInfo = secureLocalStorage.getItem("finalInfo");
            const finalPaymentInfo = {
                ...finalInfo as FinalPaymentFormType,
            }
            const currentYear = moment().year();
            const yearDiff = currentYear - Number(finalPaymentInfo.exam_year);
            const penality = yearDiff > 1 ? ((yearDiff-1) * 500) : 0;
            setPenalityAmount(penality);
            const regFee = Number(finalPaymentInfo.country) === 101 ? 4000 : 10000;
            const totalRegFee = finalPaymentInfo.extra_col1 === 'nor' ? regFee : (regFee + 2000);
            setRegistrationFee(totalRegFee);
            const amountValue = totalRegFee + penalityAmount;
            const postalCharge = 100;
            let amountRange = 4000;
            let onlineCharge = 0;
            if (amountValue < amountRange) {
                onlineCharge = 100;
            }
            else {
                onlineCharge = (Math.floor(amountValue / amountValue) + 1) * 100;
            }
            //const charges = amountValue > 4000 ? 200 : 100;
            setExtraCharges(onlineCharge + postalCharge);
            setTotalAmount(amountValue + postalCharge + onlineCharge);
        }
        setTotalAmount(7);
    }, [registrationFee, penalityAmount, totalAmount, extraCharges]);



    const PayAndContinueForm = useCallback(async (amount:any,name:any,mobileno:any,email:any) => {
        try {
            
            const paymentRequest = {
                OrderAmount: amount,
                FirstName: name ,
                MobileNo: mobileno,
                Email: email 
           }
           if(amount!=0){
            const { success, data } = await commonService.payviaJavaPayG(paymentRequest);
           
            if (success) {
                let resp=JSON.parse(data);
                LocalStorageManager.setOrderKeyId(resp.OrderKeyId.toString());
                window.open(resp.PaymentProcessUrl, '_self', 'noreferrer');
            }else{
                alert("Error Msg "+data);
            }
        }
        } catch (err) {
            console.log('error in payment process during the provisional registrartion.', err);
        }
    }, []);
    return (
        <>
            <UserHeader />
            <section className='gray-banner'>
                <div className="col-7 m-auto mt-4">
                    <div className="card mb-3 shadow border-0">
                        <div className="card-header">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h3 className="fs-18 fw-700 mb-0">Payment details</h3>
                                </div>
                                <div></div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="d-flex">
                                <div className="col pe-2 border-end">
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Registration Type</label></div>
                                        {regType === 'provisional' && <div className="col fs-14">Provisional (PMR)</div>}
                                        {regType === 'final' && <div className="col fs-14">Final (FMR)</div>}
                                    </div>
                                    {/* <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Final Registration No.</label></div>
                                        {regType === 'provisional' && <div className="col fs-14">TSMC/PMR/234579</div>}
                                        {regType === 'final' && <div className="col fs-14">TSMC/FMR/234579</div>}
                                        
                                    </div> */}
                                    {regType === 'final' &&
                                        <div className="row mb-3">
                                            <div className="col-4"><label htmlFor="">Doctor ID</label></div>
                                            <div className="col fs-14">{doctor_id}</div>
                                        </div>
                                    }
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Full Name</label></div>
                                        <div className="col fs-14">{doctor?.fullname}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Date Of Birth</label></div>
                                        <div className="col fs-14">{moment(doctor?.dateofbirth).format('DD/MM/YYYY')}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Mobile No</label></div>
                                        <div className="col fs-14">{doctor?.stdcode} {doctor?.mobileno}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Address</label></div>
                                        <div className="col fs-14">{doctor?.address1} {doctor?.address2}</div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-end ps-2">
                                    <div>
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <label htmlFor="">Registration Request</label>
                                            <div className="fs-14">{isNormalReg ? 'Non-Tatkal' : 'Tatkal'}</div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <label htmlFor="">Registration Fee</label>
                                            <div className="fs-14"><i className="bi-currency-rupee"></i> {registrationFee}/-</div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <label htmlFor="">Penalty</label>
                                            <div className="fs-14"><i className="bi-currency-rupee"></i> {penalityAmount}/-</div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <label htmlFor="">Charges</label>
                                            <div className="fs-14"><i className="bi-currency-rupee"></i> {extraCharges}/-</div>
                                        </div>
                                        <hr />
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <label htmlFor="">Total</label>
                                            <div className="fs-14"><i className="bi-currency-rupee"></i> {totalAmount}/-</div>
                                        </div>
                                        <hr className="mb-0" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer text-end py-3">
                            <button type="button" onClick={()=>navigate(-1)} className="btn btn-primary me-3">Back</button>
                            <button type="button" onClick={()=>PayAndContinueForm(totalAmount,doctor?.fullname,doctor?.mobileno,doctor?.emailid)} className="btn btn-primary ps-2">Continue & Pay</button>
                        </div>=
                    </div>
                    <div className="card shadow border-0 mb-3">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div className="fs-13 d-flex">
                                <Link target={'_blank'} className="pe-2" to={'/terms-and-conditions'}>Terms and Conditions</Link>
                                <Link target={'_blank'} className="px-2" to={'/privacy-policy'}>Privacy Policy</Link>
                                <Link target={'_blank'} className="ps-2" to={'/refund'}>Refund</Link>
                            </div>
                            <div>
                                <img src={rupaylogo} alt="" width="55px" className="pe-2" />
                                <img src={visalogo} alt="" width="55px" className="pe-2" />
                                <img src={mastercardlogo} alt="" width="55px" className="pe-2" />
                                <img src={payglogo} alt="" width="55px" className="pe-2" />
                                <img src={sslsecurelogo} alt="" width="55px" className="" />
                            </div>
                        </div>
                    </div>
                    
                </div>
            </section>
        </>
    )
};

export default Payment;