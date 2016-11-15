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

  const relationshipTypes = window.__RELATIONSHIP_TYPES__

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
      const type = relationship.split(" ")[0].toLowerCase()
      return (
        <div className={`field__item field__item--tight ${type}`}>
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
      if (!this.props.requiresConfirm) {
        this.props.confirmRelationship(index)
      }
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
          {this.state.isAnswered && this.props.requiresConfirm
            ? <button className="btn btn--border--census u-mt-s" onClick={e => this.onConfirm(e)}>Confirm relationship</button>
            : null}
        </div>
      )
    }
  }

  class QuestionAccordion extends Component {
    render() {
      const {isOpen, title, body} = this.props

      return (
        <div className="question__accordion">
          <div>{title}</div>
          <div className={`question__accordion-body ${isOpen ? 'is-open' : 'is-closed'}`}>{body}</div>
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
      this.props.onConfirm()
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
            <p className="mars">If members are not related, select the ‘unrelated’ option, including foster parents and foster children.</p>
          </div>
          <div className="question__responses">
            {people.length > 1
              ?
                people.map((person, i) => {
                  return (
                    <QuestionAccordion isOpen={i === this.state.openResponse} key={i}
                      title={
                      <h3 className="neptune">{activePerson.firstName} is <strong className="neptune strong-census" onClick={e => this.editRelationship(i)}>{this.state.relationships[i] ? this.state.relationships[i].toLowerCase() : '...'}</strong> to {person.firstName}</h3>
                    } body={
                      <QuestionResponses setRelationship={this.setRelationship} confirmRelationship={this.confirmRelationship} requiresConfirm index={i}/>
                    }>
                    </QuestionAccordion>
                  )
                })
              :
                <div>
                  <h3 className="neptune">{activePerson.firstName} is <strong className="neptune strong-census">{this.state.relationships[0] ? this.state.relationships[0].toLowerCase() : '...'}</strong> to {people[0].firstName}</h3>
                  <QuestionResponses setRelationship={this.setRelationship} confirmRelationship={this.confirmRelationship} requiresConfirm={false} index={0} />
                </div>


            }
          </div>
        </div>
      )
    }
  }

  class App extends Component {

    constructor(props) {
      super()

      const appState = sessionStorage.getItem('appState')

      if (appState) {
        this.state = JSON.parse(appState)
        if (this.state.people.length === 0) {
          this.navigateToNextSection()
        }
        return
      }

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
        numConfirmed: 0,
        canContinue: false,
        people: people,
        activePerson: people.shift()
      }
    }

    navigateToNextSection() {
      sessionStorage.removeItem('appState')
      window.location = '../section-9-inter'
    }

    onRelationshipConfirmed = () => {
      const numConfirmed = this.state.numConfirmed + 1

      this.setState({
        numConfirmed: numConfirmed
      })

      if (numConfirmed === this.state.people.length) {
        this.setState({canContinue: true})
      }
    }

    onSave = (e) => {
      if (this.state.canContinue) {
        if (this.state.people.length === 1) {
          e.preventDefault()
          this.navigateToNextSection()
        }

        const activePerson = this.state.people.shift()
        sessionStorage.setItem('appState', JSON.stringify({
          ...this.state,
          numConfirmed: 0,
          canContinue: false,
          people: this.state.people,
          activePerson: activePerson
        }))
      }
    }

    render() {
      return (
        <form action="../section-8" className="form qa-questionnaire-form" role="form" noValidate="">
          <div className="hidden-form">
          </div>
          <div className="group" id="14ba4707-321d-441d-8d21-b8367366e766">
            <div className="block" id="cd3b74d1-b687-4051-9634-a8f9ce10a27d">
              <div className="section" id="017880bc-752d-4a6b-83df-e130409ee660">
                <h2 className="section__title saturn"><span className="section__title__number question__title__number--census venus">1</span>Who lives here?</h2>
                <Question activePerson={this.state.activePerson} people={this.state.people} onConfirm={this.onRelationshipConfirmed}/>
              </div>
            </div>
          </div>

          <button className="btn btn--census qa-btn-get-started venus" disabled={!this.state.canContinue} type="submit" name="" onClick={this.onSave}>Save and continue</button><br/><br/>
          <a className="mars" href="">Save and complete later</a><br/><br/>
          <a className="mars" href="">Previous</a>
        </form>
      )

    }
  }

  render(
    <App />,
    document.getElementById('root')
  );

})()
