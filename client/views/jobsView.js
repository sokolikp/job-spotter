var React = require('react');
var JobListing = require('./jobView');

var JobsList = React.createClass({

  render: function() {
    var list = this.props.jobs.map(function(job, index) {
      return <JobListing joblisting={job} key={index} />
    });
    return (
      <div className="jobs-list row col-sm-10 col-sm-offset-1">
        <h3 className="">Available Jobs</h3>
        <div> 
          {list}
        </div>
      </div>
    );
  }

});

module.exports = JobsList;
