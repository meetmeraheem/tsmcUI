import DoctorInfoCard from "./includes/doctor-info";
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const FinalRenewals = () => {
    const navigate = useNavigate();
    const [next, setNext] = useState(false);
    return (
        <>
            <section className='gray-banner'>
            <div className="container mt-4">
            {!next && <div className="col-9 m-auto">
                        <div className="card shadow border-0 mb-4">
                            <div className="card-body">
                            <div className="mt-3">
                                <div className="d-flex align-items-center">
                                    <h1 className='fs-22 fw-700 me-2 mb-0'>Final Renewals</h1>
                                    <p className='mb-0 fs-13'>(Please check your personal details and click on next)</p>
                                    
                                </div>
                                <hr />
                                <DoctorInfoCard />
                            </div>
                            <div className="card-footer text-end">
                                <button type='submit' onClick={() => setNext(true)} className='btn btn-primary'>Next <i className="bi-chevron-right"></i></button>
                            </div>
                        </div>
                        </div>
                    </div>  
                    }
                    </div>
                </section>
            </>
    )
};

export default FinalRenewals;