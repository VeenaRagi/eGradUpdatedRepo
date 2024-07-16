import React from 'react';
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
const Control = ({
  onPlayPause,
  playing,
  onRewind,
  onFastForward,
  played,
  onSeek,
  onSeekMouseDown,
  onSeekMouseUp
}) => {
  return (
    <div className="custom-controlss">
    <div className="custom-controls">
    <button className="control-button" onClick={onRewind}>
      <FaBackward />
    </button>
    <button className="control-button" onClick={onPlayPause}>
      {playing ? <FaPause /> : <FaPlay />}
    </button>
    <button className="control-button" onClick={onFastForward}>
      <FaForward />
    </button>
  </div>
  {/* <div>
  <input
    type="range"
    min="0"
    max="100"
    step="0.1"
    value={played}
    onMouseDown={onSeekMouseDown}
    onChange={onSeek}
    onMouseUp={onSeekMouseUp}
    className="seekbar"
  />
  </div> */}
  </div>
  );
};

export default Control;
 