import DoctorInfoCard from './includes/doctor-info';

const AdditionalQualificationRegistration = () => {
    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
                    <div className="col-9 m-auto">
                        <div className="card shadow border-0 mb-4">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <h1 className='fs-22 fw-700 me-2 mb-0'>Additional Qualification Registration</h1>
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
                                <h1 className='fs-22 fw-700'>Educational Institution Details</h1>
                                <hr />
                                <div className="row mb-2">
                                    <div className="col">
                                        <label className="mb-2">Country</label>
                                        <select name="qualification" className="form-select" tabIndex={1}>
                                            <option value="">Select</option>
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label className="mb-2">State</label>
                                        <select name="exam_month" className="form-select" tabIndex={2}>
                                            <option value="">Select</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col">
                                        <label className="mb-2">University Name</label>
                                        <select name="exam_month" className="form-select" tabIndex={2}>
                                            <option value="">Select</option>
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label className="mb-2">College Name</label>
                                        <select name="edu_country" className="form-select" id="ColgCountry" tabIndex={4}>
                                            <option value="">Select</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col">
                                        <label className="mb-2">Applied For</label>
                                        <select name="edu_state" className="form-select edu_state" id="State" tabIndex={5}>
                                            <option value="">Select </option>
                                            <option value="Diploma">Diploma</option>
                                            <option value="Post Graduation">Post Graduation</option>
                                            <option value="Super Speciality">Super Speciality</option>
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label className="mb-2">Qualification</label>
                                        <input type="text" className="form-control" placeholder="Enter Qualification" name="qualification" tabIndex={6} />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col">
                                        <label className="mb-2">Month</label>
                                        <select className="form-select vdcollege" tabIndex={7} name="college">
                                            <option value="">Select</option>
                                            <option value="JAN">January</option>
                                            <option value="FEB">February</option>
                                            <option value="MAR">March</option>
                                            <option value="APR">April</option>
                                            <option value="MAY">May</option>
                                            <option value="JUN">June</option>
                                            <option value="JUL">July</option>
                                            <option value="AUG">August</option>
                                            <option value="SEP">September</option>
                                            <option value="OCT">October</option>
                                            <option value="NOV">November</option>
                                            <option value="DEC">December</option>
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label className="mb-2">Year</label>
                                        <input type="text" className="form-control" placeholder="Select Exam Year" name="exam_year" tabIndex={8} />
                                    </div>
                                </div>
                                <div className="row mb-2 mt-4">
                                    <div className="col-3">
                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                            <div className="text-center">
                                                <i className="bi-file-earmark-break fs-32"></i>
                                                <p className='fs-13'>Study Certificate</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                            <div className="text-center">
                                                <i className="bi-file-earmark-break fs-32"></i>
                                                <p className='fs-13'>Degree Certificate</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer text-end">
                                <button type='submit' className='btn btn-primary'>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
};

export default AdditionalQualificationRegistration;