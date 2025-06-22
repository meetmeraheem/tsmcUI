import './../../assets/styles/styles.css';

import { useCallback, useEffect, useState } from 'react';
import moment from "moment";
import Swal from "sweetalert2";
import Table from "../../components/Table";
import {commonService} from "../../lib/api/common";
import FMRDoctorInfoCard from './FMRDoctorInfoCard';
import { DoctorFormType } from '../../types/doctor';

const FMRDocSearch = () => {
    const [loading, setLoading] = useState(false)
    const [showComponent, setShowComponent] = useState(false);
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const [doctorId, setDoctorId] = useState("");
    
    useEffect(() => {
    }, []);

    

    const search = async () => {
        try {
            if(doctorId!=="" && doctorId!==undefined){
            
                const { data} = await commonService.getDoctorInfoBySerialId(doctorId);
                if (data) {
                    setDoctor(data);
                    setShowComponent(true);
                }else {
                    setDoctorId("");
                    Swal.fire({
                    icon:"warning",
                    title: "",
                    text: "No data found for the given criteria",
                    confirmButtonText: "OK",
                });
            }
        }else{
            Swal.fire({
                icon:"warning",
                title: "Warning",
                text: "Please Enter DoctorId No",
                confirmButtonText: "OK",
            });
            
        }
        } catch (err) {
            setDoctorId("");
            console.log('error get users by role', err);
        }
    } ;


    return (
        <>
           <div className="container">
  <div className="row align-items-end">
    {/* Doctor ID Input */}
    <div className="col-md-4">
      <label htmlFor="doctorId" className="form-label">Please Enter Doctor Id</label>
      <input
        type="text"
        className="form-control fs-14"
        id="doctorId"
        placeholder="Enter Doctor Id"
        value={doctorId}
        onChange={(e) => setDoctorId(e.target.value)}

      />
    </div>

    {/* Spacer column (optional) */}
    <div className="col-md-4">
      {/* You can add more fields here if needed */}
    </div>

    {/* Search Button */}
    <div className="col-md-4">
      <button
        type="button"
        onClick={async () => search()}
        className="btn btn-primary w-100"
      >
        Search
      </button>
    </div>
  </div>

            </div>
            <div className="row">
                <div>
                    <div className="container">
                        
                            <div className="row mb-3">
                            {doctor&&<FMRDoctorInfoCard  doctorPrimaryId ={doctor?.id} ></FMRDoctorInfoCard>}
                            </div>
                        
                    </div>
                </div>
                </div>


        </>
    )
}

export default FMRDocSearch;
