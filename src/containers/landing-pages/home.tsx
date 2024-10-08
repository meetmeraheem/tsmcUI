import React, { useCallback, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Field, FieldProps, Formik, FormikProps } from "formik";
import { date as dateYup, object as objectYup, string as stringYup, number as numberYup } from 'yup';
import getValue from 'lodash/get';
import { useDispatch } from 'react-redux';
import DatePicker from 'react-date-picker';
import { routes } from '../routes/routes-names';
import healthminister from '../../assets/images/health-minister.jpg';
import chiefminister from '../../assets/images/chiefminister.jpg';
import DocDefultPic from '../../assets/images/doc-default-img.jpg';
import { DoctorFormType, DoctorSignUpFormType } from '../../types/doctor';
import { doctorService } from '../../lib/api/doctot';
import { getUser, setDoctorInfo } from '../../redux/doctor';
import { LocalStorageManager } from '../../lib/localStorage-manager';
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { authService } from '../../lib/api/auth';
import { tokenManager } from '../../lib/token-manager';
import { Messages } from '../../lib/constants/messages';
import { SMS } from '../../lib/utils/sms/sms';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DoctorFMRSearch from '../user-panal/includes/doctorFMRSearch';

const cryptojs = require("../../assets/js/cryptojs");


const HomePage = () => {
     const navigate = useNavigate();
     const dispatch = useDispatch();
     const [startDate, setStartDate] = useState(new Date());
     const [mobileNumber, setMobileNumber] = useState('');
     const [signupMobNo, setSignupMobNo] = useState('');
     const [password, setPassword] = useState('');
     const [mobileError, setMobileError] = useState(false);
     const [mobileErrorMessage, setMobileErrorMessage] = useState('');
     const [passwordError, setPasswordError] = useState(false);
     const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

     const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
     const [otpSentMessage, setOTPSentMessage] = useState<string>('');
     const [isOTPMessageVisible, setIsOTPMessageVisible] = useState<boolean>(false);
     const [getDoctorInfo, setDoctorInfoValue] = useState<DoctorSignUpFormType | null>(null);
     const otp = SMS.generateOTP();
     const [otpError, setOTPError] = useState<boolean>(false);
     const [otpbuttonStatus, setOTPbuttonStatus] = useState<boolean>(false);
     const [otpErrorMessage, setOTPErrorMessage] = useState<string>('');
     const [enteredOTPNumber, setEnteredOTPNumber] = useState<string>('');
     const [savedOTPNumber, setSavedOTPNumber] = useState<string>('');

     const [forgetPasswordMobileNumber, setForgetPasswordMobileNumber] = useState('');
     const [forgetPasswordMobileNumberError, setForgetPasswordMobileNumberError] = useState(false);
     const [forgetPasswordMobileNumberErrorMessage, setForgetPasswordMobileNumberErrorMessage] = useState('');
     const [isMobileNumberRegistered, setIsMobileNumberRegistered] = useState(false);
     const [isForgetPasswordOtpSent, setIsForgetPasswordOtpSent] = useState<boolean>(false);
     const [enteredForgetPasswordOTPNumber, setEnteredForgetPasswordOTPNumber] = useState<string>('');
     const [savedForgetPasswordOTPNumber, setSavedForgetPasswordOTPNumber] = useState<string>('');
     const [forgetPasswordOTPError, setForgetPasswordOTPError] = useState<boolean>(false);
     const [forgetPasswordOTPErrorMessage, setForgetPasswordOTPErrorMessage] = useState<string>('');
     const [isForgetPasswordOTP, setIsForgetPasswordOTP] = useState<boolean>(true);
     const [isForgetPassword, setIsForgetPassword] = useState<boolean>(false);
     const [forgetPassword, setForgetPassword] = useState('');
     const [confirmPassword, setConfirmPassword] = useState('');
     const [forgetPasswordError, setForgetPasswordError] = useState(false);
     const [forgetPasswordErrorMessage, setForgetPasswordErrorMessage] = useState('');
     const [confirmPasswordError, setConfirmPasswordError] = useState(false);
     const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
     const [show, setShow] = useState(true);
     const [showRenewal, setShowRenewal] = useState(true);
     const [showFMRData, setShowFMRData] = useState(false);

     const initialFormData = {
          fullname: '',
          dateofbirth: '',
          gender: '',
          emailid: '',
          mobileno: '',
          password: ''
     }
     const closeWindow=()=> {
          setShowFMRData(false);
         }
   
     const submitForm = useCallback(
          async (values: DoctorSignUpFormType) => {
               
               // const newObj = Object.fromEntries(
               //      Object.entries(values).map(([k, v]) => [k, v.toUpperCase()])
               //    );
               //    console.log('newObj' + JSON.stringify(newObj));
               
               const encryptpassword = cryptojs.encryptData(values.password);

               const doctorInfo = {
                    ...values,
                    password: encryptpassword,
                    fullname: values.fullname.toUpperCase(),
                    emailid: values.emailid.toUpperCase(),
                    prefix: 'TSMC',
                    createdon: moment().format('YYYY-MM-DD'),
                    posttime: moment().format('h:mm:ss'),
                    dateofbirth: moment(values.dateofbirth).format('YYYY-MM-DD')
               }
               try {
                    const { data,success } = await doctorService.mobileValidation(doctorInfo.mobileno);
                         
                              if (success){

                              if(data.mobileno !== null) {
                                   console.log('mobile registered ' + JSON.stringify(data.length));
                                   
                                   Swal.fire({
                                        text: data.mobileno+' : Mobileno already Registered',
                                        icon: "error",
                                        confirmButtonText: Messages.OKText,
                                   });
                                   return false;
                              }else{
                                   setOTPbuttonStatus(false);
                                   const message = 'signup';
                                   setSignupMobNo(doctorInfo.mobileno);
                                   await authService.sendOTP(doctorInfo.mobileno, message).then((response) => {
                                   if (response.status === 200) {
                                         setDoctorInfoValue(doctorInfo);
                                        setIsOtpSent(true);
                                        setOTPSentMessage(Messages.OTPSuccessSentMessage);
                                        setIsOTPMessageVisible(true);
                                    }
                     }).catch((error) => {
                         setDoctorInfoValue(doctorInfo);
                         setSavedOTPNumber(otp);
                         setOTPSentMessage(Messages.OTPErrorSentMessage);
                         setIsOtpSent(true);
                         setIsOTPMessageVisible(true);
                    });
               }
               }
               } catch (err) {
                    console.log('error doctor signup', err);
               }
          },
          []
     );

     const verifyOTP = useCallback(async () => {
          try {
               if (enteredOTPNumber) {
                    setOTPbuttonStatus(true);
                    setOTPError(false);
                    setOTPErrorMessage('');
                    const message = 'signup';
                    const { data, success } = await authService.verifyOTP(signupMobNo,message,enteredOTPNumber);
                    if(success){
                         const { success } = await doctorService.doctorSignUp(getDoctorInfo);
                         if (success) {
                              Swal.fire({
                                   title: Messages.SuccessText,
                                   text: "Successfully Registered",
                                   icon: "success",
                                   confirmButtonText: Messages.OKText,
                              }).then(async (result) => {
                                   if (result.isConfirmed) {
                                        window.location.reload();
                                   }
                              });
                    }else{
                         setOTPbuttonStatus(false);
                              Swal.fire({
                                   title: Messages.ErrorText,
                                   text: "Unable to registered, please try after sometime.",
                                   icon: "error",
                                   confirmButtonText: Messages.OKText,
                              });
                    }
               }else {
                         setOTPbuttonStatus(false);
                         Swal.fire({
                              text: "OTP Incorrect",
                              icon: "error",
                              confirmButtonText: Messages.OKText,
                         });
                    }
               }
               else {
                    setOTPbuttonStatus(false);
                    setOTPError(true);
                    setOTPErrorMessage('OTP number is required.');
               }

          } catch (error) {
               setOTPbuttonStatus(false);
               Swal.fire({
                    title: Messages.ErrorText,
                    text: "Unable to registered, please try after sometime.",
                    icon: "error",
                    confirmButtonText: Messages.OKText,
               });
          }
     }, [savedOTPNumber, enteredOTPNumber, getDoctorInfo]);

     const signIn = async (e: any) => {
          e.preventDefault();

          try {
               let depwd = '';
               LocalStorageManager.removeDoctorPrimaryId();
               LocalStorageManager.removeDoctorSerialId();
               LocalStorageManager.removeDoctorFMRNo();
               LocalStorageManager.removeDoctorPMRNo();
               LocalStorageManager.removeDoctorMobileno();
               LocalStorageManager.removeDoctorPrimaryId();
               LocalStorageManager.removeDoctorFMRStatus();
               LocalStorageManager.removeRenewalStatus();

               
			LocalStorageManager.setDoctorSerialId('');
               LocalStorageManager.setDoctorFMRNo('');
               LocalStorageManager.setDoctorPMRNo('');
               LocalStorageManager.setDoctorMobileno('');
               LocalStorageManager.setDoctorPrimaryId('');
               LocalStorageManager.setDoctorFMRStatus('');
               LocalStorageManager.setRenewalStatus('');
                     
               
               if (mobileNumber && password) {
                    const encryptpassword = cryptojs.encryptData(password);



                    if (!mobileError && !passwordError) {


                         const { data, token, success } = await authService.signIn({
                              mobileno: mobileNumber,
                              password: encryptpassword,
                         });
                         if (data[0].password !== null) {
                              depwd = cryptojs.decryptData(data[0].password);
                              
                         }
                         if (success && password === depwd) {
                              tokenManager.setToken(token);
                              data[0].id && LocalStorageManager.setDoctorPrimaryId(data[0].id.toString());
                              data[0].mobileno && LocalStorageManager.setDoctorMobileno(data[0].mobileno);
                              data[0].serial_id && LocalStorageManager.setDoctorSerialId(data[0].serial_id.toString());
                              data[0].fmr_no && LocalStorageManager.setDoctorFMRNo(data[0].fmr_no.toString());
                              data[0].pmr_no &&LocalStorageManager.setDoctorPMRNo(data[0].pmr_no.toString());
                              data[0].fmrstatus&&LocalStorageManager.setDoctorFMRStatus(data[0].fmrstatus);
                              data[0].renewalStatus&&LocalStorageManager.setRenewalStatus(data[0].renewalStatus);
                              dispatch(setDoctorInfo(data[0]));
                              setMobileError(false);
                              setMobileErrorMessage('');
                              setPasswordError(false);
                              setPasswordErrorMessage('');
                              navigate(routes.userpanal);
                         }
                         else {
                              Swal.fire({
                                   //title: "Error",
                                   text: "Login failed",
                                   icon: "error",
                                   confirmButtonText: "OK",
                              });
                         }
                    }
                    else {
                         mobileValidation(mobileNumber);
                         passwordValidation(password);
                    }

               }
               else {
                    setMobileError(true);
                    setMobileErrorMessage('Mobile numer required');
                    setPasswordError(true);
                    setPasswordErrorMessage('Password required');
               }
          } catch (error) {
               if (error) {
                    console.log(error);
                    Swal.fire({
                         //title: "Error",
                         text: "Login failed",
                         icon: "error",
                         confirmButtonText: "OK",
                    });
               }
          }
     }

     const mobileValidation = useCallback(async (mobileNo: any) => {
          if (mobileNo) {
               if (mobileNo.length == 10) {
                    setMobileNumber(mobileNo);
                    setMobileError(false);
                    setMobileErrorMessage('');
               }
               else {
                    setMobileError(true);
                    setMobileErrorMessage('Mobileno 10 numbers');
               }
          }
          else {
               setMobileError(true);
               setMobileErrorMessage('Mobile numer required');
          }

     }, [mobileError, mobileErrorMessage, mobileNumber]);

     const passwordValidation = useCallback(async (password: any) => {
          if (password) {
               setPassword(password);
               setPasswordError(false);
               setPasswordErrorMessage('');
          }
          else {
               setPasswordError(true);
               setPasswordErrorMessage('Password required');
          }

     }, [passwordError, passwordErrorMessage, password]);

     const otpVerifyValidation = useCallback(async (value: any) => {
          if (value) {
               //Need to code.
               setEnteredOTPNumber(value);
               setOTPError(false);
               setOTPbuttonStatus(false);
               setOTPErrorMessage('');
          }
          else {
               setOTPError(true);
               setOTPbuttonStatus(false);
               setOTPErrorMessage('OTP number is required.');
          }
     }, []);

     const mobileNumberValidation = useCallback(async (mobileNo: any) => {
          setForgetPasswordMobileNumber(mobileNo);
          if (mobileNo) {
               if (mobileNo.length == 10) {
                    setForgetPasswordMobileNumberError(false);
                    setForgetPasswordMobileNumberErrorMessage('');
               }
               else {
                    setForgetPasswordMobileNumberError(true);
                    setForgetPasswordMobileNumberErrorMessage('Mobileno 10 numbers');
               }
          }
          else {
               setForgetPasswordMobileNumberError(true);
               setForgetPasswordMobileNumberErrorMessage('Mobileno required.');
          }
     }, [forgetPasswordMobileNumber, forgetPasswordMobileNumberError, forgetPasswordMobileNumberErrorMessage]);

     const sendForgetPasswordSMS = useCallback(async () => {
          if (forgetPasswordMobileNumber) {
               if (forgetPasswordMobileNumber.length == 10) {
                    setForgetPasswordMobileNumberError(false);
                    setForgetPasswordMobileNumberErrorMessage('');
                    const { data } = await doctorService.mobileValidation(forgetPasswordMobileNumber);
                     if(data.mobileno !== null) {
                         setIsMobileNumberRegistered(true);
                         const text1 = 'forgot';
                         const message = 'password';
                         //const message = 'Thanks for contacting TSMC. We have received an amount 52 for your 20 - application with receipt No 89. Your OTP is ' + otp;
                         await authService.sendOTP(forgetPasswordMobileNumber, message).then((response) => {
                              if (response.status === 200) {
                                   setSavedForgetPasswordOTPNumber(otp);
                                   setIsForgetPasswordOtpSent(true);
                              }
                         }).catch((error) => {
                              setSavedForgetPasswordOTPNumber(otp);
                              setIsForgetPasswordOtpSent(true);
                         });
                    }
                    else {
                         Swal.fire({
                              text: "Mobileno not registered",
                              icon: "error",
                              confirmButtonText: Messages.OKText,
                         });
                    }
               }
               else {
                    setForgetPasswordMobileNumberError(true);
                    setForgetPasswordMobileNumberErrorMessage('Mobileno 10 numbers');
               }
          }
          else {
               setForgetPasswordMobileNumberError(true);
               setForgetPasswordMobileNumberErrorMessage('Mobileno required.');
          }
     }, [isMobileNumberRegistered, forgetPasswordMobileNumber]);

     const forgetPasswordOTPVerify = useCallback(async () => {
          if (enteredForgetPasswordOTPNumber) {
               const message = 'password';
               const { data, success } = await authService.verifyOTP(forgetPasswordMobileNumber,message,enteredForgetPasswordOTPNumber);
               if(success){
                    //Need to code.
                    setIsForgetPasswordOTP(false);
                    setIsForgetPassword(true);
                    setForgetPasswordOTPError(false);
                    setForgetPasswordOTPErrorMessage('');
               }
               else {
                    Swal.fire({
                         text: "OTP Incorrect",
                         icon: "error",
                         confirmButtonText: Messages.OKText,
                    });
               }
          }
          else {
               setForgetPasswordOTPError(true);
               setForgetPasswordOTPErrorMessage('OTP is required.');
          }
     }, [enteredForgetPasswordOTPNumber, savedForgetPasswordOTPNumber]);

     const changePassword = useCallback(async () => {
          if (forgetPassword && confirmPassword) {
               if (forgetPassword === confirmPassword) {
                    //Need to code.
                    const forgetencryptpassword = cryptojs.encryptData(forgetPassword);

                    const { success } = await doctorService.updatePassword(forgetPasswordMobileNumber, forgetencryptpassword);
                    if (success) {
                         Swal.fire({
                              title: Messages.SuccessText,
                              text: "Successfully Password Updated",
                              icon: "success",
                              confirmButtonText: Messages.OKText,
                         }).then(async (result) => {
                              if (result.isConfirmed) {
                                   resetForgetPassword();
                                   window.location.reload();
                              }
                         });
                    }
                    else {
                         Swal.fire({
                              title: Messages.ErrorText,
                              text: "Unable to update the password, please try after sometime.",
                              icon: "error",
                              confirmButtonText: Messages.OKText,
                         });
                    }
               }
               else {
                    Swal.fire({
                         text: "Password not match",
                         icon: "error",
                         confirmButtonText: Messages.OKText,
                    });
               }
          }
          else {
               if (!forgetPassword) {
                    setForgetPasswordError(true);
                    setForgetPasswordErrorMessage('Password is required.');
               }
               if (!confirmPassword) {
                    setConfirmPasswordError(true);
                    setConfirmPasswordErrorMessage('Confirm Password is required.');
               }
          }
     }, [forgetPassword, confirmPassword, forgetPasswordMobileNumber]);

     const resetForgetPassword = useCallback(async () => {
          
          setIsForgetPasswordOTP(true);
          setIsForgetPassword(false);
          setForgetPasswordMobileNumber('');
          setIsMobileNumberRegistered(false);
          setIsForgetPasswordOtpSent(false);
          setEnteredForgetPasswordOTPNumber('');
          setSavedForgetPasswordOTPNumber('');
          setForgetPasswordOTPError(false);
          setForgetPasswordOTPErrorMessage('');
          setForgetPasswordError(false);
          setForgetPasswordErrorMessage('');
          setConfirmPasswordError(false);
          setConfirmPasswordErrorMessage('');
     }, []);

     return (
          <>
               <section className='plan-banner pt-2'>
                    <div className="text-center py-3 my-3"></div>
                    <div className="container mt-4">
                         <div className="d-flex justify-content-between">
                              <div className='col-2'>
                                   <div className="card shadow-sm rounded border-0 mb-4">
                                        <div className="card-body tsmc-health-pic">
                                             <img src={chiefminister} alt="" />
                                        </div>
                                        <div className="card-footer text-center border-top-0">
                                             <h2 className='fs-14 fw-700 mb-0'>Sri Anumula Revanth Reddy</h2>
                                             <p className='fs-10 fw-600'>Hon'ble Chief Minister</p>
                                        </div>
                                   </div>
                                   <div className="card shadow-sm rounded border-0">
                                        <div className="card-body tsmc-health-pic">
                                             <img src={healthminister} alt="" />
                                        </div>
                                        <div className="card-footer text-center border-top-0">
                                             <h2 className='fs-14 fw-700 mb-0'>Sri Damodar Rajanarasimha</h2>
                                             <p className='fs-10 fw-600'>Health, Medical &amp; Family Welfare, Science and Technology</p>
                                        </div>
                                   </div>
                              </div>
                              <div className='flex-grow-1 px-4'>
                                   <div className='tsmc-main-options'>
                                        <div className="tsmc-option-img"><i className="bi-bell"></i></div>
                                        <div className="tsmc-option-title">
                                             <h2 className='fs-16 fw-500 text-secondary'>
                                             <a href="https://onlinetsmc.in/notifications/"  style={{color: "black"}} target="_blank">Notifications</a></h2>
                                             <p className='fs-12'>Read all TSMC notifications here</p>
                                        </div>
                                   </div>
                                   <div className='tsmc-main-options'>
                                        <div className="tsmc-option-img"><i className="bi-people"></i></div>
                                        <div className="tsmc-option-title">
                                             <h2 className='fs-16 fw-500'>
                                             <a href="https://onlinetsmc.in/executive-members/" style={{color: "black"}} target="_blank">Executive Members</a></h2>
                                             <p className='fs-12'>Read all TSMC notifications here</p>
                                        </div>
                                   </div>
                                   <div className='tsmc-main-options'>
                                        <div className="tsmc-option-img"><i className="bi-briefcase"></i></div>
                                        <div className="tsmc-option-title">
                                             <h2 className='fs-16 fw-500'> 
                                              <a href="https://onlinetsmc.in/officers/" style={{color: "black"}} target="_blank">Officers</a></h2>
                                             <p className='fs-12'>Read all TSMC notifications here</p>
                                        </div>
                                   </div>
                                   <div className='tsmc-main-options'>
                                        <div className="tsmc-option-img"><i className="bi-collection"></i></div>
                                        <div className="tsmc-option-title">
                                             <h2 className='fs-16 fw-500'>
                                             <a href="https://onlinetsmc.in/download/Registration%20Act.pdf" style={{color: "black"}} target="_blank">Registration Act</a></h2>
                                             <p className='fs-12'>Read all TSMC registration act</p>
                                        </div>
                                   </div>
                                   <div className='tsmc-main-options'>
                                        <div className="tsmc-option-img"><i className="bi-calendar-week"></i></div>
                                        <div className="tsmc-option-title">
                                             <h2 className='fs-16 fw-500'>
                                             <a href="https://onlinetsmc.in/academic-calender/" style={{color: "black"}} target="_blank">Academic Calender</a></h2>
                                             <p className='fs-12'>Read all TSMC Academic calender here</p>
                                        </div>
                                   </div>
                              </div>
                              <div className='col-6'>
                                   <div className="card border-0 shadow">
                                        <div className="card-body py-3">
                                             <ul className="nav nav-tabs nav-fill mb-4" id="myTab" role="tablist">
                                                  <li className="nav-item" role="presentation">
                                                       <button className="nav-link active" id="LoginPageTab" data-bs-toggle="tab" data-bs-target="#LoginPage" type="button" role="tab" aria-controls="LoginPage" aria-selected="true">TSMC/APMC Registered Doctor Sign In</button>
                                                  </li>
                                                  <li className="nav-item" role="presentation">
                                                       <button className="nav-link" id="NewRegPageTab" data-bs-toggle="tab" data-bs-target="#NewRegPage" type="button" role="tab" aria-controls="NewRegPage" 
                                                       onClick= {() => {setShowFMRData(true);}}  aria-selected="false">New Doctor Sign Up</button>
                                                  </li>
                                             </ul>
                                             <div className="tab-content" id="myTabContent">
                                                  <div className="tab-pane fade show active" id="LoginPage" role="tabpanel" aria-labelledby="LoginPageTab" tabIndex={0}>
                                                       <div className="w-100 text-center mb-4">
                                                            <h1 className='fs-20 fw-600'>Doctor Sign In</h1>
                                                       </div>
                                                       <form onSubmit={signIn}>
                                                            <div className="col-6 m-auto">
                                                                 <div className="form-floating mb-3">
                                                                      <input type="text" className={`form-control ${mobileError ? 'is-invalid' : ''
                                                                           }`} id="MobileNo" minLength={10} maxLength={10}
                                                                           onChange={(e) => mobileValidation(e.target.value)} placeholder="Enter Mobile No" />
                                                                      <label htmlFor="MobileNo"><i className="bi-phone"></i> Enter Mobile No</label>
                                                                      {mobileError && <small className="text-danger">{mobileErrorMessage}</small>}
                                                                 </div>

                                                                 <div className="form-floating mb-3">
                                                                      <input type="password" className={`form-control ${passwordError ? 'is-invalid' : ''
                                                                           }`} id="Password"
                                                                           onChange={(e) => passwordValidation(e.target.value)} placeholder="Enter Password" />
                                                                      <label htmlFor="Password"><i className="bi-lock"></i> Enter Password</label>
                                                                      {passwordError && <small className="text-danger">{passwordErrorMessage}</small>}
                                                                 </div>
                                                                 <div className="w-100 text-center mb-3">
                                                                      <Link to={"/"} className="fs-14" data-bs-toggle="modal" onClick={() => { setIsForgetPasswordOTP(true); setIsForgetPassword(false) }} data-bs-target="#ForgotPassword">Reset/Forgot password?</Link>
                                                                 </div>
                                                                 <button type='submit' className="btn btn-primary btn-lg w-100 mb-3">Sign In</button>
                                                            </div>
                                                            <p className='fs-12 text-center mb-3'>By clicking Sign In or Sign Up, you agree to the TSMC
                                                                 <p>
                                                                      <Link to={'/terms-and-conditions'}>Terms and Conditions ;</Link>
                                                                      <Link to={'/privacy-policy'}>Privacy Policy ;</Link>
                                                                      <Link to={'/refund'}>Refund.</Link>
                                                                 </p>
                                                            </p>
                                                       </form>
                                                  </div>
                                                  <div className="tab-pane fade" id="NewRegPage" role="tabpanel" aria-labelledby="NewRegPageTab" tabIndex={0}>
                                                       <Formik
                                                            onSubmit={submitForm}
                                                            enableReinitialize
                                                            initialValues={initialFormData}
                                                            validationSchema={getValidationSchema}
                                                       >
                                                            {(formikProps: FormikProps<DoctorSignUpFormType>) => {
                                                                 const { isValid, handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm, errors } = formikProps;

                                                                 return (

                                                                      <>
                                                                           {/* {!isValid && JSON.stringify(errors)} */}
                                                                           <form onSubmit={handleSubmit}>
                                                                                <div className="w-100 text-center mb-4">
                                                                                     <h1 className='fs-20 fw-600'>Doctor Sign Up</h1>
                                                                                </div><div className="row">
                                                                                     <div className="col">
                                                                                          <div className="form-floating mb-3">
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
                                                                                                                   />

                                                                                                                   {error && <small className="text-danger">{error.toString()}</small>}
                                                                                                              </>
                                                                                                         );
                                                                                                    }}
                                                                                               </Field>
                                                                                               <label htmlFor="Fullname">Enter Fullname <span className="fs-10 text-secondary">(As per MBBS certificate)</span></label>
                                                                                          </div>
                                                                                     </div>
                                                                                     <div className="col">
                                                                                          <div className="form-floating mb-3">
                                                                                               <Field name="dateofbirth">
                                                                                                    {(fieldProps: FieldProps) => {
                                                                                                         const { field, form } = fieldProps;
                                                                                                         const error =
                                                                                                              getValue(form.touched, field.name) &&
                                                                                                              getValue(form.errors, field.name);
                                                                                                         return (
                                                                                                              <>
                                                                                                                   <DatePicker
                                                                                                                        format='dd/MM/yyyy'
                                                                                                                        onChange={(date: any) => {
                                                                                                                             setFieldTouched(field.name);
                                                                                                                             setFieldValue(field.name, date);
                                                                                                                             setStartDate(date);
                                                                                                                        }}
                                                                                                                        onFocus={e => e.target.blur()}
                                                                                                                        clearIcon={null}
                                                                                                                        value={startDate}
                                                                                                                        className={`form-control ${error ? 'is-invalid' : ''}`}
                                                                                                                   />
                                                                                                                   {/* <input
                                                                                                                        type="date"
                                                                                                                        value={field.value}
                                                                                                                        onChange={(ev) => {
                                                                                                                             setFieldTouched(field.name);
                                                                                                                             setFieldValue(field.name, ev.target.value);
                                                                                                                        }}
                                                                                                                        className={`form-control ${error ? 'is-invalid' : ''
                                                                                                                             }`}
                                                                                                                        maxLength={10}
                                                                                                                   /> */}

                                                                                                                   {error && <small className="text-danger">{error.toString()}</small>}
                                                                                                              </>
                                                                                                         );
                                                                                                    }}
                                                                                               </Field>
                                                                                               <label htmlFor="Dateofbirth">Enter Date Of Birth<span className="fs-12" >(As per SSC certificate)</span></label>
                                                                                          </div>
                                                                                     </div>
                                                                                </div><div className="row">
                                                                                     <div className="col">
                                                                                          <div className="form-floating mb-3">
                                                                                               <Field name="mobileno">
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
                                                                                                                        maxLength={10}
                                                                                                                        minLength={10}
                                                                                                                        placeholder="Enter mobile number"
                                                                                                                   />

                                                                                                                   {error && <small className="text-danger">{error.toString()}</small>}
                                                                                                              </>
                                                                                                         );
                                                                                                    }}
                                                                                               </Field>
                                                                                               <label htmlFor="MobileNumber">Enter Mobile Number</label>
                                                                                          </div>
                                                                                     </div>
                                                                                     <div className="col">
                                                                                          <div className="form-floating mb-3">

                                                                                               <Field name="gender">
                                                                                                    {(fieldProps: FieldProps) => {
                                                                                                         const { field, form } = fieldProps;
                                                                                                         const error =
                                                                                                              getValue(form.touched, field.name) &&
                                                                                                              getValue(form.errors, field.name);
                                                                                                         return (
                                                                                                              <><select
                                                                                                                   value={field.value}
                                                                                                                   name="gender"
                                                                                                                   onChange={(ev) => {
                                                                                                                        setFieldTouched(field.name);
                                                                                                                        setFieldValue(
                                                                                                                             field.name,
                                                                                                                             ev.target.value
                                                                                                                        );
                                                                                                                   }}
                                                                                                                  
                                                                                                              className={`form-select form-select-sm ${error ? 'is-invalid' : ''
                                                                                                                   }`}
                                                                                                              >
                                                                                                                   <option value="">Select Gender</option>
                                                                                                                   <option value="M">MALE</option>
                                                                                                                   <option value="F">FEMALE</option>
                                                                                                                   <option value="O">OTHERS</option>
                                                                                                              </select>

                                                                                                                   {error && <small className="text-danger">{error.toString()}</small>}
                                                                                                              </>
                                                                                                         );
                                                                                                    }}
                                                                                               </Field>
                                                                                               <label htmlFor="Gender">Gender</label>
                                                                                          </div>
                                                                                     </div>
                                                                                </div><div className="row">
                                                                                     <div className="col">
                                                                                          <div className="form-floating mb-3">
                                                                                               <Field name="emailid">
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
                                                                                                                   />

                                                                                                                   {error && <small className="text-danger">{error.toString()}</small>}
                                                                                                              </>
                                                                                                         );
                                                                                                    }}
                                                                                               </Field>
                                                                                               <label htmlFor="EmailId">Enter Email Address</label>
                                                                                          </div>
                                                                                     </div>
                                                                                     <div className="col">
                                                                                          <div className="form-floating">
                                                                                               <Field name="password">
                                                                                                    {(fieldProps: FieldProps) => {
                                                                                                         const { field, form } = fieldProps;
                                                                                                         const error =
                                                                                                              getValue(form.touched, field.name) &&
                                                                                                              getValue(form.errors, field.name);
                                                                                                         return (
                                                                                                              <>
                                                                                                                   <input
                                                                                                                        type="password"
                                                                                                                        name="password"
                                                                                                                        value={field.value}
                                                                                                                        onChange={(ev) => {
                                                                                                                             setFieldTouched(field.name);
                                                                                                                             setFieldValue(field.name, ev.target.value);
                                                                                                                        }}
                                                                                                                        className={`form-control form-control-sm ${error ? 'is-invalid' : ''
                                                                                                                   }`}
                                                                                                                        placeholder="Enter password"
                                                                                                                   />

                                                                                                                   {error && <small className="text-danger">{error.toString()}</small>}
                                                                                                              </>
                                                                                                         );
                                                                                                    }}
                                                                                               </Field>
                                                                                               <label htmlFor="Password">Enter Password</label>
                                                                                          </div>
                                                                                     </div>
                                                                                </div><p className='fs-12 text-center mb-3'>By clicking Sign In or Sign Up, you agree to the TSMC <a href=".">Terms & Conditions</a>,<br /> <a href=".">Privacy Policy and Refund Policy.</a></p>
                                                                                <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg w-100">
                                                                                     {isSubmitting && <span className="spinner-border spinner-border-sm" />} Sign Up
                                                                                </button>
                                                                                {/* {isOTPMessageVisible && <small className={isOtpSent ? "text-success" : "text-danger"}>{otpSentMessage}</small>} */}
                                                                           </form>
                                                                      </>
                                                                 );
                                                            }}
                                                       </Formik>
                                                       {isOtpSent && <>
                                                            <div className="d-flex w-50 m-auto my-3">
                                                                 <input type="text" className={`form-control text-center me-2 ${otpError ? 'is-invalid' : ''
                                                                      }`} id="otpText1" maxLength={4}
                                                                      onChange={(e) => otpVerifyValidation(e.target.value)} placeholder="" />
                                                                 {/* 
                                                                      <input type="text" className={`form-control text-center me-2 ${otpError ? 'is-invalid' : ''
                                                                           }`} id="otpText2" minLength={1} maxLength={1}
                                                                           onChange={otpVerifyValidation} placeholder="" />

                                                                      <input type="text" className={`form-control text-center me-2 ${otpError ? 'is-invalid' : ''
                                                                           }`} id="otpText3" minLength={1} maxLength={1}
                                                                           onChange={otpVerifyValidation} placeholder="" />

                                                                      <input type="text" className={`form-control text-center me-0 ${otpError ? 'is-invalid' : ''
                                                                           }`} id="otpText4" minLength={1} maxLength={1}
                                                                           onChange={otpVerifyValidation} placeholder="" /> */}

                                                            </div>
                                                            <div className="w-100 text-center mb-3">
                                                                 {otpError && <small className="text-danger">{otpErrorMessage}</small>}
                                                            </div>
                                                            <div className="w-50 m-auto text-center my-3">
                                                                 <button type="submit" disabled={otpbuttonStatus} onClick={verifyOTP} className='btn btn-primary btn-lg'>Verify OTP</button>
                                                            </div>
                                                       </>}
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </section>
               <div className="modal fade" id="ForgotPassword" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                         <div className="modal-content">
                              <div className="modal-header border-bottom-0">
                                   <h1 className="modal-title fs-18 fw-700" id="staticBackdropLabel">Change Password</h1>
                                   <button type="button" className="btn-close" onClick={resetForgetPassword} data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div className="modal-body mb-3">
                                   {isForgetPasswordOTP &&
                                        <div className="col-7 m-auto" >
                                             <div className="form-floating mb-3">
                                                  <input type="text" className={`form-control ${forgetPasswordMobileNumberError ? 'is-invalid' : ''
                                                       }`} id="MobileNo" minLength={10} maxLength={10}
                                                       value={forgetPasswordMobileNumber} onChange={(e) => mobileNumberValidation(e.target.value)} placeholder="Enter Registered Mobile No" />
                                                  <label htmlFor="MobileNo"><i className="bi-phone"></i> Enter Registed Mobile No</label>
                                             </div>
                                             <div className="w-100 text-center mb-3">
                                                  {forgetPasswordMobileNumberError && <small className="text-danger">{forgetPasswordMobileNumberErrorMessage}</small>}
                                             </div>
                                             <button type="submit" onClick={sendForgetPasswordSMS} className='w-100 btn btn-primary'>Send OTP</button>
                                             {isForgetPasswordOtpSent &&
                                                  <>
                                                       <div className="row my-3">
                                                            <div className="col">
                                                                 <input type="text" name="" maxLength={4}
                                                                      onChange={(e) => { setEnteredForgetPasswordOTPNumber(e.target.value) }} id=""
                                                                      className={`form-control text-center me-2 ${forgetPasswordOTPError ? 'is-invalid' : ''
                                                                           }`} />
                                                            </div>
                                                            <div className="w-100 text-center mb-3">
                                                                 {forgetPasswordOTPError && <small className="text-danger">{forgetPasswordOTPErrorMessage}</small>}
                                                            </div>
                                                       </div>
                                                       <button type="submit" onClick={forgetPasswordOTPVerify} className='w-100 btn btn-primary'>Verify OTP</button>
                                                  </>
                                             }
                                        </div>
                                   }
                                   {isForgetPassword &&
                                        <div className="col-7 m-auto" >
                                             <div className="form-floating mb-3">
                                                  <input type="text" className="form-control" onChange={(e) => { setForgetPassword(e.target.value) }} id="MobileNo" placeholder="Enter Registed Mobile No" />
                                                  <label htmlFor="MobileNo"><i className="bi-phone"></i> Password</label>
                                             </div>
                                             <div className="form-floating mb-3">
                                                  <input type="text" className="form-control" onChange={(e) => { setConfirmPassword(e.target.value) }} id="MobileNo" placeholder="Enter Registed Mobile No" />
                                                  <label htmlFor="MobileNo"><i className="bi-phone"></i>Confirm Password</label>
                                             </div>
                                             <button type="submit" onClick={changePassword} className='w-100 btn btn-primary'>Submit</button>
                                        </div>
                                   }
                              </div>
                         </div>
                    </div>
               </div>
               
               
               
      <Modal  size="lg" show={show} onHide={()=>{setShow(false)}} className="w-100 mt-5">
        <Modal.Header className="text-info" >
          <Modal.Title className="w-100 text-center mb-3 ">INSTRUCTIONS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>1. The Services that you have applied before physically at TSMC Office, need not apply again in online application.</div>
         <br/>
          <div>2. Instructions to be followed,<b> “INSTRUCTIONS” </b> link given at the top right of the application screen for smooth registrations.</div>
          <br/>
          <div>3. Read the instructions @<b> “Required Documents”</b> link for documents upload and its size limitations. Get ready with Legible Scanned documents before you start filling up the application.</div>
          <br/>
          <div>4. Any help, please contact TSMC Helpline numbers or eMail, mentioned in TSMC Website.</div>
          <br/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={()=>{setShow(false)}}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal  size="xl" show={showRenewal} onHide={()=>{setShowRenewal(false)}} className="w-100">
        <Modal.Header>
          
          <Modal.Title className="w-100 text-center text-danger">
          <i className="bi bi-exclamation-triangle m-2 h1"> </i>
          <span className="text-info">NOTIFICATION FOR RENEWAL OF REGISTRATION </span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div>
                <p>It is to inform to all the doctors that as per National Medical Commission guidelines it is mandatory to earn 30 CPD (CME) credit hours w.e.f 1st January, 2023 by all the doctors who apply for Renewal of Registration. Telangana State Medical Council has taken the following decisions keeping in view of Covid19 in earning CPD (CME) credit hours for renewal of registration.  </p>
        </div>
          <div>1. Producing of CME Credit Hours is exempted for the one year i.e., from 1st January, 2023 to 31st December, 2023 only for those who apply for Renewal of Registration.</div>
         <br/>
          <div>2. 6 CME Credit Hours to be produced by the doctors who apply for Renewal of Registration w.e.f 1st January, 2024.</div>
          <br/>
          <div>3. 12 CME Credit Hours to be produced by the doctors who apply for Renewal of Registration w.e.f 1st January, 2025.</div>
          <br/>
          <div>4. 18 CME Credit Hours to be produced by the doctors who apply for Renewal of Registration w.e.f 1st January, 2026.</div>
          <br/>
          <div>5. 24 CME Credit Hours to be produced by the doctors who apply for Renewal of Registration w.e.f 1st January, 2027.</div>
          <br/>
          <div>6. 30 CME Credit Hours to be produced by the doctors who apply for Renewal of Registration w.e.f 1st January, 2028.</div>
          <br/>
          <div>
               <p>Hence, Telangana State Medical Council has decided that it is mandatory to produce 30 CME Credit hours w.e.f 1st January, 2028 by all the doctors who apply for Renewal of Registration.</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={()=>{setShowRenewal(false)}}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
              
              
      <Modal  size="xl" show={showFMRData} onHide={()=>{setShowFMRData(true)}} >
        
          <DoctorFMRSearch methodClose={closeWindow} ></DoctorFMRSearch>
        
        <Modal.Footer>
          <Button variant="primary" onClick={()=>closeWindow()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


          </>
     )
}

export default HomePage

const getValidationSchema = () =>
     objectYup().shape({
          fullname: stringYup()
               .required('Full name is required.'),
          dateofbirth: stringYup()
               .required('Dateofbirth is required.'),
          gender: stringYup()
               .required('Gender is required.'),
          emailid: stringYup()
               .email('Enter valid email')
               .required('Emailid is required.'),
          mobileno: stringYup()
               .required('Mobileno is required.')
               .min(10, 'Mobileno 10 numbers'),
          password: stringYup()
               .required('Password is required.')
     });