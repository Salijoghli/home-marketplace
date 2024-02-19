import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ExploreIcon from "../../assets/svg/exploreIcon.svg?react";
import OfferIcon from "../../assets/svg/localOfferIcon.svg?react";
import ProfileIcon from "../../assets/svg/personOutlineIcon.svg?react";

const navItems = [
  { path: "/", label: "Explore", icon: <ExploreIcon /> },
  { path: "/offers", label: "Offers", icon: <OfferIcon /> },
  { path: "/profile", label: "Profile", icon: <ProfileIcon /> },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathMatchRoute = (route: string) => route === location.pathname;

  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          {navItems.map((item) => (
            <li
              key={item.path}
              className="navbarListItem"
              onClick={() => navigate(item.path)}
            >
              {React.cloneElement(item.icon, {
                fill: pathMatchRoute(item.path) ? "#2c2c2c" : "#8f8f8f",
                width: "36px",
                height: "36px",
              })}
              <p
                className={
                  pathMatchRoute(item.path)
                    ? "navbarListItemNameActive"
                    : "navbarListItemName"
                }
              >
                {item.label}
              </p>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
};
