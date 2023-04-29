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

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { doctor_id, regType } = location.state
    const doctorProfile = useSelector((state: RootState) => state.doctor.profile);
    const getDate = moment().format('YYYY-MM-DD');
    const [doctor, setDoctor] = useState<DoctorProfileType | null>(null);

    //const authString = '0ca4cd6e43204581ac6efeba64ea7d56:16d3605e36ef429bb2c5dcd1e238bff8:M:8463';
    //const authString = '0ca4cd6e43204581ac6efeba64ea7d56:16d3605e36ef429bb2c5dcd1e238bff8:M:11130';
    const authString = '87a2f682241e47638129d323d5e72a5d:43c185a15b904305ac8c68bc646e0b10:M:31921';
    const payg = ({
        key: 'EhYB37',
        salt: 'Dud9MZY05pnwC6rpOZ3qh9gw0Jn0O2lm'
    });

    const initialFormData: PaymentFormType = {
        amount: 1.00,
        fullname: doctor?.fullname || '',
        email: doctor?.emailid || '',
        stdcode: doctor?.stdcode || '+91',
        phone: doctor?.mobileno || '',
    }

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

    const PayAndContinueForm = useCallback(
        async (values: PaymentFormType) => {
            try {
               /* const paymentRequest = {
                    ...payLoad,
                    OrderAmount: values.amount,
                    CustomerData: {
                        FirstName:values.fullname,
                        MobileNo: values.phone,
                        Email: values.email
                    }
                }
                const {success,data} = await commonService.createPaymentURL(paymentRequest);*/

                const paymentRequestJava = {
                        FirstName:values.fullname,
                        OrderAmount: values.amount,
                        MobileNo: values.phone,
                        Email: values.email
                }
                  const {success,data} = await commonService.payviaJavaPayG(paymentRequestJava);
    
                if (success) {
                    LocalStorageManager.setOrderKeyId(data.OrderKeyId.toString());
                    window.open(data.PaymentProcessUrl, '_self', 'noreferrer');
                }
                // const data = await commonService.payviaPayG(paymentRequest, Base64.encode(authString));
                // if (data) {
                //     LocalStorageManager.setOrderKeyId(data.OrderKeyId.toString());
                //     window.open(data.PaymentProcessUrl, '_self', 'noreferrer');
                // }

            } catch (err) {
                console.log('error in payment process during the provisional registrartion.', err);
            }
        },
        []
    );
    const getDoctorProfile = useCallback(async () => {
        try {
            const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());
            if (doctorPrimaryId) {
                const getDoctor = await doctorService.getDoctorById(doctorPrimaryId);
                if (getDoctor.data.length > 0) {
                    setDoctor(getDoctor.data[0]);
                }
            }
        } catch (err: any) {
            console.log('candidateService getProfile error', err.response);
        } finally {
            //setLoading(false);
        }
    }, []);

    useEffect(() => {
        getDoctorProfile();
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
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Final Registration No.</label></div>
                                        {regType === 'provisional' && <div className="col fs-14">TSMC/PMR/234579</div>}
                                        {regType === 'final' && <div className="col fs-14">TSMC/FMR/234579</div>}
                                        
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Doctor ID</label></div>
                                        <div className="col fs-14">{doctor_id}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Full Name</label></div>
                                        <div className="col fs-14">{doctor?.fullname}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Date Of Birth</label></div>
                                        <div className="col fs-14">{moment(doctor?.dateofbirth).format('DD/MM/YYYY')}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Registraion No.</label></div>
                                        <div className="col fs-14">891399060</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Address</label></div>
                                        <div className="col fs-14">{doctor?.address1} {doctor?.address2}</div>
                                    </div>
                                </div>
                                <div className="col-4 d-flex align-items-end ps-2">
                                    <div>
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <label htmlFor="">Registration Request</label>
                                            <div className="fs-14">Non-Tatkal</div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <label htmlFor="">Registration Fee</label>
                                            <div className="fs-14"><i className="bi-currency-rupee"></i> 2,300/-</div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <label htmlFor="">Penalty</label>
                                            <div className="fs-14"><i className="bi-currency-rupee"></i> 500/-</div>
                                        </div>
                                        <hr />
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <label htmlFor="">Total</label>
                                            <div className="fs-14"><i className="bi-currency-rupee"></i> 2,800/-</div>
                                        </div>
                                        <hr className="mb-0" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer text-end py-3">
                            <button type="button" className="btn btn-primary">Continue & Pay</button>
                        </div>
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
                    <div className="card shadow border-0">
                        <Formik
                            onSubmit={PayAndContinueForm}
                            enableReinitialize
                            initialValues={initialFormData}
                        >
                            {(formikProps: FormikProps<PaymentFormType>) => {
                                const { isValid, handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm, errors } = formikProps;

                                return (
                                    <form onSubmit={handleSubmit}>
                                        <div className="card-body">
                                            <div className="w-100">
                                                <h1 className='fs-22 fw-700'>Payment Details</h1>
                                                <hr />
                                            </div>
                                            <div className="px-3">
                                                <div className="row mb-3">
                                                    <label className="col-sm-2 col-form-label">Amount</label>
                                                    <div className="col-sm-4">
                                                        <Field name="amount">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                return (
                                                                    <>
                                                                        <input
                                                                            type="text"
                                                                            value={field.value}
                                                                            onChange={(ev) => {
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(field.name, ev.target.value);
                                                                            }}
                                                                            className={`form-control ${error ? 'is-invalid' : ''
                                                                                }`}
                                                                            placeholder="Amount to be paid"
                                                                            tabIndex={2}
                                                                        />

                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>

                                                    <label className="col-sm-2 col-form-label">Full Name</label>
                                                    <div className="col-sm-4">
                                                        <Field name="fullname">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                return (
                                                                    <>
                                                                        <input
                                                                            type="text"
                                                                            value={field.value}
                                                                            onChange={(ev) => {
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(field.name, ev.target.value);
                                                                            }}
                                                                            className={`form-control ${error ? 'is-invalid' : ''
                                                                                }`}
                                                                            placeholder="Enter full name"
                                                                            tabIndex={1}
                                                                        />

                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>

                                                </div>

                                                <div className="row mb-3">
                                                    <label className="col-sm-2 col-form-label pr-0">Mobile No</label>
                                                    <div className="col-sm-4">
                                                        <div className="input-group input-group-sm mb-3">
                                                            <Field name="stdcode">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <input
                                                                                type="text"
                                                                                name="mobcode"
                                                                                value={field.value}
                                                                                onChange={(ev) => {
                                                                                    setFieldTouched(field.name);
                                                                                    setFieldValue(field.name, ev.target.value);
                                                                                }}
                                                                                className={`input-group-text col-2 ${error ? 'is-invalid' : ''
                                                                                    }`}
                                                                                placeholder="STD Code"
                                                                            />

                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                            <Field name="phone">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <input
                                                                                type="text"
                                                                                name="mobileno"
                                                                                value={field.value}
                                                                                onChange={(ev) => {
                                                                                    setFieldTouched(field.name);
                                                                                    setFieldValue(field.name, ev.target.value);
                                                                                }}
                                                                                className={`form-control col-auto ${error ? 'is-invalid' : ''
                                                                                    }`}
                                                                                placeholder="Enter Mobile No"
                                                                                tabIndex={13}
                                                                                maxLength={10}
                                                                                minLength={10}
                                                                            />

                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>
                                                    </div>

                                                    <label className="col-sm-2 col-form-label">Email ID</label>
                                                    <div className="col-sm-4">
                                                        <Field name="email">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                return (
                                                                    <>
                                                                        <input
                                                                            type="text"
                                                                            name="emailid"
                                                                            value={field.value}
                                                                            onChange={(ev) => {
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(field.name, ev.target.value);
                                                                            }}
                                                                            className={`form-control ${error ? 'is-invalid' : ''
                                                                                }`}
                                                                            placeholder="Enter Email Address"
                                                                            tabIndex={12}
                                                                        />

                                                                        {error && <small className="text-danger">{error.toString()}</small>}
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-footer">
                                                <div className="w-100 text-end">
                                                    <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                                        {isSubmitting && <span className="spinner-border spinner-border-sm" />} Pay & Continue
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                );
                            }}
                        </Formik>
                    </div>
                </div>
            </section>
        </>
    )
};

export default Payment;