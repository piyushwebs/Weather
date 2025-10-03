import "./MainPage.css";
import MapComponent from "./MapComponent/MapComponent";

import "@maptiler/sdk/dist/maptiler-sdk.css";

export default function MainPage() {


  return (
    <>
      <div id="StylingMap">
        <MapComponent/>
      </div>
    </>
  );
}
