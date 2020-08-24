import React, { Component } from "react";
import Header from "./header";
import Navbar from "./navbar";
import Footer from "./footer";

class Layout extends Component {
  render() {
    const { user } = this.props;

    return (
      <>
        <Header user={user} />

        <div className="container-lg">
          <div className="row flex-nowrap">
            <div>
              <Navbar user={user} />
            </div>

            <div className="grow-1 border bg-light">
              <main> {this.props.children} </main>
              <Footer />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Layout;
