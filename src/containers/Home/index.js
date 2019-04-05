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

  // function to know if url is valid
  urlValid = str => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!pattern.test(str);
  };

  handleSubmit = async () => {
    try {
      // check if new address already exists
      for (let i = 0; i < this.state.tabUrl.length; i++) {
        if (this.state.urlChange === this.state.tabUrl[i].longUrl) {
          alert("cette adresse url existe déjà");
        }
      }

      // check if address is valid
      if (this.urlValid(this.state.urlChange)) {
        // update db with new data of the url
        await axios.post(
          "https://short-url-chris-bapin.herokuapp.com/create_url/",
          {
            //if longUrl not includes http or https => add http:// in the url
            longUrl:
              this.state.urlChange.includes("http") ||
              this.state.urlChange.includes("https")
                ? this.state.urlChange
                : "http://" + this.state.urlChange,
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
      } else {
        alert("url is not valid");
      }
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
                        target="_blank"
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
