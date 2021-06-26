import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import "../Footer.css";

const Footer = (props) => (
  <div id="footer2">
    <div id="contentInFooter">
      <div id="about">
        <Link
          to={{
            pathname: "/about",
            state: { props },
          }}
        >
          <Button
            id="button"
            type="button"
            className="btn btn-danger"
            color="secondary"
          >
            About Us
          </Button>
        </Link>
      </div>
      <div id="contact">
        <Link
          to={{
            pathname: "/contact",
            state: { props },
          }}
        >
          <Button
            id="button"
            type="button"
            className="btn btn-danger"
            color="secondary"
          >
            Contact Us
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

export default Footer;
