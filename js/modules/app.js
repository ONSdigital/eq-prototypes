"use strict";

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
          this.state.isAnswered ? React.createElement(
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

        var bodyStyles = {
          display: isOpen ? "block" : "none"
        };
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
            { style: bodyStyles },
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
        console.log("setRelationship");
        console.log(relationship, index);
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
            people.map(function (person, i) {
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
                    _this6.state.relationships[i] ? _this6.state.relationships[i] : '...'
                  ),
                  " to ",
                  person.firstName
                ), body: React.createElement(QuestionResponses, { setRelationship: _this6.setRelationship, confirmRelationship: _this6.confirmRelationship, index: i }) });
            })
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
        currentPerson: 0,
        people: people,
        activePerson: people.shift()
      };
      return _this7;
    }

    _createClass(App, [{
      key: "render",
      value: function render() {
        return React.createElement(Question, { activePerson: this.state.activePerson, people: this.state.people });
      }
    }]);

    return App;
  }(Component);

  render(React.createElement(App, null), document.getElementById('root'));
})();