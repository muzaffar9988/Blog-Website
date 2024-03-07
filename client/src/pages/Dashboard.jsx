import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Dashsidebar from "../components/Dashsidebar";
import Dashprofile from "../components/Dashprofile";
import Dashposts from "../components/Dashposts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) setTab(tabFromUrl);
    console.log(tabFromUrl);
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full mx-auto ">
      {/* sidebar  */}
      <div className="md:w-56">
        <Dashsidebar />
      </div>
      {/* profile  */}
      <div className="w-full mx-auto">
        <div className="w-full ">{tab === "profile" && <Dashprofile />}</div>
        <div className="w-full ">{tab === "posts" && <Dashposts />}</div>
        <div className="w-full ">{tab === "users" && <DashUsers />}</div>
        <div className="w-full">{tab === "comments" && <DashComments />}</div>
        <div>{tab === "dash" && <DashboardComp />}</div>
      </div>
    </div>
  );
}
