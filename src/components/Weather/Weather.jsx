import { useEffect, useState } from "react";
import cloud1 from "../../../public/cloud1.png";
import cloud2 from "../../../public/cloud2.png";
import windspeed from "../../../public/windspeed.png";
import maxTemp from "../../../public/maxTemp.jpg";
import minTemp from "../../../public/minTemp.webp";
import sunrise from "../../../public/sunrise.png";
import sunset from "../../../public/sunset.png";
import humidity from "../../../public/humidity.png";
import visibility from "../../../public/visibility.png";

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [isError, setIsError] = useState(false);

  const tempCel = parseInt(weatherData?.main?.temp) - 273.15;
  const tempCelFixed = tempCel.toFixed(2);

  const tempCelFeelsLike = parseInt(weatherData?.main?.feels_like) - 273.15;
  const tempCelFeelsLikeFixed = tempCelFeelsLike.toFixed(2);

  const maxTempCel = parseInt(weatherData?.main?.temp_max) - 273.15;
  const maxTempCelFixed = maxTempCel.toFixed(2);

  const minTempCel = parseInt(weatherData?.main?.temp_min) - 273.15;
  const minTempCelFixed = minTempCel.toFixed(2);

  const windSpeed = parseInt(weatherData?.wind?.speed) * 3.6;
  const windSpeedFixed = windSpeed.toFixed(2);

  const sunriseTime = function () {
    const date = new Date(weatherData?.sys?.sunrise * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();
    const formattedTime =
      hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
    return formattedTime;
  };

  const sunsetTime = function () {
    const date = new Date(weatherData?.sys?.sunset * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();
    const formattedTime =
      hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
    return formattedTime;
  };

  const visibilityInKm = parseInt(weatherData?.visibility) / 1000;
  const visibilityFixed = visibilityInKm.toFixed(2);

  useEffect(() => {
    setIsLoading(true);
    const cityName = localStorage.getItem("city")
      ? localStorage.getItem("city")
      : "hyderabad";
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=8b28b5c8c33bddd6d0c910dc2feb878f`
    )
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setIsError(false);
        setWeatherData(data);
        setDescription(data?.weather[0]?.description);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        console.log("error", err);
      });
  }, []);

  return (
    <div
      className="w-[100%] h-auto"
      style={{ fontFamily: "Poppins", color: "#145063" }}
    >
      <div className="w-100% h-[100px] bg-slate-500 flex items-center">
        <span className="font-bold text-xl text-white ml-3">
          Weather Report
        </span>
      </div>
      {!isError && (
        <>
          <div
            className="w-[90%] lg:h-[300px] md:h-[400px] h-[500px] mt-3 m-auto rounded shadow-gray-500 shadow-lg overflow-hidden"
            style={{ backgroundColor: "#E6F0F3" }}
          >
            <div className="w-[100%] h-[20%] flex items-center">
              {!isLoading ? (
                <span className="ml-5">
                  {weatherData.name}, {weatherData?.sys?.country}
                </span>
              ) : (
                <span className="ml-5">Loading...</span>
              )}
            </div>
            <div className="w-[100%] h-[50%] flex md:flex-row flex-col  md:items-center jus gap-[5%]">
              <div className="ml-5">
                <img
                  src={cloud1}
                  alt="Cloud Image"
                  width="70px"
                  height="70px"
                />
              </div>
              {isLoading ? (
                <div className="text-2xl font-bold md:ml-0 ml-5">
                  Loading...
                </div>
              ) : (
                <div className="text-2xl font-bold md:ml-0 ml-5">
                  {tempCelFixed} °C
                </div>
              )}
              {isLoading ? (
                <div className="text-2xl font-semibold  md:ml-0 ml-5">
                  Loading...
                </div>
              ) : (
                <div className="text-2xl font-semibold  md:ml-0 ml-5">
                  Feels like, {tempCelFeelsLikeFixed} °C
                </div>
              )}
            </div>
            <div className="w-[100%] h-[30%]">
              {isLoading ? (
                <div className="mb-1 text-xl font-semibold ml-5">
                  Loading...
                </div>
              ) : (
                <div className="mb-1 text-xl font-semibold ml-5">
                  {description}
                </div>
              )}
              <div className="ml-5">
                <div className="flex gap-[2%]">
                  <div>
                    <div>Cloud cover</div>
                    {isLoading ? (
                      <div>Loading...</div>
                    ) : (
                      <div>{weatherData?.clouds?.all} %</div>
                    )}
                  </div>
                  <div>
                    <div>Pressure</div>
                    {isLoading ? (
                      <div>Loading...</div>
                    ) : (
                      <div>{weatherData?.main?.pressure} mb</div>
                    )}
                  </div>
                  <div>
                    <div>Wind Direction</div>
                    {isLoading ? (
                      <div>Loading...</div>
                    ) : (
                      <div>{weatherData?.wind?.deg} ° </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[90%] h-[50px] flex items-end m-auto">
            <span className="text-xl font-bold">Current Weather</span>
          </div>

          <div
            className="w-[90%] lg:h-[300px] md:h-[450px] sm:h-[500px] h-[1000px] m-auto mb-10 rounded shadow-gray-500 shadow-lg overflow-hidden flex flex-wrap justify-center items-center gap-[4%]"
            style={{ backgroundColor: "#E6F0F3" }}
          >
            <div className="w-[250px] h-[80px] bg-white rounded flex shadow-gray-500 shadow-lg">
              <div className="w-[70%] h-[100%] font-medium">
                <div className="mt-3 ml-2">Wind speed</div>
                {isLoading ? (
                  <div className="mt-1 ml-2">Loading...</div>
                ) : (
                  <div className="mt-1 ml-2">{windSpeedFixed} kmph</div>
                )}
              </div>
              <div className="w-[30%] h-[100%] flex items-center justify-center">
                <img src={windspeed} alt="Icon" width="70%" height="70%" />
              </div>
            </div>

            <div className="w-[250px] h-[80px] bg-white rounded flex shadow-gray-500 shadow-lg">
              <div className="w-[70%] h-[100%] font-medium">
                <div className="mt-3 ml-2">Max Temperature</div>
                {isLoading ? (
                  <div className="mt-1 ml-2">Loading...</div>
                ) : (
                  <div className="mt-1 ml-2">{maxTempCelFixed} °C</div>
                )}
              </div>
              <div className="w-[30%] h-[100%] flex items-center justify-center">
                <img src={maxTemp} alt="Icon" width="70%" height="70%" />
              </div>
            </div>

            <div className="w-[250px] h-[80px] bg-white rounded flex shadow-gray-500 shadow-lg">
              <div className="w-[70%] h-[100%] font-medium">
                <div className="mt-3 ml-2">Min Temperature</div>
                {isLoading ? (
                  <div className="mt-1 ml-2">Loading</div>
                ) : (
                  <div className="mt-1 ml-2">{minTempCelFixed} °C</div>
                )}
              </div>
              <div className="w-[30%] h-[100%] flex items-center justify-center">
                <img src={minTemp} alt="Icon" width="70%" height="70%" />
              </div>
            </div>

            <div className="w-[250px] h-[80px] bg-white rounded flex shadow-gray-500 shadow-lg">
              <div className="w-[70%] h-[100%] font-medium">
                <div className="mt-3 ml-2">Sunrise</div>
                {isLoading ? (
                  <div className="mt-1 ml-2">Loading...</div>
                ) : (
                  <div className="mt-1 ml-2">{sunriseTime()}</div>
                )}
              </div>
              <div className="w-[30%] h-[100%] flex items-center justify-center">
                <img src={sunrise} alt="Icon" width="70%" height="70%" />
              </div>
            </div>

            <div className="w-[250px] h-[80px] bg-white rounded flex shadow-gray-500 shadow-lg">
              <div className="w-[70%] h-[100%] font-medium">
                <div className="mt-3 ml-2">Sunset</div>
                {isLoading ? (
                  <div className="mt-1 ml-2">Loading...</div>
                ) : (
                  <div className="mt-1 ml-2">{sunsetTime()}</div>
                )}
              </div>
              <div className="w-[30%] h-[100%] flex items-center justify-center">
                <img src={sunset} alt="Icon" width="70%" height="70%" />
              </div>
            </div>

            <div className="w-[250px] h-[80px] bg-white rounded flex shadow-gray-500 shadow-lg">
              <div className="w-[70%] h-[100%] font-medium">
                <div className="mt-3 ml-2">Humidity</div>
                {isLoading ? (
                  <div className="mt-1 ml-2">Loading...</div>
                ) : (
                  <div className="mt-1 ml-2">
                    {weatherData?.main?.humidity} %
                  </div>
                )}
              </div>
              <div className="w-[30%] h-[100%] flex items-center justify-center">
                <img src={humidity} alt="Icon" width="70%" height="70%" />
              </div>
            </div>

            <div className="w-[250px] h-[80px] bg-white rounded flex shadow-gray-500 shadow-lg">
              <div className="w-[70%] h-[100%] font-medium">
                <div className="mt-3 ml-2">Visibility</div>
                {isLoading ? (
                  <div className="mt-1 ml-2">Loading...</div>
                ) : (
                  <div className="mt-1 ml-2">{visibilityFixed} km</div>
                )}
              </div>
              <div className="w-[30%] h-[100%] flex items-center justify-center">
                <img src={visibility} alt="Icon" width="70%" height="70%" />
              </div>
            </div>

            <div className="w-[250px] h-[80px] bg-white rounded flex shadow-gray-500 shadow-lg">
              <div className="w-[70%] h-[100%] font-medium">
                <div className="mt-3 ml-2">Clouds</div>
                {isLoading ? (
                  <div className="mt-1 ml-2">Loading...</div>
                ) : (
                  <div className="mt-1 ml-2">{weatherData?.clouds?.all} %</div>
                )}
              </div>
              <div className="w-[30%] h-[100%] flex items-center justify-center">
                <img src={cloud2} alt="Icon" width="70%" height="70%" />
              </div>
            </div>
          </div>
        </>
      )}
      {isError && (
        <div className="w-[100%] h-[300px] flex justify-center items-center">
          <span className="text-red-400 font-bold text-lg">
            Error while fetching data Please try again!!!
          </span>
        </div>
      )}
    </div>
  );
};

export default Weather;
