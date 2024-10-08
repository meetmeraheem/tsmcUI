import React, { useState } from "react";
import TabComponent from "./../Tabs/TabComponent";

import  chairmanDashboard from "../Chairman/ChairmanDashBoardLayout ";
import AdminDashboardHome from "../dashboard/dashboard";

type TabsType = {
  label: string;
  index: number;
  Component: React.FC<{}>;
}[];

// Tabs Array
const tabs: TabsType = [
  {
    label: "Chairman View",
    index: 1,
    Component: chairmanDashboard
  },
  {
    label: "Admin View",
    index: 2,
    Component: AdminDashboardHome
  },
 
 
 
];

export default function App() {
  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);
return (
      <TabComponent selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />
  );
}
