import React, { useState, useRef, useEffect } from "react";
import {
  FaAirbnb,
  FaBars,
  FaGlobe,
  FaUserCircle,
  FaSearch,
  FaTimes,
  FaPlusCircle,
  FaMinusCircle,
} from "react-icons/fa";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const dummyLocations = [
  "New York, NY",
  "London, UK",
  "Paris, France",
  "Tokyo, Japan",
  "Sydney, Australia",
];

const RootHeader = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState(1);
  const [activeField, setActiveField] = useState(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);


  const { user, logout } = useAuthStore();

  const searchRef = useRef(null);
  const datesRef = useRef(null);
  const guestsRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setActiveField((prev) => (prev === "location" ? null : prev));
      }
      if (datesRef.current && !datesRef.current.contains(event.target)) {
        setActiveField((prev) => (prev === "dates" ? null : prev));
      }
      if (guestsRef.current && !guestsRef.current.contains(event.target)) {
        setActiveField((prev) => (prev === "guests" ? null : prev));
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    if (!isMobileSearchOpen) {
      setActiveField("location");
    } else {
      setActiveField(null);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleFieldClick = (fieldName) => {
    setActiveField(fieldName);
  };

  const handleGuestChange = (change) => {
    setGuests((prevGuests) => Math.max(1, prevGuests + change));
  };

  const handleSearchClick = () => {
    console.log("Searching with:", {
      location,
      startDate: dateRange[0].startDate,
      endDate: dateRange[0].endDate,
      guests,
    });
  };

  const formatDate = (date) => (date ? format(date, "MMM dd") : "Add dates");

  const getGuestText = () => {
    if (guests === 1) return "1 guest";
    return `${guests} guests`;
  };

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaAirbnb className="text-3xl text-red-500" />
          <span className="hidden sm:inline text-3xl text-red-500 font-semibold">
            airbnb
          </span>
          <button
            className="md:hidden text-xl text-gray-700 cursor-pointer mobile-menu-button"
            onClick={toggleMobileMenu}
          >
            <FaBars />
          </button>
        </div>

        <div
          className="md:hidden flex items-center border border-gray-300 rounded-full px-4 py-2 shadow-sm w-auto max-w-xs"
          onClick={toggleMobileSearch}
        >
          <FaSearch className="text-gray-500 mr-2" />
          <div className="text-sm text-gray-600 truncate">
            {location || "Anywhere"} • {formatDate(dateRange[0].startDate)} •{" "}
            {formatDate(dateRange[0].endDate)} • {getGuestText()}
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700">
          <span className="hover:text-gray-900 cursor-pointer">Homes</span>
          <span className="hover:text-gray-900 cursor-pointer">
            Experiences
          </span>
          <span className="hover:text-gray-900 cursor-pointer">
            Online Experiences
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="hidden md:inline text-sm font-medium text-gray-700 hover:underline cursor-pointer">
            Become a host
          </span>
          <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <FaGlobe className="text-xl text-gray-700" />
          </div>
          <div className="relative">
            <div
              onClick={toggleProfileMenu}
              className="flex items-center space-x-2 p-2 border border-gray-300 rounded-full hover:shadow-md cursor-pointer transition"
            >
              <FaBars className="text-sm text-gray-600" />
              <FaUserCircle className="text-2xl text-gray-600" />
            </div>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-800 border-b">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <div className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer">
                      Help Center
                    </div>
                    <div className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer">
                      Become a Host
                    </div>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer">
                      Help Center
                    </div>
                    <div className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer">
                      Become a Host
                    </div>
                    <div className="flex flex-col items-center w-full">
                      <Link
                        to="/signup"
                        className="px-4 py-2 w-full text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                      >
                        Sign up
                      </Link>
                      <Link
                        to="/login"
                        className="px-4 py-2 w-full text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                      >
                        Log in
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <hr className="my-1 text-gray-300" />

      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full z-40"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col space-y-4">
              <span className="text-gray-700 font-medium py-2 cursor-pointer hover:bg-gray-100 px-2 rounded">
                Homes
              </span>
              <span className="text-gray-700 font-medium py-2 cursor-pointer hover:bg-gray-100 px-2 rounded">
                Experiences
              </span>
              <span className="text-gray-700 font-medium py-2 cursor-pointer hover:bg-gray-100 px-2 rounded">
                Online Experiences
              </span>
              <span className="text-gray-700 font-medium py-2 cursor-pointer hover:bg-gray-100 px-2 rounded">
                Become a Host
              </span>
              <hr />
              <span className="text-gray-700 font-medium py-2 cursor-pointer hover:bg-gray-100 px-2 rounded">
                Help Center
              </span>
              <Link
                to="/signup"
                className="text-gray-700 font-medium py-2 cursor-pointer hover:bg-gray-100 px-2 rounded"
              >
                Sign up
              </Link>
              <Link
                to="/login"
                className="text-gray-700 font-medium py-2 cursor-pointer hover:bg-gray-100 px-2 rounded"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white py-4">
        <div className="container mx-auto px-4">
          <div className="relative hidden md:flex items-center bg-white border border-gray-300 rounded-full shadow-sm max-w-4xl mx-auto">
            <div className="flex w-full items-center">
              <div
                ref={searchRef}
                onClick={() => handleFieldClick("location")}
                className={`flex-1 min-w-0 flex flex-col px-6 py-2 rounded-l-full cursor-pointer transition-all duration-300 ${
                  activeField === "location"
                    ? "bg-gray-100 shadow-inner"
                    : "hover:bg-gray-50"
                }`}
              >
                <label className="text-xs font-bold">Where</label>
                <input
                  type="text"
                  placeholder="Search destinations"
                  className="bg-transparent w-full outline-none text-sm placeholder-gray-500"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="h-6 w-px bg-gray-300"></div>

              <div
                ref={datesRef}
                onClick={() => handleFieldClick("dates")}
                className={`flex-1 min-w-0 flex flex-col px-6 py-2 cursor-pointer transition-all duration-300 ${
                  activeField === "dates"
                    ? "bg-gray-100 shadow-inner"
                    : "hover:bg-gray-50"
                }`}
              >
                <label className="text-xs font-bold">Check in</label>
                <span className="text-sm text-gray-500">
                  {formatDate(dateRange[0].startDate)}
                </span>
              </div>

              <div className="h-6 w-px bg-gray-300"></div>

              <div
                ref={datesRef}
                onClick={() => handleFieldClick("dates")}
                className={`flex-1 min-w-0 flex flex-col px-6 py-2 cursor-pointer transition-all duration-300 ${
                  activeField === "dates"
                    ? "bg-gray-100 shadow-inner"
                    : "hover:bg-gray-50"
                }`}
              >
                <label className="text-xs font-bold">Check out</label>
                <span className="text-sm text-gray-500">
                  {formatDate(dateRange[0].endDate)}
                </span>
              </div>

              <div className="h-6 w-px bg-gray-300"></div>

              <div
                ref={guestsRef}
                onClick={() => handleFieldClick("guests")}
                className={`flex-1 min-w-0 flex flex-col px-6 py-2 rounded-r-full cursor-pointer transition-all duration-300 ${
                  activeField === "guests"
                    ? "bg-gray-100 shadow-inner"
                    : "hover:bg-gray-50"
                }`}
              >
                <label className="text-xs font-bold">Who</label>
                <span className="text-sm text-gray-500">{getGuestText()}</span>
              </div>
            </div>

            <button
              onClick={handleSearchClick}
              className="absolute right-2 p-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition shadow-md"
            >
              <FaSearch className="text-sm" />
            </button>
          </div>

          {isMobileSearchOpen && (
            <div className="md:hidden fixed inset-0 bg-white z-50 p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FaTimes className="text-lg" />
                </button>
                <span className="font-semibold">Edit your search</span>
                <div className="w-6"></div>
              </div>

              <div className="mb-4">
                <div className="text-xs font-bold mb-1">Where</div>
                <div
                  className="border border-gray-300 rounded-lg p-3 cursor-pointer"
                  onClick={() => setActiveField("location")}
                >
                  <input
                    type="text"
                    placeholder="Search destinations"
                    className="w-full outline-none"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs font-bold mb-1">When</div>
                <div
                  className="border border-gray-300 rounded-lg p-3 cursor-pointer flex justify-between"
                  onClick={() => setActiveField("dates")}
                >
                  <span>{formatDate(dateRange[0].startDate)}</span>
                  <span className="text-gray-400">to</span>
                  <span>{formatDate(dateRange[0].endDate)}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-xs font-bold mb-1">Who</div>
                <div
                  className="border border-gray-300 rounded-lg p-3 cursor-pointer"
                  onClick={() => setActiveField("guests")}
                >
                  {getGuestText()}
                </div>
              </div>

              <button
                className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition"
                onClick={() => {
                  handleSearchClick();
                  setIsMobileSearchOpen(false);
                }}
              >
                Search
              </button>
            </div>
          )}

          {activeField === "location" && (
            <div
              ref={searchRef}
              className="absolute top-full left-1/2 transform -translate-x-1/2 w-full md:w-[800px] mt-4 bg-white rounded-2xl shadow-xl z-50 p-6"
            >
              <h3 className="font-bold text-lg mb-4">Popular destinations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dummyLocations.map((loc) => (
                  <div
                    key={loc}
                    onClick={() => {
                      setLocation(loc);
                      setActiveField(null);
                      if (isMobileSearchOpen) setActiveField("dates");
                    }}
                    className="p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition"
                  >
                    <span className="font-medium">{loc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeField === "dates" && (
            <div
              ref={datesRef}
              className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-white rounded-2xl shadow-xl z-50 p-4 md:p-6 w-full max-w-screen-sm"
            >
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setDateRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                direction="horizontal"
                months={window.innerWidth < 768 ? 1 : 2}
                rangeColors={["#F43F5E"]}
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setActiveField(null)}
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {activeField === "guests" && (
            <div
              ref={guestsRef}
              className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-white rounded-2xl shadow-xl z-50 p-6 w-full max-w-sm"
            >
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">Adults</span>
                  <span className="text-sm text-gray-500">
                    Ages 13 or above
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleGuestChange(-1)}
                    disabled={guests === 1}
                    className="p-2 rounded-full border border-gray-300 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-500"
                  >
                    <FaMinusCircle />
                  </button>
                  <span className="font-bold w-6 text-center">{guests}</span>
                  <button
                    onClick={() => handleGuestChange(1)}
                    className="p-2 rounded-full border border-gray-300 text-gray-500 hover:border-gray-500"
                  >
                    <FaPlusCircle />
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setActiveField(null);
                    if (isMobileSearchOpen) setIsMobileSearchOpen(false);
                  }}
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default RootHeader;
