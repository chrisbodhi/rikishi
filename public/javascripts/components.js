var isNode = typeof module !== 'undefined' && module.exports;
var React = isNode ? require('react') : window.React;
var ReactDOM = isNode ? require('react-dom') : window.ReactDOM;
var _ = isNode ? require('lodash') : window._;

var SurveyResults = React.createClass({
  getInitialState: function() {
    return {
      results: [],
      user: ''
    };
  },

  loadServerData: function() {
    $.get('/api/surveys')
      .then(function(results) {
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

  render: function(user) {
    var results = this.state.results
      ? this.state.results
      : this.props.results;
    return (<ul>
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
      </ul>);
  }
});

var SurveyForm = React.createClass({
  getInitialState: function() {
    return {
      survey: {}
    };
  },

  getNextSurvey: function() {
    $.get('/api/survey/user/' + this.props.user.id)
      .then(function(resp) {
        $.get('/api/survey/' + resp.nextId)
          .then(function(surveyObj) {
            if (this.isMounted()) {
              this.setState({ survey: surveyObj });
            }
          }.bind(this));
      }.bind(this));
  },

  componentDidMount: function() {
    this.getNextSurvey();
  },

  submitForm: function() {
    $.post().then();
  },

  render: function() {
    return (
      <form action={this.submitForm}>
        <fieldset>
          <label>Question: {this.state.survey.question}</label>
          <ul>
            {_.map(this.state.survey.answers, function(answer, index) {
              return (<li key={index}>
                <input
                  type='radio'
                  value={_.lowerCase(answer)}
                  id={_.lowerCase(answer)} />
                {answer}
              </li>);
            })}
          </ul>
          <input type='submit' value='Vote!' />
        </fieldset>
      </form>
    );
  }
});

var SurveyComponent = React.createClass({
  getInitialState: function() {
    return {
      user: {}
    };
  },

  loadServerData: function() {
    $.get('/api/user')
      .then(function(user) {
        if (this.isMounted()) {
          this.setState({ user: user.user });
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
    var user = this.state.user
      ? this.state.user
      : this.props.user;
    return user.isAdmin
      ? <SurveyResults user={user} results='[]' />
      : <SurveyForm user={user} />
  }
});

if (isNode) {
  exports.SurveyComponent = SurveyComponent;
} else {
  ReactDOM.render(
    <SurveyComponent user={{isAdmin: 1}} />,
    document.getElementById('survey')
  );
}
