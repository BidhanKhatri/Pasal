import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="border-t ">
      <div className="container mx-auto  text-center flex flex-col gap-2 p-4">
        <p>&copy; 2025 All rights reserved</p>
        <div className="flex items-center gap-4 justify-center text-2xl p-4">
          <a href="" className="hover:text-lime-500">
            <FaFacebook />
          </a>
          <a href="" className="hover:text-lime-500">
            <FaInstagram />
          </a>
          <a href="" className="hover:text-lime-500">
            <FaLinkedin />
          </a>
          <a href="" className="hover:text-lime-500">
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
