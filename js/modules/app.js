"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  var _React = React,
      Component = _React.Component;
  var _ReactDOM = ReactDOM,
      render = _ReactDOM.render;


  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }return text;
  }

  var relationshipTypes = ["Husband or wife", "Partner", "Unrelated", "Same sex civil-partner", "Mother or father", "Son or daughter", "Step-mother or step-father", "Step-child", "Brother or sister", "Step–brother or step–sister", "Grandparent", "Grandchild", "Relation - other"];

  var Field = function (_Component) {
    _inherits(Field, _Component);

    function Field() {
      _classCallCheck(this, Field);

      var _this = _possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).call(this));

      _this.state = {
        isComplete: false
      };
      return _this;
    }

    _createClass(Field, [{
      key: "render",
      value: function render() {
        var _props = this.props,
            relationship = _props.relationship,
            index = _props.index,
            setRelationship = _props.setRelationship;

        var id = "form-input-" + index + "-" + makeid();
        return React.createElement(
          "div",
          { className: "field__item field__item--tight" },
          React.createElement("input", { onChange: function onChange(e) {
              setRelationship(relationship, index);
            }, className: "input input--radio", type: "radio", name: "q6", id: id, value: relationship, title: relationship }),
          React.createElement(
            "label",
            { className: "label label--inline", htmlFor: id },
            React.createElement(
              "span",
              { className: "label__inner" },
              relationship
            )
          )
        );
      }
    }]);

    return Field;
  }(Component);

  var QuestionResponses = function (_Component2) {
    _inherits(QuestionResponses, _Component2);

    function QuestionResponses() {
      _classCallCheck(this, QuestionResponses);

      var _this2 = _possibleConstructorReturn(this, (QuestionResponses.__proto__ || Object.getPrototypeOf(QuestionResponses)).call(this));

      _this2.state = {
        isAnswered: false
      };
      return _this2;
    }

    _createClass(QuestionResponses, [{
      key: "setRelationship",
      value: function setRelationship(relationship, index) {
        this.setState({
          isAnswered: true
        });
        this.props.setRelationship(relationship, index);
        if (!this.props.requiresConfirm) {
          this.props.confirmRelationship(index);
        }
      }
    }, {
      key: "onConfirm",
      value: function onConfirm(e) {
        e.preventDefault();
        this.props.confirmRelationship(this.props.index);
        return false;
      }
    }, {
      key: "render",
      value: function render() {
        var _this3 = this;

        return React.createElement(
          "div",
          { className: "response response--radio" },
          React.createElement(
            "div",
            { className: "field field--multi field--radio" },
            relationshipTypes.map(function (relationship, index) {
              return React.createElement(Field, { relationship: relationship, index: index, key: index, setRelationship: function setRelationship(e) {
                  return _this3.setRelationship(relationship, _this3.props.index);
                } });
            })
          ),
          this.state.isAnswered && this.props.requiresConfirm ? React.createElement(
            "button",
            { className: "btn btn--border--census u-mt-s", onClick: function onClick(e) {
                return _this3.onConfirm(e);
              } },
            "Confirm relationship"
          ) : null
        );
      }
    }]);

    return QuestionResponses;
  }(Component);

  var QuestionAccordion = function (_Component3) {
    _inherits(QuestionAccordion, _Component3);

    function QuestionAccordion() {
      _classCallCheck(this, QuestionAccordion);

      return _possibleConstructorReturn(this, (QuestionAccordion.__proto__ || Object.getPrototypeOf(QuestionAccordion)).apply(this, arguments));
    }

    _createClass(QuestionAccordion, [{
      key: "render",
      value: function render() {
        var _props2 = this.props,
            isOpen = _props2.isOpen,
            title = _props2.title,
            body = _props2.body;


        return React.createElement(
          "div",
          { className: "question__accordion" },
          React.createElement(
            "div",
            null,
            title
          ),
          React.createElement(
            "div",
            { className: "question__accordion-body " + (isOpen ? 'is-open' : 'is-closed') },
            body
          )
        );
      }
    }]);

    return QuestionAccordion;
  }(Component);

  var Question = function (_Component4) {
    _inherits(Question, _Component4);

    function Question() {
      _classCallCheck(this, Question);

      var _this5 = _possibleConstructorReturn(this, (Question.__proto__ || Object.getPrototypeOf(Question)).call(this));

      _this5.setRelationship = function (relationship, index) {
        var relationships = _this5.state.relationships;
        relationships[index] = relationship;
        _this5.setState({
          relationships: relationships
        });
      };

      _this5.confirmRelationship = function (index) {
        _this5.setState({
          openResponse: index + 1
        });
        _this5.props.onConfirm();
      };

      _this5.editRelationship = function (index) {
        _this5.setState({
          openResponse: index
        });
      };

      _this5.state = {
        openResponse: 0,
        relationships: []
      };
      return _this5;
    }

    _createClass(Question, [{
      key: "render",
      value: function render() {
        var _this6 = this;

        var _props3 = this.props,
            activePerson = _props3.activePerson,
            people = _props3.people;

        return React.createElement(
          "div",
          { className: "question" },
          React.createElement(
            "h3",
            { className: "question__title neptune" },
            "Describe how ",
            activePerson.firstName,
            " is related to other members of the household."
          ),
          React.createElement(
            "div",
            { className: "question__description mars", id: "description" },
            React.createElement(
              "p",
              { className: "mars" },
              "If they are not related, select the \u2018unrelated\u2019 option"
            )
          ),
          React.createElement(
            "div",
            { className: "question__responses" },
            people.length > 1 ? people.map(function (person, i) {
              return React.createElement(QuestionAccordion, { isOpen: i === _this6.state.openResponse, key: i,
                title: React.createElement(
                  "h3",
                  { className: "neptune" },
                  activePerson.firstName,
                  " is ",
                  React.createElement(
                    "strong",
                    { className: "neptune strong-census", onClick: function onClick(e) {
                        return _this6.editRelationship(i);
                      } },
                    _this6.state.relationships[i] ? _this6.state.relationships[i].toLowerCase() : '...'
                  ),
                  " to ",
                  person.firstName
                ), body: React.createElement(QuestionResponses, { setRelationship: _this6.setRelationship, confirmRelationship: _this6.confirmRelationship, requiresConfirm: true, index: i }) });
            }) : React.createElement(
              "div",
              null,
              React.createElement(
                "h3",
                { className: "neptune" },
                activePerson.firstName,
                " is ",
                React.createElement(
                  "strong",
                  { className: "neptune strong-census" },
                  this.state.relationships[0] ? this.state.relationships[0].toLowerCase() : '...'
                ),
                " to ",
                people[0].firstName
              ),
              React.createElement(QuestionResponses, { setRelationship: this.setRelationship, confirmRelationship: this.confirmRelationship, requiresConfirm: false, index: 0 })
            )
          )
        );
      }
    }]);

    return Question;
  }(Component);

  var App = function (_Component5) {
    _inherits(App, _Component5);

    function App(props) {
      _classCallCheck(this, App);

      var _this7 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

      _this7.onRelationshipConfirmed = function () {
        var numConfirmed = _this7.state.numConfirmed + 1;

        _this7.setState({
          numConfirmed: numConfirmed
        });

        if (numConfirmed === _this7.state.people.length) {
          _this7.setState({ canContinue: true });
        }
      };

      _this7.onSave = function (e) {
        if (_this7.state.canContinue) {
          if (_this7.state.people.length === 1) {
            e.preventDefault();
            _this7.navigateToNextSection();
          }

          var activePerson = _this7.state.people.shift();
          sessionStorage.setItem('appState', JSON.stringify(_extends({}, _this7.state, {
            numConfirmed: 0,
            canContinue: false,
            people: _this7.state.people,
            activePerson: activePerson
          })));
        }
      };

      var appState = sessionStorage.getItem('appState');

      if (appState) {
        _this7.state = JSON.parse(appState);
        if (_this7.state.people.length === 0) {
          _this7.navigateToNextSection();
        }
        return _possibleConstructorReturn(_this7);
      }

      var people = [];
      var getPeople = function getPeople() {
        var numPeople = parseInt(sessionStorage.getItem('numberOfEntities'), 10);
        for (var i = 0; i < numPeople; i++) {
          people.push({
            firstName: sessionStorage.getItem("firstName" + i),
            middleName: sessionStorage.getItem("middleName" + i),
            lastName: sessionStorage.getItem("lastName" + i)
          });
        }
      };

      getPeople();

      _this7.state = {
        numConfirmed: 0,
        canContinue: false,
        people: people,
        activePerson: people.shift()
      };
      return _this7;
    }

    _createClass(App, [{
      key: "navigateToNextSection",
      value: function navigateToNextSection() {
        sessionStorage.removeItem('appState');
        window.location = '../section-9';
      }
    }, {
      key: "render",
      value: function render() {
        return React.createElement(
          "form",
          { action: "../section-8", className: "form qa-questionnaire-form", role: "form", noValidate: "" },
          React.createElement("div", { className: "hidden-form" }),
          React.createElement(
            "div",
            { className: "group", id: "14ba4707-321d-441d-8d21-b8367366e766" },
            React.createElement(
              "div",
              { className: "block", id: "cd3b74d1-b687-4051-9634-a8f9ce10a27d" },
              React.createElement(
                "div",
                { className: "section", id: "017880bc-752d-4a6b-83df-e130409ee660" },
                React.createElement(
                  "h2",
                  { className: "section__title saturn" },
                  React.createElement(
                    "span",
                    { className: "section__title__number question__title__number--census venus" },
                    "2"
                  ),
                  "Household"
                ),
                React.createElement(Question, { activePerson: this.state.activePerson, people: this.state.people, onConfirm: this.onRelationshipConfirmed })
              )
            )
          ),
          React.createElement(
            "button",
            { className: "btn btn--census qa-btn-get-started venus", disabled: !this.state.canContinue, type: "submit", name: "", onClick: this.onSave },
            "Save and continue"
          ),
          React.createElement("br", null),
          React.createElement("br", null),
          React.createElement(
            "a",
            { className: "mars", href: "" },
            "Save and complete later"
          ),
          React.createElement("br", null),
          React.createElement("br", null),
          React.createElement(
            "a",
            { className: "mars", href: "" },
            "Previous"
          )
        );
      }
    }]);

    return App;
  }(Component);

  render(React.createElement(App, null), document.getElementById('root'));
})();