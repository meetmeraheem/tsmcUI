import DoctorInfoCard from "../includes/doctor-info";
import getValue from 'lodash/get';
import { Field, FieldProps, Formik, FormikProps } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import {  ProvisionalDuplicateType } from "../../../types/provisional";
import Swal from "sweetalert2";
import moment from "moment";
import { useNavigate } from "react-router-dom";
//@ts-ignore
import Files from 'react-files';
import { isLessThanTheMB } from "../../../lib/utils/lessthan-max-filesize";
import { ReactFilesError, ReactFilesFile } from "../../../types/files"
import { Messages } from "../../../lib/constants/messages";
import { duplicateService } from "../../../lib/api/duplicate";
import { routes } from "../../routes/routes-names";
import { LocalStorageManager } from '../../../lib/localStorage-manager';
import secureLocalStorage from 'react-secure-storage';


const ProvisionalDuplicate = () => {
    const [next, setNext] = useState(false);
    const [provisional, setProvisional] = useState<ProvisionalDuplicateType | null>(null);
    const [provisionalCertificate, setProvisionalCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [applicationForm, setApplicationForm] = useState<{ file?: File; error?: string } | null>(null);
    const [DocCertificate, setDocCertificate] = useState<{ file?: File; error?: string } | null>(null);
    const [provisionalRequestType, setProvisionalRequestType] = useState<string>('nor');
    const navigate = useNavigate();
    const initialFormData = useMemo(
        () => ({
                doctor_id:Number(provisional?.doctor_id)||0,        
                reason: provisional?.reason || '',
                approval_status:  provisional?.approval_status || '',
                docuemt1:  provisional?.docuemt1 || ''
          
        }),
        [provisional]
    );
    const submitForm = useCallback(
        async (values: ProvisionalDuplicateType) => {
            try {
                const doctorId = Number(LocalStorageManager.getDoctorSerialId());
                const doctorPrimaryId = Number(LocalStorageManager.getDoctorPrimaryId());
                const provisionalDuplicateInfo = {
                    ...values,
                    modifiedon: moment().format('YYYY-MM-DD h:mm:ss'),
                    doctorId:doctorId,
                }
                const formData = new FormData();
                formData.append("provisionalDuplicateInfo", JSON.stringify(provisionalDuplicateInfo));
              
                if (DocCertificate?.file) {
                    formData.append("document1", DocCertificate?.file);
                }
                secureLocalStorage.setItem("regType", 'provisionalDuplicate');
                secureLocalStorage.setItem("provisionalDuplicateInfo", formData);
                    const { success } = await duplicateService.duplicateRegistration(formData);
                    if (success) {
                        Swal.fire({
                            title: "Success",
                            text: "Provisional Duplicate successfully created",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                navigate(routes.payment, { state: { doctor_id: Number(doctorId), regType: 'provisionalDuplicate' } });
                            }
                        });
                    }
                
            } catch (err) {
                Swal.fire({
                    //title: "Error",
                    text: "Provisional registered failed",
                    icon: "error",
                    confirmButtonText: "OK",
                })
                console.log('error in provisional registeration update', err);
            }
        },
        [provisional, provisionalCertificate, applicationForm, DocCertificate]
    );
    return (
        <>
            <section className='gray-banner'>
                <div className="container mt-4">
                    <div className="col-9 m-auto">
                        <div className="card shadow border-0 mb-4">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <h1 className='fs-22 fw-700 me-2 mb-0'>Provisional Duplicate Registration</h1>
                                    <p className='mb-0 fs-13'>(Please check your personal details and click on next)</p>
                                </div>
                                <hr />
                                <DoctorInfoCard />
                            </div>

                        </div>
                    </div>
                    <div className="col-9 m-auto">
                        <div className="card shadow border-0 mb-4">
                            <div className="card-body">
                                <h1 className='fs-22 fw-700'>Provisional Duplicate Registration</h1>
                                <hr />
                                <Formik
                                    onSubmit={submitForm}
                                    enableReinitialize
                                    initialValues={initialFormData}
                                >
                                    {(formikProps: FormikProps<ProvisionalDuplicateType>) => {
                                        const { isValid, handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm } = formikProps;

                                        return (
                                            <form onSubmit={handleSubmit}>
                                                <div className="row mb-2">
                                                    <div className="col-4">
                                                        <label className="mb-2">Reason</label>
                                                        <select name="reason" className="form-select form-select-sm" tabIndex={1}>
                                                            <option value="">Select</option>
                                                            <option value="notk">Not Known</option>
                                                            <option value="surr">Surrender</option>
                                                            <option value="lost">Lost</option>
                                                        </select>
                                                    </div>
                                                    <div className="row mb-2 mt-4">
                                                    <div className="col-4">
                                                        <div className="drag-img-box d-flex align-items-center justify-content-center">
                                                            <Field name="edu_cert3">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    const file = DocCertificate?.file
                                                                        ? DocCertificate?.file.name
                                                                        : field.value || null;
                                                                    return file ? (
                                                                        <p className="d-flex align-items-center">
                                                                            <strong>Uploaded:</strong>
                                                                            <span className="ms-1">{file}</span>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    setFieldValue(field.name, '');
                                                                                    setDocCertificate(null);
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
                                                                                            setDocCertificate({ file });
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
                                                                                        <p className='fs-13'>Upload Doc</p>
                                                                                    </div>
                                                                                </div>
                                                                            </Files>
                                                                            <small className="text-danger mt-1">
                                                                                {DocCertificate?.error}
                                                                            </small>
                                                                            {error && <small className="text-danger">{error.toString()}</small>}
                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-100 text-end mt-3">
                                                            {/* isValid? setNext(false):setNext(true) */}
                                                            <button type='button' onClick={() => { setNext(false) }} className='btn btn-primary me-3'><i className="bi-chevron-left"></i>Back </button>
                                                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                                                {isSubmitting && <span className="spinner-border spinner-border-sm" />} Submit
                                                            </button>
                                                        </div>
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

export default ProvisionalDuplicate;