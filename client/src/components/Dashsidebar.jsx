import { Sidebar } from "flowbite-react";

import { HiAnnotation, HiArrowSmRight, HiUser } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { HiDocumentText } from "react-icons/hi";
import { HiUserGroup } from "react-icons/hi";

export default function Dashsidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) setTab(tabFromUrl);
    console.log(tabFromUrl);
  }, [location.search]);

  // const handleSignout = async () => {
  //   const res = await fetch("/api/user/signout", {
  //     method: "POST",
  //   });
  //   console.log(res);
  // };

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) console.log("error in fetching response");
      else {
        console.log(data.message);
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "user"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                icon={HiDocumentText}
                labelColor="dark"
                as="div"
                active={tab === "posts"}
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <>
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  icon={HiUserGroup}
                  labelColor="dark"
                  as="div"
                  active={tab === "users"}
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  icon={HiAnnotation}
                  className="cursor-pointer"
                  labelColor="dark"
                  as="div"
                  active={tab === "comments"}
                >
                  <span>Comments</span>
                </Sidebar.Item>
              </Link>
            </>
          )}

          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
            <span onClick={handleSignOut}>Sign Out</span>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
