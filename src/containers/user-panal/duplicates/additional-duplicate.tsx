import { Link } from 'react-router-dom';
import DocDefultPic from '../../../assets/images/doc-default-img.jpg';
import DoctorInfoCard from "../includes/doctor-info";


const AdditionalDuplicate = () => {
    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
                    <div className="col-9 m-auto">
                        <div className="card shadow border-0 mb-4">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <h1 className='fs-22 fw-700 me-2 mb-0'>Additional Duplicate Registration</h1>
                                    <p className='mb-0 fs-13'>(Please check your personal details and click on next)</p>
                                </div>
                                <hr />
                                <DoctorInfoCard />
                            </div>
                            <div className="card-footer text-end">
                                <button type='submit' className='btn btn-primary'>Next <i className="bi-chevron-right"></i></button>
                            </div>
                        </div>
                    </div>
                    <div className="col-9 m-auto">
                        <div className="card shadow border-0 mb-4">
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <h1 className='fs-22 fw-700 me-2 mb-0'>List of Additional Qualifications</h1>
                                    <hr />
                                </div>
                                <div className="d-flex">
                                    <div className="col fs-14 py-2 ps-2 fs-700 bg-secondary text-light">Applied For</div>
                                    <div className="col fs-14 py-2 fs-700 bg-secondary text-light">Qualification</div>
                                    <div className="col fs-14 py-2 fs-700 bg-secondary text-light">Month</div>
                                    <div className="col fs-14 py-2 fs-700 bg-secondary text-light">Year</div>
                                    <div className="col fs-14 py-2 fs-700 bg-secondary text-light">Reg Date</div>
                                    <div className="col fs-14 py-2 pe-2 fs-700 bg-secondary text-light">Action</div>
                                </div>
                                <div className='d-flex'>
                                    <div className='col fs-14 py-2 ps-2'>P.G</div>
                                    <div className='col fs-14 py-2'>M.B.B.S</div>
                                    <div className='col fs-14 py-2'>April</div>
                                    <div className='col fs-14 py-2'>2009</div>
                                    <div className='col fs-14 py-2'>21/02/2009</div>
                                    <div className='col fs-14 py-2 ps-2'><Link to=".">Add Duplicate</Link></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-9 m-auto">
                        <div className="card shadow border-0 mb-4">
                            <div className="card-body">
                                <h1 className='fs-22 fw-700'>Additional Duplicate Registration</h1>
                                <hr />
                                <div className="row mb-2">
                                    <div className="col-4">
                                        <label className="mb-2">Reason</label>
                                        <select name="reason" className="form-select form-select-sm" tabIndex={1}>
                                            <option value="">Select</option>
                                            <option value="notk">Not Known</option>
                                            <option value="surr">Surrender</option>
                                            <option value="lost">Lost</option>
                                        </select>
                                    </div>
                                    <div className="col">
                                        
                                    </div>
                                </div>
                                <div className="row mb-2 mt-4">
                                    <div className="col-4">
                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                            <div className="text-center">
                                                <i className="bi-file-earmark-break fs-32"></i>
                                                <p className='fs-13'>Document 1</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
};
export default AdditionalDuplicate;