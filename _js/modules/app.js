(() => {
  const { Component } = React
  const { render } = ReactDOM

  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  const relationshipTypes = [
    "Husband or wife",
    "Partner",
    "Unrelated",
    "Same sex civil-partner",
    "Mother or father",
    "Son or daughter",
    "Step-mother or step-father",
    "Step-child",
    "Brother or sister",
    "Step–brother or step–sister",
    "Grandparent",
    "Grandchild",
    "Relation - other",
  ]

  class Field extends Component {
    constructor() {
      super()
      this.state = {
        isComplete: false
      }
    }
    render() {
      const {relationship, index, setRelationship} = this.props
      const id = `form-input-${index}-${makeid()}`
      return (
        <div className="field__item field__item--tight">
          <input onChange={e => {
           setRelationship(relationship, index)
         }} className="input input--radio" type="radio" name="q6" id={id} value={relationship} title={relationship} />
          <label className="label label--inline" htmlFor={id}><span className="label__inner">{relationship}</span></label>
        </div>
      )
    }
  }

  class QuestionResponses extends Component {
    constructor() {
      super()
      this.state = {
        isAnswered: false
      }
    }
    setRelationship(relationship, index) {
      this.setState({
        isAnswered: true
      })
      this.props.setRelationship(relationship, index)
    }
    onConfirm(e) {
      e.preventDefault()
      this.props.confirmRelationship(this.props.index)
      return false
    }
    render() {
      return (
        <div className="response response--radio">
          <div className="field field--multi field--radio">
            {relationshipTypes.map((relationship, index) => {
              return <Field relationship={relationship} index={index} key={index} setRelationship={e => this.setRelationship(relationship, this.props.index)} />
            })}
          </div>
          {this.state.isAnswered
            ? <button className="btn btn--border--census u-mt-s" onClick={e => this.onConfirm(e)}>Confirm relationship</button>
            : null}
        </div>
      )
    }
  }

  class QuestionAccordion extends Component {
    render() {
      const {isOpen, title, body} = this.props
      const bodyStyles = {
        display: isOpen ? "block" : "none"
      }
      return (
        <div className="question__accordion">
          <div>{title}</div>
          <div style={bodyStyles}>{body}</div>
        </div>
      )
    }
  }

  class Question extends Component {

    constructor() {
      super()
      this.state = {
        openResponse: 0,
        relationships: []
      }
    }

    setRelationship = (relationship, index) => {
      console.log("setRelationship");
      console.log(relationship, index);
      const relationships = this.state.relationships
      relationships[index] = relationship
      this.setState({
        relationships: relationships
      })
    }

    confirmRelationship = (index) => {
      this.setState({
        openResponse: index + 1
      })
    }

    editRelationship = (index) => {
      this.setState({
        openResponse: index
      })
    }

    render() {
      const {activePerson, people} = this.props
      return (
        <div className="question">
          <h3 className="question__title neptune">Describe how {activePerson.firstName} is related to other members of the household.</h3>
          <div className="question__description mars" id="description">
            <p className="mars">If they are not related, select the ‘unrelated’ option</p>
          </div>
          <div className="question__responses">
            {people.map((person, i) => {
              return (
                <QuestionAccordion isOpen={i === this.state.openResponse} key={i}
                  title={
                  <h3 className="neptune">{activePerson.firstName} is <strong className="neptune strong-census" onClick={e => this.editRelationship(i)}>{this.state.relationships[i] ? this.state.relationships[i] : '...'}</strong> to {person.firstName}</h3>
                } body={
                  <QuestionResponses setRelationship={this.setRelationship} confirmRelationship={this.confirmRelationship} index={i}/>
                }>
                </QuestionAccordion>
              )
            })}
          </div>
        </div>
      )
    }
  }

  class App extends Component {

    constructor(props) {
      super()

      const people = []
      const getPeople = () => {
        const numPeople = parseInt(sessionStorage.getItem('numberOfEntities'), 10)
        for (var i = 0; i < numPeople; i++) {
          people.push({
            firstName: sessionStorage.getItem(`firstName${i}`),
            middleName: sessionStorage.getItem(`middleName${i}`),
            lastName: sessionStorage.getItem(`lastName${i}`),
          })
        }
      }

      getPeople()

      this.state = {
        currentPerson: 0,
        people: people,
        activePerson: people.shift()
      }
    }

    render() {
      return <Question activePerson={this.state.activePerson} people={this.state.people} />
    }
  }

  render(
    <App />,
    document.getElementById('root')
  );

})()
