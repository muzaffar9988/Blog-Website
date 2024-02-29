import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function FooterCom() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to={"/"}
              className="text-lg sm:text-xl font-semibold whitespace-nowrap self-center dark:text-white"
            >
              <span className="px-2 py-1 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 text-white ">
                Nexus
              </span>
              Blogs
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8   sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="about" />
              <Footer.LinkGroup col>
                {" "}
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  Projects
                </Footer.Link>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  Nexus Blogs
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="follow us" />
              <Footer.LinkGroup col>
                {" "}
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  GitHub
                </Footer.Link>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  Discord
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                {" "}
                <Footer.Link href="#">Privacy & Policy</Footer.Link>
                <Footer.Link href="#">Terms & Condition</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Nexus"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 mt-4 sm:justify-center">
            <Footer.Icon href="#" icon={FaGithub}></Footer.Icon>
            <Footer.Icon href="#" icon={FaLinkedin}></Footer.Icon>
            <Footer.Icon href="#" icon={FaFacebook}></Footer.Icon>
            <Footer.Icon href="#" icon={FaInstagram}></Footer.Icon>
            <Footer.Icon href="#" icon={FaXTwitter}></Footer.Icon>
          </div>
        </div>
      </div>
    </Footer>
  );
}
