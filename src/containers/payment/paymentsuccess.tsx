import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import moment from "moment";
import { commonService } from "../../lib/api/common";
import { provisionalService } from "../../lib/api/provisional";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import { Serials } from "../../types/common";
import { doctorService } from "../../lib/api/doctot";
import { authService } from "../../lib/api/auth";
import { routes } from "../routes/routes-names";
import Swal from "sweetalert2";
import { ProvisionalFormType, ProvisionalPaymentProfileType } from "../../types/provisional";
import { FinalFormType, FinalPaymentFormType } from "../../types/final";
import { finalService } from "../../lib/api/final";
import { additionalService } from '../../lib/api/additional';
import { nocFormType } from "../../types/noc";
import { AddQualFormType } from '../../types/additionalQuali';
import { nocService } from "../../lib/api/noc";



const PaymentSuccess = () => {
    const search = useLocation().search;
   // const orderId = new URLSearchParams(search).get('orderid');
    const navigate = useNavigate();
    //const location = useLocation();
    // const { orderid } = location.state
    
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [isLoader, setIsLoader] = useState(true);
    const [paymentSerial, setPaymentSerial] = useState(0);
    const [doctorSerialNumber, setDoctorSerialNumber] = useState(0);
    const [pmrSerialNumber, setPMRSerialNumber] = useState(0);
    const [fmrSerialNumber, setFMRSerialNumber] = useState(0);
    const [transactionNumber, setTransactionNumber] = useState('');
    const [respOrderId, setRespOrderId] = useState('');
    const [paymentTransactionRefNo, setPaymentTransactionRefNo] = useState('');
    const [paymentResponseText, setPaymentResponseText] = useState('');
    const [paymentDateTime, setpaymentDateTime] = useState('');
    const [respOrderAmt, setRespOrderAmt] = useState('');


    useEffect(() => {
        (async () => {

            try {
                const orderKeyId = LocalStorageManager.getOrderKeyId();
                console.log('orderKeyId ----: ' + orderKeyId);

                //const data = await commonService.orderDetails(orderKeyId, '31921');

                const { success, data } = await commonService.getJavaOrderDetails(orderKeyId);

                if (success) {
                    let resp = JSON.parse(data);
                    console.log('order details ----: ' + JSON.stringify(resp));
                    if (resp && resp.OrderId && resp.OrderId !== null && resp.OrderId !== "" && resp.PaymentResponseText === "Approved") {
                        setPaymentSuccess(true);
                        setRespOrderId(resp.OrderId);
                        setPaymentTransactionRefNo(resp.PaymentTransactionRefNo);
                        setPaymentResponseText(resp.PaymentResponseText);
                        setpaymentDateTime(resp.PaymentDateTime);
                        setRespOrderAmt(resp.OrderAmount);

                        console.log('Payment OrderId ' + resp.OrderId + ' ------ ' + respOrderId);
                        const regType = secureLocalStorage.getItem("regType");


                        if (regType === 'provisional') {
                            const provisionalInfo = secureLocalStorage.getItem("provisionalInfo");
                            const provisionalPaymentInfo = {
                                ...provisionalInfo as ProvisionalPaymentProfileType,
                                recept_date: moment().format('YYYY-MM-DD'),
                                dd_amount: resp.OrderAmount,
                                receipt_no: resp.OrderId,
                                paymethod: resp.PaymentMethod

                            }
                            respOrderId && setTransactionNumber(respOrderId);
                            const pc = secureLocalStorage.getItem("pc");
                            const af = secureLocalStorage.getItem("af");
                            const noc = secureLocalStorage.getItem("noc");

                            const formData = new FormData();
                            formData.append("provisionalInfo", JSON.stringify(provisionalPaymentInfo));
                            if (pc) {
                                formData.append("pc", pc as File);
                            }
                            if (af) {
                                formData.append("af", af as File);
                            }
                            if (noc) {
                                formData.append("noc", noc as File);
                            }

                            const { success } = await provisionalService.provisionalRegistration(formData);
                            if (success) {
                                const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());
                                secureLocalStorage.removeItem("pc");
                                secureLocalStorage.removeItem("af");
                                secureLocalStorage.removeItem("noc");
                                const doctorMobileno = LocalStorageManager.getDoctorMobileno();
                                if (doctorMobileno) {
                                    await authService.sendSMS(doctorMobileno, 'Your Application Submitted for Provisional Medical Registration to Telangana State Medical Council is under Process.').then((response) => {
                                    }).catch(() => {
                                    });
                                }
                                Swal.fire({
                                    title: "Success",
                                    text: "Provisional Successfully Registered",
                                    icon: "success",
                                    confirmButtonText: "OK",
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        // navigate(routes.userpanal);
                                    }
                                });
                            }
                        }

                        if (regType === 'final') {
                            const finalInfo = secureLocalStorage.getItem("finalInfo");
                            const finalPaymentInfo = {
                                ...finalInfo as FinalPaymentFormType,
                                orderAmount: resp.OrderAmount,
                                orderId: resp.OrderId,
                                paymethod: resp.PaymentMethod
                            }
                            const af = secureLocalStorage.getItem("af");
                            const mbbs = secureLocalStorage.getItem("mbbs");
                            const noc = secureLocalStorage.getItem("noc");
                            const affidavit = secureLocalStorage.getItem("affidavit");
                            const testimonal1 = secureLocalStorage.getItem("mbtestimonal1bs");
                            const testimonal2 = secureLocalStorage.getItem("testimonal2");
                            const regOfOtherState = secureLocalStorage.getItem("regOfOtherState");
                            const screeningTestPass = secureLocalStorage.getItem("screeningTestPass");
                            const internshipComp = secureLocalStorage.getItem("internshipComp");
                            const mciEligibility = secureLocalStorage.getItem("mciEligibility");
                            const interVerification = secureLocalStorage.getItem("interVerification");
                            const mciReg = secureLocalStorage.getItem("mciReg");
                            const imr = secureLocalStorage.getItem("imr");

                            const formData = new FormData();
                            formData.append("finalInfo", JSON.stringify(finalPaymentInfo));

                            if (af) {
                                formData.append("af", af as File);
                            }
                            if (mbbs) {
                                formData.append("mbbs", mbbs as File);
                            }
                            if (noc) {
                                formData.append("noc", noc as File);
                            }
                            if (affidavit) {
                                formData.append("affidivit", affidavit as File);
                            }
                            if (testimonal1) {
                                formData.append("testimonal1", testimonal1 as File);
                            }
                            if (testimonal2) {
                                formData.append("testimonal2", testimonal2 as File);
                            }
                            if (regOfOtherState) {
                                formData.append("regOfOtherState", regOfOtherState as File);
                            }
                            if (screeningTestPass) {
                                formData.append("screeningTestPass", screeningTestPass as File);
                            }
                            if (internshipComp) {
                                formData.append("internshipComp", internshipComp as File);
                            }
                            if (mciEligibility) {
                                formData.append("mciEligibility", mciEligibility as File);
                            }
                            if (interVerification) {
                                formData.append("interVerification", interVerification as File);
                            }
                            if (mciReg) {
                                formData.append("mciReg", mciReg as File);
                            }
                            if (imr) {
                                formData.append("imr", imr as File);
                            }
                            const { success } = await finalService.finalRegistration(formData);
                            if (success) {
                                const doctorId = Number(LocalStorageManager.getDoctorSerialId());
                                setDoctorSerialNumber(doctorId);
                                secureLocalStorage.removeItem("af");
                                secureLocalStorage.removeItem("mbbs");
                                secureLocalStorage.removeItem("noc");
                                secureLocalStorage.removeItem("affidivit");
                                secureLocalStorage.removeItem("testimonal1");
                                secureLocalStorage.removeItem("testimonal2");
                                secureLocalStorage.removeItem("regOfOtherState");
                                secureLocalStorage.removeItem("screeningTestPass");
                                secureLocalStorage.removeItem("internshipComp");
                                secureLocalStorage.removeItem("mciEligibility");
                                secureLocalStorage.removeItem("interVerification");
                                secureLocalStorage.removeItem("mciReg");
                                secureLocalStorage.removeItem("imr");
                                Swal.fire({
                                    title: "Success",
                                    text: "Final registration successfully completed",
                                    icon: "success",
                                    confirmButtonText: "OK",
                                }).then(async (result) => {
                                    if (result.isConfirmed) {
                                        const doctorMobileno = LocalStorageManager.getDoctorMobileno();
                                        if (doctorMobileno) {
                                            await authService.sendSMS(doctorMobileno, 'Your Application Submitted for Final Medical Registration to Telangana State Medical Council is under Process.').then((response) => {
                                            }).catch(() => {
                                            });
                                        }
                                    }
                                });
                            }
                        }
                        if (regType === 'additionalInfo') {
                            const additionalInfo = secureLocalStorage.getItem("additionalInfo");
                            const additionalDataPaymentInfo = {
                                ...additionalInfo as AddQualFormType,
                                orderAmount: resp.OrderAmount,
                                orderId: resp.OrderId,
                                paymethod: resp.PaymentMethod
                            }
                            const additional_study = secureLocalStorage.getItem("additional_study");
                            const additional_Degree = secureLocalStorage.getItem("additional_Degree");
                            const formData = new FormData();
                            formData.append("additionalInfo", JSON.stringify(additionalDataPaymentInfo));
                            if (additional_study) {
                                formData.append("study", additional_study as File);
                            }
                            if (additional_Degree) {
                                formData.append("Degree", additional_Degree as File);
                            }
                            const { success } = await additionalService.additionalRegistration(formData);
                            if (success) {
                                const doctorId = Number(LocalStorageManager.getDoctorSerialId());
                                setDoctorSerialNumber(doctorId);
                                resp.OrderId && setTransactionNumber(resp.OrderId);
                                secureLocalStorage.removeItem("additional_study");
                                secureLocalStorage.removeItem("additional_Degree");
                                Swal.fire({
                                    title: "Success",
                                    text: "Additional registration successfully completed",
                                    icon: "success",
                                    confirmButtonText: "OK",
                                }).then(async (result) => {
                                    if (result.isConfirmed) {
                                        const doctorMobileno = LocalStorageManager.getDoctorMobileno();
                                        if (doctorMobileno) {
                                            await authService.sendSMS(doctorMobileno, 'Your Application Submitted for Additional Medical Registration to Telangana State Medical Council is under Process.').then((response) => {
                                            }).catch(() => {

                                            });
                                        }
                                    }
                                });
                            }
                        }
                        if (regType === 'nocInfo') {
                            const nocInfo = secureLocalStorage.getItem("nocInfo");
                            const nocDataPaymentInfo = {
                                ...nocInfo as nocFormType,
                                orderAmount: resp.OrderAmount,
                                orderId: resp.OrderId,
                                paymethod: resp.PaymentMethod

                            }
                            const formData = new FormData();
                            formData.append("nocInfo", JSON.stringify(nocDataPaymentInfo));
                            const { success } = await nocService.nocRegistration(formData);
                            if (success) {
                                const doctorId = Number(LocalStorageManager.getDoctorSerialId());
                                setDoctorSerialNumber(doctorId);
                                resp.OrderId && setTransactionNumber(resp.OrderId);
                                Swal.fire({
                                    title: "Success",
                                    text: "Noc registration successfully completed",
                                    icon: "success",
                                    confirmButtonText: "OK",
                                }).then(async (result) => {
                                    if (result.isConfirmed) {
                                        const doctorMobileno = LocalStorageManager.getDoctorMobileno();
                                        if (doctorMobileno) {
                                            await authService.sendSMS(doctorMobileno, 'Your Application Submitted for NOC Registration to Telangana State Medical Council is under Process.').then((response) => {
                                            }).catch(() => {
                                            });
                                        }
                                    }
                                });
                            }
                        }
                        setIsLoader(false);
                    }
                    else {
                        setIsLoader(false);
                        setPaymentSuccess(false);
                        setRespOrderId(resp.OrderId);
                        setPaymentTransactionRefNo(resp.PaymentTransactionRefNo);
                        setPaymentResponseText(resp.PaymentResponseText);
                        setpaymentDateTime(resp.PaymentDateTime);
                    }
                } else {
                    alert("Error" + data);
                }
            } catch (error) {
                setIsLoader(false);
                setPaymentSuccess(false);
                console.log('error --------- ' + error);
            }
        })();
    }, [doctorSerialNumber, pmrSerialNumber, fmrSerialNumber, transactionNumber]);

    return (
        <>
            {isLoader ? (<div className="spinner-border text-success" role="status"></div>) :
                <section className='gray-banner'>
                    <div className="container vh-75 d-flex align-items-center justify-content-center">
                        {/* Payment Success message */}
                        {paymentSuccess &&
                            <div className="col-5">
                                <div className="card shadow border-0 p-4">
                                    <div className="card-body">
                                        <div className="w-100 text-center">
                                            <i className="bi-check-circle fs-42 text-success"></i>
                                            <h1 className='fs-22 fw-700'>Payment Success</h1>
                                        </div>
                                        <div className="px-3 text-center">
                                            <p className="mb-3">Your application successfully submitted to <br /> Telangana State Medical Council</p>
                                            <div className="d-flex mb-2">
                                                <div className="col d-flex">
                                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Doctor Id:</label>
                                                    <div className="fs-14">{doctorSerialNumber}</div>
                                                </div>
                                                {pmrSerialNumber && <div className="col d-flex">
                                                    <label htmlFor="" className='fs-14 fw-600 me-2'>PMR No:</label>
                                                    <div className="fs-14">{pmrSerialNumber}</div>
                                                </div>}
                                                {fmrSerialNumber && <div className="col d-flex">
                                                    <label htmlFor="" className='fs-14 fw-600 me-2'>FMR No:</label>
                                                    <div className="fs-14">{fmrSerialNumber}</div>
                                                </div>}
                                                <div className="col d-flex">
                                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Transaction Order Id:</label>
                                                    <div className="fs-14">{transactionNumber}</div>
                                                </div>
                                                <div className="col d-flex">
                                                    <label htmlFor="" className='fs-14 fw-600 me-2'>PaymentTransaction Ref No :</label>
                                                    <div className="fs-14">{paymentTransactionRefNo}</div>
                                                </div>
                                                <div className="col d-flex">
                                                    <label htmlFor="" className='fs-14 fw-600 me-2'>Payment  Date and Time:</label>
                                                    <div className="fs-14">{paymentDateTime}</div>
                                                </div>
                                            </div>
                                            <hr className="my-4" />

                                            <button type="button" onClick={() => { navigate(routes.userpanal); }} className="btn btn-primary">Back to Profile</button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {/* Payment Error message */}
                        {!paymentSuccess &&
                            <div className="col-6">
                                <div className="card shadow border-0 p-4">
                                    <div className="card-body">
                                        <div className="px-4 text-center">
                                            <p className="mb-3">Opps..! <br />Something went wrong</p>
                                        </div>
                                        <div className="w-150 text-center">
                                            <i className="bi-x-circle fs-42 text-danger"></i>
                                            <h1 className='fs-22 fw-700'>Payment Error for Order Id :{transactionNumber}</h1>
                                        </div>
                                        <div className="col d-flex">
                                            <label htmlFor="" className='fs-14 fw-600 me-2'>Transaction Order Id:</label>
                                            <div className="fs-14">{transactionNumber}</div>
                                        </div>
                                        <div className="col d-flex">
                                            <label htmlFor="" className='fs-14 fw-600 me-2'>PaymentTransaction Ref No:</label>
                                            <div className="fs-14">{paymentTransactionRefNo}</div>
                                        </div>
                                        <div className="col d-flex">
                                            <label htmlFor="" className='fs-14 fw-600 me-2'>Payment Date and Time:</label>
                                            <div className="fs-14">{paymentDateTime}</div>
                                        </div>
                                        <div>
                                            <hr className="my-4" />
                                            <div className="w-400 text-center mt-3">
                                                <button type="button" onClick={() => { navigate(routes.userpanal); }} className="btn btn-primary">Back to Profile</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </section>

            }
        </>
    )
};

export default PaymentSuccess;