import { Provider } from "react-redux";
import { store } from "../redux";
import MainRoute from "./routes/routes";
import "@fontsource/poppins";
import "@fontsource/poppins/400.css"
import "@fontsource/poppins/600.css"
import "@fontsource/poppins/700.css"

//import 'bootstrap/scss/bootstrap.scss';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './../assets/styles/styles.css';
import "react-date-picker/dist/DatePicker.css";

const App = () => {
    return (
        <Provider store={store}>
            <MainRoute />
        </Provider>
    );
};

export default App;