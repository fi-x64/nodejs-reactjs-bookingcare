import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import { searchData } from '../services/userService';

const InputComponent = ({ intl }) => {
  let [filteredData, setFilteredData] = useState([]);
  let [wordEntered, setWordEntered] = useState("");

  let handleFilter = async (event) => {
    let searchWord = event.target.value;
    setWordEntered(searchWord);
    let newFilterData = await searchData(searchWord);
    let newFilter = newFilterData.result;
    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const placeholder = intl.formatMessage({ id: 'banner.search' });
  return (
    <div>
      <input placeholder={placeholder} value={wordEntered} onChange={handleFilter} />
      {filteredData.length != 0 &&
        <div className="dataResult">
          {filteredData.clinics.length > 0 ?
            <div className="dataHeader">Clinic</div>
            : null
          }
          {filteredData.clinics.length > 0 && filteredData.clinics.map((value, key) => {
            return (
              <a className="dataItem" href={"/detail-clinic/" + value.id}>
                <p>{value.name}</p>
              </a>
            )
          })}

          {filteredData.specialties.length > 0 ?
            <div className="dataHeader">Specialty</div>
            : null
          }
          {filteredData.specialties.length > 0 && filteredData.specialties.map((value, key) => {
            return (
              <a className="dataItem" href={"/detail-specialty/" + value.id}>
                <p>{value.name} </p>
              </a>
            )
          })}
          {filteredData.users.length > 0 ?
            <div className="dataHeader">Doctor</div>
            : null
          }
          {filteredData.users.length > 0 && filteredData.users.map((value, key) => {
            return (
              <a className="dataItem" href={"detail-doctor/" + value.id}>
                <p>{value.lastName + " " + value.firstName} </p>
              </a>
            )
          })}
        </div>
      }
    </div>

  );
}


export default injectIntl(InputComponent);