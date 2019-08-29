import {elevatorStates} from './elevator_states_enum'
import {isBetween} from './utils'

class Elevator {
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

  async removeCurrentFloor () { // is ought to be called then elevator arrives at floor
    await this.floors[0].shift()
  }

  async addFloor (floor, direction) {
    if (this.floor.includes(floor)) { // it's pointless to add floor if queue contains one
      return
    }
    if (this.state === elevatorStates.still) { // if elevator queue is empty
      await this.floors.push(floor) // insert target to queue
    }
    if (this.state === direction === elevatorStates.goingUp) { // if elevetor's going up and person wants to go up
      if (isBetween(this.floors[0], this.floors[1], floor)) { // and if new floor is between current and target (e.x from 1 to 5 and button pressed at 3 ^)
        await this.floors.splice(1, 0, floor) // pushing new flor bettwen current and target marking new floor as new target
      }
      if ((floor > this.floors[this.floors.length - 1]) || (floor < this.floors[0])) { // if new floor as higher than last in queue or lower than first
        await this.floors.push(floor) // push it to the top (making last in queue)
      }
    }
    if (this.state === direction === elevatorStates.goingDown) {
      if (isBetween(this.floors[0], this.floors[1], floor)) {
        await this.floors.splice(1, 0, floor) //  similar to previous in goingUp: pushing level in between two neighboors
      }
      if (floor < this.floors[this.floors.length - 1]) {
        await this.floors.push(floor)
      }
    } else {
      await this.floors.push(floor)
    }
  }
}

module.exports = {
  Elevator
}
