import React from 'react'
import { Link } from 'react-router-dom';
import DocDefultPic from '../../../assets/images/doc-default-img.jpg';

const Userleftnav = () => {
    return (
        <>
            <div className="tsmc-doc-profile-box">
                <div className='tsmc-doc-img mb-3'>
                    <img src={DocDefultPic} alt="" />
                </div>
                <h2 className='fs-16 fw-600'>Konda Venkata Vamshi Das</h2>
                <p>M.B.B.S, M.D</p>
            </div>
            <div className="list-group list-group-flush">
                <Link to='/my-panal/provisional' className="list-group-item list-group-item-action ps-2">
                    <i className="bi-mortarboard"></i> Provisional Details
                </Link>
                <Link to='/my-panal/final-registration' className="list-group-item list-group-item-action ps-2">
                    <i className="bi-person"></i> Final Details
                </Link>
                <Link to='/my-panal/additional-qualification' className="list-group-item list-group-item-action ps-2">
                    <i className="bi-mortarboard"></i> Additional Qualification Details
                </Link>
                <Link to='/my-panal/final-renewal' className="list-group-item list-group-item-action ps-2">
                    <i className="bi-arrow-clockwise"></i> Final Renewal Details
                </Link>
                <Link to='/my-panal/noc' className="list-group-item list-group-item-action ps-2">
                    <i className="bi-person-check"></i> NOC Details
                </Link>
                <Link to='/my-panal/good-standing' className="list-group-item list-group-item-action ps-2">
                    <i className="bi-file-person"></i> Good Standing Details
                </Link>
                <Link to='/my-panal/good-standing-mci' className="list-group-item list-group-item-action ps-2">
                    <i className="bi-card-checklist"></i> Good Standing MCI Details
                </Link>
                <Link to='/my-panal/temporary-registration' className="list-group-item list-group-item-action ps-2">
                    <i className="bi-calendar2-week"></i> Temporary Registration Details
                </Link>
            </div>
        </>
    )
}
export default Userleftnav;
  