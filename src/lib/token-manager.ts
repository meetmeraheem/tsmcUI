export const tokenManager = {
    getToken: function () {
        const token = localStorage.getItem('token');
        return token || null;
    },

    setToken: function (token: string) {
        localStorage.setItem('token', token);
    },

    removeToken: function () {
        if (this.getToken()) {
            localStorage.removeItem('token');
        }
    },
};
