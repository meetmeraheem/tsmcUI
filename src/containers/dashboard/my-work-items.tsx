import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";

import ProvisionalWorkItems from "../dashboard/provisional-work-items";
import FinalWorkItems from "../dashboard/final-work-items";
import NocWorkItems from "../dashboard/noc-work-items";
import AdditionalWorkItems from "../dashboard/additional-work-items";
import GoodStandingWorkItems from "../dashboard/goodstanding-work-items";
import FinalRenewalsWorkItems from "../dashboard/renewals-work-items";



const MyWorkItems = () => {
    return (
        <>
            <div className="container-fluid">
            <ProvisionalWorkItems />
            <FinalWorkItems />
            <NocWorkItems />
            <AdditionalWorkItems />
            <GoodStandingWorkItems />
            <FinalRenewalsWorkItems/>
            </div>
        </>
    )
}

export default MyWorkItems;