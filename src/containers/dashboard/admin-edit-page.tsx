import { useCallback, useEffect, useMemo, useState } from "react";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import { commonService } from '../../lib/api/common';
import Swal from 'sweetalert2';
import { DoctorFormType } from '../../types/doctor';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from '../routes/routes-names';
import moment from 'moment';
const AdminEditPage = () => {
    const [userType, setUserType] = useState('');
    const [disablebtn, setDisablebtn] = useState(false);
    const [mobileNo, setMobileNo] = useState('');
    const [fmrNo, setFmrNo] = useState('');
    const [doctorId, setDoctorId] = useState(0);
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState<DoctorFormType>();
    useEffect(() => {
        setDoctor(doctor);
    }, [doctor]);

    const getDoctorDetailsByMobile = async () => {
        try {
            
            if (mobileNo.length === 10) {
                const { data } = await commonService.getDoctorInfoByMobile(mobileNo);
                if (data.serial_id) {
                    data.serial_id && setDoctorId(data.serial_id.toString());
                    setDoctor(data);
                }else{
                    alert("Doctor info Not Found  For the entered Mobile No ");    
                }
            } else {
                alert("Please enter Moble No ");
            }

        } catch (err) {
            console.log('error getDoctorDetails ', err);
        }
    };
    const getDoctorDetailsByFMR = async () => {
        try {

            if (fmrNo.length > 4) {
                const { data } = await commonService.getDoctorInfoByFmrNo(fmrNo);
                if (data.serial_id) {
                    data.serial_id && setDoctorId(data.serial_id.toString());
                    setDoctor(data);
                }else{
                    alert("Doctor info not Found  For the entered FMR No ");    
                }
            } else {
                alert("Please enter FMR No ");
            }

        } catch (err) {
            console.log('error getDoctorDetails ', err);
        }
    };

    
    const submit = useCallback(async (type: any) => {

        let msg = "";
        let icntxt = "";
        if (type) {
            setDisablebtn(true);
            if (type === "profile") {
                const { success } = await commonService.enableDoctorProfileEdit(doctorId);
                if (success) {
                    msg = "Doctor Profile Edit Enabled successfully";
                } else {
                    icntxt = "Failed";
                    msg = "Doctor Profile Edit Failed";
                }
            } else if (type === "pmr") {
                const { success } = await commonService.enableDoctorPMREdit(doctorId);
                if (success) {
                    msg = "Doctor PMR Edit Enabled  successfully ";
                } else {
                    icntxt = "Failed";
                    msg = "Doctor PMR Edit Failed";
                }
            }
            else if (type === "fmr") {
                const { success } = await commonService.enableDoctorFMREdit(doctorId);
                if (success) {
                    msg = "Doctor FMR Edit Enabled  successfully";
                } else {
                    icntxt = "Failed";
                    msg = "Doctor FMR Edit Failed";
                }
            }
            else if (type === "aqr") {
                const { success } = await commonService.enableDoctorQualificationEdit(doctorId);
                if (success) {
                    msg = "Doctor Additional Qualification Edit Enabled  successfully";
                } else {
                    icntxt = "Failed";
                    msg = "Doctor Additional Qualification Edit Failed";
                }
            }
            if (msg != "") {
                Swal.fire({
                    title: "Success",
                    text: msg,
                    icon: icntxt === 'Failed' ?"error":"success",
                    confirmButtonText: "OK",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        setDisablebtn(false);
                        if (userType === 'a') {
                            navigate(routes.admin_dashboard);
                        }
                        if (userType === 'u') {
                            navigate(routes.admin_dashboard);
                        }
                    }
                });
            }
            else {
                Swal.fire({
                    title: "",
                    text: "Failed To update",
                    icon: "error",
                    confirmButtonText: "OK",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        if (userType === 'a') {
                            navigate(routes.admin_dashboard);
                        }
                        if (userType === 'u') {
                            navigate(routes.admin_dashboard);
                        }
                    }
                });
            }

        }
        else {
            Swal.fire({
                //title: "Error",
                text: "something went wrong",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    }, [doctorId]);

    return (
        <>
            <div className="card-body">
                <div className="mb-3 row">
                <div className="col">
                    <label htmlFor="" className='mb-2'>Mobile No : </label>
                    <input type="text" className='fs-14' id="mobileNo" onBlur={(e) => setMobileNo(e.target.value)} placeholder='Enter Mobile No' />
                    </div>
                    <div className="col-8">
                        <button type="submit"
                            disabled={disablebtn}
                            onClick={
                                getDoctorDetailsByMobile
                            } className='btn btn-outline-success'>Mobile Search</button>
                    </div>
                   </div> 
                   <div className="mb-3 row"> 
                   <div className="col"> 
                    <label htmlFor="" className='mb-2'>FMR No :   </label>
                    <input type="text" className='fs-14 w-75' id="fmrNo" onBlur={(e) => setFmrNo(e.target.value)} placeholder='Enter FMR No as per Certificate' />
                   </div> 
                    <div className="col-8">
                        <button type="submit"
                            disabled={disablebtn}
                            onClick={
                                getDoctorDetailsByFMR
                            } className='btn btn-outline-success'>FMR Search</button>
                    </div>
                </div>


                {doctor ?
                    <>
                        <div className="tsmc-text">
                            <h1 className='fs-18 fw-700'>Doctor Information</h1>
                            <div className="d-flex">
                                <div className="p-2 w-100">
                                    <div className="d-flex mb-2">
                                        <div className="col d-flex">
                                            <label htmlFor="" className='fs-14 fw-600 me-2'>Full Name:</label>
                                            <div className="fs-14">{doctor?.fullname}</div>
                                        </div>
                                        <div className="col d-flex">
                                            <label htmlFor="" className='fs-14 fw-600 me-2'>Father Name:</label>
                                            <div className="fs-14">{doctor?.fathername}</div>
                                        </div>
                                    </div>
                                    <div className="d-flex mb-2">
                                        <div className="col d-flex">
                                            <label htmlFor="" className='fs-14 fw-600 me-2'>Mother Name:</label>
                                            <div className="fs-14">{doctor?.mothername}</div>
                                        </div>
                                        <div className="col d-flex">
                                            <label htmlFor="" className='fs-14 fw-600 me-2'>Aadhar No:</label>
                                            <div className="fs-14">{doctor?.aadharcard}</div>
                                        </div>
                                    </div>
                                    <div className="d-flex mb-2">
                                        <div className="col d-flex">
                                            <label htmlFor="" className='fs-14 fw-600 me-2'>Date of Birth:</label>
                                            <div className="fs-14">{moment(doctor?.dateofbirth).format('DD/MM/YYYY')}</div>
                                        </div>
                                        <div className="col d-flex">
                                            <label htmlFor="" className='fs-14 fw-600 me-2'>Gender:</label>
                                            <div className="fs-14">{doctor?.gender == 'M' ? 'MALE' : doctor?.gender == 'F' ? 'FEMALE' : 'OTHERS'}</div>
                                        </div>
                                    </div>
                                    <div className="d-flex mb-2">
                                        <div className="col d-flex">
                                            <label htmlFor="" className='fs-14 fw-600 me-2'>Mobile No:</label>
                                            <div className="fs-14">{doctor?.mobileno}</div>
                                        </div>
                                        <div className="col d-flex">
                                            <label htmlFor="" className='fs-14 fw-600 me-2'>Email Address:</label>
                                            <div className="fs-14">{doctor?.emailid}</div>
                                        </div>
                                    </div>
                                    <div className="d-flex mb-2">
                                        <div className="col d-flex">
                                            <label htmlFor="" className='fs-14 fw-600 me-2'>Blood Group:</label>
                                            <div className="fs-14">{doctor?.bloodgroup}</div>
                                        </div>
                                    </div>
                                    <div className="d-flex mb-2">
                                        <div className="col d-flex">
                                            <label htmlFor="" className='fs-14 fw-600 me-2'>Address:</label>
                                            <div className="fs-14">{doctor?.address1} {doctor?.address2}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className='d-flex'>
                            <div className="col">
                                <button type="submit"
                                    disabled={disablebtn}
                                    onClick={() => {
                                        submit('profile');
                                    }} className='btn btn-outline-success'> Enable Personal Details </button>
                            </div>

                            <div className="col">
                                <button type="submit"
                                    disabled={disablebtn}
                                    onClick={() => {
                                        submit('pmr');
                                    }} className='btn btn-outline-success'> Enable PMR Edit</button>
                            </div>

                            <div className="col">
                                <button type="submit"
                                    disabled={disablebtn}
                                    onClick={() => {
                                        submit('fmr');
                                    }} className='btn btn-outline-success'> Enable FMR Edit</button>
                            </div>
                            <div className="col">
                                <button type="submit"
                                    disabled={disablebtn}
                                    onClick={() => {
                                        submit('aqr');
                                    }} className='btn btn-outline-success'>Enable Additional Qualification Edit</button>
                            </div>

                        </div>
                    </>
                    : ""}
            </div>


        </>
    )
}

export default AdminEditPage;