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
                                                    
                                                    
                                                    <table style={{border: "1px solid rgb(0, 0, 0)",backgroundColor:"#E2F4F5", width:"100%"}} >

                                                        <tr style={{alignContent:"center",width:"100%"}}>
                                                        <td style={{textAlign:"center",width:"100%",fontSize:"24px",fontWeight:"bold"}}>Telangana State Medical Council</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{textAlign:"center",width:"100%",fontSize:"14px"}}>Application Registration Reciept</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{textAlign:"center",width:"100%",fontSize:"12px" }}> P. B. 523, Sultan Bazaar, Near Post Office, opposite Womens College, Hyderabad, Telangana 500095</td>
                                                        </tr>

                                                        </table>
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
                                                    
                                                <table style={{border: "1px solid rgb(0, 0, 0)",width:"100%"}}>
                                                         <tr style={{width:"100%",backgroundColor:"#E2F4F5"}}>
                                                         <td colSpan={2} style={{textAlign:"left",width:"100%",fontSize:"14px",fontWeight:"bold"}} >Personal Information</td>
                                                        </tr>
                                                            <tr style={{border: "1px solid rgb(0, 0, 0)"}}>
                                                                <td style={{border: "1px solid rgb(0, 0, 0)",fontWeight:"bold"}}>Full Name:</td>
                                                                <td style={{border: "1px solid rgb(0, 0, 0)"}}>{doctor?.fullname}</td>
                                                            </tr>
                                                            <tr style={{border: "1px solid rgb(0, 0, 0)"}}>
                                                                <td  style={{border: "1px solid rgb(0, 0, 0)",fontWeight:"bold"}}>Date of Birth:</td>
                                                                <td style={{border: "1px solid rgb(0, 0, 0)"}}>{moment(doctor?.dateofbirth).format('DD/MM/YYYY')}</td>
                                                            </tr>
                                                            <tr style={{border: "1px solid rgb(0, 0, 0)"}}>
                                                                <td style={{border: "1px solid rgb(0, 0, 0)",fontWeight:"bold"}}>Gender:</td>
                                                                <td style={{border: "1px solid rgb(0, 0, 0)"}}>{doctor?.gender == 'M' ? 'MALE' : doctor?.gender == 'F' ? 'FEMALE' : 'OTHERS'}</td>
                                                            </tr>
                                                            <tr style={{border: "1px solid rgb(0, 0, 0)"}}>
                                                                <td  style={{border: "1px solid rgb(0, 0, 0)",fontWeight:"bold"}}>Mobile No:</td>
                                                                <td style={{border: "1px solid rgb(0, 0, 0)"}}>{doctor?.mobileno}</td>
                                                            </tr>
                                                            <tr style={{border: "1px solid rgb(0, 0, 0)"}}>
                                                                <td  style={{border: "1px solid rgb(0, 0, 0)",fontWeight:"bold"}}>Email Address:</td>
                                                                <td style={{border: "1px solid rgb(0, 0, 0)"}}>{doctor?.emailid}</td>
                                                            </tr>
                                                            <tr style={{border: "1px solid rgb(0, 0, 0)"}}>
                                                                <td style={{border: "1px solid rgb(0, 0, 0)",fontWeight:"bold"}}>Address Line1:</td>
                                                                <td style={{border: "1px solid rgb(0, 0, 0)"}}>{doctor?.address1} </td>
                                                             </tr>   
                                                             <tr style={{border: "1px solid rgb(0, 0, 0)"}}>
                                                                <td style={{border: "1px solid rgb(0, 0, 0)",fontWeight:"bold"}}>Address Line2:</td>
                                                                <td style={{border: "1px solid rgb(0, 0, 0)"}}>{doctor?.address2} </td>
                                                             </tr>   
                                                            <tr style={{border: "1px solid rgb(0, 0, 0)"}}>
                                                                <td style={{border: "1px solid rgb(0, 0, 0)",fontWeight:"bold"}}>City Name:</td>
                                                                <td style={{border: "1px solid rgb(0, 0, 0)"}}>{doctor?.cityName}</td>
                                                            </tr>
                                                            <tr style={{border: "1px solid rgb(0, 0, 0)"}}>
                                                            <td style={{border: "1px solid rgb(0, 0, 0)",fontWeight:"bold"}}>State:</td>
                                                            <td style={{border: "1px solid rgb(0, 0, 0)"}}>{doctor?.stateName}-{doctor?.pincode}</td>
                                                            </tr>  
                                                                
                                                        </table>
        </>
    )
};
export default DoctorInfoPrintCard;