import { useCallback, useEffect, useState } from "react";
import { commonService } from '../../../lib/api/common';
import { DoctorFormType } from '../../../types/doctor';
import { authService } from '../../../lib/api/auth';
import moment from 'moment';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import './../../../assets/styles/styles.css';
import Swal from "sweetalert2";
import { Messages } from '../../../lib/constants/messages';
import { doctorService } from '../../../lib/api/doctot';
import { SMS } from '../../../lib/utils/sms/sms';
const cryptojs = require("../../../assets/js/cryptojs");
const DoctorFMRSearch = (props:any) => {

    const [fmrNo, setFmrNo] = useState('');
    const [pmrNo, setPmrNo] = useState('');
    
    const [certStatus, setCertStatus] = useState<string>('S');
    const [fmrPmr,setFmrPmr]=useState('S');

    const [mobileNo, setMobileNo] = useState('');
    const [doctorList, setDoctorList] = useState<any>([]);
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const [isLoader, setIsLoader] = useState(false);
    const [view, setView] = useState(false);
    

    const [showDoctorDetails, setShowDoctorDetails] = useState(false);
    const [isMobileNumberRegistered, setIsMobileNumberRegistered] = useState(false);
     const [isForgetPasswordOtpSent, setIsForgetPasswordOtpSent] = useState<boolean>(false);
     const [enteredForgetPasswordOTPNumber, setEnteredForgetPasswordOTPNumber] = useState<string>('');
     const [savedForgetPasswordOTPNumber, setSavedForgetPasswordOTPNumber] = useState<string>('');
    const [forgetPasswordMobileNumber, setForgetPasswordMobileNumber] = useState('');
     const [forgetPasswordMobileNumberError, setForgetPasswordMobileNumberError] = useState(false);
     const [forgetPasswordMobileNumberErrorMessage, setForgetPasswordMobileNumberErrorMessage] = useState('');
     const [forgetPasswordOTPError, setForgetPasswordOTPError] = useState<boolean>(false);
     const [forgetPasswordOTPErrorMessage, setForgetPasswordOTPErrorMessage] = useState<string>('');
     const [isForgetPasswordOTP, setIsForgetPasswordOTP] = useState<boolean>(false);
     const [isForgetPassword, setIsForgetPassword] = useState<boolean>(false);
     const [forgetPassword, setForgetPassword] = useState('');
     const [confirmPassword, setConfirmPassword] = useState('');
     
    useEffect(() => {
        setDoctor(doctor);
    }, [doctor]);


    const getDoctorDetailsByFMR = async () => {

        try {

let alerMsg="";
if (fmrPmr === 'S'){
    alerMsg="Please Select  Registration Type ";
    Swal.fire({
                    
        text:alerMsg,
        icon: "warning",
        confirmButtonText: "OK",
    })
    return false;
}

if (fmrPmr === 'FMR'&& fmrNo.length < 4) {
    alerMsg="Please enter FMR No ";
    Swal.fire({
                    
        text:alerMsg,
        icon: "warning",
        confirmButtonText: "OK",
    })
    return false;
}else if(fmrPmr === 'PMR'&&pmrNo.length < 4){
    alerMsg="Please enter PMR No ";
    Swal.fire({
        text:alerMsg,
        icon: "warning",
        confirmButtonText: "OK",
    })
    return false;
}

if (mobileNo.length < 10){
    alerMsg="Please Enter Valid Mobile No";
    Swal.fire({
                    
        text:alerMsg,
        icon: "warning",
        confirmButtonText: "OK",
    })
    return false;
}

                setDoctorList([]);
                setIsLoader(true);
                const { data } = await authService.getDoctorInfoByFmrPmr(fmrNo,pmrNo,fmrPmr,mobileNo);
                if (data) {
                    setIsLoader(false);
                    setDoctor(data);
                    setView(false);
                } else {
                    setIsLoader(false);
                 //   alert("Doctor information not found  For the entered Details");
                }
              
            

        } catch (err) {
            setIsLoader(false);
            console.log('error getDoctorDetails ', err);
        }
        setIsLoader(false);
    };
    
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
                             setIsForgetPasswordOtpSent(true);
                        }
                   }).catch((error) => {
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
}, [ forgetPasswordMobileNumber]);


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
         
    }
}, [forgetPassword, confirmPassword, forgetPasswordMobileNumber]);

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
    
}, []);

    
    return (
        <>
           <div className="container" style={{ padding: "40px" }}>

          {showDoctorDetails===false&&   <div className="">
               <div  style={{ color: "#1b42af",marginBottom:"30px", paddingLeft:"250px",fontWeight:"bold" }}>  Check your Information with Final/Provisional Registration Number  </div>
                <section className="bg-white">
                                <div className="row ">
                                                            <label className="col mb-2" style={{ color: "red" }}> Do you have final Registration/Provisional in Telangana OR in AP before 2014 (Y/N)   </label>
                                                            <select
                                                                value={certStatus}
                                                                onChange={(ev) => {
                                                                    if(ev.target.value==="N"){
                                                                        props.methodClose();
                                                                    }else{
                                                                    setCertStatus(ev.target.value);
                                                                    }
                                                                }}
                                                                className="col form-select"
                                                                required={true}
                                                            >
                                                                <option value="S">Select</option>
                                                                <option value="Y">Yes</option>
                                                                <option value="N">No</option>
                                                            </select>
                                                            
                                                                </div>

                    {(certStatus === 'Y')?
                            <div className="row">
                                                            <label className="col mb-2" style={{ color: "#1b42af" }}> Registarion Type </label>
                                                            <select
                                                                value={fmrPmr}
                                                                onChange={(ev) => {
                                                                    setFmrPmr(ev.target.value);
                                                                }}
                                                                className="col form-select"
                                                                required={true}
                                                            >
                                                                <option value="S">Select</option>
                                                                <option value="FMR">Final Registration </option>
                                                                <option value="PMR">Provisional Registration</option>
                                                            </select>
                            {fmrPmr==='FMR'?
                                    <div className="row  ">
                                    <label  className='col mb-2' style={{ color: "#1b42af" }}>Final Registration Number:  </label>
                                    <input type="text" className='col fs-14 w-75 form-control' id="fmrNo" onBlur={(e) => setFmrNo(e.target.value)} placeholder='Enter FMR No as per Certificate' />
                                    </div>
                                :
                                    <div className="row ">
                                    <label  className='col' style={{ color: "#1b42af" }}> Provisional Registration Number:</label>
                                    <input type="text" className='col fs-14 w-75 form-control' id="pmrNo" onBlur={(e) => setPmrNo(e.target.value)} placeholder='Enter PMR No as per Certificate' />
                                    </div>
                                }
                                <div className="row  ">
                                <label className='col' style={{ color:"#1b42af" }}>Already Registered Mobile No :   </label>
                                <input type="text" className='col fs-14 w-75 form-control' id="mobileNo" onBlur={(e) => setMobileNo(e.target.value)} placeholder='Enter Mobile No' />
                                <button type="submit"
                                    onClick={
                                        getDoctorDetailsByFMR
                                    } className='btn btn-primary'>Search</button>
                            </div>
                            </div>:""
                                }
                        
                    
                </section>

                {isLoader ? (
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border text-success mt-5" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>) :
                    <>
                        {doctor&& view === false ?
                            <>
                                <table className="table table-hover fs-12 table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Provisional Registration Number</th>
                                            <th>Final Registration Number</th>
                                            <th>Registration Date</th>
                                            <th>Doctor Name</th>
                                            <th>Date of Birth</th>
                                            <th>Qualification</th>
                                            <th>M.B.B.S University </th>
                                            <th>M.B.B.S College</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{ fontSize:"15px" }}>
                                                <td >{doctor.pmr_no}</td>
                                                <td >{doctor.original_fmr_no}</td>
                                                <td>{doctor.regDate}</td>
                                                <td style={{ color: "red"}}>{doctor.fullname}</td>
                                                <td>{moment(doctor.dateofbirth).format('DD/MM/YYYY')}</td>
                                                <td>{doctor.qualification}</td>
                                                <td>{doctor.university}</td>
                                                <td>{doctor.college}</td>
                                            </tr>
                                    </tbody>
                                </table>
                                {doctor.mobileStatus==="Matched"?<span>Given Mobile Number matched  with our records.
                                    Please click here to change password <div className="w-100 text-center mb-3">
                                                                      <Link to={"/"} className="fs-14"  onClick={() => {setShowDoctorDetails(true); setIsForgetPasswordOTP(true); setIsForgetPassword(false);mobileNumberValidation(doctor.mobileno) }} data-bs-target="#ForgotPassword">Reset/Forgot password?</Link>
                                                                 </div> </span>:
                                <div style={{ color: "red",fontSize:"15px" ,paddingLeft:"300px" }}> 
                                Given Mobile Number is <b>Not Registered</b> in our records.<p> Please Contact TGMC  for Change of Mobile Number..
                                    <p>Click <Link to={"https://onlinetsmc.in/contact/"}> here</Link> for contact details  </p>
                                 </p>
                                    </div>
                              }
                            </> : view? <span>Doctor Information not found  for the provided details</span>:""
                            }
                    </>
                  }
         </div>}


                         
                         
                                   {isForgetPasswordOTP &&
                                   
                                        <div className="col-7 m-auto" >
                                             <h1 className="fs-18 fw-700" id="staticBackdropLabel">Change Password</h1>
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
                         
               
   
   
        </>
    )
}
export default DoctorFMRSearch;