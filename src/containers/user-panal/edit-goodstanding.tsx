import { Field, FieldProps, Formik, FormikProps } from "formik";
import { object as objectYup, string as stringYup, number as numberYup } from 'yup';
import getValue from 'lodash/get';
import { useNavigate,useLocation } from "react-router-dom";
//@ts-ignore
import Files from 'react-files';
import secureLocalStorage from "react-secure-storage";
import Swal from "sweetalert2";
import moment from "moment";
import { goodStandingUserType } from "../../types/common";
import { ReactFilesError, ReactFilesFile } from "../../types/files";
import { useCallback, useEffect, useState, useMemo } from "react";
import { College, Country, Qualification, Serials, State, University } from "../../types/common";
import { goodstandingService } from "../../lib/api/goodstanding";
import { routes } from "../routes/routes-names";
import { isLessThanTheMB } from "../../lib/utils/lessthan-max-filesize";
import { Messages } from "../../lib/constants/messages";
import { LocalStorageManager } from "../../lib/localStorage-manager";


const EditGSRegistration = () => {
    const navigate = useNavigate();
    
    const location = useLocation();
    const { gsPrimaryId} = location.state
    const [doctorId, setDoctorId] = useState(0);
    const [serial, setserial] = useState<Serials>();
    const [goodStanding, setGoodStanding] = useState<goodStandingUserType>();
    const [provisionalCertificate, setProvisionalCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [applicationForm, setApplicationForm] = useState<{ file?: File; error?: string } | null>(null);
    


    const initialFormData =  useMemo(
        () => ({
        createdon: '',
        posttime: '',
        modifiedon: '',
        status: '',
        added_by: 0,
        approval_status:'',
        doctor_id: '',
        doctorPrimaryId:'',
        extra_col3:'',
        ecfmgRefNo:'',
        ecfmgEmail:'',
        edu_cert1: goodStanding?.edu_cert1 || '',
        edu_cert2: goodStanding?.edu_cert2 || '',
    }),
    [goodStanding]
);
    const getGoodStandingDetails = useCallback(async () => {
        try {
            if (gsPrimaryId) {
                const { data } = await goodstandingService.getGoodstandingById(gsPrimaryId);
                if (data.length > 0) {
                    setGoodStanding({
                        createdon: '',
                        posttime: '',
                        modifiedon: '',
                        status: '',
                        added_by: 0,
                        approval_status:'',
                        doctorPrimaryId:'',
                        extra_col3:'',
                        ecfmgRefNo:'',
                        ecfmgEmail:'',
                        doctor_id: data[0].doctor_id,
                        edu_cert1: data[0].edu_cert1,
                        edu_cert2: data[0].edu_cert2,
                        
                    });
                }
            }
        } catch (err) {
            console.log('error getAdditionalDetails', err);
        }
    }, []);
    

    const submitForm = useCallback(
        async (values: goodStandingUserType) => {
            try {
                const doctorPrimaryId = LocalStorageManager.getDoctorPrimaryId()
                const doctorId = LocalStorageManager.getDoctorSerialId();

                const goodstandingInfo = {
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
                formData.append("goodstandingInfo", JSON.stringify(goodstandingInfo));
                if (provisionalCertificate?.file) {
                    formData.append("gsRegCertificate", provisionalCertificate?.file);
                }
                if (applicationForm?.file) {
                    formData.append("gs_af", applicationForm?.file);
                }
                const { success } = await goodstandingService.editGoodStanding(gsPrimaryId,formData);
                if (success) {
                 
                    Swal.fire({
                        title: "Success",
                        text: "Good Standing  updated successfully",
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
        getGoodStandingDetails();
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
                                        <h1 className='fs-22 fw-700 text-nowrap'>Edit Good Standing </h1>
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
                                        {(formikProps: FormikProps<goodStandingUserType>) => {
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
