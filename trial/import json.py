import json
import pandas as pd

# Your JSON data
json_data = {
    "type": "FeatureCollection",
    "metadata": {
        "generated": 1720655491000,
        "url": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson",
        "title": "USGS Significant Earthquakes, Past Week",
        "status": 200,
        "api": "1.10.3",
        "count": 1
    },
    "features": [
        {
            "type": "Feature",
            "properties": {
                "mag": 6.7,
                "place": "south of Africa",
                "time": 1720587343301,
                "updated": 1720594854031,
                "tz": None,
                "url": "https://earthquake.usgs.gov/earthquakes/eventpage/us7000my76",
                "detail": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/us7000my76.geojson",
                "felt": None,
                "cdi": None,
                "mmi": 0,
                "alert": "green",
                "status": "reviewed",
                "tsunami": 0,
                "sig": 691,
                "net": "us",
                "code": "7000my76",
                "ids": ",us7000my76,",
                "sources": ",us,",
                "types": ",losspager,moment-tensor,origin,phase-data,shakemap,",
                "nst": 47,
                "dmin": 18.375,
                "rms": 0.99,
                "gap": 36,
                "magType": "mww",
                "type": "earthquake",
                "title": "M 6.7 - south of Africa"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    25.3099,
                    -53.3122,
                    10
                ]
            },
            "id": "us7000my76"
        }
    ]
}

# Extract the earthquake data
earthquake_data = []
for feature in json_data["features"]:
    properties = feature["properties"]
    geometry = feature["geometry"]["coordinates"]
    data = {
        "id": feature["id"],
        "mag": properties["mag"],
        "place": properties["place"],
        "time": properties["time"],
        "updated": properties["updated"],
        "tz": properties["tz"],
        "url": properties["url"],
        "detail": properties["detail"],
        "felt": properties["felt"],
        "cdi": properties["cdi"],
        "mmi": properties["mmi"],
        "alert": properties["alert"],
        "status": properties["status"],
        "tsunami": properties["tsunami"],
        "sig": properties["sig"],
        "net": properties["net"],
        "code": properties["code"],
        "ids": properties["ids"],
        "sources": properties["sources"],
        "types": properties["types"],
        "nst": properties["nst"],
        "dmin": properties["dmin"],
        "rms": properties["rms"],
        "gap": properties["gap"],
        "magType": properties["magType"],
        "type": properties["type"],
        "title": properties["title"],
        "longitude": geometry[0],
        "latitude": geometry[1],
        "depth": geometry[2]
    }
    earthquake_data.append(data)

# Create a DataFrame
df = pd.DataFrame(earthquake_data)

# Save to Excel file
excel_file = "earthquake_data.xlsx"
df.to_excel(excel_file, index=False)

print(f"Data saved to {excel_file}")
