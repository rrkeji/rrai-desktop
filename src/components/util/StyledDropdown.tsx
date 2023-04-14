import * as React from 'react';

import { Option, Select } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';
import { CaretDownOutlined } from '@ant-design/icons';


/**
 * A Select component that blends-in nicely (cleaner, easier to the eyes)
 */
export const StyledDropdown = <TValue extends string>(props: { value: TValue, items: Record<string, { title: string }>, onChange: (event: any, value: TValue | null) => void, sx?: SxProps }) => {

  // TODO ICON KeyboardArrowDownIcon
  return (
    <Select
      variant='solid' color='neutral' size='md'
      value={props.value} onChange={props.onChange}
      indicator={<CaretDownOutlined />}
      slotProps={{
        listbox: {
          variant: 'plain', color: 'neutral', size: 'lg',
          disablePortal: false,
          sx: {
            minWidth: 140,
          },
        },
        indicator: {
          sx: {
            opacity: 0.5,
          },
        },
      }}
      sx={{
        mx: 0,
        /*fontFamily: theme.vars.fontFamily.code,*/
        fontWeight: 500,
        ...(props.sx || {}),
      }}
    >
      {Object.keys(props.items).map((key: string) => (
        <Option key={key} value={key}>
          {props.items[key].title}
        </Option>
      ))}
    </Select>
  );
}