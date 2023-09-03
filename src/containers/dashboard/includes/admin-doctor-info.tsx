import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DocDefultPic from '../../../assets/images/doc-default-img.jpg';
import { adminEditService } from '../../../lib/api/adminedits';
import { FinalMyProfileType } from '../../../types/final';
import { DoctorFormType } from '../../../types/doctor';
import { serverUrl, serverImgUrl } from '../.././../config/constants';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ProfileDataEdit from '../adminEdits/profile-data-edit'
import FinalDataEdit from '../adminEdits/final-data-edit';
import AdditionalDataEdit from '../adminEdits/additional-data-edit';

const AdminDoctorInfoCard = (props: any) => {
    const dispatch = useDispatch();
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const [final, setFinal] = useState<FinalMyProfileType>();
    const [showFinal, setShowFinal] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showAdditional, setShowAdditional] = useState(false);
    const [additionalId, setAdditionalId] = useState('');
    const [additionslGridList, setAdditionalGridList] = useState<any>([]);

    const getDoctorDetails = async () => {
        try {
            const doctorPrimaryId = Number(props.doctorId);
            if (doctorPrimaryId) {
                const { data } = await adminEditService.getDoctorDetailsById(doctorPrimaryId);
                if (data) {
                    setDoctor(data.doctorInfo);
                    setAdditionalGridList(data.additionalInfo);
                    setFinal({
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
                    });
                }
            }
        } catch (err) {
            console.log('error countries getList', err);
        }
    };

    useEffect(() => {
        console.log('error countries getList');
        getDoctorDetails();
    }, [showProfile,showFinal, showAdditional]);

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
                        <h1 className='fs-18 fw-700 mb-0'>Profile &nbsp;&nbsp;&nbsp; </h1>
                                    <div className="col d-flex">
                                    <Button variant="primary" onClick={() => { setShowProfile(true) }}>Edit Profile</Button>
                                    </div>
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
                    <div className="row">
                        {final && props.fmrView !=='NO'&&
                            <>
                                <div className="tsmc-text">
                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                        <div className="d-flex mb-2">
                                            <h1 className='fs-18 fw-700 mb-0'>Final Registration &nbsp;&nbsp;&nbsp; </h1>
                                            {final.row_type !=="M" ? 
                                            <div className="col d-flex">
                                                <Button variant="primary" onClick={() => { setShowFinal(true) }}>Edit Final</Button>
                                            </div>:"" }

                                        </div>
                                    </div>
                                    <div className="w-100">
                                        <div className="d-flex mb-2">
                                            <div className="col d-flex">
                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Registration No:</label>
                                                <div className="fs-14">{doctor?.original_fmr_no}</div>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <div className="col d-flex">
                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Qualification:</label>
                                                <div className="fs-14">{final?.qualification ? final?.qualification : 'NA'}</div>
                                            </div>

                                            <div className="col d-flex">
                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Registration Date:</label>
                                                <div className="fs-14">{final?.reg_date ? moment(final?.reg_date).format('DD/MM/YYYY') : 'NA'}</div>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-2">

                                            <div className="col d-flex">
                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Exam Month:</label>
                                                <div className="fs-14">{final?.exam_month ? final?.exam_month : 'NA'}</div>
                                            </div>
                                            <div className="col d-flex">
                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Exam Year:</label>
                                                <div className="fs-14">{final?.exam_year ? final?.exam_year : 'NA'}</div>
                                            </div>

                                        </div>

                                        <div className="d-flex mb-2">
                                            <div className="col d-flex">
                                                <label htmlFor="" className='fs-14 fw-600 me-2'>College Name:</label>
                                                <div className="fs-14">{final?.college ? final?.college : 'NA'}</div>
                                            </div>
                                            <div className="col d-flex">
                                                <label htmlFor="" className='fs-14 fw-600 me-2'>University Name:</label>
                                                <div className="fs-14">{final?.university ? final?.university : 'NA'}</div>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <div className="col d-flex">
                                                <label htmlFor="" className='fs-14 fw-600 me-2'>State:</label>
                                                <div className="fs-14">{final?.state ? final?.state : 'NA'}</div>
                                            </div>
                                            <div className="col d-flex">
                                                <label htmlFor="" className='fs-14 fw-600 me-2'>Country:</label>
                                                <div className="fs-14">{final?.country ? final?.country : 'NA'}</div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    </div>

                    <div className="row">
                        {additionslGridList.length > 0 && props.additionalView !=='NO'&&
                            <>
                                <div className="tsmc-text">
                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                        <h1 className='fs-18 fw-700 mb-0'>Additional Qualification &nbsp;&nbsp;&nbsp;</h1>
                                        
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
                                                <th></th>
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
                                                    {obj.extra_col2 !=="M" ? 
                                                    <Button variant="primary" onClick={() => {setAdditionalId(obj.id); setShowAdditional(true) }}>Edit</Button>
                                                    :""
                                                    }
                                                    </td>

                                                </tr>);
                                            })}
                                        </tbody></table>
                                </div>
                            </>
                        }
                    </div>
                    <Modal size="xl" show={showProfile} onHide={() => { setShowProfile(false) }} className="w-100 mt-5">
                        <Modal.Body>
                            <ProfileDataEdit doctorId={doctor?.id}></ProfileDataEdit>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={() => {
                                setShowProfile (false);
                            }}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal size="lg" show={showFinal} onHide={() => { setShowFinal(false) }} className="w-100 mt-5">
                        <Modal.Body>
                            <FinalDataEdit doctorId={doctor?.serial_id} ></FinalDataEdit>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={() => {
                                setShowFinal(false);
                            }}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal size="lg" show={showAdditional} onHide={() => { setShowAdditional(false) }} className="w-100 mt-5">
                        <Modal.Body>
                            <AdditionalDataEdit additionalPrimaryId={additionalId} ></AdditionalDataEdit>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={() => {
                                setShowAdditional(false);
                            }}>

                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </>
    )
};
export default AdminDoctorInfoCard;