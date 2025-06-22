import { useCallback, useEffect, useState } from 'react';
import { useDispatch  } from 'react-redux';
import DocDefultPic from '../../assets/images/doc-default-img.jpg';
import { adminEditService } from '../../lib/api/adminedits';
import { FinalMyProfileType } from '../../types/final';
import { DoctorFormType } from '../../types/doctor';
import { serverImgUrl } from '../.././config/constants';
import moment from 'moment';
import dispatchservice from "../../lib/api/dispatch";
import Swal from "sweetalert2";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import FMRDataEdit from'./FMR-data-edit';

const FMRDoctorInfoCard = (props: any) => {
    const dispatch = useDispatch();
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const [final, setFinal] = useState<FinalMyProfileType>();
    const getDoctorDetails = async () => {
        try {
            const doctorPrimaryId = Number(props.doctorPrimaryId);
            if (doctorPrimaryId) {
                const { data } = await adminEditService.getDoctorDetailsById(doctorPrimaryId);
                if (data) {
                    setDoctor(data.doctorInfo);
                    setFinal({
                        id:data.FinalInfo[0].id,
                        serialno: data.FinalInfo[0].serialno,
                        reg_date: data.FinalInfo[0].reg_date,
                        country: data.FinalInfo[0].countryName,
                        state: data.FinalInfo[0].stateName,
                        qualification: data.FinalInfo[0].qualificationName,
                        exam_month: data.FinalInfo[0].exam_month,
                        exam_year: data.FinalInfo[0].exam_year,
                        university: data.FinalInfo[0].university,
                        college: data.FinalInfo[0].college,
                        approval_status: data.FinalInfo[0].approval_status,
                        createdon: data.FinalInfo[0].createdon,
                        posttime: data.FinalInfo[0].posttime,
                        extra_col3: data.FinalInfo[0].extra_col3,
                        row_type:data.FinalInfo[0].row_type,
                        extra_col1: data.FinalInfo[0].extra_col1,
                    });
                }
            }
        } catch (err) {
            console.log('error FMRDoctorInfoCard', err);
        }
       
    };

    


    useEffect(() => {
        getDoctorDetails();
    }, []);

    return (
        <>
            <div className="tsmc-text border border-info">
                <div className="d-flex ">
                    <div className="flex-shrink-1 pe-1">
                        <div className="tsmc-doc-profile-box border-bottom-0">
                            <div className='tsmc-doc-img mb-3'>
                                {doctor?.passphoto ? <>
                                    {doctor?.filestatus === true ?
                                        <img src={serverImgUrl + 'files/' + doctor?.passphoto} alt="" /> :
                                        <img src={'http://admin.regonlinetsmc.in/forms/uploads/' + doctor?.passphoto} alt="" />
                                    }
                                </> : <img src={DocDefultPic} alt="" />}
                            </div>
                            <div className="d-flex align-items-center justify-content-center border rounded p-1 signature">
                                {doctor?.signature ? <>
                                    {doctor?.filestatus === true ?
                                        <img src={serverImgUrl + 'files/' + doctor?.signature} alt="" /> :
                                        <img src={'http://admin.regonlinetsmc.in/forms/uploads/' + doctor?.signature} alt="" />}
                                </> :
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
                        
                         </div> 
                         
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
                                <label htmlFor="" className='fs-14 fw-00 me-2'>Doctor Id:</label>
                                <div className="col fs-14">{doctor?.serial_id}</div>
                            </div>
                            <div className="col d-flex">
                                <label htmlFor="" className='fs-14 fw-600 me-2'>Blood Group:</label>
                                <div className="fs-14">{doctor?.bloodgroup}</div>
                            </div>
                        </div>
                        <div className="d-flex mb-2">
                            <div className="col d-flex">
                                <label htmlFor="" className='fs-14 fw-600 me-2'>Address:</label>
                                <div className="fs-14">{doctor?.address1} {doctor?.address2},
                                    {doctor?.cityName},{doctor?.stateName}-{doctor?.pincode}</div>
                            </div>
                        </div>
                   </div>
                   
                </div>
                <div>
                </div>
                <FMRDataEdit doctor_id={doctor?.serial_id}></FMRDataEdit>
                            </div>
                       
        </>
    )
};
export default FMRDoctorInfoCard;