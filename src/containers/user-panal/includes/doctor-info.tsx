import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DocDefultPic from '../../../assets/images/doc-default-img.jpg';
import { doctorService } from '../../../lib/api/doctot';
import { LocalStorageManager } from '../../../lib/localStorage-manager';
import { RootState } from '../../../redux';
import { setDoctorInfo } from '../../../redux/doctor';
import { DoctorFormType } from '../../../types/doctor';
import { serverUrl, serverImgUrl } from '../.././../config/constants';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import { routes } from "../../routes/routes-names";
import { useNavigate,useLocation } from "react-router-dom";
// type Props = {
//     doctor : DoctorFormType  | null;
// };

// const DoctorInfoCard: React.FC<Props> = ({doctor}) => {
const DoctorInfoCard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [doctor, setDoctor] = useState<DoctorFormType>();

    const getDoctorDetails = async () => {
        try {
            const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());
            if (doctorPrimaryId) {
                const {data} = await doctorService.getDoctorById(doctorPrimaryId);
                if (data.length > 0) {
                    if(data[0].passphoto ===null|| data[0].signature ===null ||data[0].passphoto===""||data[0].signature ===""||
                    data[0].fathername===null || data[0].fathername===""||data[0].mothername===null||data[0].mothername ===""||
                    data[0].address1===null ||data[0].address1===""||data[0].address2 === null||data[0].address2==="")
                    {
                        Swal.fire({
                            title: "Warning",
                            text: "Please update Mother Name,Father Name,Pass Photo,Signature  and address detais in  Profile as they are not updated",
                            icon: "warning",
                            confirmButtonText: "OK",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                navigate(routes.usereditprofile);
                            }
                        });
                    }else{
                        setDoctor(data[0]);
                        dispatch(setDoctorInfo(data[0]));
                    }
                }
            }
        } catch (err) {
            console.log('error countries getList', err);
        }
    };

    useEffect(() => {
        console.log('error countries getList');
        getDoctorDetails();
    }, []);

    return (
        <>
           
            <div >
                                            <div className="tsmc-text">
                                               
                                                <div className="d-flex">
                                                    <div className="flex-shrink-1 pe-3">
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
                                                                <div className="fs-14">{doctor?.address1} {doctor?.address2}
                                                                {doctor?.cityName},{doctor?.stateName}-{doctor?.pincode}</div>
                                                            </div>
                                                        </div>
                                                        <div className="col d-flex">
                                                            <label htmlFor="" className='fs-14 fw-600 me-2'>Registration No:</label>
                                                            <div className="fs-14">{doctor?.original_fmr_no}</div>
                                                        </div>
                                                    </div>
                
                                                      </div>
                                                    </div>
                                                 </div>
        </>
    )
};
export default DoctorInfoCard;