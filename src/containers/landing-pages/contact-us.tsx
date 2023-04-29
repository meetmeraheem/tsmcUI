import React from 'react'
import { Link } from 'react-router-dom'

const ContactUs = () => {
    return (
         <>
          <section className='gray-banner d-flex align-items-center justify-content-center'>
				<div className="card col-6 m-auto border-0 shadow-sm">
					<div className='card-body'>
						<div className="w-100 text-center border-bottom mb-3">
							<h1 className='fs-20 fw-700'>Contact Us</h1>
						</div>
						<form action="">
							<div className="row">
								<div className="col">
									<div className="form-floating mb-3">
										<input type="text" className="form-control" id="Fullname" placeholder="Enter Fullname" />
										<label htmlFor="Fullname"><i className="bi-person"></i> Enter Fullname</label>
									</div>
								</div>
								<div className="col">
									<div className="form-floating mb-3">
										<input type="text" className="form-control" id="Mobile" placeholder="Enter Mobile" />
										<label htmlFor="Mobile"><i className="bi-phone"></i> Enter Mobile</label>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<div className="form-floating mb-3">
										<input type="email" className="form-control" id="Emailid" placeholder="Enter Email Address" />
										<label htmlFor="Emailid"><i className="bi-at"></i> Enter Email Address</label>
									</div>
								</div>
								<div className="col">
									<div className="form-floating mb-3">
										<input type="text" className="form-control" id="RegNo" placeholder="Enter RegNo" />
										<label htmlFor="RegNo"><i className="bi-lock"></i> Enter Provisional / Final Registration No</label>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<div className="form-floating mb-3">
										<input type="text" className="form-control" id="AadharNo" placeholder="Enter Aadhar No" />
										<label htmlFor="AadharNo"><i className="bi-person-vcard"></i> Enter Aadhar No</label>
									</div>
								</div>
								<div className="col">
									
								</div>
							</div>
							<hr />
							<div className="row mb-3">
								<div className="col">
									<label htmlFor="" className='mb-3'>Upload Provisional / Final Registration Copy</label>
									<input type="file" className="form-control" name='provifinalcopy' id="ProviFinalCopy" />
								</div>
								<div className="col">
									<label htmlFor="" className='mb-3'>Upload Aadhar Card Copy</label>
									<input type="file" className="form-control" name='aadharcardcopy' id="AadharCardCopy" />
								</div>
							</div>
							<Link to={"/my-panal/"} className='btn btn-primary btn-lg w-100 mb-3'>Submit</Link>
							<p className='fs-12 text-center mb-3'>By clicking Submit, you agree to the TSMC <a href=".">Terms & Conditions</a>,<br /> <a href=".">Privacy Policy and Cookie Policy.</a></p>
						</form>
					</div>
				</div>
			</section>
         </>
    )
}

export default ContactUs