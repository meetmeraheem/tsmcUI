import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DocDefultPic from '../../../assets/images/doc-default-img.jpg';
import { doctorService } from '../../../lib/api/doctot';
import { LocalStorageManager } from '../../../lib/localStorage-manager';
import { RootState } from '../../../redux';
import { setDoctorInfo } from '../../../redux/doctor';
import { DoctorFormType } from '../../../types/doctor';
import { serverUrl, serverImgUrl } from '../.././../config/constants';

// type Props = {
//     doctor : DoctorFormType  | null;
// };

// const DoctorInfoCard: React.FC<Props> = ({doctor}) => {
const DoctorInfoCard = () => {
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
            <div className="row">
                <div className="col-3">
                    <div className="tsmc-doc-profile-box border-bottom-0">
                        <div className='tsmc-doc-img mb-3'>
                        {doctor?.passphoto ? <img src={serverImgUrl + 'files/' + doctor?.passphoto} alt="" /> : <img src={DocDefultPic} alt="" /> }
                        </div>
                        <div className="d-flex align-items-center justify-content-center border rounded p-1 signature">
                        {doctor?.signature ? <img src={serverImgUrl + 'files/' + doctor?.signature} alt="" /> :
                                                                <div><i className="bi-pencil-square fs-22 px-2"></i><h2 className="fs-18 fw-700 mb-0 pe-2">Signature</h2></div>
                                                                }
                        </div>
                    </div>
                </div>
                <div className="col">
                    <h2 className='fs-16 fw-600 mb-3'>{doctor?.fullname}</h2>
                    <div className="d-flex">
                        <div className="col">
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
                                <div className="col fs-14">{doctor?.gender == 'm' ? 'Male' : doctor?.gender == 'f' ? 'FeMale': ''}</div>
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
        </>
    )
};
export default DoctorInfoCard;