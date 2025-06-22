
import React, { useState } from "react";
import TabComponent from "./../Tabs/TabComponent";
import FMRDocSearch from "../FmrEntry/FMRDocSearch";


type TabsType = {
  label: string;
  index: number;
  Component: React.FC<{}>;
}[];

// Tabs Array
const tabs: TabsType = [
  {
    label: "FMR Entry",
    index: 1,
    Component: FMRDocSearch
  },
 
 
];



const  FMRSearchLayout =() => {
  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);
return (
    <TabComponent selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />
  );
}

export default FMRSearchLayout;
