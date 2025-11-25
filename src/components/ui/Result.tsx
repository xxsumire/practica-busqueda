import "../../styles/Result.css"

interface ResultInterface {
    title?: string
    time?: number,
    distancia?: number
    lineas?: string[]
}

export default function Result({
    title,
    time,
    distancia,
    lineas
}: ResultInterface) {

    console.log(time)

    return (
        <div className='left-align'>
            <div className='title'>{title}</div>
            <div className='resultado-container-inner space-between'>
                <div className='center'>
                    {lineas?.map((e, index) => (
                        <>
                            <div 
                                key={index}
                                className={`line-item linea-${Number(e)}`}
                            >
                                {e}
                            </div>
                            {index < lineas.length - 1 && (
                                <div>
                                    {"\>"}
                                </div>
                            )}
                        </>
                    ))}
                </div>
                <div className='x-center'>
                    <div className='time'>{time?.toFixed(0)} min</div>
                    <div className='distancia'>{distancia?.toFixed(0)} Km</div>
                </div>
            </div>
        </div>
    )
}
