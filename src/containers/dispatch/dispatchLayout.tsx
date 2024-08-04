
import React, { useState } from "react";
import TabComponent from "./../Tabs/TabComponent";
import DispatchSearch from "../dispatch/dispatchSearch";
import DispatchList from "../dispatch/dispatchList";

type TabsType = {
  label: string;
  index: number;
  Component: React.FC<{}>;
}[];

// Tabs Array
const tabs: TabsType = [
  {
    label: "Dispatch Entry",
    index: 1,
    Component: DispatchSearch
  },
  {
    label: "Dispatch List",
    index: 2,
    Component: DispatchList
  },
 
 
 
];



const  DispatchLayout =() => {
  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);
return (
    <TabComponent selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />
  );
}

export default DispatchLayout;
