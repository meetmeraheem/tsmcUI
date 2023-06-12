import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';

import { routes } from './routes-names';
import ScrollToTop from './scroll-to-top';
import UserPanal from '../user-panal/index';
import MainHomePage from '../landing-pages';
import Logout from '../landing-pages/logout';
import ContactUs from '../landing-pages/contact-us';
import HomePage from '../landing-pages/home';
import Newregistration from '../registration/new-registration';
import Myprofile from '../user-panal/my-profile';
import Provisional from '../user-panal/provisional-registration';
import ProvisionalDuplicate from '../user-panal/duplicates/provisional-duplicate';
import FinalRegistration from '../user-panal/final-registration';
import AdditionalQualificationRegistration from '../user-panal/additional-qualification';
import EditAdditionalQualificationRegistration from '../user-panal/edit-additional-qualification';
import TemporaryRegistration from '../user-panal/temporary-registration';
import NocRegistration from '../user-panal/noc';
import EditNocView from '../user-panal/edit-noc';

import GoodStandingMciRegistration from '../user-panal/good-standing-mci';
import FinalRenewals from '../user-panal/final-renewal';
import GoodStandingRegistration from '../user-panal/good-standing';
import FinalDuplicate from '../user-panal/duplicates/final-duplicate';
import AdditionalDuplicate from '../user-panal/duplicates/additional-duplicate';
import AdminDashboard from '../dashboard';
import AdminDashboardHome from '../dashboard/dashboard';
import MyWorkItems from '../dashboard/my-work-items';
import EmployesWorks from '../dashboard/employes-work';
import AdminNotifications from '../dashboard/notifications';
import AdminSettings from '../dashboard/settings';
import AdminLogout from '../dashboard/logout';
import ProvisionalRegistrations from '../dashboard/provisional-registrations';
import AdminLogin from '../dashboard/login';
import UserEditProfile from '../user-panal/edit-profile';
import Payment from '../payment/payment';
import PaymentSuccess from '../payment/paymentsuccess';
import EditProvisional from '../user-panal/edit-provisional';
import EditFinal from '../user-panal/edit-final';
import ProvisionalView from '../dashboard/provisional-view';
import AdditionalRegList from '../dashboard/additional-registrations';
import AdditionalView from '../dashboard/additional-view';
import RenewalRegList from '../dashboard/renewal-registrations';
import RenewalView from '../dashboard/renewals-view';

import GoodStandingRegList from '../dashboard/goodstanding-registrations';
import GoodStandingMCIView from '../dashboard/mci';
import GoodStandingView from '../dashboard/goodstanding-view';
import NocRegList from '../dashboard/noc-registrations';
import NocView from '../dashboard/noc-view';
import FinalRegView from '../dashboard/final-reg-view';
import FinalRegistrations from '../dashboard/final-registration';
import PaymentFailure from '../payment/paymentfailure';
import PrivacyPolicy from '../landing-pages/privacy-policy';
import TermsConditions from '../landing-pages/terms-conditions';
import Refund from '../landing-pages/refund';
import ChangeofNameRegistration from '../user-panal/change-of-name';
import ProvisionalRevalidation from '../user-panal/provisional-revalidation';

	


const MainRoute = () => {
	return (
		

		<Router>
			<ScrollToTop />
		
			<Routes>
		
				<Route path={routes.main} element={<MainHomePage />}>
					<Route path={routes.main} element={<HomePage />} />
					<Route path={routes.home} element={<HomePage />} />
					<Route path={routes.privacy_policy} element={<PrivacyPolicy />} />
					<Route path={routes.terms_and_conditions} element={<TermsConditions />} />
					<Route path={routes.refund} element={<Refund />} />
					<Route path={routes.logout} element={<Logout />} />
					<Route path={routes.contact_us} element={<ContactUs />} />
				</Route>
				<Route path={routes.admin_login} element={<AdminLogin />} />
				<Route path={routes.newregistration} element={<Newregistration />} />
				<Route path={routes.payment} element={<Payment />} />
				<Route path={routes.paymentsuccess} element={<PaymentSuccess />} />
				<Route path={routes.payment_failure} element={<PaymentFailure />} />
				<Route path={routes.paymenterror} element={<PaymentSuccess />} />
				<Route path={routes.userpanal} element={<UserPanal />}>
					<Route path={routes.userpanal} element={<Myprofile />} />
					<Route path={routes.usereditprofile} element={<UserEditProfile />} />
					<Route path={routes.provisional_registration} element={<Provisional />} />
					<Route path={routes.provisional_edit} element={<EditProvisional />} />
					<Route path={routes.provisional_duplicate} element={<ProvisionalDuplicate />} />
					<Route path={routes.final_registration} element={<FinalRegistration />} />
					<Route path={routes.final_edit} element={<EditFinal />} />
					<Route path={routes.final_duplicate} element={<FinalDuplicate />} />
					<Route path={routes.additional_qualification_registration} element={<AdditionalQualificationRegistration />} />
					<Route path={routes.edit_additional_qualification_registration} element={<EditAdditionalQualificationRegistration />} />
					<Route path={routes.additional_duplicate} element={<AdditionalDuplicate />} />
					<Route path={routes.temporary_registration} element={<TemporaryRegistration />} />
					<Route path={routes.noc_registration} element={<NocRegistration />} />
					<Route path={routes.noc_registration_edit} element={<EditNocView />} />
					<Route path={routes.good_standing_registration} element={<GoodStandingRegistration />} />
					<Route path={routes.good_standing_mci_registration} element={<GoodStandingMciRegistration />} />
					<Route path={routes.final_registration} element={<FinalRegistration />} />
					<Route path={routes.final_renewal} element={<FinalRenewals />} />
					<Route path={routes.change_of_name} element={<ChangeofNameRegistration />} />
					<Route path={routes.prov_revalidation} element={<ProvisionalRevalidation />} />
				</Route>
				<Route path={routes.admin_dashboard} element={<AdminDashboard />}>
					<Route path={routes.provisional_registrations} element={<ProvisionalRegistrations />} />
					<Route path={routes.admin_final_registrations} element={<FinalRegistrations />} />
					<Route path={routes.admin_provisional_view} element={<ProvisionalView />} />
					<Route path={routes.admin_additional} element={<AdditionalRegList />} />
					<Route path={routes.admin_renewals} element={<RenewalRegList />} />
					<Route path={routes.admin_goodstanding} element={<GoodStandingRegList />} />
					<Route path={routes.admin_goodstanding_mci} element={<GoodStandingMCIView />} />
					<Route path={routes.admin_goodstanding_view} element={<GoodStandingView />} />
					<Route path={routes.admin_noc} element={<NocRegList />} />
					<Route path={routes.admin_final_reg_view} element={<FinalRegView />} />
					<Route path={routes.admin_noc_reg_view} element={<NocView />} />
					<Route path={routes.admin_additional_reg_view} element={<AdditionalView/>} />
					<Route path={routes.admin_renewals_reg_view} element={<RenewalView/>} />
					<Route path={routes.admin_my_work_items} element={<MyWorkItems />} />
					<Route path={routes.admin_employes_works} element={<EmployesWorks />} />
					<Route path={routes.admin_notifications} element={<AdminNotifications />} />
					<Route path={routes.admin_settings} element={<AdminSettings />} />
					<Route path={routes.admin_logout} element={<AdminLogout />} />



				</Route>
			</Routes>
		</Router>
	);
};

export default MainRoute;
