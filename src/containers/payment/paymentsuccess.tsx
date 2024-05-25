import { useCallback, useEffect, useState,useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { ProvisionalFormType, ProvisionalPaymentProfileType } from "../../types/provisional";
import { FinalFormType, FinalPaymentFormType } from "../../types/final";
import { finalService } from "../../lib/api/final";
import { additionalService } from '../../lib/api/additional';
import { nocUserFormType } from "../../types/noc";
import { AddQualFormType } from '../../types/additionalQuali';
import { nocService } from "../../lib/api/noc";
import { goodStandingFormType } from "../../types/common";
import { goodstandingService } from "../../lib/api/goodstanding";
import { renewalsFormType } from "../../types/common";
import { renewalService } from "../../lib/api/renewals";
import { changeofnameService } from "../../lib/api/changeofname";
import { changeOfNameType } from "../../types/common";
import { revalidationService } from "../../lib/api/revalidation";
import  DoctorInfoSuccess from './../../containers/user-panal/includes/doctor-info-success'
import SiteLogo from '../../assets/images/logo.png'
import SiteSubLogo from '../../assets/images/tsgovt-logo.png'
import { Link } from 'react-router-dom';
import FinalRegPrint from'../../containers/user-panal/printouts/final-reg-print';
import AdditionalRegViewPrint from'../../containers/user-panal/printouts/additional-view-print';
import RenewalsViewPrint from'../../containers/user-panal/printouts/renewals-view-print';
import NocRegViewPrint from'../../containers/user-panal/printouts/noc-view-print';
import GoodStandingRegPrintView from '../../containers/user-panal/printouts/goodstanding-view-print';
import ProvisionalViewPrint from '../../containers/user-panal/printouts/provisional-view-print';
import ReactToPrint from 'react-to-print';
import  './../../assets/styles/styles.css';


const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const finalcomponentRef = useRef<HTMLDivElement>(null);
    const additionalcomponentRef = useRef<HTMLDivElement>(null);
    const renewlcomponentRef = useRef<HTMLDivElement>(null);
    const noccomponentRef = useRef<HTMLDivElement>(null);
    const gscomponentRef = useRef<HTMLDivElement>(null);
    const provisionalcomponentRef = useRef<HTMLDivElement>(null);   
    const [isLoader, setIsLoader] = useState(true);
    const [doctorSerialNumber, setDoctorSerialNumber] = useState(0);
    const [pmrSerialNumber, setPMRSerialNumber] = useState(0);
    const [fmrSerialNumber, setFMRSerialNumber] = useState(0);
    const [transactionMsg, setTransactionMsg] = useState('');
    const [finalId, setFinalId] = useState(0);
    const [finalreqType, setFinalreqType] = useState("");
    const [additionalId, setAdditionalId] = useState(0);
    const [additionalreqType, setAdditionalreqType] = useState("");
    const [renewalId, setRenewalId] = useState(0);
    const [gsId, setGsId] = useState(0);
    const [nocId, setNocId] = useState(0);
    const [provisionalId, setProvisionalId] = useState(0);
    const [isPrinting, setIsPrinting] = useState(false);


    useEffect(() => {
        (async () => {

            try {
                setIsLoader(true);
                const respOrderKeyId = LocalStorageManager.getOrderKeyId();
                if (LocalStorageManager.getDoctorSerialId() != null) {
                    const doctorId = Number(LocalStorageManager.getDoctorSerialId());
                    setDoctorSerialNumber(doctorId);
                }
                const regType = secureLocalStorage.getItem("regType");
                console.log('orderKeyId ----: ' + respOrderKeyId);

                if (regType === 'provisional') {
                    const provisionalInfo = secureLocalStorage.getItem("provisionalInfo");
                    const provisionalPaymentInfo = {
                        ...provisionalInfo as ProvisionalPaymentProfileType,
                        orderKeyId: respOrderKeyId

                    }
                    const formData = new FormData();
                    formData.append("provisionalInfo", JSON.stringify(provisionalPaymentInfo));
                    const pc = secureLocalStorage.getItem("pcName");
                    const af = secureLocalStorage.getItem("afName");
                    const noc = secureLocalStorage.getItem("nocName");

                    console.log('pc', pc);
                    console.log('af', af);
                    console.log('noc', noc);
                    if (pc) {
                        formData.append("pc", pc as string);
                    }
                    if (af) {
                        formData.append("af", af as string);
                    }
                    if (noc) {
                        formData.append("noc", noc as string);
                    }

                    const { success, data, message } = await provisionalService.provisionalRegistration(formData);
                    if (success) {
                        
                        if (data && data.doctorId !== null) {
                            LocalStorageManager.setDoctorSerialId(data.doctorId.toString());
                            setProvisionalId(data.id);
                        }
                        
                        setIsLoader(false);
                        setTransactionMsg(message);
                        const element = document.getElementById("msgId") as HTMLElement;
                        element.innerHTML = message;
                        
                        secureLocalStorage.removeItem("provisionalInfo");
                        secureLocalStorage.removeItem("pcName");
                        secureLocalStorage.removeItem("afName");
                        secureLocalStorage.removeItem("nocName");
                        const doctorMobileno = LocalStorageManager.getDoctorMobileno();


                        if (doctorMobileno) {
                            await authService.sendConfirmation(doctorMobileno, 'ProvisionalRegistration').then((response) => {
                            }).catch(() => {
                            });
                        }
                        Swal.fire({
                            title: "Success",
                            text: "Provisional registration successfully completed",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // navigate(routes.userpanal);
                            }
                        });
                    } else {
                        setIsLoader(false);
                        setTransactionMsg(message);
                        const element = document.getElementById("msgId") as HTMLElement;
                        element.innerHTML = message;
                    }
                }

                if (regType === 'final') {
                    const finalInfo = secureLocalStorage.getItem("finalInfo");
                    const finalPaymentInfo = {
                        ...finalInfo as FinalPaymentFormType,
                        orderKeyId: respOrderKeyId
                    }
                    const formData = new FormData();
                    formData.append("finalInfo", JSON.stringify(finalPaymentInfo));
                    const af = secureLocalStorage.getItem("afName");
                    const mbbs = secureLocalStorage.getItem("mbbsName");
                    const noc = secureLocalStorage.getItem("nocName");
                    const affidavit = secureLocalStorage.getItem("affidivitName");
                    const testimonal1 = secureLocalStorage.getItem("testimonal1Name");
                    const testimonal2 = secureLocalStorage.getItem("testimonal2Name");
                    const regOfOtherState = secureLocalStorage.getItem("regOtherStateName");
                    const screeningTestPass = secureLocalStorage.getItem("screenTestName");
                    const internshipComp = secureLocalStorage.getItem("internshipCompName");
                    const mciEligibility = secureLocalStorage.getItem("mciEligibilityName");
                    const interVerification = secureLocalStorage.getItem("interVerificationName");
                    const mciReg = secureLocalStorage.getItem("mciRegName");
                    const imr = secureLocalStorage.getItem("imrName");

                    if (af) {
                        formData.append("af", af as string);
                    }
                    if (mbbs) {
                        formData.append("mbbs", mbbs as string);
                    }
                    if (noc) {
                        formData.append("noc", noc as string);
                    }
                    if (affidavit) {
                        formData.append("affidivit", affidavit as string);
                    }
                    if (testimonal1) {
                        formData.append("testimonal1", testimonal1 as string);
                    }
                    if (testimonal2) {
                        formData.append("testimonal2", testimonal2 as string);
                    }
                    if (regOfOtherState) {
                        formData.append("regOfOtherState", regOfOtherState as string);
                    }
                    if (screeningTestPass) {
                        formData.append("screeningTestPass", screeningTestPass as string);
                    }
                    if (internshipComp) {
                        formData.append("internshipComp", internshipComp as string);
                    }
                    if (mciEligibility) {
                        formData.append("mciEligibility", mciEligibility as string);
                    }
                    if (interVerification) {
                        formData.append("interVerification", interVerification as string);
                    }
                    if (mciReg) {
                        formData.append("mciReg", mciReg as string);
                    }
                    if (imr) {
                        formData.append("imr", imr as string);
                    }
                    const { success, data, message } = await finalService.finalRegistration(formData);
                    if (success) {

                        if (data && data.doctorId !== null) {
                            LocalStorageManager.setDoctorSerialId(data.doctorId.toString());
                            setFinalId(data.id);
                            setFinalreqType(data.extraCol1);
                        }

                        setIsLoader(false);
                        setTransactionMsg(message);
                        const element = document.getElementById("msgId") as HTMLElement;
                        element.innerHTML = message;
                        secureLocalStorage.removeItem("finalInfo");
                        secureLocalStorage.removeItem("afName");
                        secureLocalStorage.removeItem("mbbsName");
                        secureLocalStorage.removeItem("nocName");
                        secureLocalStorage.removeItem("affidivitName");
                        secureLocalStorage.removeItem("testimonal1Name");
                        secureLocalStorage.removeItem("testimonal2Name");
                        secureLocalStorage.removeItem("regOtherStateName");
                        secureLocalStorage.removeItem("screenTestName");
                        secureLocalStorage.removeItem("internshipCompName");
                        secureLocalStorage.removeItem("mciEligibilityName");
                        secureLocalStorage.removeItem("interVerificationName");
                        secureLocalStorage.removeItem("mciRegName");
                        secureLocalStorage.removeItem("imrName");
                        Swal.fire({
                            title: "Success",
                            text: "Final registration successfully completed",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                const doctorMobileno = LocalStorageManager.getDoctorMobileno();
                                if (doctorMobileno) {
                                    await authService.sendConfirmation(doctorMobileno, 'FinalRegistration').then((response) => {
                                    }).catch(() => {
                                    });
                                }
                            }
                        });
                    } else {
                        setIsLoader(false);
                        setTransactionMsg(message);
                        const element = document.getElementById("msgId") as HTMLElement;
                        element.innerHTML = message;
                    }
                }
                if (regType === 'additionalInfo') {
                    const additionalInfo = secureLocalStorage.getItem("additionalInfo");
                    const additionalDataPaymentInfo = {
                        ...additionalInfo as AddQualFormType,
                        orderKeyId: respOrderKeyId
                    }
                    const formData = new FormData();
                    formData.append("additionalInfo", JSON.stringify(additionalDataPaymentInfo));
                    const additional_study = secureLocalStorage.getItem("additional_study_name");
                    const additional_Degree = secureLocalStorage.getItem("additional_Degree_name");

                    if (additional_study) {
                        formData.append("study", additional_study as string);
                    }
                    if (additional_Degree) {
                        formData.append("Degree", additional_Degree as string);
                    }
                    const { success,data, message } = await additionalService.additionalRegistration(formData);
                    if (success) {
                        setIsLoader(false);
                        setTransactionMsg(message);
                        setAdditionalId(data.id);
                        setAdditionalreqType(data.extraCol1);
                        const element = document.getElementById("msgId") as HTMLElement;
                        element.innerHTML = message;
                        secureLocalStorage.removeItem("additionalInfo");
                        secureLocalStorage.removeItem("additional_study_name");
                        secureLocalStorage.removeItem("additional_Degree_name");
                        Swal.fire({
                            title: "Success",
                            text: "Additional registration successfully completed",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                const doctorMobileno = LocalStorageManager.getDoctorMobileno();
                                if (doctorMobileno) {
                                    await authService.sendConfirmation(doctorMobileno, 'AdditionalQualification').then((response) => {
                                    }).catch(() => {

                                    });
                                }
                            }
                        });
                    } else {
                        setIsLoader(false);
                        setTransactionMsg(message);
                        const element = document.getElementById("msgId") as HTMLElement;
                        element.innerHTML = message;
                    }
                }
                if (regType === 'nocInfo') {
                    const nocInfo = secureLocalStorage.getItem("nocInfo");
                    const nocDataPaymentInfo = {
                        ...nocInfo as nocUserFormType,
                        orderKeyId: respOrderKeyId

                    }
                    const formData = new FormData();
                    formData.append("nocInfo", JSON.stringify(nocDataPaymentInfo));
                    const nocRegCertificateName = secureLocalStorage.getItem("nocRegCertificateName");
                    const nocafName = secureLocalStorage.getItem("noc_af_Name");
                    formData.append("nocRegCertificateName", nocRegCertificateName as string);
                    formData.append("nocafName", nocafName as string);
                    const { success,data,message } = await nocService.nocRegistration(formData);
                    if (success) {
                        setIsLoader(false);
                        setTransactionMsg(message);
                        setNocId(data.id);
                        const element = document.getElementById("msgId") as HTMLElement;
                        element.innerHTML = message;
                        secureLocalStorage.removeItem("nocInfo");
                        secureLocalStorage.removeItem("nocRegCertificateName");
                        secureLocalStorage.removeItem("noc_af_Name");
                        Swal.fire({
                            title: "Success",
                            text: "Noc registration successfully completed",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                const doctorMobileno = LocalStorageManager.getDoctorMobileno();
                                if (doctorMobileno) {
                                    await authService.sendConfirmation(doctorMobileno, 'NOCRegistration').then((response) => {
                                    }).catch(() => {
                                    });
                                }
                            }
                        });
                    } else {
                        setIsLoader(false);
                        setTransactionMsg(message);
                        const element = document.getElementById("msgId") as HTMLElement;
                        element.innerHTML = message;
                    }
                }
                if (regType === 'goodstandingInfo') {
                    const goodstandingInfo = secureLocalStorage.getItem("goodstandingInfo");
                    const goodstandingInfoDataPaymentInfo = {
                        ...goodstandingInfo as goodStandingFormType,
                        orderKeyId: respOrderKeyId
                    }
                    const formData = new FormData();
                    formData.append("goodstandingInfo", JSON.stringify(goodstandingInfoDataPaymentInfo));
                    const gsRegCertificateName = secureLocalStorage.getItem("gsRegCertificateName");
                    const gsafName = secureLocalStorage.getItem("gs_af_Name");
                    formData.append("gsRegCertificateName", gsRegCertificateName as string);
                    formData.append("gs_af_Name", gsafName as string);
                    const { success,data,message } = await goodstandingService.createGoodstandingDetails(formData);
                    if (success) {
                        setIsLoader(false);
                        setTransactionMsg(message);
                        setGsId(data.id);
                        const element = document.getElementById("msgId") as HTMLElement;
                        element.innerHTML = message;
                        secureLocalStorage.removeItem("goodstandingInfo");
                        secureLocalStorage.removeItem("gsRegCertificateName");
                        secureLocalStorage.removeItem("gs_af_Name");
                        Swal.fire({
                            title: "Success",
                            text: "GoodStanding registration successfully completed",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                const doctorMobileno = LocalStorageManager.getDoctorMobileno();
                                if (doctorMobileno) {
                                    await authService.sendConfirmation(doctorMobileno, 'GoodStanding').then((response) => {
                                    }).catch(() => {
                                    });
                                }
                            }
                        });
                    } else {
                        setIsLoader(false);
                        setTransactionMsg(message);
                        const element = document.getElementById("msgId") as HTMLElement;
                        element.innerHTML = message;
                    }
                }
                if (regType === 'finalrenewalsInfo') {
                    const renewalsInfo = secureLocalStorage.getItem("finalrenewalsInfo");
                    const renewalsInfoDataPaymentInfo = {
                        ...renewalsInfo as renewalsFormType,
                        orderKeyId: respOrderKeyId
                    }
                    const formData = new FormData();
                    formData.append("finalrenewalsInfo", JSON.stringify(renewalsInfoDataPaymentInfo));

                    const oldregCert = secureLocalStorage.getItem("regCertificateName");
                    const renewalaf = secureLocalStorage.getItem("renewalafName");
                    const renewalnoc = secureLocalStorage.getItem("renewalnocName");

                    if (oldregCert) {
                        formData.append("regCertificate", oldregCert as string);
                    }
                    if (renewalaf) {
                        formData.append("renewalaf", renewalaf as string);
                    }
                    if (renewalnoc) {
                        formData.append("renewalnoc", renewalnoc as string);
                    }
                    const { success,data,message } = await renewalService.createRenewalDetails(formData);
                    if (success) {
                        setIsLoader(false);
                        setTransactionMsg(message);
                        setRenewalId(data.id);
                        const element = document.getElementById("msgId") as HTMLElement;
                        element.innerHTML = message;
                        secureLocalStorage.removeItem("finalrenewalsInfo");
                        secureLocalStorage.removeItem("regCertificateName");
                        secureLocalStorage.removeItem("renewalafName");
                        secureLocalStorage.removeItem("renewalnocName");

                        Swal.fire({
                            title: "Success",
                            text: "Final Renewal registration successfully completed",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                const doctorMobileno = LocalStorageManager.getDoctorMobileno();
                                if (doctorMobileno) {
                                    await authService.sendConfirmation(doctorMobileno, 'FinalRenewal').then((response) => {
                                    }).catch(() => {
                                    });
                                }
                            }
                        });
                    } else {
                        setIsLoader(false);
                        setTransactionMsg(message);
                        const element = document.getElementById("msgId") as HTMLElement;
                        element.innerHTML = message;
                    }

                }
                if (regType === 'changeofNameInfo') {
                    const changeofNameInfo = secureLocalStorage.getItem("changeofNameInfo");
                    const changeofNameInfoDataInfo = {
                        ...changeofNameInfo as changeOfNameType,
                        orderKeyId: respOrderKeyId
                    }
                    const formData = new FormData();
                    formData.append("changeofNameInfo", JSON.stringify(changeofNameInfoDataInfo));

                    const gazzetCert = secureLocalStorage.getItem("gazzetCertificateName");
                    if (gazzetCert) {
                        formData.append("gazzetCertificateName", gazzetCert as string);
                    }

                    const { success, message } = await changeofnameService.createNameChange(formData);
                    if (success) {
                        setIsLoader(false);
                        setTransactionMsg(message);
                        const element = document.getElementById("msgId") as HTMLElement;
                        element.innerHTML = message;
                        secureLocalStorage.removeItem("changeofNameInfo");
                        secureLocalStorage.removeItem("gazzetCertificateName");
                        Swal.fire({
                            title: "Success",
                            text: "Name Change  registration successfully completed",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                const doctorMobileno = LocalStorageManager.getDoctorMobileno();
                                if (doctorMobileno) {
                                    await authService.sendConfirmation(doctorMobileno, 'NameChangeRegistration').then((response) => {
                                    }).catch(() => {
                                    });
                                }
                            }
                        });
                    } else {
                        setIsLoader(false);
                        setTransactionMsg(message);
                        const element = document.getElementById("msgId") as HTMLElement;
                        element.innerHTML = message;
                    }

                }
                if (regType === 'provRevalidationInfo') {
                    const revalidationInfo = secureLocalStorage.getItem("provRevalidationInfo");
                    const revalidationInfoDataInfo = {
                        ...revalidationInfo as renewalsFormType,
                        orderKeyId: respOrderKeyId
                    }
                    const formData = new FormData();
                    formData.append("revalidationInfo", JSON.stringify(revalidationInfoDataInfo));

                    const revalidationCert = secureLocalStorage.getItem("revalidationCertificateName");
                    if (revalidationCert) {
                        formData.append("revalidationCertificateName", revalidationCert as string);
                    }

                    const supportCert = secureLocalStorage.getItem("supportCertificateName");
                    if (supportCert) {
                        formData.append("supportCertificateName", supportCert as string);
                    }

                    const { success, message } = await revalidationService.createRevalidation(formData);
                    if (success) {
                        setIsLoader(false);
                        setTransactionMsg(message);
                        const element = document.getElementById("msgId") as HTMLElement;
                        element.innerHTML = message;
                        secureLocalStorage.removeItem("provRevalidationInfo");
                        secureLocalStorage.removeItem("revalidationCertificateName");
                        secureLocalStorage.removeItem("supportCertificateName");
                        Swal.fire({
                            title: "Success",
                            text: "Provisional Revalidation  registration successfully completed",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                const doctorMobileno = LocalStorageManager.getDoctorMobileno();
                                if (doctorMobileno) {
                                    await authService.sendConfirmation(doctorMobileno, 'ProvisionalRevalidation').then((response) => {
                                    }).catch(() => {
                                    });
                                }
                            }
                        });
                    } else {
                        setIsLoader(false);
                        setTransactionMsg(message);
                        const element = document.getElementById("msgId") as HTMLElement;
                        element.innerHTML = message;
                    }

                }

            } catch (error) {
                setIsLoader(false);
                console.log('error --------- ' + error);
            }
        })();
    }, []);

    const printwindow = useCallback(async () => {
        window.print();
    }, []);

    return (
        <>
            <header>
                <nav className="navbar navbar-expand-lg  tsmc-header">
                    <div className="container">
                        <div className='col-1' id="printPageButton">
                            <Link to="" className="navbar-brand tsmc-site-logo">
                                <img src={SiteLogo} alt="Site Logo" className='mt-3' />
                            </Link>
                        </div>
                        <div className="row mr-3">
                            <h1 className="fs-22 fw-700 mb-0 text-light">Telangana Medical Council</h1>
                        </div>
                        <div>
                        </div>
                        <div>
                        </div>

                        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#MainMenu" aria-controls="MainMenu">
                            <i className="bi bi-list"></i>
                        </button>
                    </div>
                    <Link to="" id="printPageButton" className="navbar-brand tsmc-site-logo tsmc-site-sub-logo">
                        <img src={SiteSubLogo} alt="Site Logo" />
                    </Link>
                </nav>
            </header>
            <section className='gray-banner'>
                <div className="card shadow border-0 p-4">
                    <div className="card-body">
                        <div className="row mb-3">
                            <div className="col"></div>
                            <div className="col"></div>
                           <div> 
                             
                         
                               
                        </div>
                        </div>

                        {isLoader ? (
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border text-success mt-5" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <div className='text-danger fs-11'>
                                please do not press back button or refresh
                                </div>
                               
                            </div>
                        ) :
                            <>
                                {(transactionMsg.includes("Failed") ||transactionMsg==="") ?
                                    <div className="card-body">

                                        <div className="w-100 text-center">
                                            <i className="bi-x-circle fs-42 text-danger"></i>
                                            <h1 className='fs-22 fw-700'>Payment Error</h1>
                                        </div>
                                    </div>
                                    :
                                    <div className="col-11">
                                        <div className="w-100 text-center">
                                            <i className="bi-check-circle fs-42 text-success"></i>
                                            <h1 className='fs-22 fw-700'>Payment Success</h1>
                                        </div>
                        {(secureLocalStorage.getItem("regType") === 'final')
                             &&
                             <div>
                             <ReactToPrint
                             trigger={() => <button className='btn btn-outline-primary'><i className="bi-printer-fill"></i>Print</button>}
                             content={() => finalcomponentRef.current} />
                             <div ref={finalcomponentRef} className='hideComponentScreen'>
                              <FinalRegPrint state={{finalPrimaryId:finalId,reqType:finalreqType}}  />
                              </div>  
                               </div>
                            }
                            {(secureLocalStorage.getItem("regType") === 'provisional')&&
                            <div>
                            <ReactToPrint
                            trigger={() => <button className='btn btn-outline-primary'><i className="bi-printer-fill"></i>Print</button>}
                            content={() => provisionalcomponentRef.current}
                                />
                             <div ref={provisionalcomponentRef} className='hideComponentScreen'>
                                <ProvisionalViewPrint state={{provisionalPrimaryId:provisionalId}}  />
                                </div>  
                                </div>
                              }
                               {(secureLocalStorage.getItem("regType") === 'additionalInfo')&&
                            <div>
                            <ReactToPrint
                            trigger={() => <button className='btn btn-outline-primary'><i className="bi-printer-fill"></i>Print</button>}
                            content={() => additionalcomponentRef.current}
                                />
                             <div ref={additionalcomponentRef} className='hideComponentScreen'>
                             <AdditionalRegViewPrint state={{ additionalPrimaryId:additionalId,reqType:additionalreqType}}  />
                                </div>  
                                </div>
                              }
                              {(secureLocalStorage.getItem("regType") === 'finalrenewalsInfo')&&
                            <div>
                            <ReactToPrint
                            trigger={() => <button className='btn btn-outline-primary'><i className="bi-printer-fill"></i>Print</button>}
                            content={() => renewlcomponentRef.current}
                                />
                             <div ref={renewlcomponentRef} className='hideComponentScreen'>
                             <RenewalsViewPrint state={{renewalPrimaryId:renewalId}}  />
                                </div>  
                                </div>
                              }
                                {(secureLocalStorage.getItem("regType") === 'goodstandingInfo')&&
                            <div>
                            <ReactToPrint
                            trigger={() => <button className='btn btn-outline-primary'><i className="bi-printer-fill"></i>Print</button>}
                            content={() => gscomponentRef.current}
                                />
                             <div ref={gscomponentRef} className='hideComponentScreen'>
                             <GoodStandingRegPrintView state={{gsPrimaryId:gsId}}  />
                                </div>  
                                </div>
                              }
                                {(secureLocalStorage.getItem("regType") === 'nocInfo')&&
                            <div>
                            <ReactToPrint
                            trigger={() => <button className='btn btn-outline-primary'><i className="bi-printer-fill"></i>Print</button>}
                            content={() => noccomponentRef.current}
                                />
                             <div ref={noccomponentRef} className='hideComponentScreen'>
                             <NocRegViewPrint state={{nocPrimaryId:nocId}}  />
                                </div>  
                                </div>
                              }
                                        <div className="px-3 text-center">
                                            <p className="mb-3" id="printPageButton">Your application successfully submitted to <br /> Telangana State Medical Council</p>
                                            <hr />
                                            <DoctorInfoSuccess />  
                                        </div>
                                    </div>
                                }
                            </>

                        }
                        <hr className="my-4" />
                        <div className="align-items-center  mb-3">
                        <div className="col d-flex" id="msgId"></div>
                        </div>
                        {(secureLocalStorage.getItem("regType") === 'provisional') || (secureLocalStorage.getItem("regType") === 'final')?
                        <button type="button" id="printPageButton"  onClick={() => { navigate(routes.main); }} className="btn btn-primary">Back to Login</button>
                        
                        : <button type="button" id="printPageButton" onClick={() => { navigate(routes.userpanal); }} className="btn btn-primary">Back to Profile</button>}
                    </div>
                </div>
            </section>
        </>
    )
};

export default PaymentSuccess;