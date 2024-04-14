const weatherApiKey = "8b28b5c8c33bddd6d0c910dc2feb878f";

export const fetchWeather = async (cityName = "Hyderabad") => {
  try {
    const responce = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherApiKey}`
    );
    const weatherData = await responce.json();
    return weatherData;
  } catch (error) {
    console.log("Error while fetching data", error);
  }
};
