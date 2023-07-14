import React, { useState } from "react";
import TabComponent from "./../Tabs/TabComponent";
import FinalRegistrations from '../dashboard/final-registration';
import ProvisionalRegistrations from '../dashboard/provisional-registrations';
import AdditionalRegList from '../dashboard/additional-registrations';
import GoodStandingRegList from '../dashboard/goodstanding-registrations';
import NocRegList from '../dashboard/noc-registrations';
import RenewalRegList from '../dashboard/renewal-registrations';
import ChangeofNameReg from '../dashboard/changeofname-registrations';
import  ProvRevalidationReg  from '../dashboard/prov-revalidation-registrations';


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
      label: "Finals Renewals",
      index: 4,
      Component: RenewalRegList
    },
    {
      label: "Noc",
      index: 5,
      Component: NocRegList
    },
    {
      label: "Good Standing",
      index: 6,
      Component: GoodStandingRegList
    },
    
 /*   {
      label: "Change of Name",
      index: 7,
      Component: ChangeofNameReg
    },
    {
      label: "Provisional Revalidations",
      index: 8,
      Component: ProvRevalidationReg
    },*/
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