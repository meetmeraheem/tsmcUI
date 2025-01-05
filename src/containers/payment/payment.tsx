import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import visalogo from "../../assets/images/visa.jpg";
import payglogo from "../../assets/images/payg.jpg";
import sslsecurelogo from "../../assets/images/ssl-secure.jpg";
import mastercardlogo from "../../assets/images/mastercard.jpg";
import rupaylogo from "../../assets/images/rupay.jpg";
import { RegPayDetailsFormType } from "../../types/common";
import { goodStandingFormType } from "../../types/common";
import secureLocalStorage from "react-secure-storage";
import { ProvisionalPaymentProfileType } from "../../types/provisional";
import { FinalPaymentFormType } from "../../types/final";
import { nocUserFormType } from "../../types/noc";
import { nocService } from "../../lib/api/noc";
import { AddQualFormType } from '../../types/additionalQuali';
import { additionalService } from '../../lib/api/additional';
import { finalService } from "../../lib/api/final";
import { provisionalService } from "../../lib/api/provisional";
import { goodstandingService } from "../../lib/api/goodstanding";
import { renewalsFormType } from "../../types/common";
import { renewalService } from "../../lib/api/renewals";
import { changeofnameService } from "../../lib/api/changeofname";
import { revalidationService } from "../../lib/api/revalidation";
import SiteLogo from '../../assets/images/logo.png'
import SiteSubLogo from '../../assets/images/tsgovt-logo.png'






const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { doctor_id, regType } = location.state
    const [isLoader, setIsLoader] = useState(true);

    const getDate = moment().format('YYYY-MM-DD');
    const [regPayDetails, setRegPayDetails] = useState<RegPayDetailsFormType | null>(null);
    const [isNormalReg, setIsNormalReg] = useState(true);
    const [payUrl, setPayUrl] = useState('');
    const [payOrderId, setPayOrderId] = useState('');

    const getProvisionalRegDetails = useCallback(async () => {
        try {

            const provisionalInfo = secureLocalStorage.getItem("provisionalInfo");
            const provisionalPaymentInfo = {
                ...provisionalInfo as ProvisionalPaymentProfileType,
                recept_date: moment().format('YYYY-MM-DD'),
                dd_amount: "",
                receipt_no: "",
                paymethod: ""

            }
            const formData = new FormData();
            formData.append("provisionalInfo", JSON.stringify(provisionalPaymentInfo));

            const pc = secureLocalStorage.getItem("pc");
            const af = secureLocalStorage.getItem("af");
            const noc = secureLocalStorage.getItem("noc");

            console.log('pc', pc);
            console.log('af', af);
            console.log('noc', noc);
            if (pc) {
                formData.append("pc", pc as File);
            }
            if (af) {
                formData.append("af", af as File);
            }
            if (noc) {
                formData.append("noc", noc as File);
            }

            const provData = await provisionalService.getProvisionalFeeDetails(formData);
            if (provData.data) {
                setRegPayDetails({
                    registrationFee: provData.data.registrationFee,
                    penalityAmount: provData.data.penalityAmount,
                    totalAmount: provData.data.totalAmount,
                    extraCharges: provData.data.extraCharges,
                    fullName: provData.data.fullName,
                    dataOfbirth: provData.data.dateofBirth,
                    phoneNo: provData.data.mobileNo,
                    address1: provData.data.address1,
                    address2: provData.data.address2,
                    examYear: provData.data.examYear,
                    examMonth: provData.data.examMonth,
                    doctor_id: provData.data.doctor_id
                });
                if (provData.data.regType != null && provData.data.regType === "tat") {
                    setIsNormalReg(false);
                } else {
                    setIsNormalReg(true);
                }
                setPayUrl(provData.data.redirectUrl);
                setPayOrderId(provData.data.orderKeyId);
                if (provData.data.provisionalInfoData.edu_cert1 != null) {
                    secureLocalStorage.setItem("pcName", provData.data.provisionalInfoData.edu_cert1);
                }
                if (provData.data.provisionalInfoData.edu_cert2 != null) {
                    secureLocalStorage.setItem("afName", provData.data.provisionalInfoData.edu_cert2);
                }
                if (provData.data.provisionalInfoData.edu_cert3 != null) {
                    secureLocalStorage.setItem("nocName", provData.data.provisionalInfoData.edu_cert3);
                }


            }

        } catch (err: any) {
            console.log('candidateService getProfile error', err.response);
        } finally {
            setIsLoader(false);
        }
    }, []);

    const getFinalRegDetails = useCallback(async () => {
        try {

            const finalInfo = secureLocalStorage.getItem("finalInfo");
            const finalInfo_slotValue=secureLocalStorage.getItem("finalInfo_slotValue");
            const finalPaymentInfo = {
                ...finalInfo as FinalPaymentFormType,
                orderAmount: "",
                orderId: "",
                paymethod: "",
                slotDateTime:finalInfo_slotValue
            }
            const formData = new FormData();
            formData.append("finalInfo", JSON.stringify(finalPaymentInfo));
            const af = secureLocalStorage.getItem("af");
            const mbbs = secureLocalStorage.getItem("mbbs");
            const noc = secureLocalStorage.getItem("noc");
            const affidavit = secureLocalStorage.getItem("affidavit");
            const testimonal1 = secureLocalStorage.getItem("mbtestimonal1bs");
            const testimonal2 = secureLocalStorage.getItem("testimonal2");
            const regOfOtherState = secureLocalStorage.getItem("regOfOtherState");
            const screeningTestPass = secureLocalStorage.getItem("screeningTestPass");
            const internshipComp = secureLocalStorage.getItem("internshipComp");
            const mciEligibility = secureLocalStorage.getItem("mciEligibility");
            const interVerification = secureLocalStorage.getItem("interVerification");
            const mciReg = secureLocalStorage.getItem("mciReg");
            const imr = secureLocalStorage.getItem("imr");

            if (af) {
                formData.append("af", af as File);
            }
            if (mbbs) {
                formData.append("mbbs", mbbs as File);
            }
            if (noc) {
                formData.append("noc", noc as File);
            }
            if (affidavit) {
                formData.append("affidivit", affidavit as File);
            }
            if (testimonal1) {
                formData.append("testimonal1", testimonal1 as File);
            }
            if (testimonal2) {
                formData.append("testimonal2", testimonal2 as File);
            }
            if (regOfOtherState) {
                formData.append("regOfOtherState", regOfOtherState as File);
            }
            if (screeningTestPass) {
                formData.append("screeningTestPass", screeningTestPass as File);
            }
            if (internshipComp) {
                formData.append("internshipComp", internshipComp as File);
            }
            if (mciEligibility) {
                formData.append("mciEligibility", mciEligibility as File);
            }
            if (interVerification) {
                formData.append("interVerification", interVerification as File);
            }
            if (mciReg) {
                formData.append("mciReg", mciReg as File);
            }
            if (imr) {
                formData.append("imr", imr as File);
            }

            const finalData = await finalService.getFinalRegFeeDetails(formData);
            if (finalData.data) {
                setRegPayDetails({
                    registrationFee: finalData.data.registrationFee,
                    penalityAmount: finalData.data.penalityAmount,
                    totalAmount: finalData.data.totalAmount,
                    extraCharges: finalData.data.extraCharges,
                    fullName: finalData.data.fullName,
                    dataOfbirth: finalData.data.dateofBirth,
                    phoneNo: finalData.data.mobileNo,
                    address1: finalData.data.address1,
                    address2: finalData.data.address2,
                    examYear: finalData.data.examYear,
                    examMonth: finalData.data.examMonth,
                    doctor_id: finalData.data.doctor_id,

                });
                if (finalData.data.regType != null && finalData.data.regType === "tat") {
                    setIsNormalReg(false);
                } else {
                    setIsNormalReg(true);
                }
                setPayUrl(finalData.data.redirectUrl);
                setPayOrderId(finalData.data.orderKeyId);

                 if (finalData.data.finalRegInfoData.edu_cert1 != null) {
                    secureLocalStorage.setItem("afName", finalData.data.finalRegInfoData.edu_cert1);
                }
                if (finalData.data.finalRegInfoData.edu_cert2 != null) {
                    secureLocalStorage.setItem("mbbsName", finalData.data.finalRegInfoData.edu_cert2);
                }
                if (finalData.data.finalRegInfoData.edu_cert3 != null) {
                    secureLocalStorage.setItem("nocName", finalData.data.finalRegInfoData.edu_cert3);
                }
                if (finalData.data.finalRegInfoData.affidivit != null) {
                    secureLocalStorage.setItem("affidivitName", finalData.data.finalRegInfoData.affidivit);
                }
                if (finalData.data.finalRegInfoData.testimonal1 != null) {
                    secureLocalStorage.setItem("testimonal1Name", finalData.data.finalRegInfoData.testimonal1);
                }
                if (finalData.data.finalRegInfoData.testimonal2 != null) {
                    secureLocalStorage.setItem("testimonal2Name", finalData.data.finalRegInfoData.testimonal2);
                }
                if (finalData.data.finalRegInfoData.reg_other_state != null) {
                    secureLocalStorage.setItem("regOtherStateName", finalData.data.finalRegInfoData.reg_other_state);
                }

                if (finalData.data.finalRegInfoData.screen_test != null) {
                    secureLocalStorage.setItem("screenTestName", finalData.data.finalRegInfoData.screen_test);
                }

                if (finalData.data.finalRegInfoData.screen_test != null) {
                    secureLocalStorage.setItem("screenTestName", finalData.data.finalRegInfoData.screen_test);
                }

                if (finalData.data.finalRegInfoData.intership_comp != null) {
                    secureLocalStorage.setItem("internshipCompName", finalData.data.finalRegInfoData.intership_comp);
                }

                if (finalData.data.finalRegInfoData.mci_eligi != null) {
                    secureLocalStorage.setItem("mciEligibilityName", finalData.data.finalRegInfoData.mci_eligi);
                }
                if (finalData.data.finalRegInfoData.inter_verif_cert != null) {
                    secureLocalStorage.setItem("interVerificationName", finalData.data.finalRegInfoData.inter_verif_cert);
                }
                if (finalData.data.finalRegInfoData.mci_reg != null) {
                    secureLocalStorage.setItem("mciRegName", finalData.data.finalRegInfoData.mci_reg);
                }
                if (finalData.data.finalRegInfoData.imr_certificate != null) {
                    secureLocalStorage.setItem("imrName", finalData.data.finalRegInfoData.imr_certificate);
                }
                if (finalData.data.finalRegInfoData.slotId != null) {
                        secureLocalStorage.setItem("finalInfo_slot_id", finalData.data.finalRegInfoData.slotId );
                     }
                   if (finalInfo_slotValue != null) {
                          secureLocalStorage.setItem("finalInfo_reg_slotValue", finalInfo_slotValue);
                     }


            }

        } catch (err: any) {
            console.log('candidateService getProfile error', err.response);
        } finally {
            setIsLoader(false);
        }
    }, []);
    const getNocRegDetails = useCallback(async () => {
        try {

            const nocInfo = secureLocalStorage.getItem("nocInfo");
            const nocDataPaymentInfo = {
                ...nocInfo as nocUserFormType,
                orderAmount: "",
                orderId: "",
                paymethod: ""
            }
            const formData = new FormData();
            formData.append("nocInfo", JSON.stringify(nocDataPaymentInfo));
            const nocRegCertificate = secureLocalStorage.getItem("nocRegCertificate");
            const noc_af = secureLocalStorage.getItem("noc_af");

            if (nocRegCertificate) {
                formData.append("nocRegCertificate", nocRegCertificate as File);
            }
            if (noc_af) {
                formData.append("noc_af", noc_af as File);
            }

            const nocData = await nocService.getNocRegDetails(formData);
            if (nocData.data) {
                setRegPayDetails({
                    registrationFee: nocData.data.registrationFee,
                    penalityAmount: nocData.data.penalityAmount,
                    totalAmount: nocData.data.totalAmount,
                    extraCharges: nocData.data.extraCharges,
                    fullName: nocData.data.fullName,
                    dataOfbirth: nocData.data.dateofBirth,
                    phoneNo: nocData.data.mobileNo,
                    address1: nocData.data.address1,
                    address2: nocData.data.address2,
                    examYear: nocData.data.examYear,
                    examMonth: nocData.data.examMonth,
                    doctor_id: nocData.data.doctor_id,

                });
                setPayUrl(nocData.data.redirectUrl);
                setPayOrderId(nocData.data.orderKeyId);
                if (nocData.data.nocData.edu_cert1 != null) {
                    secureLocalStorage.setItem("nocRegCertificateName", nocData.data.nocData.edu_cert1 );
                }

                if (nocData.data.nocData.edu_cert2 != null) {
                    secureLocalStorage.setItem("noc_af_Name", nocData.data.nocData.edu_cert2);
                }
                if (nocData.data.regType != null && nocData.data.regType === "tat") {
                    setIsNormalReg(false);
                } else {
                    setIsNormalReg(true);
                }
            }

        } catch (err: any) {
            console.log('candidateService getProfile error', err.response);
        } finally {
            setIsLoader(false);
        }
    }, []);

    const getAdditionalRegDetails = useCallback(async () => {
        try {

            const additionalInfo = secureLocalStorage.getItem("additionalInfo");
            const additionalInfo_slotValue=secureLocalStorage.getItem("additionalInfo_slotValue");
            const additionalDataPaymentInfo = {
                ...additionalInfo as AddQualFormType,
                orderAmount: "",
                orderId: "",
                paymethod: "",
                slotDateTime:additionalInfo_slotValue
            }
            const formData = new FormData();
            formData.append("additionalInfo", JSON.stringify(additionalDataPaymentInfo));
            
            const additionalStudy = secureLocalStorage.getItem("additional_study");
            const additionalDegree = secureLocalStorage.getItem("additional_Degree");
           
            if (additionalStudy) {
                formData.append("study", additionalStudy as File);
            }
            if (additionalDegree) {
                formData.append("Degree", additionalDegree as File);
            }

            const additionalRegData = await additionalService.getAdditionalRegFeeDetails(formData);
            if (additionalRegData.data) {
                setRegPayDetails({
                    registrationFee: additionalRegData.data.registrationFee,
                    penalityAmount: additionalRegData.data.penalityAmount,
                    totalAmount: additionalRegData.data.totalAmount,
                    extraCharges: additionalRegData.data.extraCharges,
                    fullName: additionalRegData.data.fullName,
                    dataOfbirth: additionalRegData.data.dateofBirth,
                    phoneNo: additionalRegData.data.mobileNo,
                    address1: additionalRegData.data.address1,
                    address2: additionalRegData.data.address2,
                    examYear: additionalRegData.data.examYear,
                    examMonth: additionalRegData.data.examMonth,
                    doctor_id: additionalRegData.data.doctor_id,

                });
                if (additionalRegData.data.regType != null && additionalRegData.data.regType === "tat") {
                    setIsNormalReg(false);
                } else {
                    setIsNormalReg(true);
                }
                setPayUrl(additionalRegData.data.redirectUrl);
                setPayOrderId(additionalRegData.data.orderKeyId);
                if (additionalRegData.data.additionalInfoData.edu_cert1 != null ) {
                    secureLocalStorage.setItem("additional_study_name", additionalRegData.data.additionalInfoData.edu_cert1);
                }
                if (additionalRegData.data.additionalInfoData.edu_cert2 != null) {
                    secureLocalStorage.setItem("additional_Degree_name", additionalRegData.data.additionalInfoData.edu_cert2 );
                }
                if (additionalRegData.data.additionalInfoData.slotId != null) {
                      secureLocalStorage.setItem("additional_slot_id", additionalRegData.data.additionalInfoData.slotId );
                   }
                   if (additionalInfo_slotValue != null) {
                       secureLocalStorage.setItem("additionalInfo_reg_slotValue", additionalInfo_slotValue);
                    }
            }

        } catch (err: any) {
            console.log('candidateService getProfile error', err.response);
        } finally {
            setIsLoader(false);
        }
    }, []);

   const  getGoodstandingInfoRegDetails= useCallback(async () => {
        try {

            const goodstandingInfo = secureLocalStorage.getItem("goodstandingInfo");
            const goodstandingInfoDataPaymentInfo = {
                ...goodstandingInfo as goodStandingFormType,
                orderId: "",
                orderAmount: "",
                paymethod: ""
            }
            const formData = new FormData();
            formData.append("goodstandingInfo", JSON.stringify(goodstandingInfoDataPaymentInfo));
            const gsRegCertificate = secureLocalStorage.getItem("gsRegCertificate");
            const gs_af = secureLocalStorage.getItem("gs_af");

            if (gsRegCertificate) {
                formData.append("gsRegCertificate", gsRegCertificate as File);
            }
            if (gs_af) {
                formData.append("gs_af", gs_af as File);
            }
            const gsData = await goodstandingService.getGoodstandingInfoRegDetails(formData);
            if (gsData.data) {
                setRegPayDetails({
                    registrationFee: gsData.data.registrationFee,
                    penalityAmount: gsData.data.penalityAmount,
                    totalAmount: gsData.data.totalAmount,
                    extraCharges: gsData.data.extraCharges,
                    fullName: gsData.data.fullName,
                    dataOfbirth: gsData.data.dateofBirth,
                    phoneNo: gsData.data.mobileNo,
                    address1: gsData.data.address1,
                    address2: gsData.data.address2,
                    examYear: gsData.data.examYear,
                    examMonth: gsData.data.examMonth,
                    doctor_id: gsData.data.doctor_id,

                });
                setPayUrl(gsData.data.redirectUrl);
                setPayOrderId(gsData.data.orderKeyId);
                if (gsData.data.gsData.edu_cert1 != null) {
                    secureLocalStorage.setItem("gsRegCertificateName", gsData.data.gsData.edu_cert1 );
                }
                if (gsData.data.gsData.edu_cert2 != null) {
                    secureLocalStorage.setItem("gs_af_Name", gsData.data.gsData.edu_cert2);
                }
                if (gsData.data.regType != null && gsData.data.regType === "tat") {
                    setIsNormalReg(false);
                } else {
                    setIsNormalReg(true);
                }
                
            }

        } catch (err: any) {
            console.log('candidateService getProfile error', err.response);
        } finally {
            setIsLoader(false);
        }
    }, []);

    const  getRenewalsRegFeeDetails= useCallback(async () => {
        try {

            const renewalsInfo = secureLocalStorage.getItem("finalrenewalsInfo");
            const renewalsInfoDataPaymentInfo = {
                ...renewalsInfo as renewalsFormType,
                orderId: "",
                orderAmount: "",
                paymethod: ""
            }
            const formData = new FormData();
            formData.append("finalrenewalsInfo", JSON.stringify(renewalsInfoDataPaymentInfo));
            
            const oldregCert = secureLocalStorage.getItem("regCertificate");
            const renewal_af = secureLocalStorage.getItem("renewal_af");
            const renewal_noc = secureLocalStorage.getItem("renewal_noc");
            const cmecredit6 =secureLocalStorage.getItem("cmecredit6");
            const cmecredit12 =secureLocalStorage.getItem("cmecredit12");
            const cmecredit18 =secureLocalStorage.getItem("cmecredit18");
            const cmecredit24 =secureLocalStorage.getItem("cmecredit24");
            const cmecredit30 =secureLocalStorage.getItem("cmecredit30");
           
            if (oldregCert) {
                formData.append("regCertificate", oldregCert as File);
            }
            if (renewal_af) {
                formData.append("renewal_af", renewal_af as File);
            }
            if (renewal_noc) {
                formData.append("renewal_noc", renewal_noc as File);
            }

            if (cmecredit6) {
                formData.append("cmecredit6", cmecredit6 as File);
            }
            if (cmecredit12) {
                formData.append("cmecredit12", cmecredit12 as File);
            }
            if (cmecredit18) {
                formData.append("cmecredit18", cmecredit18 as  File);
            }
            if (cmecredit24) {
                formData.append("cmecredit24", cmecredit24 as  File);
            }
            if (cmecredit30) {
                formData.append("cmecredit30", cmecredit30 as  File);
            }

            const frenewalData = await renewalService.getRenewalRegFeeDetails(formData);
            if (frenewalData.data) {
                setRegPayDetails({
                    registrationFee: frenewalData.data.registrationFee,
                    penalityAmount: frenewalData.data.penalityAmount,
                    totalAmount: frenewalData.data.totalAmount,
                    extraCharges: frenewalData.data.extraCharges,
                    fullName: frenewalData.data.fullName,
                    dataOfbirth: frenewalData.data.dateofBirth,
                    phoneNo: frenewalData.data.mobileNo,
                    address1: frenewalData.data.address1,
                    address2: frenewalData.data.address2,
                    examYear: frenewalData.data.examYear,
                    examMonth: frenewalData.data.examMonth,
                    doctor_id: frenewalData.data.doctor_id,

                });
                setPayUrl(frenewalData.data.redirectUrl);
                setPayOrderId(frenewalData.data.orderKeyId);
                
                if (frenewalData.data.renewalData.edu_cert1 != null ) {
                    secureLocalStorage.setItem("regCertificateName", frenewalData.data.renewalData.edu_cert1);
                }
                if (frenewalData.data.renewalData.edu_cert2 != null ) {
                    secureLocalStorage.setItem("renewalafName", frenewalData.data.renewalData.edu_cert2);
                }
                if (frenewalData.data.renewalData.edu_cert3 != null ) {
                    secureLocalStorage.setItem("renewalnocName", frenewalData.data.renewalData.edu_cert3);
                }
                if (frenewalData.data.renewalData.document4 != null ) {
                    secureLocalStorage.setItem("cmecredit6Name", frenewalData.data.renewalData.document4);
                }
                if (frenewalData.data.renewalData.document5 != null ) {
                    secureLocalStorage.setItem("cmecredit12Name", frenewalData.data.renewalData.document5);
                }
                if (frenewalData.data.renewalData.document6 != null ) {
                    secureLocalStorage.setItem("cmecredit18Name", frenewalData.data.renewalData.document6);
                }
                if (frenewalData.data.renewalData.document7 != null ) {
                    secureLocalStorage.setItem("cmecredit24Name", frenewalData.data.renewalData.document7);
                }
                if (frenewalData.data.renewalData.document8 != null ) {
                    secureLocalStorage.setItem("cmecredit30Name", frenewalData.data.renewalData.document8);
                }
                if (frenewalData.data.regType != null && frenewalData.data.regType === "tat") {
                    setIsNormalReg(false);
                } else {
                    setIsNormalReg(true);
                }
            }

        } catch (err: any) {
            console.log('candidateService getProfile error', err.response);
        } finally {
            setIsLoader(false);
        }
    }, []);

    const  getNameChangeRegFeeDetails= useCallback(async () => {
        try {

            const changeofNameInfo = secureLocalStorage.getItem("changeofNameInfo");
            const changeofNameInfoDataPaymentInfo = {
                ...changeofNameInfo as renewalsFormType,
                orderId: "",
                orderAmount: "",
                paymethod: ""
            }
            const formData = new FormData();
            formData.append("changeofNameInfo", JSON.stringify(changeofNameInfoDataPaymentInfo));
            
            const gazzettCertificate = secureLocalStorage.getItem("gazzettCertificate");
            if (gazzettCertificate) {
                formData.append("gazzetCertificate", gazzettCertificate as File);
            }
            const namechangeData = await changeofnameService.getNameChangeRegFeeDetails(formData);
            if (namechangeData.data) {
                setRegPayDetails({
                    registrationFee: namechangeData.data.registrationFee,
                    penalityAmount: namechangeData.data.penalityAmount,
                    totalAmount: namechangeData.data.totalAmount,
                    extraCharges: namechangeData.data.extraCharges,
                    fullName: namechangeData.data.fullName,
                    dataOfbirth: namechangeData.data.dateofBirth,
                    phoneNo: namechangeData.data.mobileNo,
                    address1: namechangeData.data.address1,
                    address2: namechangeData.data.address2,
                    examYear: namechangeData.data.examYear,
                    examMonth: namechangeData.data.examMonth,
                    doctor_id: namechangeData.data.doctor_id,

                });
                setPayUrl(namechangeData.data.redirectUrl);
                setPayOrderId(namechangeData.data.orderKeyId);
                
                if (namechangeData.data.nameData.edu_cert1 != null ) {
                    secureLocalStorage.setItem("gazzetCertificateName", namechangeData.data.nameData.edu_cert1);
                }
                
                if (namechangeData.data.regType != null && namechangeData.data.regType === "tat") {
                    setIsNormalReg(false);
                } else {
                    setIsNormalReg(true);
                }
            }

        } catch (err: any) {
            console.log('candidateService getProfile error', err.response);
        } finally {
            setIsLoader(false);
        }
    }, []);
    const  getProvRevalidationRegFeeDetails= useCallback(async () => {
        try {

            const provRevalidationInfo = secureLocalStorage.getItem("provRevalidationInfo");
            const provRevalidationInfoDataPaymentInfo = {
                ...provRevalidationInfo as renewalsFormType,
                orderId: "",
                orderAmount: "",
                paymethod: ""
            }
            const formData = new FormData();
            formData.append("provRevalidationInfo", JSON.stringify(provRevalidationInfoDataPaymentInfo));
            
            const revalidationCertificate = secureLocalStorage.getItem("revalidationCertificate");
            if (revalidationCertificate) {
                formData.append("revalidationCertificate", revalidationCertificate as File);
            }
            const supportCertificate = secureLocalStorage.getItem("supportCertificate");
            if (supportCertificate) {
                formData.append("supportCertificate", supportCertificate as File);
            }
            const revalidationData = await revalidationService.getRevalidationRegFeeDetails(formData);
            if (revalidationData.data) {
                setRegPayDetails({
                    registrationFee: revalidationData.data.registrationFee,
                    penalityAmount: revalidationData.data.penalityAmount,
                    totalAmount: revalidationData.data.totalAmount,
                    extraCharges: revalidationData.data.extraCharges,
                    fullName: revalidationData.data.fullName,
                    dataOfbirth: revalidationData.data.dateofBirth,
                    phoneNo: revalidationData.data.mobileNo,
                    address1: revalidationData.data.address1,
                    address2: revalidationData.data.address2,
                    examYear: revalidationData.data.examYear,
                    examMonth: revalidationData.data.examMonth,
                    doctor_id: revalidationData.data.doctor_id,

                });
                setPayUrl(revalidationData.data.redirectUrl);
                setPayOrderId(revalidationData.data.orderKeyId);
                
                if (revalidationData.data.revalidationData.edu_cert1 != null ) {
                    secureLocalStorage.setItem("revalidationCertificateName", revalidationData.data.revalidationData.edu_cert1);
                }
                if (revalidationData.data.revalidationData.edu_cert2 != null ) {
                    secureLocalStorage.setItem("supportCertificateName", revalidationData.data.revalidationData.edu_cert2);
                }
                if (revalidationData.data.regType != null && revalidationData.data.regType === "tat") {
                    setIsNormalReg(false);
                } else {
                    setIsNormalReg(true);
                }
            }

        } catch (err: any) {
            console.log('candidateService getProfile error', err.response);
        } finally {
            setIsLoader(false);
        }
    }, []);
    useEffect(
        () => {

            if (regType === 'provisional') {
                getProvisionalRegDetails();
            }
            if (regType === 'final') {
                getFinalRegDetails();
            }
            if (regType === 'nocInfo') {
                getNocRegDetails();
            }
            if (regType === 'additionalInfo') {
                getAdditionalRegDetails();
            }
            if (regType === 'goodstandingInfo') {
                getGoodstandingInfoRegDetails();
            }
            if(regType === 'finalrenewalsInfo'){
                getRenewalsRegFeeDetails();
            }
            
            if(regType === 'changeofNameInfo'){
                getNameChangeRegFeeDetails();
            }
            
            if(regType === 'provRevalidationInfo'){
                getProvRevalidationRegFeeDetails();
            }

        }, []);



    const PayAndContinueForm = useCallback(async (payUrl: any, payOrderId: any) => {
        try {
            if (payUrl) {
                LocalStorageManager.setOrderKeyId(payOrderId);
                window.open(payUrl, '_self', 'noreferrer');
            } else {
                alert("Error Msg ");
            }
        } catch (err) {
            console.log('error in payment process during the provisional registrartion.', err);
        }
    }, []);
    return (
        <> <header>
        <nav className="navbar navbar-expand-lg  tsmc-header">
            <div className="container">
                <div className='col-1'>
                    <Link to="" className="navbar-brand tsmc-site-logo">
                        <img src={SiteLogo} alt="Site Logo" className='mt-3'/>
                    </Link>
                </div>
                <div >
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
                <Link to="" className="navbar-brand tsmc-site-logo tsmc-site-sub-logo">
                    <img src={SiteSubLogo} alt="Site Logo" />
                </Link>
                </nav>
                </header>

              {isLoader ? (
              <div className="d-flex justify-content-center">
              <div className="spinner-border text-success mt-5" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
                ) :
              <section className='gray-banner'>
                <div className="col-7 m-auto mt-4">
                    <div className="card mb-3 shadow border-0">
                        <div className="card-header">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h3 className="fs-18 fw-700 mb-0">Payment details</h3>
                                </div>
                                <div></div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="d-flex">
                                <div className="col pe-2 border-end">
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Registration Type</label></div>
                                        {regType === 'provisional' && <div className="col fs-14">Provisional (PMR)</div>}
                                        {regType === 'final' && <div className="col fs-14">Final (FMR)</div>}
                                        {regType === 'additionalInfo' && <div className="col fs-14">Additional Registration</div>}
                                        {regType === 'nocInfo' && <div className="col fs-14">NOC</div>}
                                        {regType === 'goodstandingInfo' && <div className="col fs-14">Good Standing </div>}
                                        {regType === 'finalrenewalsInfo' && <div className="col fs-14">Final Renewals</div>}
                                        {regType === 'changeofNameInfo' && <div className="col fs-14">Change of Name</div>}
                                        {regType === 'provRevalidationInfo' && <div className="col fs-14">Provisional Revalidation </div>}
                                    </div>
                                    {/* <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Final Registration No.</label></div>
                                        {regType === 'provisional' && <div className="col fs-14">TSMC/PMR/234579</div>}
                                        {regType === 'final' && <div className="col fs-14">TSMC/FMR/234579</div>}
                                        
                                    </div> */}
                                    {regType === 'final' &&
                                        <div className="row mb-3">
                                            <div className="col-4"><label htmlFor="">Doctor ID</label></div>
                                            <div className="col fs-14">{regPayDetails?.doctor_id}</div>
                                        </div>
                                    }
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Full Name</label></div>
                                        <div className="col fs-14">{regPayDetails?.fullName}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Date Of Birth</label></div>
                                        <div className="col fs-14">{regPayDetails?.dataOfbirth}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Mobile No</label></div>
                                        <div className="col fs-14">{regPayDetails?.phoneNo}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Address</label></div>
                                        <div className="col fs-14">{regPayDetails?.address1} {regPayDetails?.address2}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Exam Year</label></div>
                                        <div className="col fs-14">{regPayDetails?.examYear}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-4"><label htmlFor="">Exam Month</label></div>
                                        <div className="col fs-14">{regPayDetails?.examMonth} </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-end ps-2">
                                    <div>
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <label htmlFor="">Registration Type: </label>
                                            <div className="fs-14  fw-700">
                                                {isNormalReg === true ? <span className="text-primary" > Normal </span> : <span className="text-primary" >Tatkal</span>} 
                                               </div> 
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <label htmlFor="">Registration Fee</label>
                                            <div className="fs-14"><i className="bi-currency-rupee"></i> {regPayDetails?.registrationFee}/-</div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <label htmlFor="">Penalty</label>
                                            <div className="fs-14"><i className="bi-currency-rupee"></i> {regPayDetails?.penalityAmount}/-</div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <label htmlFor="">Charges</label>
                                            <div className="fs-14"><i className="bi-currency-rupee"></i> {regPayDetails?.extraCharges}/-</div>
                                        </div>
                                        <hr />
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <label htmlFor="">Total</label>
                                            <div className="fs-14"><i className="bi-currency-rupee"></i> {regPayDetails?.totalAmount}/-</div>
                                        </div>
                                        <hr className="mb-0" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer text-end py-3">
                            <button type="button" onClick={() => navigate(-1)} className="btn btn-primary me-3">Back</button>
                            <button type="button" onClick={() => PayAndContinueForm(payUrl, payOrderId)} className="btn btn-primary ps-2">Continue & Pay</button>
                        </div>
                    </div>
                    <div className="card shadow border-0 mb-3">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div className="fs-13 d-flex">
                                <Link target={'_blank'} className="pe-2" to={'/terms-and-conditions'}>Terms and Conditions</Link>
                                <Link target={'_blank'} className="px-2" to={'/privacy-policy'}>Privacy Policy</Link>
                                <Link target={'_blank'} className="ps-2" to={'/refund'}>Refund</Link>
                            </div>
                            <div>
                                <img src={rupaylogo} alt="" width="55px" className="pe-2" />
                                <img src={visalogo} alt="" width="55px" className="pe-2" />
                                <img src={mastercardlogo} alt="" width="55px" className="pe-2" />
                                <img src={payglogo} alt="" width="55px" className="pe-2" />
                                <img src={sslsecurelogo} alt="" width="55px" className="" />
                            </div>
                        </div>
                    </div>

                </div>
            </section>}
        </>
    )
};

export default Payment;