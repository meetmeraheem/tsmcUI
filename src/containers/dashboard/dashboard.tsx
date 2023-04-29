
const AdminDashboardHome = () => {
    return (
        <>
            <div className="container-fluid">
                {/* Top overal matrics */}
                <div className="row mb-4">
                    <div className="col">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h2 className="fs-16 fw-600">New Registrations <i className="bi-info-circle"></i></h2>
                                <div className="d-flex align-items-center">
                                    <div className="p-2 w-100">
                                        <div className="card-icon-box">
                                            <i className="bi-person fs-32"></i>
                                        </div>
                                    </div>
                                    <div className="p-2 flex-shrink-1">
                                        <h2 className="fs-32 fw-600 tsmc-typo-secondary">250</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h2 className="fs-16 fw-600">Pending Registrations <i className="bi-info-circle"></i></h2>
                                <div className="d-flex align-items-center">
                                    <div className="p-2 w-100">
                                        <div className="card-icon-box">
                                            <i className="bi-exclamation-square fs-32"></i>
                                        </div>
                                    </div>
                                    <div className="p-2 flex-shrink-1">
                                        <h2 className="fs-32 fw-600 tsmc-typo-secondary">250</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h2 className="fs-16 fw-600">Tatkal Registrations <i className="bi-info-circle"></i></h2>
                                <div className="d-flex align-items-center">
                                    <div className="p-2 w-100">
                                        <div className="card-icon-box">
                                            <i className="bi-stopwatch fs-32"></i>
                                        </div>
                                    </div>
                                    <div className="p-2 flex-shrink-1">
                                        <h2 className="fs-32 fw-600 tsmc-typo-secondary">250</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h2 className="fs-16 fw-600">Total Payments <i className="bi-info-circle"></i></h2>
                                <div className="d-flex align-items-center">
                                    <div className="p-2 w-100">
                                        <div className="card-icon-box">
                                            <i className="bi-currency-rupee fs-32"></i>
                                        </div>
                                    </div>
                                    <div className="p-2 flex-shrink-1">
                                        <h2 className="fs-32 fw-600 tsmc-typo-secondary">2,50,000</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminDashboardHome;