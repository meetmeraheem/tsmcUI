import React, { useState } from "react";
import TabComponent from "./../../Tabs/TabComponent";
import ProvisionalWorkItems from "../../dashboard/provisional-work-items";
import FinalWorkItems from "../../dashboard/final-work-items";
import NocWorkItems from "../../dashboard/noc-work-items";
import AdditionalWorkItems from "../../dashboard/additional-work-items";
import GoodStandingWorkItems from "../../dashboard/goodstanding-work-items";
import FinalRenewalsWorkItems from "../../dashboard/renewals-work-items";
import ChangeofNameWorkItems from "../../dashboard/changeofname-work-items";
import ProvRevalidationRegWorkItems from "../../dashboard/prov-revalidation-work-items";


type TabsType = {
  label: string;
  index: number;
  Component: React.FC<{}>;
}[];

// Tabs Array
const tabs: TabsType = [
  {
    label: "Provisional",
    index: 1,
    Component: ProvisionalWorkItems
  },
  {
    label: "Finals",
    index: 2,
    Component: FinalWorkItems
  },
  {
    label: "Additonals",
    index: 3,
    Component: AdditionalWorkItems
  },
  {
    label: "Finals Renewals",
    index: 4,
    Component: FinalRenewalsWorkItems
  },
  {
    label: "Noc",
    index: 5,
    Component: NocWorkItems
  },
  {
    label: "Good Standing",
    index: 6,
    Component: GoodStandingWorkItems
  },
 
 /* {
    label: "Change of Name ",
    index: 7,
    Component: ChangeofNameWorkItems
  },
  {
    label: "Provisional Revalidations",
    index: 8,
    Component: ProvRevalidationRegWorkItems
  },*/
];

export default function App() {
  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);
return (
      <TabComponent selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />
  );
}
