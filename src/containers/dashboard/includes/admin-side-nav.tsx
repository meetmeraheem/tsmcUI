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
import TopNav from "../../dashboard/includes/admin-top-nav";
 import AdminDashboardHome from "../dashboard";
 import  ChairmanLayout from "../../Chairman/ChairmanLayout";
 import DispatchLayout from "../../dispatch/dispatchLayout";
 import FMRSearchLayout from "../../FmrEntry/FMRSearchLayout";
const AdminSideNav = () => {
	const location = useLocation();
	const activeTab = location.pathname;
	

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
			
				<div >
					{user?.user_type === 'a' 
						&&<AdminDashboardHome />
					}
					{user?.user_type === 'u' &&
					<TopNav/>
					}
						{user?.user_type === 'c' &&
					<ChairmanLayout/>
					}
						{user?.user_type === 'd' &&
					<DispatchLayout></DispatchLayout>
					}

					{user?.user_type === 'f' &&
					<FMRSearchLayout></FMRSearchLayout>
					}

					
				</div>
			
		</>
	)
}

export default AdminSideNav;

function dispatch(deleteDoctorInfo: ActionCreatorWithoutPayload<"doctorInfo/deleteDoctorInfo">) {
	throw new Error("Function not implemented.");
}
