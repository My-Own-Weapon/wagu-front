/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import OpenViduVideoComponent from './OvVideo';

interface Props {
  streamManager: any;
}

function UserVideoComponent({ streamManager }: Props) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      {streamManager ? (
        <OpenViduVideoComponent streamManager={streamManager} />
      ) : null}
    </div>
  );
}

export default UserVideoComponent;
