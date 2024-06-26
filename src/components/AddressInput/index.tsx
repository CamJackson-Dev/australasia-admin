import { useEffect, useState } from "react";

import { objectKeys, objectValues } from "../../../src/utils/objectKeys";
import { territoryAus } from "@/data/address/aus";
import { territoryNG } from "@/data/address/ng";
import { territoryNZ } from "@/data/address/nz";
import { territoryPI } from "@/data/address/pi";
import CustomSelect from "../CustomSelect";

interface IAddressInput {
    country: string;
    territory: string;
    city: string;
    onLocationChange: (loc: { [key: string]: string }) => void;
}

const AddressInput = (props: IAddressInput) => {
    const { country, territory, city, onLocationChange } = props;
    const [currentData, setCurrentData] = useState({});
    // const [allCountries, setAllCountries] = useState(["AU", "NZ", "PG"]);
    const [allTerritories, setAllTerritories] = useState([]);
    const [allCities, setAllCities] = useState([]);

    console.log(country, territory, city);

    const Codes = {
        AU: "Australia",
        NZ: "New-zealand",
        PG: "New-guinea",
        FJ: "Fiji",
        VU: "Vanuatu",
        SB: "Solomon Islands",
        NC: "New Caledonia",
    };

    const getTerritories = (code: keyof typeof Codes) => {
        // console.log(code, "cccc");
        let country = {};

        if (code == "AU") {
            territoryAus.map((territory) => {
                territory.city.map((city) => {
                    country[territory.name] = country[territory.name]
                        ? [...country[territory.name], city.title]
                        : [city.title];
                });
            });
            // console.log(country);
            return country;
        } else if (code == "NZ") {
            territoryNZ.map((territory) => {
                territory.city.map((city) => {
                    country[territory.name] = country[territory.name]
                        ? [...country[territory.name], city.title]
                        : [city.title];
                });
            });
            return country;
        } else if (code == "PG") {
            territoryNG.map((territory) => {
                territory.city.map((city) => {
                    country[territory.name] = country[territory.name]
                        ? [...country[territory.name], city.title]
                        : [city.title];
                });
            });
            return country;
        } else {
            territoryPI.map((territory) => {
                let outerTemp = {};
                territory.regions.map((region) => {
                    let temp = [];
                    region.city.map((city) => {
                        temp = [...temp, city.title];
                    });
                    outerTemp[region.name] = temp;
                });
                country[territory.name] = outerTemp;
            });
            return country[Codes[code]];
        }
    };

    const setAllData = (code: keyof typeof Codes) => {
        let data = getTerritories(code);
        setCurrentData(data);

        let keys = Object.keys(data);
        setAllTerritories(keys);

        setAllCities(data[keys[0]]);
        onLocationChange({
            country: code,
            territory: keys[0],
            city: data[keys[0]][0],
        });
    };

    const changeTerritory = (territory: string) => {
        const cities = currentData[territory];
        if (cities) {
            setAllCities(cities);
            onLocationChange({
                territory: territory,
                city: cities[0],
            });
        }
    };

    const changeCity = (city: string) => {
        onLocationChange({
            city: city,
        });
    };

    useEffect(() => {
        if (country) {
            let data = getTerritories(country as keyof typeof Codes);
            setCurrentData(data);

            let keys = Object.keys(data);
            setAllTerritories(keys);

            const cities = data[territory];
            setAllCities(cities);
        }
    }, [country]);

    return (
        <div className="grid grid-cols-3 gap-2">
            <CustomSelect
                nameSelect="Country"
                dataSelect={objectKeys(Codes)}
                value={country}
                onChange={(e) => setAllData(e)}
            />
            <CustomSelect
                nameSelect="Territory/Province"
                dataSelect={allTerritories}
                value={territory}
                onChange={changeTerritory}
            />
            <CustomSelect
                nameSelect="Town/Village"
                dataSelect={allCities}
                value={city}
                onChange={changeCity}
            />
        </div>
    );
};

export default AddressInput;
