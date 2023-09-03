import { Field, FieldProps, Formik, FormikProps } from "formik";
import { object as objectYup, string as stringYup, number as numberYup } from 'yup';
import getValue from 'lodash/get';
import { useNavigate,useLocation } from "react-router-dom";
//@ts-ignore
import Files from 'react-files';
import secureLocalStorage from "react-secure-storage";
import Swal from "sweetalert2";
import moment from "moment";
import { renewalsType } from "../../types/common";
import { ReactFilesError, ReactFilesFile } from "../../types/files";
import { useCallback, useEffect, useState, useMemo } from "react";
import { College, Country, Qualification, Serials, State, University } from "../../types/common";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { routes } from "../routes/routes-names";
import { isLessThanTheMB } from "../../lib/utils/lessthan-max-filesize";
import { Messages } from "../../lib/constants/messages";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import { renewalService } from "../../lib/api/renewals";

import DatePicker from 'react-date-picker';


const EditRenewalRegistration = () => {
    const navigate = useNavigate();
    
    const location = useLocation();
    const { renwalPrimaryId} = location.state
    const [doctorId, setDoctorId] = useState(0);
    const [serial, setserial] = useState<Serials>();
    const [renewals, setRenewals] = useState<renewalsType>();
    const [provisionalCertificate, setProvisionalCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [applicationForm, setApplicationForm] = useState<{ file?: File; error?: string } | null>(null);
    const [nocCertificate, setNOCCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [provisionalRequestType, setProvisionalRequestType] = useState<string>('nor');
    const [reg_date, setReg_date] = useState(new Date());


    const initialFormData =  useMemo(
        () => ({
        doctor_id: 0,
        edu_cert1: renewals?.edu_cert1 || '',
        edu_cert2: renewals?.edu_cert2 || '',
        edu_cert3: renewals?.edu_cert3 || '',
        reg_date:'',
        status:'',
    }),
    [renewals]
);
    const getRenewalDetails = useCallback(async () => {
        try {
            if (renwalPrimaryId) {
                const { data } = await renewalService.getRenewalById(renwalPrimaryId);
                if (data.status != null) {
                    setRenewals({
                        status: data.status,
                        reg_date: data.createdon,
                        doctor_id: data.doctorId,
                        edu_cert1: data.document1,
                        edu_cert2: data.document2,
                        edu_cert3: data.document3,
                    });
                }
            }
        } catch (err) {
            console.log('error getAdditionalDetails', err);
        }
    }, []);
    

    const submitForm = useCallback(
        async (values: renewalsType) => {
            try {
                const doctorPrimaryId = LocalStorageManager.getDoctorPrimaryId()
                const doctorId = LocalStorageManager.getDoctorSerialId();

                const renewalInfo = {
                    ...values,
                    createdon: moment().format('YYYY-MM-DD'),
                    posttime: moment().format('h:mm:ss'),
                    doctor_id: doctorId,
                    prefix: 'TSMC',
                    approval_status: 'pen',
                    row_type: 'on',
                    extra_col1:provisionalRequestType,
                    doctorPrimaryId:doctorPrimaryId,
                }
               
                secureLocalStorage.setItem("regType", 'finalrenewalsInfo');
                secureLocalStorage.setItem("finalrenewalsInfo", renewalInfo);
                
                const formData = new FormData();
                formData.append("finalrenewalsInfo", JSON.stringify(renewalInfo));
                if (provisionalCertificate?.file) {
                    formData.append("regCertificate", provisionalCertificate?.file);
                }
                if (applicationForm?.file) {
                    formData.append("renewal_af", applicationForm?.file);
                }
                if (nocCertificate?.file) {
                    formData.append("renewal_noc", nocCertificate?.file);
                }
               
               
                const { success } = await renewalService.editRenewal(renwalPrimaryId,formData);
                if (success) {
                 
                    Swal.fire({
                        title: "Success",
                        text: "Final Renewal updated successfully",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            navigate(routes.userpanal);
                        }
                    });
                } 
            } catch (err) {
                Swal.fire({
                    //title: "Error",
                    text: "final renewal updation failed",
                    icon: "error",
                    confirmButtonText: "OK",
                })
                console.log('error in final renewal update', err);
            }
        },
        [doctorId, serial, provisionalCertificate, applicationForm, nocCertificate]
    );

    useEffect(() => {
        getRenewalDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
                        <div className="col-9 m-auto">
                            <div className="card shadow border-0 mb-4">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h1 className='fs-22 fw-700 text-nowrap'>Edit Final Renewals </h1>
                                        <div>
                                            
                                        </div>
                                    </div>
                                    <hr />
                                    <Formik
                                        onSubmit={submitForm}
                                        enableReinitialize
                                        validationSchema={getValidationSchema}
                                        initialValues={initialFormData}
                                    >
                                        {(formikProps: FormikProps<renewalsType>) => {
                                            const { isValid, handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm } = formikProps;

                                            return (
                                                <form onSubmit={handleSubmit}>
                                                    <div className="row mb-2">
                                                       

                                                    </div>
                                                    <div className="row mb-2 mt-4">
                                                            <div className='text-danger fs-10'>
                                                                Please upload images (.jpeg,.png) only, with less than 200 KB size.  
                                                            </div>
                                                            <div className='text-danger fs-10'>
                                                                File name should not contain any special charaters and should have less than 20 character length.
                                                            </div>
                                                        </div>
                                                    <div className="row mb-2 mt-4">
                                                        <div className="col">
                                                            <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                <Field name="edu_cert1">
                                                                    {(fieldProps: FieldProps) => {
                                                                        const { field, form } = fieldProps;
                                                                        const error =
                                                                            getValue(form.touched, field.name) &&
                                                                            getValue(form.errors, field.name);
                                                                        const file = provisionalCertificate?.file
                                                                            ? provisionalCertificate?.file.name
                                                                            : field.value || null;
                                                                        return file ? (
                                                                            <p className="d-flex align-items-center">
                                                                                <strong>Uploaded:</strong>
                                                                                <span className="ms-1">{file}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setFieldValue(field.name, '');
                                                                                        setProvisionalCertificate(null);
                                                                                    }}
                                                                                    title='Delete'
                                                                                    className="ms-2 lh-1"
                                                                                >
                                                                                    <i className="bi-trash" />
                                                                                </button>
                                                                            </p>
                                                                        ) : (
                                                                            <>
                                                                                <Files
                                                                                    className="files-dropzone"
                                                                                    onChange={(files: ReactFilesFile[]) => {
                                                                                        if (files[0]) {
                                                                                            const file = files[0];
                                                                                            const isLess = isLessThanTheMB(files[0].size, 0.3);
                                                                                            if (isLess) {
                                                                                                setProvisionalCertificate({ file });
                                                                                                setFieldValue(field.name, file.name);
                                                                                            }
                                                                                            else {
                                                                                                alert(Messages.isLessThanTheMB);
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                    onError={(error: ReactFilesError) => {
                                                                                        console.log('error', error);
                                                                                        if (error.code === 1) {
                                                                                        }
                                                                                    }}
                                                                                    accepts={['.jpeg', '.jpg','.png']}
                                                                                    clickable
                                                                                >
                                                                                    <div className="drag-drop-box mt-3">
                                                                                        <div className="text-center">
                                                                                            <i className="bi-file-earmark-break fs-32"></i>
                                                                                            <p className='fs-13'>Upload Last Renewal Certificate</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </Files>
                                                                                <small className="text-danger mt-1">
                                                                                    {provisionalCertificate?.error}
                                                                                </small>
                                                                                {error && <small className="text-danger">{error.toString()}</small>}
                                                                            </>
                                                                        );
                                                                    }}
                                                                </Field>


                                                            </div>
                                                            <div className="col">
                                                            <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                <Field name="edu_cert2">
                                                                    {(fieldProps: FieldProps) => {
                                                                        const { field, form } = fieldProps;
                                                                        const error =
                                                                            getValue(form.touched, field.name) &&
                                                                            getValue(form.errors, field.name);
                                                                        const file = applicationForm?.file
                                                                            ? applicationForm?.file.name
                                                                            : field.value || null;
                                                                        return file ? (
                                                                            <p className="d-flex align-items-center">
                                                                                <strong>Uploaded:</strong>
                                                                                <span className="ms-1">{file}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setFieldValue(field.name, '');
                                                                                        setApplicationForm(null);
                                                                                    }}
                                                                                    title='Delete'
                                                                                    className="ms-2 lh-1"
                                                                                >
                                                                                    <i className="bi-trash" />
                                                                                </button>
                                                                            </p>
                                                                        ) : (
                                                                            <>
                                                                                <Files
                                                                                    className="files-dropzone"
                                                                                    onChange={(files: ReactFilesFile[]) => {
                                                                                        if (files[0]) {
                                                                                            const file = files[0];
                                                                                            const isLess = isLessThanTheMB(files[0].size, 0.3);
                                                                                            if (isLess) {
                                                                                                setApplicationForm({ file });
                                                                                                setFieldValue(field.name, file.name);
                                                                                            }
                                                                                            else {
                                                                                                alert(Messages.isLessThanTheMB);
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                    onError={(error: ReactFilesError) => {
                                                                                        console.log('error', error);
                                                                                        if (error.code === 1) {
                                                                                        }
                                                                                    }}
                                                                                    accepts={['.jpeg', '.jpg','.png']}
                                                                                    clickable
                                                                                >
                                                                                    <div className="drag-drop-box mt-3">
                                                                                        <div className="text-center">
                                                                                            <i className="bi-file-earmark-break fs-32"></i>
                                                                                            <p className='fs-13'>Upload MBBS Certificate </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </Files>
                                                                                <small className="text-danger mt-1">
                                                                                    {applicationForm?.error}
                                                                                </small>
                                                                                {error && <small className="text-danger">{error.toString()}</small>}
                                                                            </>
                                                                        );
                                                                    }}
                                                                </Field>
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                                <Field name="edu_cert3">
                                                                    {(fieldProps: FieldProps) => {
                                                                        const { field, form } = fieldProps;
                                                                        const error =
                                                                            getValue(form.touched, field.name) &&
                                                                            getValue(form.errors, field.name);
                                                                        const file = nocCertificate?.file
                                                                            ? nocCertificate?.file.name
                                                                            : field.value || null;
                                                                        return file ? (
                                                                            <p className="d-flex align-items-center">
                                                                                <strong>Uploaded:</strong>
                                                                                <span className="ms-1">{file}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setFieldValue(field.name, '');
                                                                                        setNOCCertificate(null);
                                                                                    }}
                                                                                    title='Delete'
                                                                                    className="ms-2 lh-1"
                                                                                >
                                                                                    <i className="bi-trash" />
                                                                                </button>
                                                                            </p>
                                                                        ) : (
                                                                            <>
                                                                                <Files
                                                                                    className="files-dropzone"
                                                                                    onChange={(files: ReactFilesFile[]) => {
                                                                                        if (files[0]) {
                                                                                            const file = files[0];
                                                                                            const isLess = isLessThanTheMB(files[0].size, 0.3);
                                                                                            if (isLess) {
                                                                                                setNOCCertificate({ file });
                                                                                                setFieldValue(field.name, file.name);
                                                                                            }
                                                                                            else {
                                                                                                alert(Messages.isLessThanTheMB);
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                    onError={(error: ReactFilesError) => {
                                                                                        console.log('error', error);
                                                                                        if (error.code === 1) {
                                                                                        }
                                                                                    }}
                                                                                    accepts={['.jpeg', '.jpg','.png']}
                                                                                    clickable
                                                                                >
                                                                                    <div className="drag-drop-box mt-3">
                                                                                        <div className="text-center">
                                                                                            <i className="bi-file-earmark-break fs-32"></i>
                                                                                            <p className='fs-13'>Other relavant documents</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </Files>
                                                                                <small className="text-danger mt-1">
                                                                                    {nocCertificate?.error}
                                                                                </small>
                                                                                {error && <small className="text-danger">{error.toString()}</small>}
                                                                            </>
                                                                        );
                                                                    }}
                                                                </Field>
                                                            </div>
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            
                                                        </div>
                                                    </div>
                                                    <div className="w-100 text-end mt-3">
                                                        {/* isValid? setNext(false):setNext(true) */}
                                                        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                                            {isSubmitting && <span className="spinner-border spinner-border-sm" />} Submit
                                                        </button>
                                                    </div>
                                                </form>
                                            );
                                        }}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    
                </div>
            </section>
        </>
    )
};

export default EditRenewalRegistration;

const getValidationSchema = () =>
    objectYup().shape({
        edu_cert1: stringYup()
            .required('Last Renewal certificate is required.'),
         edu_cert2: stringYup()
            .required('MBBS Certificate is required.'),
       /* edu_cert3: stringYup()
            .required('Other/previous renewal documents is required.')*/
      
    });
