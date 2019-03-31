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
    const response = await axios.get("https://short-url-chris-bapin.herokuapp.com/get_url");
    await this.setState({ data: response.data });

    for (let i = 0; i < this.state.data.length; i++) {
      if (this.props.match.params.shorturl === this.state.data[i].shortUrl) {
        console.log(i, this.state.data[i]);
        this.state.data[i].visit = Number(this.state.data[i].visit) + 1;
        await this.setState({
          visit: this.state.data[i].visit,
        });
        window.location.href = this.state.data[i].longUrl;
      }
    }

    await axios.post(
      "https://short-url-chris-bapin.herokuapp.com/update_url/" + this.props.match.params.shorturl,
      {
        visit: this.state.visit,
      }
    );
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
