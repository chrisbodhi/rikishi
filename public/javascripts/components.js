var isNode = typeof module !== 'undefined' && module.exports;
var React = isNode ? require('react') : window.React;
var ReactDOM = isNode ? require('react-dom') : window.ReactDOM;
var _ = isNode ? require('lodash') : window._;

var SurveyResults = React.createClass({
  getInitialState: function() {
    return {
      results: []
    };
  },

  loadServerData: function() {
    $.get('/api/surveys', function(results) {
      if (this.isMounted()) {
        this.setState({ results: results.surveyResults });
      }
    }.bind(this))
  },

  componentDidMount: function() {
    this.loadServerData();
    this.intervalId = setInterval(this.loadServerData, 3000);
  },

  componentWillUnmount: function() {
    clearInterval(this.intervalId)
  },

  render: function() {
    var results = this.state.results
      ? this.state.results
      : this.props.results;
    return (
      <ul>
        {_.map(results, function(result, index) {
          return <li key={index}>
            <p>{result.question}</p>
            <ul>
              {_.map(result.counts, function(ct, index) {
                return <li key={'ct=' + index}>
                  {ct.response} | {ct.count}
                </li>
              })}
            </ul>
          </li>
        })}
      </ul>
    );
  }
});

var VoteForm = React.createClass({render: function(){}});

if (isNode) {
  exports.SurveyResults = SurveyResults;
  exports.VoteForm = VoteForm;
} else {
  ReactDOM.render(
    <SurveyResults results='[]' />,
    document.getElementById('results')
  );
  ReactDOM.render(
    <VoteForm />,
    document.getElementById('vote-form')
  );
}
