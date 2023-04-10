import React, { Component, useState } from 'react';
import Close from './close';
import Minimize from './minimize';
import Resize from './resize';

var styles = {
  controls: {
    WebkitUserSelect: 'none',
    userSelect: 'none',
    cursor: 'default',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '60px',
    height: '20px'
  },
};

type ControlsPropTypes = {
  isFullscreen: boolean,
  onCloseClick: () => void,
  onMinimizeClick: () => void,
  onMaximizeClick: () => void,
  onResizeClick: () => void,
  disableClose?: boolean,
  disableMinimize?: boolean,
  disableResize?: boolean,
  disableFullscreen?: boolean,
  isWindowFocused: boolean,
}


export const Controls: React.FC<ControlsPropTypes> = (props) => {

  const [isOver, setIsOver] = useState<boolean>(false);

  return (
    <div
      style={{ ...styles.controls }}
      onMouseEnter={() => setIsOver(true)}
      onMouseLeave={() => setIsOver(false)}
    >
      <Close
        onClick={props.onCloseClick}
        showIcon={isOver}
        disabled={props.disableClose}
        isWindowFocused={props.isWindowFocused}
      />
      <Minimize
        onClick={props.onMinimizeClick}
        showIcon={isOver}
        disabled={props.disableMinimize}
        isWindowFocused={props.isWindowFocused}
      />
      <Resize
        isFullscreen={props.isFullscreen}
        onClick={props.onResizeClick}
        onMaximizeClick={props.onMaximizeClick}
        showIcon={isOver}
        disabled={props.disableResize}
        disableFullscreen={props.disableFullscreen}
        isWindowFocused={props.isWindowFocused}
      />
    </div>
  );
}


export default Controls;
