export const devMode = process.env.NODE_ENV === 'development';

export const serverUrl = process.env.REACT_APP_API_URL+'/';

export const serverImgUrl = process.env.REACT_APP_IMAGE_API_URL;

export const apiHealthUrl = process.env.REACT_APP_API_HEALTH+'/';

export const apiUrl = `${serverUrl}`;

//export const paymentURL = devMode ? 'https://uatapi.payg.in/payment/api/order/create' : 'https://paygapi.payg.in/payment/api/order/create';
export const paymentURL = 'https://paygapi.payg.in/payment/api/order/create';

export const smsBaseURL = 'https://bhashsms.com/api/sendmsg.php?user=PINANKSOLUTIONS&pass=123456&sender=TSMCSM&';




// const payu = ({
//     key: 'EhYB37',
//     salt: 'Dud9MZY05pnwC6rpOZ3qh9gw0Jn0O2lm'
// });

// const hash = PayU(payu).hasher.generateHash({
//     txnid: `txnid12345onlinetsmc`,
//     amount: '10.00',
//     productinfo: 'Medical Council Registration',
//     firstname: 'Nageswara Rao',
//     email: 'nageswararao.g31@gmail.com',
// });
// const initialFormData: PaymentFormType = {
//     key: 'EhYB37',
//     amount: 10.00,
//     txnid: `txnid12345onlinetsmc`,
//     productinfo: 'Medical Council Provisional',
//     firstname: 'Nageswara Rao' || '',
//     email: 'nageswararao.g31@gmail.com' || '',
//     phone: '8099528126' || '',
//     lastname: 'Ganapavarapu' || '',
//     FullName: 'Nageswara Rao Ganapavarapu' || '',
//     surl: 'http://localhost:3000/paymentsuccess/',// Success URL
//     furl: 'http://localhost:3000/payment_failure/', // Failure URL
//     hash: hash
// }