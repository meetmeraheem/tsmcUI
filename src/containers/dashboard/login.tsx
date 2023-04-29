import { useCallback, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import SiteLogo from '../../assets/images/logo.png'
import { adminService } from "../../lib/api/admin";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import { tokenManager } from "../../lib/token-manager";
import { USERNAME_REGEX } from "../../lib/utils/validation";
import { setAdminInfo } from "../../redux/admin";
import { routes } from "../routes/routes-names";

const AdminLogin = () => {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [usernameError, setUsernameError] = useState<boolean>(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState<string>('');
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const signIn = async (e: any) => {
        e.preventDefault();
        try {
            if (username && password) {
                if (!usernameError && !passwordError) {
                    setIsSubmitting(true);
                    const { success,data,token } = await adminService.signIn({
                        username: username,
                        password: password,
                    });
                    if (success) {
                        console.log('token ' + JSON.stringify(token));
                        tokenManager.setToken(token);
                        LocalStorageManager.setAdminPrimaryId(data[0].id.toString());
                        LocalStorageManager.setUserType(data[0].user_type);
                        dispatch(setAdminInfo(data[0]));
                        setUsernameError(false);
                        setUsernameErrorMessage('');
                        setPasswordError(false);
                        setPasswordErrorMessage('');
                        navigate(routes.admin_dashboard);
                        setIsSubmitting(false);
                    }
                    else {
                        setIsSubmitting(false);
                        Swal.fire({
                            //title: "Error",
                            text: "Login failed",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    }
                }
                else {
                    validateUsername(username);
                    passwordValidation(password);
                }

            }
            else {
                setUsernameError(true);
                setUsernameErrorMessage('Username is required.');
                setPasswordError(true);
                setPasswordErrorMessage('Password is required.');
            }
        } catch (error) {
            if (error) {
                //setMsg(error.response.data.msg);
                Swal.fire({
                    //title: "Error",
                    text: "Login failed",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
            setIsSubmitting(false);
        }
    }

    const validateUsername = useCallback(async (username: string) => {
        if (username.length == 0) {
            setUsernameError(true);
            setUsernameErrorMessage('Username is required.');
        }
        else {
            setUsername(username);
            setUsernameError(false);
            setUsernameErrorMessage('');
        }

    }, [usernameError, usernameErrorMessage, username]);

    const passwordValidation = useCallback(async (password: any) => {
        if (password.length == 0) {
            setPasswordError(true);
            setPasswordErrorMessage('Password is required.');
        }
        else {
            setPassword(password);
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

    }, [passwordError, passwordErrorMessage, password]);

    return (
        <>
            <section className="vh-100 d-flex align-items-center justify-content-center">
                <div className="col-3 bg-light">
                    <div className="card">
                        <div className="card-body text-center p-4">
                            <img src={SiteLogo} width="90" className="mb-3" alt="" />
                            <h3 className="mb-4 fw-600">TSMC Login</h3>
                            <form id="" onSubmit={signIn} className="mb-3">
                                <div className="form-floating mb-3">
                                    <input type="username" className={`form-control ${usernameError ? 'is-invalid' : ''
                                        }`} id="Username"
                                        onChange={(e) => validateUsername(e.target.value)} placeholder="Enter Username" />
                                    {usernameError && <small className="text-danger">{usernameErrorMessage}</small>}
                                    <label htmlFor="username"><i className="bi-person text-primary"></i> Enter Username</label>
                                </div>
                                <div className="form-floating">
                                    <input className={`form-control ${passwordError ? 'is-invalid' : ''
                                        }`} type="password" onChange={(e) => passwordValidation(e.target.value)} id="password" placeholder="Enter Password" />
                                    <label htmlFor="password"><i className="bi-lock text-primary"></i> Enter Password</label>
                                    {passwordError && <small className="text-danger">{passwordErrorMessage}</small>}
                                </div>
                                <div className="mt-3">
                                    <button type="submit" disabled={isSubmitting} className="btn btn-primary w-100">
                                        {isSubmitting && <span className="spinner-border spinner-border-sm" />} Login
                                    </button>
                                </div>
                            </form>
                            <p className="fs-14">Application Developed by <a href=".">Pinank Solutions</a> <br /> 2023 © All Copyrights Reserved for TSMC</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AdminLogin;