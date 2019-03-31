import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import axios from "axios";

class Home extends React.Component {
  state = {
    urlChange: "",
    tabUrl: [],
  };

  handleChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8080/create_url/", {
        longUrl: this.state.urlChange,
        visit: 0,
      });

      const responseGet = await axios.get("http://localhost:8080/get_url/");

      this.setState({
        tabUrl: responseGet.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  async componentDidMount() {
    try {
      const responseGet = await axios.get("http://localhost:8080/get_url/");

      this.setState({
        tabUrl: responseGet.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
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
                      <Link to={"/" + url.shortUrl}>{url.baseShortUrl}</Link>
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
