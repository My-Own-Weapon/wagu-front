import React from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';

function UserVideoComponent({ streamManager }) {
  const getNicknameTag = () => {
    // Assuming `streamManager` and `stream` are properly checked for null/undefined elsewhere in the application
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  return (
    <div>
      {streamManager ? (
        <div className="streamcomponent">
          <OpenViduVideoComponent streamManager={streamManager} />
          <div>
            <p>{getNicknameTag()}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default UserVideoComponent;

// import React from 'react';
// import OpenViduVideoComponent from './OvVideo';

// function UserVideoComponent({ streamManager }) {
//   // console.log('@UserVideoComponent - streamManager:', streamManager);

//   const getNicknameTag = () => {
//     // Assuming `streamManager` and `stream` are properly checked for null/undefined elsewhere in the application
//     return JSON.parse(streamManager.stream.connection.data).clientData;
//   };

//   return (
//     <div>
//       {streamManager ? (
//         <div className="streamcomponent">
//           <OpenViduVideoComponent streamManager={streamManager} />
//           <div>
//             <p>{getNicknameTag()}</p>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// export default UserVideoComponent;
