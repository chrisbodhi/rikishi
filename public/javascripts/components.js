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
      user: {},
      survey: {},
      answerId: 0
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

  handleClick: function(event) {
    this.setState({ answerId: event.target.value });
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({ user: nextProps.user });
  },

  componentDidMount: function() {
    this.getNextSurvey();
  },

  submitForm: function(event) {
    event.preventDefault();

    $.ajax({
      type: 'POST',
      url: '/api/results',
      data: {
        userId: this.props.user.id,
        surveyId: this.state.survey.id,
        answerId: this.state.answerId
      },
      success: function(data) {
        console.log('Added to the results', data);
      }
    });
    this.getNextSurvey();
  },

  render: function() {
    var question = this.state.survey.question;
    var answers = this.state.survey.answers;
    return (
      <form action={this.submitForm}>
        <fieldset>
          <label>Question: {question}</label>
          <ul>
            {_.map(answers, function(answer, index) {
              return (<li key={index}>
                <input
                  type='radio'
                  name='answer'
                  value={answer.id}
                  onChange={this.handleClick}/>
                {answer.text}
              </li>);
            }.bind(this))}
          </ul>
          <input type='submit' onClick={this.submitForm} />
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
