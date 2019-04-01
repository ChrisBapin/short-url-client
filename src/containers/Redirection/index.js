import React from "react";
import axios from "axios";

class Redirection extends React.Component {
  state = {
    data: [],
    visit: "",
    id: "",
    shortUrl: "",
  };

  async componentDidMount() {
    // Get data array of url
    const response = await axios.get(
      "https://short-url-chris-bapin.herokuapp.com/get_url"
    );

    //  update state
    await this.setState({ data: response.data });

    for (let i = 0; i < this.state.data.length; i++) {
      // if "shorturl" in route === "shorturl in array"
      if (this.props.match.params.shorturl === this.state.data[i].shortUrl) {
        // increment visit
        this.state.data[i].visit = Number(this.state.data[i].visit) + 1;

        // update state
        await this.setState({
          visit: this.state.data[i].visit,
        });

        // update visits in db
        await axios.post(
          "https://short-url-chris-bapin.herokuapp.com/update_url/" +
            this.props.match.params.shorturl,
          {
            visit: this.state.visit,
          }
        );

        // redirection to external address which is in db
        window.location.href = this.state.data[i].longUrl;
      }
    }
  }

  render() {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}
      >
        {/* <div>Redirection</div> */}
      </div>
    );
  }
}

export default Redirection;
