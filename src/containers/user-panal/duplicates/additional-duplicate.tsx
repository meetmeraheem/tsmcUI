import { Link } from 'react-router-dom';
import DocDefultPic from '../../../assets/images/doc-default-img.jpg';

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
                                <div className="row">
                                    <div className="col-3">
                                        <div className="tsmc-doc-profile-box border-bottom-0">
                                            <div className='tsmc-doc-img mb-3'>
                                                <img src={DocDefultPic} alt="" />
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center border rounded p-1">
                                                <i className="bi-pencil-square fs-22 px-3"></i>
                                                <h2 className="fs-18 fw-700 mb-0">Signature</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <h2 className='fs-16 fw-600 mb-3'>Konda Venkata Vamshi Das</h2>
                                        <div className="d-flex">
                                            <div className="col">
                                                <div className="d-flex mb-2">
                                                    <label htmlFor="" className='fs-14 fw-700 me-2'>Father Name:</label>
                                                    <div className="col fs-14">Konda Venkata Ranga Das</div>
                                                </div>
                                                <div className="d-flex mb-2">
                                                    <label htmlFor="" className='fs-14 fw-700 me-2'>Mother Name:</label>
                                                    <div className="col fs-14">Konda Venkata Sunitha</div>
                                                </div>
                                                <div className="d-flex mb-2">
                                                    <label htmlFor="" className='fs-14 fw-700 me-2'>Date of Birth:</label>
                                                    <div className="col fs-14">22-12-1989</div>
                                                </div>
                                                <div className="d-flex mb-2">
                                                    <label htmlFor="" className='fs-14 fw-700 me-2'>Gender:</label>
                                                    <div className="col fs-14">Male</div>
                                                </div>
                                                <div className="d-flex mb-2">
                                                    <label htmlFor="" className='fs-14 fw-700 me-2'>Mobile No:</label>
                                                    <div className="col fs-14">+91 9000992292</div>
                                                </div>
                                                <div className="d-flex mb-2">
                                                    <label htmlFor="" className='fs-14 fw-700 me-2'>Email Address:</label>
                                                    <div className="col fs-14">vamshidas@gmail.com</div>
                                                </div>
                                                <div className="d-flex mb-2">
                                                    <label htmlFor="" className='fs-14 fw-700 me-2'>Blood Group:</label>
                                                    <div className="col fs-14">O+</div>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="d-flex mb-2">
                                                    <label htmlFor="" className='fs-14 fw-00 me-2'>Landline:</label>
                                                    <div className="col fs-14">040 3234358</div>
                                                </div>
                                                <div className="d-flex mb-1">
                                                    <label htmlFor="" className='fs-14 fw-00 me-2'>Aadhar No:</label>
                                                    <div className="col fs-14">3455 7999 4394 9834</div>
                                                </div>
                                                <div className="mb-2">
                                                    <label htmlFor="" className='fs-14 fw-00 me-2'>Address:</label>
                                                    <div className="col fs-14">P.B. 523, Sultan Bazaar, Near Post Office, opposite Womens College, Hyderabad, Telangana 500095, India</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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