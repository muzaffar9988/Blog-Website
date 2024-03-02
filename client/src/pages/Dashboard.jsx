import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Dashsidebar from "../components/Dashsidebar";
import Dashprofile from "../components/Dashprofile";

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
    <div className="min-h-screen flex flex-col md:flex-row ">
      {/* sidebar  */}
      <div className="md:w-56">
        <Dashsidebar />
      </div>
      {/* profile  */}
      <div>{tab === "profile" && <Dashprofile />}</div>
    </div>
  );
}
