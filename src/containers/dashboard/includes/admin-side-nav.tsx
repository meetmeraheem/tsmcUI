import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { Link } from "react-router-dom";
import { LocalStorageManager } from "../../../lib/localStorage-manager";
import { tokenManager } from "../../../lib/token-manager";
import { deleteDoctorInfo } from "../../../redux/doctor";
import { useLocation } from "react-router-dom";
import { routes } from "../../routes/routes-names";
import { useCallback, useEffect, useState } from "react";
import { AdminFormType } from "../../../types/admin";
import { adminService } from "../../../lib/api/admin";

const AdminSideNav = () => {
	const location = useLocation();
	const activeTab = location.pathname;
	const signOut = () => {
		tokenManager.removeToken();
		LocalStorageManager.removeDoctorPrimaryId();
		LocalStorageManager.removeDoctorSerialId();
		LocalStorageManager.removeAdminPrimaryId();
		LocalStorageManager.removeDoctorFMRNo();
		LocalStorageManager.removeUserType();
		dispatch(deleteDoctorInfo);
	};

	//const [adminPrimaryId, setAdminPrimaryId] = useState(0);
	const [user, setUser] = useState<AdminFormType>();
	const getAdminProfile = useCallback(async () => {
		try {
			const adminPrimaryId = Number(LocalStorageManager.getAdminPrimaryId());
			if (adminPrimaryId) {
				//setAdminPrimaryId(adminPrimaryId);
				const getUser = await adminService.getAdminById(adminPrimaryId);
				if (getUser.data.length > 0) {
					setUser(getUser.data[0])
				}
			}
		} catch (err: any) {
			console.log('candidateService getProfile error', err.response);
		} finally {
			//setLoading(false);
		}
	}, [user]);

	useEffect(() => {
		getAdminProfile();
	}, []);

	return (
		<>
			<aside>
				<ul className="nav flex-column">
					{user?.user_type === 'a' 
						&&
						<><li className="nav-item">
							<Link className={activeTab === routes.admin_dashboard ? 'nav-link active' : 'nav-link'} to={'/admin'}><i className="bi-columns-gap me-2"></i> Dashboard</Link>
							</li>
							<li className="nav-items">
								<Link className={(activeTab === routes.provisional_registrations || activeTab === routes.admin_provisional_view) ? 'nav-link active' : 'nav-link'} to={"/admin/provisional_registrations"}><i className="bi-mortarboard"></i> Provisional</Link>
							</li><li className="nav-items">
								<Link className={(activeTab === routes.admin_final_registrations || activeTab === routes.admin_final_reg_view) ? 'nav-link active' : 'nav-link'} to={"/admin/final_registrations"}><i className="bi-person"></i> Final</Link>
							</li><li className="nav-items">
								<Link className={activeTab === routes.admin_additional ? 'nav-link active' : 'nav-link'} to={"/admin/admin_additional"}><i className="bi-file-person"></i> Additional Qualifications</Link>
							</li>
							<li className="nav-items">
								<Link className={activeTab === routes.admin_noc ? 'nav-link active' : 'nav-link'} to={"/admin/noc"}><i className="bi-person-check"></i> NOC</Link>
							</li>
							<li className="nav-items">
								<Link className={activeTab === routes.admin_goodstanding ? 'nav-link active' : 'nav-link'} to={"/admin/admin_goodstanding"}><i className="bi-file-person"></i> Good Standing</Link>
							</li>
							<li className="nav-items">
								<Link className={activeTab === routes.admin_renewals ? 'nav-link active' : 'nav-link'} to={"/admin/admin_renewals"}><i className="bi-file-person"></i> Final Renewals</Link>
							</li>
							
							{/*<li className="nav-items">
								<Link className={activeTab === routes.admin_goodstanding_mci ? 'nav-link active' : 'nav-link'} to={"/admin/admin_goodstanding_mci"}><i className="bi-file-person"></i> Good Standing MCI</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to={'/admin/employees-works'}><i className="bi-briefcase me-2"></i> User Management</Link>
							</li>*/}</>
					}
					{user?.user_type === 'u' &&
						<><li className="nav-item">
							<Link className="nav-link d-flex justify-content-between" to={'/admin/my-work-items'}>
								<div><i className="bi-card-checklist me-2"></i><span>My Work Items</span></div>
								<span className="badge rounded-pill text-bg-danger d-flex align-self-end">10+</span>
							</Link>
						</li><li className="nav-item">
								<Link className="nav-link" to={'/admin/settings'}><i className="bi-lock me-2"></i> Change Password</Link>
							</li></>
					}
					<li className="nav-item">
						<Link className="nav-link" to="/login" onClick={signOut}><i className="bi-box-arrow-right me-2"></i> Logout</Link>
					</li>
				</ul>
			</aside>
		</>
	)
}

export default AdminSideNav;

function dispatch(deleteDoctorInfo: ActionCreatorWithoutPayload<"doctorInfo/deleteDoctorInfo">) {
	throw new Error("Function not implemented.");
}
