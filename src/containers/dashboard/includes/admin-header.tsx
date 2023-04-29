import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import SiteLogo from '../../../assets/images/logo.png'
import SiteSubLogo from '../../../assets/images/tsgovt-logo.png'
import Clock from '../../../components/clock';
import { adminService } from '../../../lib/api/admin';
import { LocalStorageManager } from '../../../lib/localStorage-manager';
import { AdminFormType } from '../../../types/admin';

const AdminHeader = () => {
	const [adminPrimaryId, setAdminPrimaryId] = useState(0);
	const [user, setUser] = useState<AdminFormType>();
	const getAdminProfile = useCallback(async () => {
        try {
            const adminPrimaryId = Number(LocalStorageManager.getAdminPrimaryId());
            if (adminPrimaryId) {
                setAdminPrimaryId(adminPrimaryId);
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
        <header className='tsmc-header'>
			<div className="container-fluid">
				<div className="row">
					<div className="col">
						<div className="d-flex align-items-center">
							<img src={SiteLogo} width="70" alt="" />
							<div className="ms-3">
								<h1 className="mb-0 fs-20 fw-700 tsmc-text-white">TELANGANA STATE MEDICAL COUNCIL</h1>
								<p className="fs-14 tsmc-text-white">
									<span className="fw-600">User:</span> {user?.username}
									<span className="fw-600 ms-2">Role:</span> {user?.role_name}
								</p>
							</div>
						</div>
					</div>
					<div className="col-auto">
						<div className="d-flex align-items-center">
							<div className="tsmc-datetime me-3 d-flex align-items-center justify-content-center">
								<div className="d-flex align-items-center justify-content-start">
									<i className="bi-calendar3 tsmc-text-primary fs-32"></i>
									<div className="ms-2">
										<h1 className="fs-20 fw-700 tsmc-text-primary mb-1"><Clock /></h1>
										<h2 className="fs-16 fw-400 tsmc-text-primary mb-0">{moment().format('ll')}</h2>
									</div>
								</div>
							</div>
							<img src={SiteSubLogo} width="70" alt="" />
						</div>
					</div>
				</div>
			</div>
		</header>
        </>
    )
}

export default AdminHeader;