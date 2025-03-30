import React from 'react'
import { useParams } from 'react-router-dom'

function CallingScreen() {
    const params = useParams()
    return (
        <div>CallingScreen id : {params.id}</div>
    )
}

export default CallingScreen