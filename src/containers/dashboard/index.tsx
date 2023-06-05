import { Navigate, useOutlet } from 'react-router-dom';
import { LocalStorageManager } from '../../lib/localStorage-manager';
import AdminFooter from "./includes/admin-footer";
import AdminHeader from "./includes/admin-header";
import AdminSideNav from './includes/admin-side-nav';

const AdminDashboard = () => {
    const outlet = useOutlet();
    const adminPrimaryId = Number(LocalStorageManager.getAdminPrimaryId());
    if(!adminPrimaryId){
        return <Navigate to="/" replace />;
    }
    else{
        return (
            <>
            <AdminHeader />
           
            <div >
               <AdminSideNav />
                <section >
                    {outlet}
                </section>
            </div>
            <AdminFooter />
            </>
        )
    }
}

export default AdminDashboard;