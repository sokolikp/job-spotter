var Promise = require('bluebird');
var _ = require('underscore');
var Loc = require('../../sqldb/models/loc');
var Job = require('../../sqldb/models/job');
var Company = require('../../sqldb/models/startup');
var Role = require('../../sqldb/models/role');

module.exports = {
  getAllJobs: function (req, res, next) {
    console.log("Getting" + req.query.title + "jobs");
    // var jobsData = [];
    new Job()
    .where({name: req.query.title})
    .fetchAll({
      withRelated: ['startup','loc']
    })
    .then(function (jobs) {
      var locServer, company, locClient;
      var jobsData = _.map(jobs.models, function(job) {
        var jobData = {};

        jobData.job_id = job.attributes.id;
        jobData.title = job.attributes.name;
        jobData.salary = (job.attributes.salary_min + job.attributes.salary_max)/2;

        locServer = job.related('loc').at(0);
        if (locServer) {
          //if Washington, DC, don't use normal regex because it removes substring after ','
          if (locServer === "washington,_dc") {
            locClient = "Washington, DC";
          } else {
            locClient = locServer.replace(/_/g, " ").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
          }
        }
        company = job.related('startup').at(0);

        jobData.locServer = locServer === undefined ? locServer : locServer.attributes.name;
        jobData.company = company === undefined ? company : company.attributes.name;
        jobData.locClient = locServer === undefined ? locServer : locClient;

        return jobData;
      });

      console.log(jobsData.length);
      res.status(200).send(jobsData);
    });
  }

};
