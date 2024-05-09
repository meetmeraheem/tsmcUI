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
import FinalRegPrint from'../../containers/user-panal/printouts/final-reg-print';
import AdditionalRegViewPrint from'../../containers/user-panal/printouts/additional-view-print';
import RenewalsViewPrint from'../../containers/user-panal/printouts/renewals-view-print';
import NocRegViewPrint from'../../containers/user-panal/printouts/noc-view-print';
import GoodStandingRegPrintView from '../../containers/user-panal/printouts/goodstanding-view-print';
import ProvisionalViewPrint from '../../containers/user-panal/printouts/provisional-view-print';

const DispatchDoctorInfoCard = (props: any) => {
    const dispatch = useDispatch();
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const [final, setFinal] = useState<FinalMyProfileType>();
    let default7Days = moment().format('YYYY-MM-DD');
    const [fromdate, setFromDate] = useState(default7Days);
    const [dispatchDate, setDispatchDate] = useState(default7Days);
    const [courierDate, setCourierDate] = useState(default7Days);
    const [dispatchNo, setDispatchNo] = useState('');
    const [courierNo, setCourierNo] = useState('');
    const [saveUpdate, setSaveUpdate] = useState('save');
    const [dispatchId, setDispatchId] = useState('');

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
            console.log('error countries getList', err);
        }
        
        /*if(dispatchdata !== null){
            setDispatchDate(dispatchdata.dispatchDate);
            setDispatchNo(dispatchdata.dispatchNo);
            setCourierDate(dispatchdata.courierDate);
            setCourierNo(dispatchdata.courierNo);
            setDispatchId(dispatchdata.id);
            setSaveUpdate("Update");
        }*/
    };

    const closewindow = useCallback(async () => {
        props.greet();
    }, []);

    const getDispatchDetails = async () => {
        try {
            const { data } = await dispatchservice.getDispatchinfo(props.doctorId,props.requestPrimaryId);
        if(data !== null){
            setDispatchDate(data.dispatchDate);
            setDispatchNo(data.dispatchNo);
            setCourierDate(data.courierDate);
            setCourierNo(data.courierNo);
            setDispatchId(data.id);
            setSaveUpdate("Update");
        }

        } catch (err) {
            console.log('error getDispatchDetails ', err);
        }
    }


    const saveDispatch = useCallback(async (saveType:any) => {
        try {
            if(dispatchNo===''){
                Swal.fire({
                    icon:"warning",
                    title: "",
                    text: "Please Enter dispatch No ",
                    confirmButtonText: "OK",
                });
                return false;
            }
            
            if(courierNo===''){
                Swal.fire({
                    icon:"warning",
                    title: "",
                    text: "Please Enter courierNo No ",
                    confirmButtonText: "OK",
                });
                return false;
            }
            const adminPrimaryId = Number(LocalStorageManager.getAdminPrimaryId());
           const dispatchInfo = {
                doctor_id: props.doctorId,
                reqType:props.reqType,
                userId:adminPrimaryId,
                requestPrimaryId:props.requestPrimaryId,
                dispatchDate: moment(dispatchDate).format('YYYY-MM-DD'),
                dispatchNo:dispatchNo,
                courierDate: moment(courierDate).format('YYYY-MM-DD'),
                courierNo:courierNo
            }
            const formData = new FormData();
            formData.append("dispatchInfo", JSON.stringify(dispatchInfo));
            
            if(saveType === 'save'){
                const { data } = await dispatchservice.saveDispatchinfo(formData);
                if (data) {
                    Swal.fire({
                        icon:"success",
                        title: "",
                        text: "Saved successfully",
                        confirmButtonText: "OK",
                    });
                    props.greet();
                }else {
                Swal.fire({
                    icon:"error",
                    title: "",
                    text: "Failed to Save",
                    confirmButtonText: "OK",
                });
            }
            }else{

                const { data } = await dispatchservice.updateDispatchinfo(formData,dispatchId);

                if (data) {
                    Swal.fire({
                        icon:"success",
                        title: "",
                        text: "Updated successfully",
                        confirmButtonText: "OK",
                    });
                    props.greet();
                }else {
                Swal.fire({
                    icon:"error",
                    title: "",
                    text: "Failed to Update",
                    confirmButtonText: "OK",
                });
            }
        }
        } catch (err) {
            console.log('error get users by role', err);
        }
    }, [dispatchDate, dispatchNo,courierDate,courierNo,dispatchId]);
    useEffect(() => {
        console.log('error countries getList');
        getDoctorDetails();
        getDispatchDetails();
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
                    {props.reqType==="fmr" && <FinalRegPrint state={{ finalPrimaryId:props.requestPrimaryId,reqType:""}}></FinalRegPrint>}
                            
                        {/*else if(reqType==="pmr") 
                        {
                            
                         }else if(reqType==="aqr")
                        {
                            
                        }else if(reqType==="frr")
                            {
                            
                            }
                            else if(reqType==="noc")
                                {
                            
                                }
                        else if(reqType==="gs")
                                {
                            
                                }*/}
                    <div className="d-flex mb-2">
                        <h1 className='fs-18 fw-700 mb-0'>Profile &nbsp;&nbsp;&nbsp; </h1>
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
                <div className="tsmc-text border ">
                                <div className="d-flex align-items-center justify-content-center">
                                    <div className="flex-shrink-1 pe-1">
                                        <div className="tsmc-doc-profile-box border-bottom-0 card-footer">

                                            <div className="row p-2">

                                                <div className="col d-flex">
                                                    <label>Dispatch Date <small className="text-danger">*</small> </label>
                                                </div>
                                                <div className="col d-flex">
                                                    <input type="date" name="" id=""
                                                        value={dispatchDate}
                                                        className='form-control'
                                                        onChange={(ev) => {
                                                            setDispatchDate(ev.target.value)
                                                        }} />
                                                </div>

                                            </div>
                                            <div className="row p-2">
                                                <div className="col d-flex">
                                                    <label>Dispatch Number <small className="text-danger">*</small> </label>
                                                </div>
                                                <div className="col d-flex">
                                                    <input type="text" className='fs-14 form-control' 
                                                    defaultValue={dispatchNo}
                                                    id="dispatchNo" onBlur={(e) => setDispatchNo(e.target.value)} placeholder='Enter Dispatch No ' />
                                                </div>
                                            </div>
                                            <div className="row p-2">
                                                <div className="col d-flex">
                                                    <label>Courier Date <small className="text-danger">*</small> </label>
                                                </div>
                                                <div className="col d-flex">
                                                    <input type="date" name="" id=""
                                                        value={courierDate}
                                                        className='form-control'
                                                        onChange={(ev) => {
                                                            setCourierDate(ev.target.value)
                                                        }} />
                                                </div>
                                            </div>
                                            <div className="row p-2 ">
                                                <div className="col d-flex">
                                                    <label>Courier Number <small className="text-danger">*</small>  </label>
                                                </div>
                                                <div className="col d-flex">
                                                    <input type="text" 
                                                    className='fs-14 form-control'
                                                    defaultValue={courierNo}
                                                     id="courierNo" onBlur={(e) => setCourierNo(e.target.value)} placeholder='Enter Courier No ' />
                                                </div>
                                            </div>
                                            <div className="card-footer">
                                                <div className='d-flex'>
                                                    <div className="col">
                                                        <button type="submit"

                                                            onClick={() => {
                                                                closewindow();
                                                            }} className='btn btn-danger'><i className="bi-x-circle"></i> Close</button>
                                                    </div>
                                                    <div className="col text-end">
                                                        <button type="submit"

                                                            onClick={() => {
                                                                {saveUpdate === 'save'? saveDispatch('save'):saveDispatch('Update')}
                                                            }} className='btn btn-success'><i className="bi-check-circle"></i> 

                                                            {saveUpdate === 'save'? "Submit":"Update"}

                                                            </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
        </>
    )
};
export default DispatchDoctorInfoCard;