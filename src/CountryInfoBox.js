import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import "./countryInfoBox.css";

function CountryInfoBox({ title, cases ,isRed,isOrange,active, total, ...props }) {
  return (
    <Card onClick={props.onClick} className={`card-info ${active && "card-info_selected"}
    ${isRed && "red"} ${isOrange && "orange"}
    `}>
      <CardContent>
        <Typography className="card_content_title" color="textSecondary">
          {title}
        </Typography>
        <h2 className="card-info-cases">{cases}</h2>

        <Typography className="card-info-total" color="textSecondary">
          {total} total
        </Typography>
      </CardContent>
    </Card> 
  );
}

export default CountryInfoBox;
