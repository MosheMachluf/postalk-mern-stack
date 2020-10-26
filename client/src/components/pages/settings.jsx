import React, { Component } from "react";
import Swal from "sweetalert2";

import PageHeader from "../common/page-header";
import Button from "../common/button";

import userService from "../../services/userService";
import { swal } from "../../services/helpers";

import { tokenKey } from "../../config.json";
import EditProfile from "../common/edit-proile";

class Settings extends Component {
  state = {};

  deleteAccount = async () => {
    const { value } = await Swal.fire(swal.delete("account"));

    if (value) {
      await userService.deleteAccount();
      localStorage.removeItem(tokenKey);
      window.location = "/account";
    }
  };

  render() {

    return (
      <>
        <PageHeader title="Account Settings" />

        <div className="inner">
          <div className="row">
            <div className="col-md-3">
              <div className="list-group mb-5" id="list-tab">
                <div
                  className="list-group-item list-group-item-action active"
                  id="nav-edit-profile"
                  data-toggle="list"
                  href="#edit-profile"
                >
                  <i className="fas fa-user-edit mr-2" /> Edit Profile
                </div>

                <div
                  className="list-group-item list-group-item-action"
                  id="nav-delete-account"
                  data-toggle="list"
                  href="#delete-account"
                >
                  <i className="fas fa-user-slash mr-2" /> Delete Account
                </div>
              </div>
            </div>

            <div className="col-md-9">
              <div
                className="card p-3"
                style={{ minHeight: "calc(100vh - 250px)" }}
              >
                <div className="tab-content" id="nav-tabContent">
                  <div className="tab-pane fade show active" id="edit-profile">
                    <h2>Edit Profile</h2>
                    <hr />

                    <EditProfile history={this.props.history} />
                  </div>
                  <div className="tab-pane fade" id="delete-account">
                    <h2 className="text-danger">Delete Account</h2>
                    <hr />
                    <p>
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>

                    <Button
                      classbtn="button button-secondary mx-2"
                      onClick={this.deleteAccount}
                    >
                      <i className="far fa-trash-alt" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Settings;
