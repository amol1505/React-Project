import React from "react";
import "../components/Sightings.css";
import { Link } from "react-router-dom";
import Loading from "../assets/images/loading.gif";
import offlineImage from "../assets/images/nowifi.jpg";

/**
 * @author Amol Dhaliwal
 * Sightings page displaying all of the sightings from GET request
 */

class Sightings extends React.Component {
  /**
   * Method containing local state of variables to be set depending on online connection, values from get request or via local storage
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      postCards: null,
      online: false,
      loading: true,
      pangolinData: null,
      imgURL: "https://ad959.brighton.domains/uploads/userimages/",
      offlineNoCache: false,
    };
  }
  /**
   * Method to iterate through JSON array from get request and occupy card layout with data
   * @param jsonData data about Pangolin
   */
  occupyPosts(jsonData) {
    const postCards = [];
    if (jsonData) {
      for (let i = 0; i < jsonData.length; i++) {
        postCards.push(
          <article key={i}>
            <img
              alt="pangolin"
              src={
                this.state.online
                  ? this.state.imgURL + jsonData[i].pangolinImg
                  : offlineImage
              }
            />
            <div className="text">
              <h3>{jsonData[i].pangolinStatus} Pangolin</h3>
              <Link
                to={`/Sighting${jsonData[i].id}`}
                className="navigatebutton"
              >
                View
              </Link>
            </div>
          </article>
        );
      }
      this.setState({ postCards: postCards });
    }
  }

  /**
   * Method called when the component is loaded which checks network connection and if there are any values stored in local storage.
   * Makes GET request to API if online and calling setValues method or uses values from localstorage if offline
   */

  async componentDidMount() {
    try {
      const cachedValues = localStorage.getItem("Sightings");
      if (navigator.onLine) {
        const dataResponse = await fetch(
          "https://ad959.brighton.domains/posts"
        );
        if (dataResponse.ok) {
          this.setState({ offlineNoCache: false });
          this.setState({ online: true });
          localStorage.removeItem("Sightings");
          const jsonData = await dataResponse.json();
          if (jsonData !== "No results") {
            this.occupyPosts(jsonData);
          }
          const storeLocally = JSON.stringify(jsonData);
          localStorage.setItem("Sightings", storeLocally);
        } else if (cachedValues) {
          this.setState({ offlineNoCache: false });
          const jsonData = JSON.parse(cachedValues);
          this.occupyPosts(jsonData);
        } else {
          this.setState({ offlineNoCache: true });
        }
      } else if (cachedValues) {
        this.setState({ offlineNoCache: false });
        const jsonData = JSON.parse(cachedValues);
        this.occupyPosts(jsonData);
      } else {
        this.setState({ offlineNoCache: true });
      }
      this.setState({ loading: false });
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Method that renders the content on the page, some of which depending on the boolean state values
   * such as image placeholder when offline and no cache either
   * @returns {JSX.Element}
   */

  render() {
    const offlineNoCachePage = this.state.offlineNoCache ? (
      <div className="noContent">
        <img src={offlineImage} alt="no content" />
      </div>
    ) : (
      ""
    );
    const loadingAnimation = this.state.loading ? (
      <div className="loadingimg">
        <img id="pangolinLoading" src={Loading} alt="Data loading" />
      </div>
    ) : (
      <div className="postcontainer">
        <main className="grid">{this.state.postCards}</main>
      </div>
    );
    return (
      <div className="postdisplay">
        <h2 className="titleText">Pangolin Sightings:</h2>
        {offlineNoCachePage}
        {loadingAnimation}
      </div>
    );
  }
}

export default Sightings;
