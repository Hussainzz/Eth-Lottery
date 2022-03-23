import React from 'react'
import ClipLoader from "react-spinners/ClipLoader";

const Spinner = ({loading, size, applyPadding}) => {
    const padding = (applyPadding) ? {
        paddingTop: '100px',
    }:{};
    return  (
        <div className="mt-3 text-center" style={padding}>
            <ClipLoader color={'black'} loading={loading} size={size} />
        </div>
    )
}

export default Spinner