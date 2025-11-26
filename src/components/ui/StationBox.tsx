import { CardHeader, CardContent, Stack } from '@mui/material';
import { Home as HomeIcon, LocationOn as LocationOnIcon } from '@mui/icons-material';

interface StationBoxInterface {
  title?: string
  station?: string
  lines?: string[]
}

export default function StationBox({title, station, lines}: StationBoxInterface) {

  const getIcon = () => {
    if (title?.toLowerCase() === 'origen') return <HomeIcon sx={{ color: 'orange'}} />;
    return <LocationOnIcon sx={{ color: 'orange' }} />;
  };

  return (
    <>
      <CardHeader
        title={title}
        avatar={getIcon()}
        sx={{ padding: '16px 16px 5px 16px'}}
      />
      <CardContent
        sx={{padding: '0px 16px 0px 16px'}}
      >
        <Stack direction='row' sx={{ display: 'flex', alignItems: 'center' }}>
          <Stack direction='row' spacing={1} sx={{ marginRight: '5px' }}>
            {lines?.map((linea) => (
              <div
              key={linea}
              className={`line-item-result-box linea-${linea}`}
              >
                {linea}
              </div>
            ))}
          </Stack>
          <div>{station}</div>
        </Stack>
      </CardContent>
    </>
  );
}