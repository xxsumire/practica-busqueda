import { 
    useEffect, 
    useState,
    useRef
} from 'react'
import { csv } from 'd3-fetch'
import "../../styles/InputCustom.css"
import "../../styles/linesColor.scss"
import { TextField, Popper, Paper, List, Divider, ListItemButton, Box } from '@mui/material'

interface InputCustomInterface {
  type?: "default" | "primary" |"tiny",
  labelInput: string;
  onChange?: (d: string) => void
}

type StationType = {
  name: string
  line: string[]
}   

const chooseType = (
  type: "default" | "primary" | "tiny", 
  handler: (e: string) => void
) => {
  switch (type) {
    case "default": 
      handler("input-default")
      break;
    case "primary":
      handler("input-primary")
      break;
    case "tiny":
      handler("input-tiny")
      break;
  }
}

const parseCsv = (
  handler: (items: StationType[]) => void) => {

  csv('../../public/estaciones_coords.csv').then((data) => {
    const parsed = data.map((d) => ({
      name: d.estacion,
      line: d.linea.split(',').map(l => l.trim()),
    }));
    handler(parsed);
  });
}

export default function InputCustom({
  type = "default",
  labelInput,
  onChange
}: InputCustomInterface) {

  const [innerStyle, setInnerStyle] = useState<string>();
  const [stations, setStations] = useState<StationType[]>();

  const [query, setQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [anchorWidth, setAnchorWidth] = useState(0);

  useEffect(() => {
    chooseType(type, setInnerStyle)
    parseCsv(setStations)
  }, [])

  const filteredStations = stations?.filter(e =>
    e.name.toLowerCase().includes(
      query.toLowerCase()
    )
  );

  const styleStation = (item: StationType) => {
    return (
      <div className='list-item'>
        {item.line.map((e, index) => (
          <div 
            key={index}
            className={`icon-item linea-${e}`}
          >
            {e}
          </div>
        ))}
        {item.name}
      </div>
    )
  }

  return (
    <div className='input-container'>
      <div ref={anchorRef} style={{ marginBottom: '30px' }}>
        <TextField
            required
            variant='outlined'
            label={labelInput}
            value={query}
            placeholder='Busca una estación'
            onFocus={() => {
              setIsOpen(true);
              setAnchorWidth(anchorRef.current?.offsetWidth || 0);
            }}
            onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
            }}
            className={`${innerStyle ?? ""} input-custom-textfield`}
        />

        {isOpen && query && (
          <Popper
            open={true}
            anchorEl={anchorRef.current}
            placement='bottom-start'
            style={{ width: anchorWidth, zIndex: 2 }}
          >
            <Paper elevation={3}>
              {filteredStations && filteredStations.length > 0 ? (
                <List dense sx={{ padding: 0, maxHeight: 250, overflowY: 'auto' }}>
                  {filteredStations.map((e, index) => (
                    <ListItemButton
                      key={index}
                      onClick={() => {
                        setQuery(e.name);
                        setIsOpen(false);
                        onChange?.(e.name);
                      }}
                    >
                      {styleStation(e)}
                      <Divider/>
                    </ListItemButton>
                  ))}
                </List>
              ) : (
                <Box sx={{ padding: '8px 12px', color: '#666' }}>
                  Ningún resultado encontrado
                </Box>
              )}
            </Paper>
          </Popper>
        )}

      </div>
    </div>
  )
}