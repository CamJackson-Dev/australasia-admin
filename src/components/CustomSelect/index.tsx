import React from "react";

function CustomSelect(props) {
    const { nameSelect, value, onChange, dataSelect, readOnly } = props;
    return (
        <select
            className="bg-[var(--inputField)] p-2 rounded-sm border-0 outline-none h-12"
            // defaultValue={defaultValue}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
        >
            <option value="" disabled selected>
                {nameSelect}
            </option>
            {dataSelect &&
                dataSelect.map((data, index) => (
                    <option key={`${data}-${index}`} value={data}>
                        {data}
                    </option>
                ))}
        </select>
    );
}

export default CustomSelect;
