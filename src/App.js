import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import "./App.css";
import CountryInfoBox from "./CountryInfoBox";
import Map from "./Map";
import Table from "./Table";
import { prettyPrintStat, SortData } from "./helper";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  // useStates
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("all");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState(["cases"]);
  // useEffects to make calls to API

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    // send request to server with async
    const getCountryData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          // loop through the json file and return array data
          const countries = data.map((country) => ({
            name: country.country, //country name
            value: country.countryInfo.iso2, //country code eg. ZA,UK
          }));

          // sort data
          const sortedData = SortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };

    getCountryData(); //CALL FUNCTION
  }, []);

  // create function to listen to dropdown menu changes
  const OnCountryChange = async (event) => {
    const countryCode = event.target.value;

    const getUrl =
      countryCode === "all"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    // fetch data and store it as json file
    await fetch(getUrl)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  // console.log("info", countryInfo);

  return (
    <div className="app">
      <div className="left">
        <div className="app_header">
          <h2> Covid-19 Tracking</h2>
          {/* drop down menu to select countries */}
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={OnCountryChange}
            >
              <MenuItem value="all"> All</MenuItem>

              {countries.map((country) => (
                <MenuItem value={country.value}> {country.name} </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app_country_stats">
          <CountryInfoBox
            
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="cases "
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <CountryInfoBox
          
            onClick={(e) => setCasesType("recovered")}
            title="Recoveries"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <CountryInfoBox
            
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
          {/* <CountryInfoBox
            title="Tests"
            cases={countryInfo.tests}
            total={countryInfo.tests}
          /> */}
        </div>

        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="right">
        <CardContent>
          
            <h3 >live cases</h3>
            <Table countries={tableData} />
            <h3 className ="app_graphTitle">worldwide new {casesType}</h3>
            <LineGraph className="app_graph" casesType={casesType} />
         
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
