"use strict"


module.exports = class Projects {
  constructor() {
    this.projects = {};
    this.err = 'Fail on add project'
  }

  add(socket,data) {
    // Checking config.
    if (!data.Route || !data.Name || !data.Interval || !data.Description) {
      console.log(this.err, ', config not valid !.', data);
      return false;
    }

    // Create project.
    // Create new object for not create a corupted object.
    this.projects[data.Name] = {
      Description : data.Description,
      Route : data.Route,
      Interval : data.Interval,
      Name : data.Name,
    }

    // Try callback addRoute
    this.callOnAddRoute(this.projects[data.projectName]);
  }

  remove(socket,data) {

  }

  update(socket,data) {

  }


  getProjects() {

  }

  onAddRoute(callOnAddRoute) {
    this.callOnAddRoute = callOnAddRoute;
  }
}
