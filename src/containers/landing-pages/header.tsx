import React from 'react'
import { Link } from 'react-router-dom';
import SiteLogo from '../../assets/images/logo.png'
import SiteSubLogo from '../../assets/images/tsgovt-logo.png'
import { serverUrl, serverImgUrl } from '../../config/constants';


const LandingHeader = () => {
	return (
		<>
			<header>
				<nav className="navbar navbar-expand-lg bg-light tsmc-header py-3">
					<div className="container">
						<div className='col-1'>
							<Link to="" className="navbar-brand tsmc-site-logo">
								<img src={SiteLogo} alt="Site Logo" className='mt-3' />
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
									<li className="nav-item"><Link to="/" className="nav-link" aria-current="page">Home</Link></li>
									<li className="nav-item"><Link to="/contact-us" className="nav-link">Contact Us</Link></li>
									<li className="nav-item"><a href={serverImgUrl + 'userdocs/userInstructions.pdf'} className="nav-link"  target="_blank">Help </a></li>
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

export default LandingHeader
