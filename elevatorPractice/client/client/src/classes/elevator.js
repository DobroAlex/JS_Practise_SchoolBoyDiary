import {elevatorStates} from './elevator_states_enum'
module.exports = {
  elevator: class {
    constructor () {
      this.state = elevatorStates.still
      this.floors = []
    }
    get state () {
      return this.state
    }

    get floors () {
      return this.floors
    }

    set state (state) {
      this.state = state
    }

    addFloor (floor, direction) {
      if (this.floor.includes(floor)) {
        return
      }
      if (this.state === elevatorStates.still) {
        this.floors.push(floor)
      }
      if (this.state === direction === elevatorStates.goingUp) {  // if elevetor's going up and person wants to go up
        this.floors.push(floor)  // simply add as a last element
      }
    }
  }
}
