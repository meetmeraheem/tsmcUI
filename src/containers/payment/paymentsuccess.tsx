import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import moment from "moment";
import { commonService } from "../../lib/api/common";
import { provisionalService } from "../../lib/api/provisional";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import { Serials } from "../../types/common";
import { doctorService } from "../../lib/api/doctot";
import { authService } from "../../lib/api/auth";
import { routes } from "../routes/routes-names";
import Swal from "sweetalert2";

const PaymentSuccess = () => {
    const search = useLocation().search;
    const orderId = new URLSearchParams(search).get('orderid');
    const navigate = useNavigate();
    console.log('orderId ' + orderId);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const orderKeyId = LocalStorageManager.getOrderKeyId();
                console.log('orderKeyId ----: ' + orderKeyId);
                const data = await commonService.orderDetails(orderKeyId, '31921');
                console.log('order details ----: ' + JSON.stringify(data));
                if (data) {
                    const provisionalInfo = secureLocalStorage.getItem("provisionalInfo");
                    const pc = secureLocalStorage.getItem("pc");
                    const af = secureLocalStorage.getItem("af");
                    const noc = secureLocalStorage.getItem("noc");

                    const formData = new FormData();
                    formData.append("provisionalInfo", JSON.stringify(provisionalInfo));
                    if (pc) {
                        formData.append("pc", pc as File);
                    }
                    if (af) {
                        formData.append("af", af as File);
                    }
                    if (noc) {
                        formData.append("noc", noc as File);
                    }

                    const { success } = await provisionalService.provisionalRegistration(formData);
                    if (success) {
                        const { data } = await commonService.getMtSerials('DPD');
                        if (data) {
                            await commonService.updateMtSerials(
                                {
                                    ...data,
                                    created_date: moment(data.created_date).format('YYYY-MM-DD h:mm:ss'),
                                    serial_starts: Number(data.serial_starts) + 1
                                }
                            );
                        }

                        const { data: pr } = await commonService.getMtSerials('PR');
                        if (pr) {
                            await commonService.updateMtSerials(
                                {
                                    ...pr,
                                    created_date: moment(pr.created_date).format('YYYY-MM-DD h:mm:ss'),
                                    serial_starts: Number(pr.serial_starts) + 1
                                }
                            );
                        }
                        const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());
                        doctorPrimaryId && await doctorService.updateDoctorIdPmrId(doctorPrimaryId, Number(data.serial_starts) + 1, Number(pr.serial_starts) + 1);
                        LocalStorageManager.setDoctorSerialId((Number(data.serial_starts) + 1).toString());
                        secureLocalStorage.removeItem("pc");
                        secureLocalStorage.removeItem("af");
                        secureLocalStorage.removeItem("noc");
                        const doctorMobileno = LocalStorageManager.getDoctorMobileno();
                        if (doctorMobileno) {
                            await authService.sendSMS(doctorMobileno, 'Your Application Submitted for Provisional Medical Registration to Telangana State Medical Council is under Process.').then((response) => {

                            }).catch(() => {

                            });
                        }
                        Swal.fire({
                            title: "Success",
                            text: "Provisional Successfully Registered",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // navigate(routes.userpanal);
                            }
                        });
                    }
                    setPaymentSuccess(true);
                }
                else {
                    setPaymentSuccess(false);
                }
            } catch (error) {
                setPaymentSuccess(false);
                console.log('error --------- ' + error);
            }

        })();
    }, []);

    return (
        <>
            <section className='gray-banner'>
                <div className="container vh-75 d-flex align-items-center justify-content-center">
                    {/* Payment Success message */}
                    {paymentSuccess &&
                        <div className="col-5">
                            <div className="card shadow border-0 p-4">
                                <div className="card-body">
                                    <div className="w-100 text-center">
                                        <i className="bi-check-circle fs-42 text-success"></i>
                                        <h1 className='fs-22 fw-700'>Payment Success</h1>
                                    </div>
                                    <div className="px-3 text-center">
                                        <p className="mb-3">Your application successfully submitted to <br /> Telangana State Medical Council</p>
                                        <hr className="my-4" />
                                        <button type="button" onClick={() => { navigate(routes.userpanal); }} className="btn btn-primary">Back to Profile</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {/* Payment Error message */}
                    {!paymentSuccess &&
                        <div className="col-5">
                            <div className="card shadow border-0 p-4">
                                <div className="card-body">
                                    <div className="w-100 text-center">
                                        <i className="bi-x-circle fs-42 text-danger"></i>
                                        <h1 className='fs-22 fw-700'>Payment Error</h1>
                                    </div>
                                    <div className="px-3 text-center">
                                        <p className="mb-3">Opps..! <br />Something want wornge</p>
                                        <hr className="my-4" />
                                        <button type="button" onClick={() => { navigate(routes.userpanal); }} className="btn btn-primary">Back to Profile</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </section>
        </>
    )
};

export default PaymentSuccess;