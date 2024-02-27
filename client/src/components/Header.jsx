import { Button, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";

export default function Header() {
  let path = useLocation().pathname;
  return (
    <Navbar>
      <Link
        to={"/"}
        className="text-sm sm:text-xl font-semibold whitespace-nowrap self-center dark:text-white"
      >
        <span className="px-2 py-1 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 text-white ">
          Nexus
        </span>
        Blogs
      </Link>
      <form>
        <TextInput
          placeholder="Search..."
          type="text"
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        ></TextInput>
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2 ">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FaMoon />
        </Button>
        <Link to={"/sign-in"}>
          <Button gradientDuoTone="purpleToBlue">Sign In</Button>
        </Link>
        <Navbar.Toggle></Navbar.Toggle>
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/home"} as={"div"}>
          <Link to={"/home"}>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to={"/about"}>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/project"} as={"div"}>
          <Link to={"/projects"}>Projects </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
