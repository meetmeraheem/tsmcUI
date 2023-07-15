import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { routes } from '../routes/routes-names';
import { LocalStorageManager } from '../../lib/localStorage-manager';
import moment from 'moment';
import DoctorInfoCard from "./includes/doctor-info";
import secureLocalStorage from 'react-secure-storage';

const GoodStandingRegistration = () => {
    const navigate = useNavigate();
    const [doctorId, setDoctorId] = useState(0);
    const [provisionalRequestType, setProvisionalRequestType] = useState<string>("nor");
  
      useEffect(() => {
        
    }, [])

  const ContinueForm = useCallback(async () => {
        try {
            const doctorId = Number(LocalStorageManager.getDoctorSerialId());
            const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());
            const goodstandingInfo = {
                createdon: moment().format('YYYY-MM-DD'),
                posttime: moment().format('h:mm:ss'),
                prefix: 'TSMC',
                approval_status: 'pen',
                row_type: 'on',
                reg_date: moment().format('YYYY-MM-DD'),
                doctor_id: doctorId && Number(doctorId),
                extra_col1:provisionalRequestType,
                doctorPrimaryId:doctorPrimaryId

            }
            secureLocalStorage.setItem("regType", 'goodstandingInfo');
            secureLocalStorage.setItem("goodstandingInfo", goodstandingInfo);
            navigate(routes.payment, {state:{doctor_id:Number(doctorId),regType:'goodstandingInfo'}});
        } catch (err) {
            console.log('error in  registrartion.', err);
        }
    }, [doctorId,provisionalRequestType]);

    return (
        <>
            <section className='gray-banner'>
            <div className="container mt-4">
             <div className="col-9 m-auto">
                        <div className="card shadow border-0 mb-4">
                            <div className="card-body">
                            <div className="mt-3">
                                <div className="d-flex align-items-center">
                                    <h1 className='fs-22 fw-700 me-2 mb-0'>Good standing Registration</h1>
                                    <p className='mb-0 fs-13'>(Please check your personal details and click on next)</p>
                                    
                                </div>
                                <hr />
                                <DoctorInfoCard />
                            </div>
                            <div className="row mb-2">
                            <div className="col-sm-auto">
                                                            <label className="mb-2"> Request Type</label>
                                                            <select
                                                                value={provisionalRequestType}
                                                                onChange={(ev) => {
                                                                    setProvisionalRequestType(ev.target.value);
                                                                }}
                                                                className="form-select"
                                                            >
                                                                {/*  <option value="">Select</option>*/}
                                                                <option value="nor">Normal</option>
                                                               {/*<option value="tat">Tatkal</option>*/}
                                                            </select>
                                                        </div>
                                                        </div>

                            <div className="card-footer text-end">
                            <button type="button" onClick={() => ContinueForm()} className="btn btn-primary ps-2">Continue</button>
                            </div>
                        </div>
                        </div>
                    </div>  
                    
                    </div>
                </section>
            </>
    )
};


export default GoodStandingRegistration;