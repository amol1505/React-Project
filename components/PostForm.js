import "./PostForm.css";
import React from "react";

/**
 * @author Amol Dhaliwal
 * Post form to submit information about pangolin sightings
 */
export default class PostForm extends React.Component {
  /**
   * Method containing local state of variables used for the form or to render components of the page
   * @param props
   */
  constructor(props) {
    super(props);
    this.onPangolinStatus = this.onPangolinStatus.bind(this);
    this.onPangolinMortality = this.onPangolinMortality.bind(this);
    this.onPangolinInfo = this.onPangolinInfo.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      visibility: false,
      pangolinStatus: "Alive",
      pangolinMortality: null,
      pangolinInfo: null,
      pangolinImg: null,
      pangolinLocation: null,
      pangolinImgName: null,
      noLocation: false,
      offlineStored: false,
      offlineUploaded: false,
      imgBad: false,
      successfulForm: false,
      valueNull: false,
    };
  }
  /**
   * Method called to set the state of image field to a base64 string when user uploads a file
   * @param e
   */
  onFileChange(e) {
    this.setState({ imgBad: false, pangolinImgName: e.target.files[0].name });
    const imgfile = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState({ pangolinImg: reader.result });
    };
    reader.readAsDataURL(imgfile);
  }
  /**
   * Method called to set the state of pangolin state field to either dead or alive depending on user selection
   * @param e
   */
  onPangolinStatus(e) {
    this.setState({ pangolinStatus: e.target.value });
    if (e.target.value === "Dead") {
      this.setState({ visibility: true });
    } else {
      this.setState({ visibility: false, pangolinMortality: null });
    }
  }
  /**
   * Method called to set the state of mortality type field to death type depending on user selection
   * @param e
   */
  onPangolinMortality(e) {
    this.setState({ valueNull: false, pangolinMortality: e.target.value });
  }
  /**
   * Method called to set the state of additional information field to whatever the user inputs
   * @param e
   */
  onPangolinInfo(e) {
    this.setState({ pangolinInfo: e.target.value });
  }

  /**
   * Method called to obtain users current location and returns json array containing longitude and latitude as a promise
   * @returns {Promise<JSON>} Location data in JSON array
   */

  async getCoords() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        (e) => {
          this.setState({ noLocation: true });
          reject(e);
        },
        { timeout: 6000 }
      );
    });
  }
  /**
   * Method called when the component is loaded which checks network connection and if there are any forms stored in local storage.
   * Searches for keys not related to those for sightings and removes them after uploading, ouputting a notification to user that
   * their response is uploaded
   */

  async componentDidMount() {
    try {
      if (navigator.onLine) {
        if (localStorage.length > 0) {
          const formKeys = Object.keys(localStorage);
          const formData = new FormData();

          for (let formKey of formKeys) {
            if (formKey.indexOf("Sighting") === -1) {
              this.setState({ offlineStored: true, offlineUploaded: false });
              const previousKey = localStorage.getItem(formKey);
              const jsonContent = JSON.parse(previousKey);

              formData.append("pangolinStatus", jsonContent.pangolinStatus);
              formData.append("pangolinInfo", jsonContent.pangolinInfo);
              formData.append(
                "pangolinMortality",
                jsonContent.pangolinMortality
              );
              formData.append("pangolinImg", jsonContent.pangolinImg);
              formData.append("pangolinLocation", jsonContent.pangolinLocation);
              formData.append("pangolinImgName", jsonContent.pangolinImgName);

              const dataResponse = await this.sendData(formData);

              if (dataResponse.ok) {
                this.setState({ offlineStored: false, offlineUploaded: true });
                localStorage.removeItem(formKey);
              }
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Method called to send data from form to the API by a POST request, returning response in form of status
   * @param formData Form Data object containing information about pangolin to be sent as a request
   * @returns {Promise<Response>} returns a response to the POST request
   */

  async sendData(formData) {
    return await fetch("https://ad959.brighton.domains/posts", {
      method: "POST",
      body: formData,
    });
  }
  /**
   * Method called to store data to local storage when there is no network connection
   * Every form has unique key relating to date and time so wont be overwritten
   */
  storeLocally() {
    const formData = JSON.stringify({
      pangolinStatus: this.state.pangolinStatus,
      pangolinInfo: this.state.pangolinInfo,
      pangolinMortality: this.state.pangolinMortality,
      pangolinImg: this.state.pangolinImg,
      pangolinLocation: this.state.pangolinLocation,
      pangolinImgName: this.state.pangolinImgName,
    });
    const pangolinKey = new Date().getTime().toString();
    localStorage.setItem(pangolinKey, formData);
    this.setState({ offlineStored: true });
  }
  /**
   * Method called when form is submit which undergoes series of conditional statements to validate responses
   * and sends data to API if online or stores locally if offline, outputting end result or any errors
   * @param e Form submission event
   */
  async onSubmit(e) {
    try {
      e.preventDefault();
      this.setState({
        offlineStored: false,
        successfulForm: false,
        offlineUploaded: false,
      });
      const userPos = await this.getCoords();
      const pangolinLocation = JSON.stringify({
        lng: userPos.coords.longitude,
        lat: userPos.coords.latitude,
      });
      this.setState({ noLocation: false, pangolinLocation: pangolinLocation });

      if (
        this.state.pangolinStatus === "Dead" &&
        (this.state.pangolinMortality === null ||
          this.state.pangolinMortality === "null")
      ) {
        this.setState({ valueNull: true });
        return false;
      } else {
        this.setState({ valueNull: false });
      }
      if (this.state.pangolinImg !== null)
        if (this.state.pangolinImg.indexOf("data:image/") === -1) {
          this.setState({ imgBad: true });
          return false;
        } else {
          this.setState({ imgBad: false });
        }
      else {
        this.setState({ imgBad: true });
        return false;
      }
      if (navigator.onLine) {
        const formData = new FormData();
        formData.append("pangolinStatus", this.state.pangolinStatus);
        formData.append("pangolinInfo", this.state.pangolinInfo);
        formData.append("pangolinMortality", this.state.pangolinMortality);
        formData.append("pangolinImg", this.state.pangolinImg);
        formData.append("pangolinLocation", this.state.pangolinLocation);
        formData.append("pangolinImgName", this.state.pangolinImgName);
        const dataResponse = await this.sendData(formData);

        if (dataResponse.ok) {
          this.setState({ successfulForm: true, offlineUploaded: false });
        } else {
          this.storeLocally();
        }
      } else {
        this.storeLocally();
      }
      document.getElementById("pangolinform").reset();
      this.setState({
        pangolinStatus: "Alive",
        pangolinMortality: null,
        pangolinInfo: null,
        pangolinImg: null,
        pangolinLocation: null,
        pangolinImgName: null,
        visibility: false,
      });
    } catch (e) {
      console.log(e);
    }
  }
  /**
   * Method that renders the content on the page, several responses and a form component to be rendered depending on the boolean state values
   * @returns {JSX.Element}
   */
  render() {
    const nullError = this.state.valueNull ? (
      <p id="pError">Please pick a mortality type</p>
    ) : (
      ""
    );
    const mortalityType = this.state.visibility ? (
      <div>
        <label htmlFor="pangolinMortality">Mortality Type</label>
        {nullError}
        <select
          name="pangolinMortality"
          id="pangolinMortality"
          onChange={this.onPangolinMortality}
        >
          <option value="null">Please select the cause of death</option>
          <option value="Fence death: electrocution">
            Fence death: electrocution
          </option>
          <option value="Fence death: caught on non-electrified fence">
            Fence death: caught on non-electrified fence
          </option>
          <option value="Road death">Road death</option>
          <option value="Other">Other</option>
        </select>
      </div>
    ) : (
      ""
    );
    const noLocationError = this.state.noLocation ? (
      <div className="reportResponse bad">
        <p>
          Location couldn't be stored, try again after accepting geolocation
        </p>
      </div>
    ) : (
      ""
    );
    const imgError = this.state.imgBad ? (
      <p id="pError">Upload an appropriate image format</p>
    ) : (
      ""
    );
    const storedForm = this.state.offlineStored ? (
      <div className="reportResponse bad">
        <p>
          Unable to reach server but response has been stored and will be sent
        </p>
      </div>
    ) : (
      ""
    );
    const storedSent = this.state.offlineUploaded ? (
      <div className="reportResponse good">
        <p>Previous response that was stored has been sent</p>
      </div>
    ) : (
      ""
    );
    const formSuccess = this.state.successfulForm ? (
      <div className="reportResponse good">
        <p>Response has successfully been sent</p>
      </div>
    ) : (
      ""
    );
    return (
      <div className="form">
        {noLocationError}
        {storedForm}
        {storedSent}
        {formSuccess}
        <div className="formheader">
          <h2>Report A Pangolin</h2>
        </div>
        <div className="container">
          <form id="pangolinform">
            <label htmlFor="pangolinStatus">Pangolin Status</label>
            <select
              name="pangolinStatus"
              id="pangolinStatus"
              onChange={this.onPangolinStatus}
            >
              <option value="Alive">Alive</option>
              <option value="Dead">Dead</option>
            </select>
            <label htmlFor="pangolinImg">Image of Pangolin</label>
            {imgError}
            <input
              type="file"
              name="pangolinImg"
              id="pangolinImg"
              accept="image/*"
              onChange={this.onFileChange}
            />
            {mortalityType}
            <label>Additional Information</label>
            <textarea
              name="pangolinInfo"
              rows="6"
              cols="15"
              onChange={this.onPangolinInfo}
            ></textarea>
            <input type="submit" onClick={this.onSubmit}></input>
          </form>
        </div>
      </div>
    );
  }
}
