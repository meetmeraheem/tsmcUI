import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DocDefultPic from '../../assets/images/doc-default-img.jpg';
import { commonService } from '../../lib/api/common';
import { doctorService } from '../../lib/api/doctot';
import { finalService } from '../../lib/api/final';
import { provisionalService } from '../../lib/api/provisional';
import { LocalStorageManager } from '../../lib/localStorage-manager';
import { DoctorFormType } from '../../types/doctor';
import { FinalMyProfileType } from '../../types/final';
import { ProvisionalMyProfileType } from '../../types/provisional';
import { serverUrl, serverImgUrl } from '../../config/constants';
import { additionalService } from '../../lib/api/additional';
import { AddQualDataFormType } from '../../types/additionalQuali';
import { nocService } from "../../lib/api/noc";
import { nocFormType } from "../../types/noc";


const Myprofile = () => {
    //const doctorProfile = useSelector((state: RootState) => state.doctor.profile);
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const [provisional, setProvisional] = useState<ProvisionalMyProfileType>();
    const [final, setFinal] = useState<FinalMyProfileType>();
    const [additional, setadditional] = useState<AddQualDataFormType>();
    const [Nocdata, setNocdata] = useState<nocFormType>();
    const [additionslGridList, setAdditionalGridList] = useState<any>([]);
    const [loading, setLoading] = useState(false)


    const getDoctorDetails = useCallback(async () => {
        try {
            const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());
            if (doctorPrimaryId) {
                const getDoctor = await doctorService.getDoctorMyprofileById(doctorPrimaryId);
                if (getDoctor.data.length > 0) {
                    setDoctor(getDoctor.data[0]);
                }
            }
        } catch (err) {
            console.log('error getDoctorDetails', err);
        }
    }, []);

    const getProvisionalDetails = useCallback(async () => {
        try {
            const doctorSerialId = LocalStorageManager.getDoctorSerialId();
            if (doctorSerialId) {
                const { data } = await provisionalService.getProvisionalByDoctorId(doctorSerialId);
                if (data.length > 0) {
                   // const qualification = await commonService.getQualificationById(Number(data[0].qualification));
                    //const country = await commonService.getCountry(Number(data[0].country));
                    //const state = await commonService.getState(Number(data[0].state));
                    setProvisional({
                        id: data[0].id,
                        doctor_id: data[0].DoctorId,
                        reg_date: data[0].reg_date,
                        receipt_no: data[0].receipt_no,
                        country: data[0].countryName,
                        state: data[0].stateName,
                        qualification: data[0].qualification,
                        exam_month: data[0].exam_month,
                        exam_year: data[0].exam_year,
                        university: data[0].university,
                        approval_status: data[0].approval_status,
                        college: data[0].college,
                        edu_cert1: data[0].edu_cert1,
                        edu_cert2: data[0].edu_cert2,
                        edu_cert3: data[0].edu_cert3,
                    });
                }
            }
        } catch (err) {
            console.log('error getProvisionalDetails', err);
        }
    }, []);
    const getFinalDetails = useCallback(async () => {
        try {
            const doctorSerialId = LocalStorageManager.getDoctorSerialId();
            if (doctorSerialId) {
                const { data } = await finalService.getFinal(doctorSerialId);
                if (data.length > 0) {
                  //  const qualification = await commonService.getQualificationById(Number(data[0].qualification));
                  //  const country = await commonService.getCountry(Number(data[0].country));
                   // const state = await commonService.getState(Number(data[0].state));
                    setFinal({
                        serialno: data[0].serialno,
                        reg_date: data[0].reg_date,
                        country: data[0].countryName,
                        state: data[0].stateName,
                        qualification: data[0].qualification,
                        exam_month: data[0].exam_month,
                        exam_year: data[0].exam_year,
                        university: data[0].university,
                        college: data[0].college,
                        approval_status: data[0].approval_status,
                        createdon: data[0].createdon,
                        posttime: data[0].posttime
                    });
                }
            }
        } catch (err) {
            console.log('error getProvisionalDetails', err);
        }
    }, []);
    const getAdditionalDetails = useCallback(async () => {
        try {
            const doctorSerialId = LocalStorageManager.getDoctorSerialId();
            if (doctorSerialId) {
                const { data } = await additionalService.getAdditionalData(doctorSerialId);
                if (data.length > 0) {
                    //const qualification = await commonService.getQualificationById(Number(data[0].qualification));
                    setAdditionalGridList(data);
                   {/* setadditional({
                        country: country.data[0].name,
                        state: state.data[0].name,
                        qualification: data[0].qualification,
                        exam_month: data[0].exam_month,
                        exam_year: data[0].exam_year,
                        university: data[0].university,
                        college: data[0].college,
                        approval_status: data[0].approval_status,
                        appliedFor:data[0].appliedFor,

                    })*/};
                }
            }
        } catch (err) {
            console.log('error getProvisionalDetails', err);
        }
    }, []);
    const getNocDetails = useCallback(async () => {
        try {
            const doctorSerialId = LocalStorageManager.getDoctorSerialId();
            if (doctorSerialId) {
                const { data } = await nocService.nocDataByDoctorId(doctorSerialId);
                if (data.length > 0) {
                    //const qualification = await commonService.getQualificationById(Number(data[0].qualification));
                    //const country = await commonService.getCountry(Number(data[0].country));
                    //const state = await commonService.getState(Number(data[0].state));
                    setNocdata({
                        country: data[0].countryName,
                        state: data[0].stateName,
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
        //console.log('doctorProfile ' + JSON.stringify(doctorProfile));
        setLoading(true);
        getDoctorDetails();
        getProvisionalDetails();
        getFinalDetails();
        getAdditionalDetails();
        getNocDetails();
        setLoading(false);
    }, []);

    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
                    <div className="row">
                        <div className="col-10 m-auto">
                            <div className="card shadow border-0 mb-4">
                                {!doctor?.serial_id &&
                                    <div className="card-header text-end">
                                        <Link to={'edit-profile'} className='btn btn-primary btn-sm'>Edit Profile</Link>
                                    </div>
                                 } 
                                <div className="card-body">
                                    <div className="tsmc-timeline-box">
                                        <div className="tsmc-timeline mb-5">
                                            <div className="tsmc-text">
                                                <h1 className='fs-18 fw-700'>Doctor Information</h1>
                                                <div className="d-flex">
                                                    <div className="flex-shrink-1 pe-3">
                                                        <div className="tsmc-doc-profile-box border-bottom-0">
                                                            <div className='tsmc-doc-img mb-3'>
                                                                {doctor?.passphoto ? <img src={serverImgUrl + 'files/' + doctor?.passphoto} alt="" /> : <img src={DocDefultPic} alt="" />}
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center border rounded p-1 signature">
                                                                {doctor?.signature ? <img src={serverImgUrl + 'files/' + doctor?.signature} alt="" /> :
                                                                    <>
                                                                        <div><i className="bi-pencil-square fs-22 px-2"></i></div>
                                                                        <div><h2 className="fs-18 fw-700 mb-0 pe-2">Signature</h2></div>
                                                                    </>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
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
                                                                <div className="fs-14">{doctor?.gender == 'm' ? 'MALE' : doctor?.gender == 'f' ? 'FEMALE' : 'OTHERS'}</div>
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
                                        </div>
                                        {provisional &&
                                            <div className="tsmc-timeline mb-5">
                                                <div className="tsmc-text">
                                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                                        <h1 className='fs-18 fw-700 mb-0'>Provisional Registration</h1>
                                                        <div>
                                                            {provisional?.approval_status == 'apr' &&
                                                                <span className='alert alert-success px-2 py-1 fs-12 rounded-pill me-3'>
                                                                    <i className='bi-check-circle'></i> Approved
                                                                </span>
                                                            }
                                                            {provisional?.approval_status == 'pen' &&
                                                                <span className='alert alert-warning px-2 py-1 fs-12 rounded-pill me-3'>
                                                                    <i className='bi-exclamation-circle'></i> Pending
                                                                </span>
                                                            }
                                                            {provisional?.approval_status == 'rej' &&
                                                                <span className='alert alert-danger px-2 py-1 fs-12 rounded-pill me-3'>
                                                                    <i className='bi-exclamation-circle'></i> Rejected
                                                                </span>
                                                            }
                                                            {provisional?.approval_status == 'pen' && <Link to={'edit-provisional'} className='btn btn-primary btn-sm me-3'>Edit</Link>}
                                                        </div>
                                                    </div>
                                                    <div className="w-100">
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Registration No:</label>
                                                                <div className="fs-14">TSMC/PMR/{doctor?.pmr_no}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Registration Date:</label>
                                                                <div className="fs-14">{provisional?.reg_date ? moment(provisional?.reg_date).format('DD/MM/YYYY') : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Qualification:</label>
                                                                <div className="fs-14">{provisional?.qualification ? provisional?.qualification : 'NA'}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Exam Month:</label>
                                                                <div className="fs-14">{provisional?.exam_month ? provisional?.exam_month : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Exam Year:</label>
                                                                <div className="fs-14">{provisional?.exam_year ? provisional?.exam_year : 'NA'}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Country:</label>
                                                                <div className="fs-14">{provisional?.country ? provisional?.country : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>State:</label>
                                                                <div className="fs-14">{provisional?.state ? provisional?.state : 'NA'}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>University:</label>
                                                                <div className="fs-14">{provisional?.university ? provisional?.university : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>College:</label>
                                                                <div className="fs-14">{provisional?.college ? provisional?.college : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {final &&
                                            <><div className="tsmc-timeline mb-5">
                                                <div className="tsmc-text">
                                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                                        <h1 className='fs-18 fw-700 mb-0'>Final Registration</h1>
                                                        <div>
                                                            {final?.approval_status == 'apr' &&
                                                                <span className='alert alert-success px-2 py-1 fs-12 rounded-pill me-3'>
                                                                    <i className='bi-check-circle'></i> Approved
                                                                </span>
                                                            }
                                                            {final?.approval_status == 'pen' &&
                                                                <span className='alert alert-warning px-2 py-1 fs-12 rounded-pill me-3'>
                                                                    <i className='bi-exclamation-circle'></i> Pending
                                                                </span>
                                                            }
                                                            {final?.approval_status == 'rej' &&
                                                                <span className='alert alert-danger px-2 py-1 fs-12 rounded-pill me-3'>
                                                                    <i className='bi-exclamation-circle'></i> Rejected
                                                                </span>
                                                            }
                                                            {final?.approval_status == 'pen' && <Link to={'edit-final'} className='btn btn-primary btn-sm me-3'>Edit</Link>}
                                                        </div>
                                                    </div>
                                                    <div className="w-100">
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Registration No:</label>
                                                                <div className="fs-14">TSMC/FMR/{doctor?.fmr_no}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Registration Date:</label>
                                                                <div className="fs-14">{final?.reg_date ? moment(final?.reg_date).format('DD/MM/YYYY') : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Qualification:</label>
                                                                <div className="fs-14">{final?.qualification ? final?.qualification : 'NA'}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Exam Month:</label>
                                                                <div className="fs-14">{final?.exam_month ? final?.exam_month : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Exam Year:</label>
                                                                <div className="fs-14">{final?.exam_year ? final?.exam_year : 'NA'}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Country:</label>
                                                                <div className="fs-14">{final?.country ? final?.country : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>State:</label>
                                                                <div className="fs-14">{final?.state ? final?.state : 'NA'}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>University Name:</label>
                                                                <div className="fs-14">{final?.university ? final?.university : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>College Name:</label>
                                                                <div className="fs-14">{final?.college ? final?.college : 'NA'}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div></>
                                        }
                                      
                    
                    {additionslGridList.length > 0 &&
                        <>
                        <div className="tsmc-timeline mb-5">
                          <div className="tsmc-text">
                                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                                        <h1 className='fs-18 fw-700 mb-0'>Additional Qualification</h1>
                                                        </div>
                                                        </div>
                                                       
                        <table className="table table-hover fs-10 table-striped">
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
                                        <td>{obj.reg_date}</td>
                                        
                                        <td>
                                            {obj.approval_status === 'apr' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Approved</span>}
                                            {obj.approval_status === 'pen' && <span className="alert alert-warning rounded-pill py-0 px-2 fs-12">Pending</span>}
                                        </td>
                                        {/* <td><Link to={'/admin/provisional_view'} state={{ provisionalPrimaryId: obj.provisionalPrimaryId, doctorPrimaryId: obj.doctorPrimaryId }}>View</Link></td> */}
                                    </tr>);
                                })}
                            </tbody></table>
                            </div>
                            </>
                                         
                                        }
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
                                                            {Nocdata?.status == 'pen' && <Link to={''} className='btn btn-primary btn-sm me-3'>Edit</Link>}
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
                                        {loading && (
                                            <div>
                                          
                                              </div>
                                        )
                                        }
              
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="modal fade" id="ProvisionalEdit" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-bottom-0">
                            <h1 className="modal-title fs-18 fw-700 text-center w-100" id="staticBackdropLabel">Edit Provisional Details</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form action="">
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="" className='mb-2'>Qualification</label>
                                        <select name="" id="" className="form-select">
                                            <option value="">Select</option>
                                            <option value=""></option>
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label htmlFor="" className='mb-2'>Country</label>
                                        <select name="" id="" className="form-select">
                                            <option value="">Select</option>
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="" className='mb-2'>State</label>
                                        <select name="" id="" className="form-select">
                                            <option value="">Select</option>
                                            <option value=""></option>
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label htmlFor="" className='mb-2'>University</label>
                                        <select name="" id="" className="form-select">
                                            <option value="">Select</option>
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="" className='mb-2'>College</label>
                                        <select name="" id="" className="form-select">
                                            <option value="">Select</option>
                                            <option value=""></option>
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label htmlFor="" className='mb-2'>Exam Month</label>
                                        <select name="" id="" className="form-select">
                                            <option value="">Select</option>
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <label htmlFor="" className='mb-2'>Exam Year</label>
                                        <input type="text" className="form-control" placeholder='Enter Exam Year' />
                                    </div>
                                </div>
                                <div className="row mt-4">
                                    <div className="col">
                                        <div className="file-upload-box">
                                            <i className="bi-plus-lg fs-22"></i>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="file-upload-box">
                                            <i className="bi-plus-lg fs-22"></i>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="file-upload-box">
                                            <i className="bi-plus-lg fs-22"></i>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="file-upload-box">
                                            <i className="bi-plus-lg fs-22"></i>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer border-top-0">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Myprofile;