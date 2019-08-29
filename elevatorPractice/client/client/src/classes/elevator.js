import {elevatorStates} from './elevator_states_enum'
import {isBetween} from './utils'

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

    async addFloor (floor, direction) {
      if (this.floor.includes(floor)) {
        return
      }
      if (this.state === elevatorStates.still) {
        await this.floors.push(floor)
      }
      if (this.state === direction === elevatorStates.goingUp) { // if elevetor's going up and person wants to go up
        if (isBetween(this.floors[0], this.floors[1], floor)) {   // and if new floor is between current and target (e.x from 1 to 5 and button pressed at 3 ^)
          await this.floors.splice(1, 0, floor) // pushing new flor bettwen current and target marking new floor as new target
        }
      }
    }
  }
}
