import { useEffect, useRef, useState } from "react";
import styles from "../Table/Table.module.css";
import { useNavigate } from "react-router-dom";
const Table = () => {
  const [cities, setCities] = useState([]);
  const [originalCities, setOriginalCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [more, setMore] = useState(true);
  const [isShow, setIsShow] = useState(true);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [selectedPopulation, setSelectedPopulation] = useState("");
  const pageRef = useRef(1);
  const navigate = useNavigate();

  const handleWeatherReport = (city, e) => {
    if (e.button === 2) {
      localStorage.setItem("city", city.name);
      e.preventDefault();
      window.open("/weather", "_blank");
    } else {
      localStorage.setItem("city", city.name);
      navigate("/weather");
    }
  };

  const handleSearch = (city) => {
    if (!city.trim()) {
      setCities(originalCities);
    } else {
      const filteredNewcity = cities.filter((item) =>
        item.name.toLowerCase().includes(city.toLowerCase())
      );
      setCities(filteredNewcity);
    }
    setSelectedCity(city);
  };

  const handleFilterByCoutry = (value) => {
    if (!value.trim()) {
      setCities(originalCities);
    } else {
      const filteredNewcountry = cities.filter((item) =>
        item.country.toLowerCase().includes(value.toLowerCase())
      );
      setCities(filteredNewcountry);
    }
    setSelectedCountry(value);
  };

  const handleFilterByTimezone = (value) => {
    if (!value.trim()) {
      setCities(originalCities);
    } else {
      const filteredNewTimezone = cities.filter((item) =>
        item.timezone.toLowerCase().includes(value.toLowerCase())
      );
      setCities(filteredNewTimezone);
    }
    setSelectedTimezone(value);
  };

  const handleFilterByPopulation = (value) => {
    if (!value.trim()) {
      setCities(originalCities);
    } else {
      const filteredNewPopulation = cities.filter(
        (item) => item.population == value
      );
      setCities(filteredNewPopulation);
    }
    setSelectedPopulation(value);
  };

  const handleSortCityName = () => {
    const sortedCities = [...cities].sort((a, b) => {
      const firstCity = a.name.toLowerCase();
      const secondCity = b.name.toLowerCase();

      if (firstCity < secondCity) {
        return -1;
      }
      if (firstCity > secondCity) {
        return 1;
      }
      return 0;
    });
    setCities(sortedCities);
  };

  const handleSortByCountryName = () => {
    const sortedContries = [...cities].sort((a, b) => {
      const firstName = a.timezone.toLowerCase();
      const secondName = b.timezone.toLowerCase();

      if (firstName < secondName) {
        return -1;
      }
      if (firstName > secondName) {
        return 1;
      }
      return 0;
    });
    setCities(sortedContries);
  };

  const handleSortByTimezone = () => {
    const sortedContries = [...cities].sort((a, b) => {
      const firstName = a.country.toLowerCase();
      const secondName = b.country.toLowerCase();

      if (firstName < secondName) {
        return -1;
      }
      if (firstName > secondName) {
        return 1;
      }
      return 0;
    });
    setCities(sortedContries);
  };

  const handleSortByPopulation = () => {
    const sortedContries = [...cities].sort((a, b) => {
      const firstName = a.population;
      const secondName = b.population;

      if (firstName < secondName) {
        return -1;
      }
      if (firstName > secondName) {
        return 1;
      }
      return 0;
    });
    setCities(sortedContries);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchCities();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsShow(!isShow);
      clearInterval(interval);
    }, 1000);
  }, [isShow]);

  const fetchCities = () => {
    fetch(
      `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&offset=${
        (pageRef.current - 1) * 20
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        const newCities = data.results.map((item) => ({
          name: item.name,
          country: item.cou_name_en,
          timezone: item.timezone,
          countrycode: item.country_code,
          coordinates: item.coordinates,
          population: item.population,
        }));
        if (newCities.length === 0) {
          setMore(false);
          return;
        }
        setIsLoading(false);
        setIsError(false);
        setCities((prevCities) => [...prevCities, ...newCities]);
        setOriginalCities((prevCities) => [...prevCities, ...newCities]);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        console.log("Error fetching data:", err);
      });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (
        scrollTop + clientHeight >= scrollHeight - 100 &&
        !isLoading &&
        more
      ) {
        pageRef.current++;
        fetchCities();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, more]);

  return (
    <div>
      <div
        className="lg:w-[90%] w-[100%] lg:h-[100px] h-[200px] flex flex-grow-1 lg:justify-between lg:items-center lg:flex-row flex-col justify-evenly lg:mt-0 lg:mb-0  mb-2 fixed lg:left-[5%] left-0 top-0 lg:pl-0 pl-[5%] bg-white"
        style={{ fontFamily: "Poppins" }}
        id={styles.search}
      >
        <h2 className="text-xl font-bold lg:mr-1 mr-0">Cities Table Data</h2>
        <div className="w-auto lg:h-auto h-[50px] flex items-center">
          {isShow && (
            <h2 className="text-base font-bold lg:mr-1 mr-0 text-red-400 text-justify">
              Click on the any cityname to view weather details
            </h2>
          )}
        </div>
        <input
          className="lg:w-[300px] md:w-[350px] w-[270px] h-[50px] pl-3 pr-3 border-gray-700 border-2 rounded-md text-gray-900"
          style={{ fontFamily: "Poppins" }}
          placeholder="Search city here"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {!isError && !isLoading && (
        <table
          className="border-collapse m-auto w-[90%] h-[90%] text-start lg:text-base text-xs lg:mt-[100px] mt-[200px]"
          style={{ fontFamily: "Poppins" }}
          id={styles.table}
        >
          <thead className="sticky lg:top-[100px] top-[200px]">
            <tr className="bg-slate-400">
              <th className="lg:pl-5 lg:pr-5 pl-1 pr-1 pt-2 pb-2 text-start">
                S.No
              </th>
              <th className="lg:pl-5 flex justify-start md:gap-[5%] gap-[1%] lg:pr-5 pl-1 pr-1  pt-2 pb-2 text-start">
                Cityname
                <svg
                  className="cursor-pointer w-[15px] lg:w-[25px] h-[15px] lg:h-[25px]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  onClick={handleSortCityName}
                >
                  <path d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z" />
                </svg>
                <select
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-[50px] h-auto bg-slate-400 cursor-pointer"
                  value={selectedCity}
                >
                  <option></option>
                  {cities.map((ele, index) => {
                    return <option key={index}>{ele.name}</option>;
                  })}
                </select>
              </th>
              <th className="lg:pl-5 lg:pr-5 pl-1 pr-1 pt-2 pb-2 text-start">
                <div className="flex lg:gap-[5%] gap-[1%]">
                  Country
                  <div>
                    <svg
                      className="cursor-pointer w-[15px] lg:w-[25px] h-[15px] lg:h-[25px]"
                      width="25px"
                      height="25px"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                      onClick={handleSortByCountryName}
                    >
                      <path d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z" />
                    </svg>
                  </div>
                  <div>
                    <select
                      onChange={(e) => handleFilterByCoutry(e.target.value)}
                      className="w-[50px] h-auto bg-slate-400 cursor-pointer"
                      value={selectedCountry}
                    >
                      <option></option>
                      {cities.map((ele, index) => {
                        return <option key={index}>{ele.country}</option>;
                      })}
                    </select>
                  </div>
                </div>
              </th>
              <th className="lg:pl-5 lg:pr-5 pl-1 pr-1 pt-2 pb-2 text-start">
                <div className="flex lg:gap-[5%] gap-[1%]">
                  Timezone
                  <div>
                    <svg
                      className="cursor-pointer  w-[15px] lg:w-[25px] h-[15px] lg:h-[25px]"
                      width="25px"
                      height="25px"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                      onClick={handleSortByTimezone}
                    >
                      <path d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z" />
                    </svg>
                  </div>
                  <div>
                    <select
                      onChange={(e) => handleFilterByTimezone(e.target.value)}
                      className="w-[50px] h-auto bg-slate-400 cursor-pointer"
                      value={selectedTimezone}
                    >
                      <option></option>
                      {cities.map((ele, index) => {
                        return <option key={index}>{ele.timezone}</option>;
                      })}
                    </select>
                  </div>
                </div>
              </th>

              <th className="lg:pl-5 lg:pr-5 pl-1 pr-1 pt-2 pb-2 text-start">
                <div className="flex lg:gap-[5%] gap-[1%]">
                  Population
                  <div>
                    <svg
                      className="cursor-pointer w-[15px] lg:w-[25px] h-[15px] lg:h-[25px]"
                      width="25px"
                      height="25px"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                      onClick={handleSortByPopulation}
                    >
                      <path d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z" />
                    </svg>
                  </div>
                  <div>
                    <select
                      onChange={(e) => handleFilterByPopulation(e.target.value)}
                      className="w-[50px] h-auto bg-slate-400 cursor-pointer"
                      value={selectedPopulation}
                    >
                      <option></option>
                      {cities.map((ele, index) => {
                        return <option key={index}>{ele.population}</option>;
                      })}
                    </select>
                  </div>
                </div>
              </th>

              <th className="lg:pl-5 lg:pr-5 pl-1 pr-1 pt-2 pb-2 text-start">
                Coordinates
              </th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city, index) => (
              <tr
                key={index}
                style={
                  index % 2 === 0
                    ? { backgroundColor: "#FFFFFF" }
                    : { backgroundColor: "#E0E0E0" }
                }
              >
                <td className="lg:pl-5 lg:pr-5 pl-1 pr-1 pt-2 pb-2">
                  {++index}
                </td>
                <td
                  className="lg:pl-5 lg:pr-5 pl-1 pr-1 pt-2 pb-2 cursor-pointer hover:bg-slate-700 hover:text-white hover:rounded-lg transition-colors"
                  onClick={(e) => handleWeatherReport(city, e)}
                  onContextMenu={(e) => {
                    handleWeatherReport(city, e);
                  }}
                >
                  {city.name}
                </td>
                <td className="lg:pl-5 lg:pr-5 pl-1 pr-1 pt-2 pb-2">
                  {city.country}
                </td>
                <td className="lg:pl-5 lg:pr-5 pl-1 pr-1 pt-2 pb-2">
                  {city.timezone}
                </td>
                <td className="lg:pl-5 lg:pr-5 pl-1 pr-1 pt-2 pb-2">
                  {city.population}
                </td>
                <td className="lg:pl-5 lg:pr-5 pl-1 pr-1 pt-2 pb-2">
                  {city.coordinates.lon}, {city.coordinates.lat}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!isError && isLoading && (
        <div className="lg:ml-[40%] m-[30%] lg:mt-[150px] mt-[250px]">
          <button
            type="button"
            className="bg-indigo-500 pl-3 pr-3 p-3 rounded-xl flex text-white"
            disabled
            style={{ fontFamily: "Poppins" }}
          >
            <span className="animate-spin block h-5 w-5 mr-3 border-l-2 border-r-2 border-b-2 border-l-white border-r-white border-b-white rounded-full bg-indigo-500"></span>
            Loading...
          </button>
        </div>
      )}
      {!isError && !isLoading && !more && <p>No more cities to load.</p>}
      {isError && !isLoading && (
        <div className="w-[100%] h-[200px] flex justify-center items-center" style={{marginTop:"200px",fontFamily:"Poppins"}}>
          <span className="text-xl text-red-500 font-bold">
            Error while fetch the data please try again!!!
          </span>
        </div>
      )}
    </div>
  );
};

export default Table;
