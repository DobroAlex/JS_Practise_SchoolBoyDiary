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
      
    }
  }
}
