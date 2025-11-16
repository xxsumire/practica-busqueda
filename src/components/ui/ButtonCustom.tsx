import React, { useEffect, useState } from 'react'

import "../../styles/ButtonCustom.css"
import SearchIcon from '@mui/icons-material/Search'

interface ButtonCustomInterface {
    text: string
    type?: "default" | "primary" | "secondary" | "danger" 
    onClick?: () => void 
}

const setColor = (type: string, handler: (e: string) => void) => {
    switch (type) {
        default:
        case "default":
            handler?.("btn-default")
            break;
        case "primary":
            handler?.("btn-primary")
            break;
        case "secondary":
            handler?.("btn-secondary")
            break;
        case "danger":
            handler?.("btn-danger")
            break;
    }
}

export default function ButtonCustom({
    text,
    type = "default",
    onClick
}: ButtonCustomInterface) {

    const [innerColor, setInnerColor] = useState<string>()

    useEffect(() => {
        setColor(type, setInnerColor);
    }, [])

    return (
        <div className='btn-custom-container'>
            <button
                className={'button-custom ' + innerColor}
                onClick={onClick}
            >
                <SearchIcon />
                {text}
            </button>
        </div>
    )
}
