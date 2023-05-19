import { Field, FieldProps, Formik, FormikProps } from "formik";
import { RootState } from "../../redux";
import getValue from 'lodash/get';
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { commonService } from "../../lib/api/common";
import UserHeader from "../user-panal/includes/user-header";
import moment from "moment";
import { SMS } from '../../lib/utils/sms/sms';
import { LocalStorageManager } from "../../lib/localStorage-manager";
import visalogo from "../../assets/images/visa.jpg";
import payglogo from "../../assets/images/payg.jpg";
import sslsecurelogo from "../../assets/images/ssl-secure.jpg";
import mastercardlogo from "../../assets/images/mastercard.jpg";
import rupaylogo from "../../assets/images/rupay.jpg";
import { DoctorProfileType } from "../../types/doctor";
import secureLocalStorage from "react-secure-storage";
import { ProvisionalPaymentProfileType } from "../../types/provisional";
import { FinalPaymentFormType } from "../../types/final";
import { nocFormType } from "../../types/noc";
import { nocService } from "../../lib/api/noc";
import { AddQualFormType } from '../../types/additionalQuali';
import { additionalService } from '../../lib/api/additional';
import { finalService } from "../../lib/api/final";
import { provisionalService } from "../../lib/api/provisional";



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
    const [payUrl, setPayUrl] = useState('');
    const [payOrderId, setPayOrderId] = useState('');

    const getProvisionalRegDetails = useCallback(async () => {
        try {

            const provisionalInfo = secureLocalStorage.getItem("provisionalInfo");
            const provisionalPaymentInfo = {
                ...provisionalInfo as ProvisionalPaymentProfileType,
                recept_date: moment().format('YYYY-MM-DD'),
                dd_amount: "",
                receipt_no: "",
                paymethod: ""

            }
            const formData = new FormData();
            formData.append("provisionalInfo", JSON.stringify(provisionalPaymentInfo));

            const provisionalData = await provisionalService.getProvisionalFeeDetails(formData);
            if (provisionalData.data) {
                setFullName(provisionalData.data.fullName);
                setEmail(provisionalData.data.email);
                setPhoneNo(provisionalData.data.mobileNo);
                setPenalityAmount(provisionalData.data.penalityAmount);
                setRegistrationFee(provisionalData.data.registrationFee);
                setExtraCharges(provisionalData.data.extraCharges);
                setTotalAmount(provisionalData.data.totalAmount);
                setPayUrl(provisionalData.data.redirectUrl);
                setPayOrderId(provisionalData.data.orderKeyId);
            }

        } catch (err: any) {
            console.log('candidateService getProfile error', err.response);
        } finally {
            //setLoading(false);
        }
    }, []);

    const getFinalRegDetails = useCallback(async () => {
        try {

            const finalInfo = secureLocalStorage.getItem("finalInfo");
            const finalPaymentInfo = {
                ...finalInfo as FinalPaymentFormType,
                orderAmount: "",
                orderId: "",
                paymethod: ""
            }
            const formData = new FormData();
            formData.append("finalInfo", JSON.stringify(finalPaymentInfo));

            const finalData = await finalService.getFinalRegFeeDetails(formData);
            if (finalData.data) {
                setFullName(finalData.data.fullName);
                setEmail(finalData.data.email);
                setPhoneNo(finalData.data.mobileNo);
                setPenalityAmount(finalData.data.penalityAmount);
                setRegistrationFee(finalData.data.registrationFee);
                setExtraCharges(finalData.data.extraCharges);
                setTotalAmount(finalData.data.totalAmount);
                setPayUrl(finalData.data.redirectUrl);
                setPayOrderId(finalData.data.orderKeyId);
            }

        } catch (err: any) {
            console.log('candidateService getProfile error', err.response);
        } finally {
            //setLoading(false);
        }
    }, []);
    const getNocRegDetails = useCallback(async () => {
        try {

            const nocInfo = secureLocalStorage.getItem("nocInfo");
            const nocDataPaymentInfo = {
                ...nocInfo as nocFormType,
                orderAmount: "",
                orderId: "",
                paymethod: ""
            }
            const formData = new FormData();
            formData.append("nocInfo", JSON.stringify(nocDataPaymentInfo));

            const nocData = await nocService.getNocRegDetails(formData);
            if (nocData.data) {
                setFullName(nocData.data.fullName);
                setEmail(nocData.data.email);
                setPhoneNo(nocData.data.mobileNo);
                setPenalityAmount(nocData.data.penalityAmount);
                setRegistrationFee(nocData.data.registrationFee);
                setExtraCharges(nocData.data.extraCharges);
                setTotalAmount(nocData.data.totalAmount);
                setPayUrl(nocData.data.redirectUrl);
                setPayOrderId(nocData.data.orderKeyId);
            }

        } catch (err: any) {
            console.log('candidateService getProfile error', err.response);
        } finally {
            //setLoading(false);
        }
    }, []);

    const getAdditionalRegDetails = useCallback(async () => {
        try {

            const additionalInfo = secureLocalStorage.getItem("additionalInfo");
            const additionalDataPaymentInfo = {
                ...additionalInfo as AddQualFormType,
                orderAmount: "",
                orderId: "",
                paymethod: ""
            }
            const formData = new FormData();
            formData.append("additionalInfo", JSON.stringify(additionalDataPaymentInfo));

            const additionalRegData = await additionalService.getAdditionalRegFeeDetails(formData);
            if (additionalRegData.data) {
                setFullName(additionalRegData.data.fullName);
                setEmail(additionalRegData.data.email);
                setPhoneNo(additionalRegData.data.mobileNo);
                setPenalityAmount(additionalRegData.data.penalityAmount);
                setRegistrationFee(additionalRegData.data.registrationFee);
                setExtraCharges(additionalRegData.data.extraCharges);
                setTotalAmount(additionalRegData.data.totalAmount);
                setPayUrl(additionalRegData.data.redirectUrl);
                setPayOrderId(additionalRegData.data.orderKeyId);
            }

        } catch (err: any) {
            console.log('candidateService getProfile error', err.response);
        } finally {
            //setLoading(false);
        }
    }, []);
    useEffect(
        () => {

            if (regType === 'provisional') {
                getProvisionalRegDetails();
            }
            if (regType === 'final') {
                getFinalRegDetails();
            }
            if (regType === 'nocInfo') {
                getNocRegDetails();
            }
            if (regType === 'additionalInfo') {
                getAdditionalRegDetails();
            }
        }, [registrationFee, penalityAmount, totalAmount, extraCharges]);



    const PayAndContinueForm = useCallback(async (payUrl:any,payOrderId:any) => {
        try {
            if (payUrl) {
                LocalStorageManager.setOrderKeyId(payOrderId);
                window.open(payUrl, '_self', 'noreferrer');
            } else {
                alert("Error Msg ");
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
                                        {regType === 'nocInfo' && <div className="col fs-14">NOC</div>}
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
                                        <div className="col fs-14">{fullName}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Date Of Birth</label></div>
                                        <div className="col fs-14">{moment(doctor?.dateofbirth).format('DD/MM/YYYY')}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Mobile No</label></div>
                                        <div className="col fs-14">{phoneNo}</div>
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
                            <button type="button" onClick={() => navigate(-1)} className="btn btn-primary me-3">Back</button>
                            <button type="button" onClick={() => PayAndContinueForm(payUrl,payOrderId)} className="btn btn-primary ps-2">Continue & Pay</button>
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