import { Field, FieldProps, Formik, FormikProps } from 'formik';
import getValue from 'lodash/get';
import { nocFormType } from "../../types/noc";
import { date as dateYup, object as objectYup, string as stringYup, number as numberYup } from 'yup';
import Select from 'react-select';
import { City, Country, State } from "../../types/common";
import { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { nocService } from "../../lib/api/noc";
import { doctorService } from "../../lib/api/doctot";
import { routes } from '../routes/routes-names';
import Swal from "sweetalert2";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import { commonService } from "../../lib/api/common";
import secureLocalStorage from 'react-secure-storage';
import { useLocation, useNavigate } from 'react-router-dom';
import { DoctorFormType } from '../../types/doctor';
import { serverUrl, serverImgUrl } from '../../config/constants';
import DocDefultPic from '../../assets/images/doc-default-img.jpg';


const RenewalsViews = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [next, setNext] = useState(false);
    const [Nocdata, setNocdata] = useState<nocFormType>();
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const { finalPrimaryId, doctorPrimaryId } = location.state
    const [userType, setUserType] = useState('');

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
            approval_status:''
        }),
        []
    );
  
    

    
    const getDoctorDetails = async () => {
        try {
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
            const doctorSerialId = LocalStorageManager.getDoctorSerialId();
            if (doctorSerialId) {
                const { data } = await nocService.nocDataByDoctorId(doctorSerialId);
                if (data.length > 0) {
                    //const qualification = await commonService.getQualificationById(Number(data[0].qualification));
                    const country = await commonService.getCountry(Number(data[0].country));
                    const state = await commonService.getState(Number(data[0].state));
                    setNocdata({
                        country: country.data[0].name,
                        state: state.data[0].name,
                        councilname: data[0].councilname,
                        councilpincode: data[0].councilpincode,
                        approval_status: data[0].approval_status,
                        address1:data[0].address1,
                        address2:data[0].Address2,
                        createdon: data[0].createdon,
                        posttime: data[0].posttime,
                        modifiedon: data[0].modifiedon,
                        city:data[0].city,
                        status: data[0].status,
                        added_by: data[0].added_by
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
        getNocDetails();
    }, []);
    
    return (
        <>
          <div className="col-8 m-auto mb-4">
                <div className="card">
                    <div className="card-body">
                        <h3 className="fs-18 fw-600">Renewals View</h3>
                        <div className="row mb-3">
                            <div className="col-3">
                                <div className="tsmc-doc-profile-box border-bottom-0">
                                    <div className='tsmc-doc-img mb-3'>
                                        {doctor?.passphoto ? <img src={serverImgUrl + 'files/' + doctor?.passphoto} alt="" /> : <img src={DocDefultPic} alt="" />}
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center border rounded p-1">
                                        {doctor?.signature ? <img src={serverImgUrl + 'files/' + doctor?.signature} alt="" width="100%" /> :
                                            <>
                                                <div><i className="bi-pencil-square fs-22 px-2"></i></div>
                                                <div><h2 className="fs-18 fw-700 mb-0 pe-2">Signature</h2></div>
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                {/* <h2 className='fs-16 fw-600 mb-3'>{doctor?.fullname}</h2> */}
                                <div className="d-flex">
                                    <div className="col">
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-700 me-2'>Full Name:</label>
                                            <div className="col fs-14">{doctor?.fullname}</div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-700 me-2'>Father Name:</label>
                                            <div className="col fs-14">{doctor?.fathername}</div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-700 me-2'>Mother Name:</label>
                                            <div className="col fs-14">{doctor?.mothername}</div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-700 me-2'>Date of Birth:</label>
                                            <div className="col fs-14">{doctor?.dateofbirth}</div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-700 me-2'>Gender:</label>
                                            <div className="col fs-14">{doctor?.gender == 'm' ? 'Male' : doctor?.gender == 'f' ? 'FeMale' : ''}</div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-700 me-2'>Mobile No:</label>
                                            <div className="col fs-14">{doctor?.mobileno}</div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-700 me-2'>EmailId:</label>
                                            <div className="col fs-14">{doctor?.emailid}</div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-700 me-2'>Blood Group:</label>
                                            <div className="col fs-14">{doctor?.bloodgroup}</div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-00 me-2'>Doctor Id:</label>
                                            <div className="col fs-14">{doctor?.serial_id}</div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <label htmlFor="" className='fs-14 fw-00 me-2'>Landline:</label>
                                            <div className="col fs-14">{doctor?.phoneno}</div>
                                        </div>
                                        <div className="d-flex mb-1">
                                            <label htmlFor="" className='fs-14 fw-00 me-2'>Aadhar No:</label>
                                            <div className="col fs-14">{doctor?.aadharcard}</div>
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="" className='fs-14 fw-00 me-2'>Address:</label>
                                            <div className="col fs-14">{doctor?.address1} {doctor?.address2}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
            
                <div className="container mt-4">
                       {Nocdata&&  <div className="tsmc-timeline mb-5">
                       <div className="tsmc-text">
                           <div className="d-flex align-items-center justify-content-between mb-4">
                               <h1 className='fs-18 fw-700 mb-0'>NOC Details</h1>
                               <div>
                               <div>
                                       {Nocdata?.status == 'apr' &&
                                           <span className='alert alert-success px-2 py-1 fs-12 rounded-pill me-3'>
                                               <i className='bi-check-circle'></i> Approved
                                           </span>
                                       }
                                       {Nocdata?.status == 'pen' &&
                                           <span className='alert alert-warning px-2 py-1 fs-12 rounded-pill me-3'>
                                               <i className='bi-exclamation-circle'></i> Pending
                                           </span>
                                       }
                                       {Nocdata?.status == 'rej' &&
                                           <span className='alert alert-danger px-2 py-1 fs-12 rounded-pill me-3'>
                                               <i className='bi-exclamation-circle'></i> Rejected
                                           </span>
                                       }
                                   </div>
                               </div>
                           </div>
                           <div className="w-100">
                          
                                   <div className="d-flex mb-2">
                                       <div className="col d-flex">
                                           <label htmlFor="" className='fs-14 fw-600 me-2'>Council Name:</label>
                                           <div className="fs-14">{Nocdata?.councilname ? Nocdata?.councilname : 'NA'}</div>
                                       </div>
                                       <div className="col d-flex">
                                           <label htmlFor="" className='fs-14 fw-600 me-2'>Council Address1</label>
                                           <div className="fs-14">{Nocdata?.address1 ? Nocdata?.address1 : 'NA'}</div>
                                       </div>
                                   </div>
                                   <div className="d-flex mb-2">
                                       <div className="col d-flex">
                                           <label htmlFor="" className='fs-14 fw-600 me-2'>Council Address2</label>
                                           <div className="fs-14">{Nocdata?.address2 ? Nocdata?.address2 : 'NA'}</div>
                                       </div>
                                       <div className="col d-flex">
                                           <label htmlFor="" className='fs-14 fw-600 me-2'>Country:</label>
                                           <div className="fs-14">{Nocdata?.country ? Nocdata?.country : 'NA'}</div>
                                       </div>
                                   </div>
                                   <div className="d-flex mb-2">
                                       <div className="col d-flex">
                                           <label htmlFor="" className='fs-14 fw-600 me-2'>State:</label>
                                           <div className="fs-14">{Nocdata?.state ? Nocdata?.state : 'NA'}</div>
                                       </div>
                                       <div className="col d-flex">
                                           <label htmlFor="" className='fs-14 fw-600 me-2'>city Name:</label>
                                           <div className="fs-14">{Nocdata?.city ? Nocdata?.city : 'NA'}</div>
                                       </div>
                                   </div>
                                   <div className="d-flex mb-2">
                                       <div className="col d-flex">
                                           <label htmlFor="" className='fs-14 fw-600 me-2'>council pincode :</label>
                                           <div className="fs-14">{Nocdata?.councilpincode ? Nocdata?.councilpincode : 'NA'}</div>
                                       </div>
                                   </div>
                           </div>
                       </div>
                   </div>
                       }
                 
                </div>
           </div>
           </div>
           </div>
           


        </>
    )
};

export default RenewalsViews;