import React from "react";
import "../components/Sighting.css";
import "../components/Sightings.css";

import Loading from "../assets/images/loading.gif";
import offlineImage from "../assets/images/nowifi.jpg";
/**
 * @author Amol Dhaliwal
 * Individual sightings page containing details about pangolin
 */
class Sighting extends React.Component {
  /**
   * Method containing local state of variables to be set from GET request or to render components of the page
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      lng: null,
      lat: null,
      zoom: 10,
      pangolinImg: null,
      pangolinStatus: null,
      pangolinMortality: null,
      pangolinInfo: null,
      id: window.location.href.split("Sighting")[1],
      loading: true,
      offline: false,
      imgURL: "https://ad959.brighton.domains/uploads/userimages/",
    };
  }
  /**
   * Method called to set state of variables respective to those within the JSON array returned from GET request
   * @param datajson JSON array
   */
  setValues(datajson) {
    let pangLocation = datajson[0].pangolinLocation;
    pangLocation = JSON.parse(pangLocation);
    this.setState({
      pangolinInfo: datajson[0].pangolinInfo,
      pangolinStatus: datajson[0].pangolinStatus,
      pangolinMortality: datajson[0].pangolinMortality,
      lng: pangLocation.lng,
      lat: pangLocation.lat,
      pangolinImg: datajson[0].pangolinImg,
    });
  }
  /**
   * Method called when the component is loaded which checks network connection and if there are any values already stored in the local storage.
   * Makes a GET request if online or uses values from cache to set state values
   *
   */

  async componentDidMount() {
    try {
      const cachedValues = localStorage.getItem(`Sighting${this.state.id}`);
      if (navigator.onLine) {
        const dataResponse = await fetch(
          `https://ad959.brighton.domains/posts/byId/${this.state.id}`
        );
        if (dataResponse.ok) {
          localStorage.removeItem(`Sighting${this.state.id}`);
          const datajson = await dataResponse.json();
          if (datajson.result !== "No results") {
            this.setValues(datajson);
          }
          const storeLocally = JSON.stringify(datajson);
          localStorage.setItem(`Sighting${this.state.id}`, storeLocally);
        } else if (cachedValues) {
          this.setState({ offline: true });
          const datajson = JSON.parse(cachedValues);
          this.setValues(datajson);
        } else {
          this.setState({ offline: true });
        }
      } else if (cachedValues) {
        this.setState({ offline: true });
        const datajson = JSON.parse(cachedValues);
        this.setValues(datajson);
      } else {
        this.setState({ offline: true });
      }
      this.setState({ loading: false });
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Method that renders the content on the page depending on the boolean state values
   * Image replaced with placeholder if no network connection
   * @returns {JSX.Element}
   */

  render() {
    const loadingAnimation = this.state.loading ? (
      <div className="loadingimg">
        <img id="pangolinLoading" src={Loading} alt="Data loading" />
      </div>
    ) : (
      <div>
        <section className="about">
          <div className="row">
            <div className="col50">
              <h2 className="titleText">Pangolin Details </h2>

              <table className="pangtable">
                <tbody>
                  <tr>
                    <th>Status:</th>
                    <td>{this.state.pangolinStatus}</td>
                  </tr>
                  <tr>
                    <th>Mortality Cause:</th>
                    <td>
                      {this.state.pangolinMortality === "null"
                        ? "N/A"
                        : this.state.pangolinMortality}
                    </td>
                  </tr>
                  <tr>
                    <th>Additional information:</th>
                    <td>
                      {this.state.pangolinInfo === "null"
                        ? "N/A"
                        : this.state.pangolinInfo}
                    </td>
                  </tr>
                  <tr>
                    <th>Location:</th>
                    <td>
                      <div className="mapcontainer">
                        {this.state.lng}, {this.state.lat}
                        {this.state.offline ? (
                          ""
                        ) : (
                          <img
                            alt="pangolin location"
                            src={`https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-s-l+000(${this.state.lng},${this.state.lat})/${this.state.lng},${this.state.lat},14/300x300?access_token=pk.eyJ1IjoiYW1vbDE1MDUiLCJhIjoiY2t3YWdhZnpxM2E1aTJvcm9pYWZjNmE2MSJ9.ZNVKJVP__hiX0IfPSHQNJA`}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col50">
              <div className="postimgBx">
                <img
                  className="cover"
                  src={
                    this.state.offline
                      ? offlineImage
                      : this.state.imgURL + this.state.pangolinImg
                  }
                  alt="pangolin"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    );

    return (
      <div className="sightingwrapper">
        <div>{loadingAnimation}</div>
      </div>
    );
  }
}
export default Sighting;
