export const LocalStorageManager = {
    getDoctorPrimaryId: function () {
        const doctorPrimaryId = localStorage.getItem('doctorPrimaryId');
        return doctorPrimaryId || null;
    },

    setDoctorPrimaryId: function (doctorPrimaryId: string) {
        localStorage.setItem('doctorPrimaryId', doctorPrimaryId);
    },

    removeDoctorPrimaryId: function () {
        if (this.getDoctorPrimaryId()) {
            localStorage.removeItem('doctorPrimaryId');
        }
    },

    getDoctorSerialId: function () {
        const doctorSerialId = localStorage.getItem('doctorSerialId');
        return doctorSerialId || null;
    },

    setDoctorSerialId: function (SerialId: string) {
        localStorage.setItem('doctorSerialId', SerialId);
    },

    removeDoctorSerialId: function () {
        if (this.getDoctorSerialId()) {
            localStorage.removeItem('doctorSerialId');
        }
    },
    getDoctorFMRNo: function () {
        const doctorFMRNo = localStorage.getItem('doctorFMRNo');
        return doctorFMRNo || null;
    },

    setDoctorFMRNo: function (FMRNo: string) {
        localStorage.setItem('doctorFMRNo', FMRNo);
    },

    removeDoctorFMRNo: function () {
        if (this.getDoctorFMRNo()) {
            localStorage.removeItem('doctorFMRNo');
        }
    },

    getDoctorFMRStatus: function () {
        const doctorFMRNo = localStorage.getItem('doctorFMRStatus');
        return doctorFMRNo || null;
    },

    setDoctorFMRStatus: function (FMRStatus: string) {
        localStorage.setItem('doctorFMRStatus', FMRStatus);
    },

    removeDoctorFMRStatus: function () {
        if (this.getDoctorFMRNo()) {
            localStorage.removeItem('doctorFMRNo');
        }
    },

    getDoctorMobileno: function () {
        const mobileno = localStorage.getItem('mobileno');
        return mobileno || null;
    },

    setDoctorMobileno: function (doctorMobileno: string) {
        localStorage.setItem('mobileno', doctorMobileno);
    },

    removeDoctorMobileno: function () {
        if (this.getDoctorMobileno()) {
            localStorage.removeItem('mobileno');
        }
    },

    //Admin
    getAdminPrimaryId: function () {
        const adminPrimaryId = localStorage.getItem('adminPrimaryId');
        return adminPrimaryId || null;
    },

    setAdminPrimaryId: function (adminPrimaryId: string) {
        localStorage.setItem('adminPrimaryId', adminPrimaryId);
    },

    removeAdminPrimaryId: function () {
        if (this.getAdminPrimaryId()) {
            localStorage.removeItem('adminPrimaryId');
        }
    },

     //Admin
     getUserType: function () {
        const userType = localStorage.getItem('userType');
        return userType || null;
    },

    setUserType: function (userType: string) {
        localStorage.setItem('userType', userType);
    },

    removeUserType: function () {
        if (this.getUserType()) {
            localStorage.removeItem('userType');
        }
    },

    //Payment Getway
    getOrderKeyId: function () {
        const orderKeyId = localStorage.getItem('orderKeyId');
        return orderKeyId || null;
    },

    setOrderKeyId: function (orderKeyId: string) {
        localStorage.setItem('orderKeyId', orderKeyId);
    },

    removeOrderKeyId: function () {
        if (this.getOrderKeyId()) {
            localStorage.removeItem('orderKeyId');
        }
    },
};
