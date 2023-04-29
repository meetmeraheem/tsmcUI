import React from 'react'
import { useOutlet } from 'react-router-dom';
import LandingFooter from './footer';
import LandingHeader from './header';

const MainHomePage = () => {
     const outlet = useOutlet();
     return (
          <>
               <LandingHeader />
               <div>{outlet}</div>
               <LandingFooter />
          </>
     )
}

export default MainHomePage
