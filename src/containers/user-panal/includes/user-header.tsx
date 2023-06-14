import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SiteLogo from '../../../assets/images/logo.png'
import SiteSubLogo from '../../../assets/images/tsgovt-logo.png'
import { LocalStorageManager } from '../../../lib/localStorage-manager';
import { tokenManager } from '../../../lib/token-manager';
import { RootState } from '../../../redux';
import { deleteDoctorInfo } from '../../../redux/doctor';

const Userheader = () => {
	const dispatch = useDispatch();
	const [isDoctorId, setISDoctorId] = useState(false);
	const [isDoctorFMRNo, setISDoctorFMRNo] = useState(false);
	const [isDoctorFMRapproved, setISDoctorFMRapproved] = useState(false);
	const signOut = () => {
		tokenManager.removeToken();
		LocalStorageManager.removeDoctorPrimaryId();
		LocalStorageManager.removeDoctorSerialId();
		LocalStorageManager.removeAdminPrimaryId();
		LocalStorageManager.removeDoctorFMRNo();
		LocalStorageManager.removeOrderKeyId();
		dispatch(deleteDoctorInfo);
	};

	useEffect(() => {
		const doctorSerialId = LocalStorageManager.getDoctorSerialId();
		if (doctorSerialId) {
			setISDoctorId(true);
		}
		const doctorFMRNo = LocalStorageManager.getDoctorFMRNo();
		if (doctorFMRNo) {
			setISDoctorFMRNo(true);
		}
		const doctorFMRstatus = LocalStorageManager.getDoctorFMRStatus();
		if(doctorFMRstatus === 'apr'){
			setISDoctorFMRapproved(true);
		}
		


	}, [isDoctorId, isDoctorFMRNo]);

	return (
		<>
			<header>
				<nav className="navbar navbar-expand-lg  tsmc-header">
					<div className="container">
						<div className='col-1'>
							<Link to="" className="navbar-brand tsmc-site-logo">
								<img src={SiteLogo} alt="Site Logo" className='mt-3'/>
							</Link>
						</div>
						<div>
							<h1 className="fs-22 fw-700 mb-0 text-light">Telangana State Medical Council</h1>
						</div>
						<button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#MainMenu" aria-controls="MainMenu">
							<i className="bi bi-list"></i>
						</button>
						<div className="offcanvas offcanvas-end" id="MainMenu" aria-labelledby="MainMenuLabel">
							<div className="offcanvas-header">
								<h5 className="offcanvas-title" id="MainMenuLabel">Menu</h5>
								<button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
							</div>
							<div className="offcanvas-body">
								<ul className="navbar-nav justify-content-center flex-grow-1 pe-3 tsmc-nav-items">
									<li className="nav-item"><Link to="/my-panal" className="nav-link" aria-current="page">My Profile</Link></li>
									<li className="nav-item dropdown">
										<Link to='' className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">New Registrations <i className='bi-chevron-down'></i></Link>
										<div className="dropdown-menu shadow">
											<li className='dropdown-submenu'>
												<p className="dropdown-item">Provisional</p>
												<ul className="dropdown-menu">
													{isDoctorId ? '' : 
													<p>
													<li><Link className="dropdown-item" to={'provisional-registration'}>New Registration</Link></li>
													<li><Link className="dropdown-item" to={isDoctorId ? '' : 'provisional-duplicate'}>Duplicate</Link></li>
													{/*<li><Link to='/my-panal/revalidation' className="dropdown-item">Provisional Revalidation</Link></li>*/} </p>	}
													
													
												</ul>
											</li>
											<li className='dropdown-submenu'>
												<p className="dropdown-item">Final Registration</p>
												<ul className="dropdown-menu">
													{isDoctorFMRNo ? '' : <li><Link className="dropdown-item" to={'final-registration'}>New Registration</Link></li>}
													<li><Link className="dropdown-item" to={isDoctorFMRNo ? '' : 'final-duplicate'}>Duplicate</Link></li>
												</ul>
											</li>
											{isDoctorFMRapproved ?
											<div>
											<li className='dropdown-submenu'>
											<Link to='additional-qualification-registration' className="dropdown-item">Additional Qualification</Link>
											<ul className="dropdown-menu">
												<li><Link className="dropdown-item" to={'additional-qualification-registration'}>New Registration</Link></li>
												<li><Link className="dropdown-item" to={'additional-duplicate'}>Duplicate</Link></li>
											</ul>
										</li>
										<li><Link to='/my-panal/good-standing-registration' className="dropdown-item">Good Standing</Link></li>
										<li><Link to='/my-panal/noc-registration' className="dropdown-item">NOC for Other State</Link></li>
										<li><Link to='/my-panal/final-renewal' className="dropdown-item">Final Renewals </Link></li>
										{/*<li><Link to='/my-panal/chnage-of-name' className="dropdown-item">Change of Name</Link></li>*/}
										</div> :''}
									
										</div>
									</li>
									<li className="nav-item"><Link to="/" className="nav-link" onClick={signOut} aria-current="page">Sign Out</Link></li>
								</ul>
							</div>
						</div>
						<Link to="" className="navbar-brand tsmc-site-logo tsmc-site-sub-logo">
							<img src={SiteSubLogo} alt="Site Logo" />
						</Link>
					</div>
				</nav>
			</header>
		</>
	)
}
export default Userheader;
