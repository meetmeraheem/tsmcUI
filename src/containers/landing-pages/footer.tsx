import React from 'react'
import { Link } from 'react-router-dom'
import TermsConditions from './terms-conditions'

const LandingFooter = () => {
     return (
          <>
               <footer>
                    <div className="container">
                         <div className="row">
                              <div className="col">
                                   <div className="tsmc-home-links">
                                        <h2>Menu Links</h2>
                                        <ul>
                                             <li><Link to="">Home</Link></li>
                                             <li><Link to="">About Us</Link></li>
                                             <li><Link to="">Services</Link></li>
                                             <li><Link to="">Contact Us</Link></li>
                                        </ul>
                                   </div>
                              </div>
                              <div className="col">
                                   <div className="tsmc-home-links">
                                        <h2>Informative Links</h2>
                                        <ul>
                                             <li><Link to="">Services</Link></li>
                                             <li><Link to="">Notification</Link></li>
                                             <li><Link to="">Constitution</Link></li>
                                             <li><Link to="">Help & Support</Link></li>
                                             <li><Link to="">Press Release</Link></li>
                                        </ul>
                                   </div>
                              </div>
                              <div className="col">
                                   <div className="tsmc-home-links">
                                        <h2>Site Links</h2>
                                        <ul>
                                             <li><Link to={'/terms-and-conditions'}>Terms and Conditions</Link></li>
                                             <li><Link to={'/privacy-policy'}>Privacy Policy</Link></li>
                                             <li><Link to={'/refund'}>Refund</Link></li>
                                        </ul>
                                   </div>
                              </div>
                         </div>
                    </div>
               </footer>
          </>
     )
}

export default LandingFooter
