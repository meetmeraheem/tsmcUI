import { Field, FieldProps, Formik, FormikProps } from "formik";
import { object as objectYup, string as stringYup, number as numberYup } from 'yup';
import getValue from 'lodash/get';
import { useNavigate,useLocation } from "react-router-dom";
//@ts-ignore
import Files from 'react-files';
import Swal from "sweetalert2";
import moment from "moment";
import { ReactFilesError, ReactFilesFile } from "../../types/files";
import { useCallback, useEffect, useState, useMemo } from "react";
import { routes } from "../routes/routes-names";
import { isLessThanTheMB } from "../../lib/utils/lessthan-max-filesize";
import { Messages } from "../../lib/constants/messages";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import { provisional_Revalidation } from "../../types/common";
import { revalidationService } from "../../lib/api/revalidation";


const EditGSRegistration = () => {
    const navigate = useNavigate();
    
    const location = useLocation();
    const { revalidationPrimaryId} = location.state
    const [doctorId, setDoctorId] = useState(0);
    const [revalidation, setRevalidation] = useState<provisional_Revalidation>();
    const [provisionalCertificate, setProvisionalCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [applicationForm, setApplicationForm] = useState<{ file?: File; error?: string } | null>(null);
    


    const initialFormData =  useMemo(
        () => ({
            doctor_id: 0,
            status: '',
            prov_reg_date:'',
            edu_cert1: revalidation?.edu_cert1 || '',
            edu_cert2: revalidation?.edu_cert2 || '',
            revalidationReason:'',
            extra_col3:'',
    }),
    [revalidation]
);
    const getRevalidationDetails = useCallback(async () => {
        try {
            if (revalidationPrimaryId) {
                const { data } = await revalidationService.getRevalidationById(revalidationPrimaryId);
                if (data) {
                    setRevalidation({
                        doctor_id: data.doctor_id,
                        status: '',
                        edu_cert1: data.provisionalDocument,
                        edu_cert2: data.otherDocument,
                        revalidationReason:'',
                        prov_reg_date:'',
                        extra_col3:'',
                    });
                }
            }
        } catch (err) {
            console.log('error getAdditionalDetails', err);
        }
    }, []);
    

    const submitForm = useCallback(
        async (values: provisional_Revalidation) => {
            try {
                const doctorPrimaryId = LocalStorageManager.getDoctorPrimaryId()
                const doctorId = LocalStorageManager.getDoctorSerialId();

                const revalidationInfo = {
                    ...values,
                    createdon: moment().format('YYYY-MM-DD'),
                    posttime: moment().format('h:mm:ss'),
                    prefix: 'TSMC',
                    approval_status: 'pen',
                    row_type: 'on',
                    reg_date: moment().format('YYYY-MM-DD'),
                    doctor_id: doctorId && Number(doctorId),
                    doctorPrimaryId: doctorPrimaryId
                }
                const formData = new FormData();
                formData.append("provRevalidationInfo", JSON.stringify(revalidationInfo));
                if (provisionalCertificate?.file) {
                    formData.append("revalidationCertificate", provisionalCertificate?.file);
                }
                if (applicationForm?.file) {
                    formData.append("supportCertificate", applicationForm?.file);
                }
                const { success } = await revalidationService.editRevalidation(revalidationPrimaryId,formData);
                if (success) {
                 
                    Swal.fire({
                        title: "Success",
                        text: "Provisional Revalidation updated successfully",
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
                    text: "good standing  updation failed",
                    icon: "error",
                    confirmButtonText: "OK",
                })
                console.log('error in final renewal update', err);
            }
        },
        [doctorId,  provisionalCertificate, applicationForm]
    );

    useEffect(() => {
        getRevalidationDetails();
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
                                        <h1 className='fs-22 fw-700 text-nowrap'>Edit Revalidation</h1>
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
                                        {(formikProps: FormikProps<provisional_Revalidation>) => {
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
                                                                                            <p className='fs-13'>Upload  Certificate</p>
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
                                                                                            <p className='fs-13'>Upload  Certificate </p>
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
                                                        </div>
                                                        <div className="col">
                                                            
                                                        </div>
                                                    </div>
                                                    <div className="w-100 text-end mt-3">
                                                    <button type='button'  onClick={() => { navigate(routes.userpanal); }}  className='btn btn-primary me-3'><i className="bi-chevron-left"></i>Back </button>
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

export default EditGSRegistration;

const getValidationSchema = () =>
    objectYup().shape({
        edu_cert1: stringYup()
            .required('certificate is required.'),
         edu_cert2: stringYup()
            .required('certificate is required.'),
      
    });
