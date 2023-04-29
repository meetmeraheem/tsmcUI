import { Field, FieldProps, Formik, FormikProps } from "formik";
import { RootState } from "../../redux";
import getValue from 'lodash/get';
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { commonService } from "../../lib/api/common";
import { PaymentFormType } from "../../types/payment";
import { routes } from "../routes/routes-names";
import UserHeader from "../user-panal/includes/user-header";
import moment from "moment";
import { Base64 } from 'js-base64';
import { SMS } from '../../lib/utils/sms/sms';
import { LocalStorageManager } from "../../lib/localStorage-manager";


const Payment = () => {
    const navigate = useNavigate();
    const doctorProfile = useSelector((state: RootState) => state.doctor.profile);
    const getDate = moment().format('YYYY-MM-DD');

    //const authString = '0ca4cd6e43204581ac6efeba64ea7d56:16d3605e36ef429bb2c5dcd1e238bff8:M:8463';
    //const authString = '0ca4cd6e43204581ac6efeba64ea7d56:16d3605e36ef429bb2c5dcd1e238bff8:M:11130';
    const authString = '87a2f682241e47638129d323d5e72a5d:43c185a15b904305ac8c68bc646e0b10:M:31921';
    const payg = ({
        key: 'EhYB37',
        salt: 'Dud9MZY05pnwC6rpOZ3qh9gw0Jn0O2lm'
    });

    const initialFormData: PaymentFormType = {
        amount: 1.00,
        fullname: 'Nageswara Rao' || '',
        email: 'nageswararao.g31@gmail.com' || '',
        phone: '8099528126' || '',
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

    const PayAndContinueForm = useCallback(
        async (values: PaymentFormType) => {
            try {
                const paymentRequest = {
                    ...payLoad,
                    OrderAmount: values.amount,
                    CustomerData: {
                        FirstName:values.fullname,
                        MobileNo: values.phone,
                        Email: values.email
                    }
                }
                const data = await commonService.payviaPayG(paymentRequest, Base64.encode(authString));
                if (data) {
                    LocalStorageManager.setOrderKeyId(data.OrderKeyId.toString());
                    window.open(data.PaymentProcessUrl, '_blank', 'noreferrer');
                }

            } catch (err) {
                console.log('error in payment process during the provisional registrartion.', err);
            }
        },
        []
    );

    return (
        <>
            <UserHeader />
            <section className='gray-banner'>
                <div className="container mt-4">
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
                                                                            className={`form-control form-control-sm ${error ? 'is-invalid' : ''
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
                                                        <Field name="FullName">
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
                                                                            className={`form-control form-control-sm ${error ? 'is-invalid' : ''
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
                                                            <Field name="Stdcode">
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
                                                            <Field name="Phone">
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
                                                        <Field name="Email">
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
                                                                            className={`form-control form-control-sm ${error ? 'is-invalid' : ''
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