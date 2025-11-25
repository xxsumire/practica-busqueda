import { useState } from 'react';
import dayjs, {Dayjs} from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import '../../styles/SearchBar.css';

export default function DateTimeLabel({ onChange }:{onChange?: (d: Dayjs | null) => void}) {
  const [value, setValue] = useState<Dayjs | null>(dayjs());
  
  return (
    <div className='date-time-box'>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label='Selecciona el día y la hora'
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            onChange?.(newValue);
          }}
          minDateTime={dayjs()}
          maxDateTime={dayjs().add(1, 'year')}
          sx={{width: '100%'}}
        />
      </LocalizationProvider>
    </div>
  );
}