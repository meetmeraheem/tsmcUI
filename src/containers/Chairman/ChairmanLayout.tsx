import React, { useState } from "react";
import TabComponent from "./../Tabs/TabComponent";

import  ChairmanDashboard from "../Chairman/ChairmanBoard";
import ChairmanSearch from "../Chairman/ChairmanSearch";
type TabsType = {
  label: string;
  index: number;
  Component: React.FC<{}>;
}[];

// Tabs Array
const tabs: TabsType = [
  {
    label: "Dashboard",
    index: 1,
    Component: ChairmanDashboard
  },
  {
    label: "Advanced Search",
    index: 2,
    Component: ChairmanSearch
  },
 
 
 
];

export default function App() {
  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);
return (
      <TabComponent selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />
  );
}
