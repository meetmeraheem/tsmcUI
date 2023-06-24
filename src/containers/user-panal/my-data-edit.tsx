import moment from 'moment';
import { useCallback, useEffect, useState,useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FinalMyProfileType } from '../../types/final';
import { ProvisionalMyProfileType } from '../../types/provisional';
import { SMS } from '../../lib/utils/sms/sms';
import { authService } from '../../lib/api/auth';
import { Messages } from '../../lib/constants/messages';
import Swal from "sweetalert2";
import { DoctorFormType, DoctorProfileType } from "../../types/doctor";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import ProfileDataEdit from '../editdata/profile-data-edit';
import ProvisionalDataEdit from '../editdata/provisional-data-edit';
import FinalDataEdit from '../editdata/final-data-edit';

const MyDataEdit= () => {

    const [additionslGridList, setAdditionalGridList] = useState<any>([]);
    const [isDataEditOtpSent, setIsDataEditOtpSent] = useState<boolean>(false);
     const [enteredDataEditOTPNumber, setEnteredDataEditOTPNumber] = useState<string>('');
     const [savedDataEditOTPNumber, setSavedDataEditOTPNumber] = useState<string>('');
     const [dataEditOTPError, setDataEditOTPError] = useState<boolean>(false);
     const [dataEditOTPErrorMessage, setDataEditOTPErrorMessage] = useState<string>('');
     const [isDataEditOTP, setIsDataEditOTP] = useState<boolean>(false);
     const [mobileNumber,setMobileNumber]=useState<any>();

     const otp = SMS.generateOTP();
    const sendDataEditSMS = useCallback(async (mobileNumber:any) => {
        if (mobileNumber) {
                       const message = otp + ' is your OTP to verify Data Edit from Telangana State Medical Council. Please do not share this with anyone. Kindly note this is valid for the next 15 minutes.';
                       await authService.sendOTP(mobileNumber, message).then((response) => {
                            if (response.status === 200) {
                                 setSavedDataEditOTPNumber(otp);
                                 setIsDataEditOtpSent(true);
                            }
                       }).catch((error) => {
                            setSavedDataEditOTPNumber(otp);
                            setIsDataEditOtpSent(true);
                       });
                  }
                  else {
                       Swal.fire({
                            text: "Mobileno not registered",
                            icon: "error",
                            confirmButtonText: Messages.OKText,
                       });
                  }
   }, []);

   const dataEditOTPVerify = useCallback(async () => {
        if (enteredDataEditOTPNumber) {
             if (enteredDataEditOTPNumber === savedDataEditOTPNumber) {
                  //Need to code.
                  setIsDataEditOTP(true);
                  setDataEditOTPError(false);
                  setDataEditOTPErrorMessage('');
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
             setDataEditOTPError(true);
             setDataEditOTPErrorMessage('OTP is required.');
        }
   }, [enteredDataEditOTPNumber, savedDataEditOTPNumber]);
   
   useEffect(() => {
    setMobileNumber(LocalStorageManager.getDoctorMobileno());

}, [mobileNumber]);
    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
                    <div className="row">
                        <div className="col-10 m-auto">
                            <div className="card shadow border-0 mb-4">
                                <div className="card-body">
                                {!isDataEditOTP&&
                                        <div>
                                        <div className="row">
                                        <div className="col-3 m-auto" >
                                                  <label htmlFor="MobileNo"> Registed Mobile No</label>
                                         </div>         
                                        <div className="col-3 m-auto" >         
                                                  <label htmlFor="MobileNo"> {mobileNumber}</label>
                                          </div>        
                                       
                                       
                                          <div className="col-2 m-auto" >  
                                             <button type="submit" onClick={()=>{sendDataEditSMS(mobileNumber);}} className='w-100 btn btn-primary'>Send OTP</button>
                                             </div>        
                                          </div>      
                                             {isDataEditOtpSent &&
                                                  <>
                                                       <div className="row">
                                                       <div className="col-8 m-auto" >
                                                            <label htmlFor="MobileNo"> Enter Recieved OTP</label>
                                                                 <input type="text" name="" maxLength={4}
                                                                      onChange={(e) => { setEnteredDataEditOTPNumber(e.target.value) }} id=""
                                                                      className={`form-control text-center me-2 ${dataEditOTPError ? 'is-invalid' : ''
                                                                           }`} />
                                                            </div>
                                                            <div className="col-2 w-100 text-center mb-3">
                                                                 {dataEditOTPError && <small className="text-danger">{dataEditOTPErrorMessage}</small>}
                                                            </div>
                                                      
                                                            <div className="col-2">
                                                              <button type="submit" onClick={dataEditOTPVerify} className='w-100 btn btn-primary'>Verify OTP</button>
                                                       </div>
                                                       </div>
                                                  </>
                                             }
                                        </div>}
                                    {isDataEditOTP? <div>
                                       <ProfileDataEdit ></ProfileDataEdit>
                                        <ProvisionalDataEdit></ProvisionalDataEdit>
                                        <FinalDataEdit></FinalDataEdit>
                            {additionslGridList.length > 0 &&
                                <>
                      
                          <div className="tsmc-text">
                                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                                        <h1 className='fs-18 fw-700 mb-0'>Additional Qualification</h1>
                                                        </div>
                                                        </div>
                                                       
                        <table className="table table-hover fs-10 table-bordered">
                            <thead>
                                <tr>
                                    <th>Qualification</th>
                                    <th>Exam month</th>
                                    <th>Exam year</th>
                                    <th>Country</th>
                                    <th>State</th>
                                    <th>Applied For</th>
                                    <th>University</th>
                                    <th>college</th>
                                    <th>Registration Date</th>
                                    <th>Approval Status</th>
                                    <th> </th>
                                    <th> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {additionslGridList?.map((obj: any) => {
                                    return (<tr>
                                        <td>{obj.qualification}</td>
                                        <td>{obj.exam_month}</td>
                                        <td>{obj.exam_year}</td>
                                        <td>{obj.countryName}</td>
                                        <td>{obj.stateName}</td>
                                        <td>{obj.appliedFor}</td>
                                        <td>{obj.university}</td>
                                        <td>{obj.college}</td>
                                        <td>{moment(obj.reg_date).format('DD/MM/YYYY')}</td>
                                        
                                        <td>
                                            {obj.approval_status === 'apr' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Approved</span>}
                                            {obj.approval_status === 'pen' && <span className="alert alert-warning rounded-pill py-0 px-2 fs-12">Pending</span>}
                                        </td>
                                        {(obj.approval_status == 'pen' ||obj.approval_status == 'rej')  ?<td> <Link to={'edit_additional-qualification-registration'} state={{ additionalPrimaryId: obj.id}}className='btn btn-primary btn-sm me-3'>Edit</Link></td>:<td></td>}

                                        {obj.approval_status === 'rej'?  <td>{obj.extra_col3}</td>:<td></td>}  

                                    </tr>);
                                })}
                            </tbody></table>
                            
                            </>
                                        }
            
                                     </div>
                               
                                :" "}
                            </div>

                        </div>                
                        </div>
                    </div>
                </div>
            </section>
        </>
    
)};

export default MyDataEdit;