import { Navigate, useOutlet } from 'react-router-dom';
import { LocalStorageManager } from '../../lib/localStorage-manager';
import Userfooter from './includes/user-footer';
import UserHeader from './includes/user-header';

// type Props = {
//     isLoggedIn: boolean;
// };

//const UserPanal: React.FC<Props> = ({ isLoggedIn }) => {
const UserPanal = () => {
    const outlet = useOutlet();
    const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());
    if (!doctorPrimaryId) {
        return <Navigate to="/" replace />;
    }
    else{
        return (
            <>
                <UserHeader />
                <div>{outlet}</div>
                <Userfooter />
            </>
        );
    }
};

export default UserPanal;