"use strict"


module.exports = class Projects {
  constructor() {
    this.projects = {};
    this.public_projects = {};

    this.err = 'Fail on add project';

    this.ping();
  }

  ping() {
    setInterval(() => {
      Object.keys(this.projects).forEach((key) => {
        // The Slave is down, i dont need ping.
        if (!this.projects[key].status) return;

        console.log('Send ping to', this.projects[key].Name, this.projects[key].status)
        this.projects[key].socket.emit('update', {}, (e) => { console.log('test',e) });

        // Create final object.
        this.public_projects[this.projects[key].Name] = this.projects[key];

        console.log(this.public_projects);
      })
    },1000)
  }

  add(socket,data) {
    // Checking config.
    if (!data.Route || !data.Name || !data.Description) {
      console.log(this.err, ', config not valid !.', data);
      return false;
    }

    // Check current list and remove doublon
    Object.keys(this.projects).forEach((key) => {
      if (this.projects[key].Name == data.Name)
        delete this.projects[key]
    });

    // Create project.
    // Create new object for not create a corupted object.
    this.projects[socket.id] = {
      Description : data.Description,
      Route : data.Route,
      Interval : data.Interval,
      Name : data.Name,
      socket : socket,
      status : true,
      data : {},
    }

    // Try callback addRoute
    this.callOnAddRoute(this.projects[socket.id]);
  }

  remove(socket) {
    console.log('Serveur is down')
    this.projects[socket.id].status = false
  }

  update(socket,data) {
    this.projects[socket.id].data = data
  }


  getProjects() {

  }



  onAddRoute(callOnAddRoute) {
    this.callOnAddRoute = callOnAddRoute;
  }
}
