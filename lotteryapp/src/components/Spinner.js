import React from 'react'
import ClipLoader from "react-spinners/ClipLoader";

const Spinner = ({loading, size}) => {
    return  (
        <div className="mt-3 text-center">
            <ClipLoader color={'black'} loading={loading} size={size} />
        </div>
    )
}

export default Spinner