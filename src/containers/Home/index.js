import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import axios from "axios";

class Home extends React.Component {
  state = {
    urlChange: "",
    tabUrl: [],
    isLoading: true,
    visit: "",
  };

  handleChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = async () => {
    try {
      // check if new address already exists
      for (let i = 0; i < this.state.tabUrl.length; i++) {
        if (this.state.urlChange === this.state.tabUrl[i].longUrl) {
          alert("cette adresse url existe déjà");
        }
      }
      // update db with new data of the url
      await axios.post(
        "https://short-url-chris-bapin.herokuapp.com/create_url/",
        {
          longUrl: this.state.urlChange,
          visit: 0,
        }
      );

      // get new url in array
      const responseGet = await axios.get(
        "https://short-url-chris-bapin.herokuapp.com/get_url/"
      );

      this.setState({
        tabUrl: responseGet.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  incrementVisit = index => {
    index.visit = Number(index.visit) + 1;
    this.setState({
      visit: index.visit,
    });
  };

  async componentDidMount() {
    try {
      // get new url in array
      const responseGet = await axios.get(
        "https://short-url-chris-bapin.herokuapp.com/get_url/"
      );

      this.setState({
        tabUrl: responseGet.data,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    if (this.state.isLoading === true) {
      return (
        <div>
          <div className="header__main--container">
            <div className="header--container main--container">
              <h1>Simplify your links</h1>
              <div>
                <input
                  type="text"
                  placeholder="Your original URL here"
                  name="urlChange"
                  value={this.state.urlChange}
                  onChange={this.handleChange}
                />
                <button onClick={this.handleSubmit}>Shorten url</button>
              </div>
            </div>
          </div>
          <div className="loader--content">
            <div>Chargement en cours, veuillez patienter</div>
            <div className="lds-hourglass" />
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="header__main--container">
          <div className="header--container main--container">
            <h1>Simplify your links</h1>
            <div>
              <input
                type="text"
                placeholder="Your original URL here"
                name="urlChange"
                value={this.state.urlChange}
                onChange={this.handleChange}
              />
              <button onClick={this.handleSubmit}>Shorten url</button>
            </div>
          </div>
        </div>
        <div className="table__main--container main--container">
          <table>
            <thead>
              <tr>
                <th>Original URL</th>
                <th>Short URL</th>
                <th>Visits</th>
              </tr>
            </thead>

            <tbody>
              {this.state.tabUrl.map((url, index) => {
                return (
                  <tr key={url._id}>
                    <td>
                      <a
                        rel="noopener noreferrer"
                        target="_blank"
                        href={url.longUrl}
                      >
                        {url.longUrl}
                      </a>
                    </td>
                    <td>
                      <Link
                        onClick={() => this.incrementVisit(url)}
                        to={"/" + url.shortUrl}
                      >
                        {url.baseShortUrl}
                      </Link>
                    </td>
                    <td>{this.state.tabUrl[index].visit}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Home;
