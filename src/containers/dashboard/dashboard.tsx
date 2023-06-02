import React, { useState } from "react";
import TabComponent from "./../Tabs/TabComponent";
import FinalRegistrations from '../dashboard/final-registration';
import ProvisionalRegistrations from '../dashboard/provisional-registrations';
import AdditionalRegList from '../dashboard/additional-registrations';
import GoodStandingRegList from '../dashboard/goodstanding-registrations';
import NocRegList from '../dashboard/noc-registrations';
import RenewalRegList from '../dashboard/renewal-registrations';



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
      Component: ProvisionalRegistrations
    },
    {
      label: "Finals",
      index: 2,
      Component: FinalRegistrations
    },
    {
      label: "Additonals",
      index: 3,
      Component: AdditionalRegList
    },
    {
      label: "Noc",
      index: 4,
      Component: NocRegList
    },
    {
      label: "Good Standing",
      index: 5,
      Component: GoodStandingRegList
    },
    {
      label: "Finals Renewals",
      index: 6,
      Component: RenewalRegList
    },
    
  ];

const AdminDashboardHome = () => {
    const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);
    return (
        <>
      <TabComponent selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />
        </>
    );
}

export default AdminDashboardHome;