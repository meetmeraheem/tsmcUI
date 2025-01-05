import { Provider } from "react-redux";
import { store } from "../redux";
import MainRoute from "./routes/routes";
import {useEffect } from 'react';

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

const parseVersion = (str:any) => +str.replace(/\D/g, '');
const clearCacheData = () => {
    fetch(`/meta.json`)
    .then((response) => response.json())
    .then((meta) => {
      if (meta?.version) {
        const metaVersion = parseVersion(meta.version);
        const packageVersion = parseVersion("05.01.2025");
        console.log("metaVersion"+metaVersion);
        console.log("packageVersion"+packageVersion);
        if (packageVersion < metaVersion) {
            
          if (window?.location?.reload) {
          window.location.reload();
         }
        }
      }
    })
    .catch((error) => {
      console.error('something went wrong fetching meta.json', error);
    });
    
    console.log("Complete Cache Cleared");
};  


const App = () => {
  useEffect(() => {
    clearCacheData();
  }, []);
    return (
        <Provider store={store}>
            <MainRoute />
        </Provider>
    );
};

export default App;