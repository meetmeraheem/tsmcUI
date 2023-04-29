import DoctorInfoCard from "./includes/doctor-info";

const GoodStandingRegistration = () => {
    return (
        <>
            <section className='gray-banner'>
                <div className="col-8 m-auto mt-4">
                    <div className="card shadow border-0 mb-4">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <h1 className='fs-22 fw-700 me-2 mb-0'>Good Registration</h1>
                                <p className='mb-0 fs-13'>(Please check your personal details and click on next)</p>
                            </div>
                            <hr />
                            <DoctorInfoCard />
                            <div className="mt-3">
                                <div className="d-flex align-items-center">
                                    <h1 className='fs-16 fw-700 me-2 mb-0'>Final Registration Details</h1>
                                </div>
                                <hr />
                                <div className="d-flex">
                                    
                                    <label className="col-sm-2 col-form-label form-group pr-0 mb-3">Internship Month</label>
                                    <div className="col fs-14">January</div>
                                    <label className="col-sm-2 col-form-label form-group pr-0 mb-3">Internship Year</label>
                                    <div className="col fs-14">2009</div>
                                    <label className="col-sm-2 col-form-label form-group pr-0 mb-3">Reg. Date</label>
                                    <div className="col fs-14">22/12/2023</div>
                                    <label className="col-sm-2 col-form-label form-group pr-0 mb-3">Final Registration No</label>
                                    <div className="col fs-14">TSMC/FMR/19289</div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer text-end">
                            <button type='submit' className='btn btn-primary'>Next <i className="bi-chevron-right"></i></button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
};

export default GoodStandingRegistration;