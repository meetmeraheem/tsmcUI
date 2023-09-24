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


// type Props = {
//     doctor : DoctorFormType  | null;
// };

// const DoctorInfoCard: React.FC<Props> = ({doctor}) => {
const DoctorInfoPrintCard = () => {
    const dispatch = useDispatch();
    const [doctor, setDoctor] = useState<DoctorFormType>();

    const getDoctorDetails = async () => {
        try {
            const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());
            if (doctorPrimaryId) {
                const {data} = await doctorService.getDoctorById(doctorPrimaryId);
                if (data.length > 0) {
                    setDoctor(data[0]);
                    dispatch(setDoctorInfo(data[0]));
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
                                                        
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Full Name:</label>
                                                                <div className="fs-14">{doctor?.fullname}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Date of Birth:</label>
                                                                <div className="fs-14">{moment(doctor?.dateofbirth).format('DD/MM/YYYY')}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Gender:</label>
                                                                <div className="fs-14">{doctor?.gender == 'M' ? 'MALE' : doctor?.gender == 'F' ? 'FEMALE' : 'OTHERS'}</div>
                                                            </div>
                                                        
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Mobile No:</label>
                                                                <div className="fs-14">{doctor?.mobileno}</div>
                                                            </div>
                                                            <div className="col d-flex">
                                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Email Address:</label>
                                                                <div className="fs-14">{doctor?.emailid}</div>
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
export default DoctorInfoPrintCard;