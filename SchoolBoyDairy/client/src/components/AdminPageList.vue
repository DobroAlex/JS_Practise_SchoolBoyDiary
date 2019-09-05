<template>
    <div class="defaultPageStyle">
        <modal name="addLessonModal"
            :classes="['v--modal']"
            :pivot-y="0.2"
            :width="240"
            :height="240"
            >
            <div class="addLessonHead">Add new lesson</div>
            <div class="addLessonBody">
                <label> Select Data </label>
                <input type="datetime-local" v-model="newDay">
                <label> Select State </label>
                <select required="true"  v-model="newState">
                    <option value="visited">visited (and paid)</option>
                    <option value="missed">missed</option>
                    <option value="unpaid">unpaid (but visited)</option>
                </select>
                <button type="button" @click="saveLesson(newDay, newState)">Save</button>
                <button type="button" @click="closeMeModal('addLessonModal')">Close</button>
            </div>
        </modal>

        <modal name="editLessonModal"
            :classes="['v--modal']"
            :pivot-y="0.2"
            :width="240"
            :height="240"
            >
            <div class="editLessonHead">Edit lesson</div>
            <div class="editLessonBody">
                <label> Select Data </label>
                <input type="datetime-local" v-model="currentlyEditingLesson.date.toString" >
                <label> Select State </label>
                <select required="true"  v-model="currentlyEditingLesson.state">
                    <option value="visited">visited (and paid)</option>
                    <option value="missed">missed</option>
                    <option value="unpaid">unpaid (but visited)</option>
                </select>
                <button type="button" @click="saveEditedLesson(currentlyEditingLesson.id, currentlyEditingLesson)">Save</button>
                <button type="button" @click="closeMeModal('editLessonModal')">Close</button>
            </div>
        </modal>


        <modal name="addHomeTaskModal"
            :classes="['v--modal']"
            :pivot-y="0.2"
            :width="240"
            :height="240"
            >
            <div class="addHomeTaskHead">Add new Home Task</div>
            <div class="addHomeTaskBody">
                <label> Select Data </label>
                <input type="datetime-local" v-model="newDay">
                <label> Select State </label>
                <select required="true"  v-model="newState">
                    <option value="done">done 100%</option>
                    <option value="missed">missed</option>
                    <option value="partialy">done partialy</option>
                </select>
                <textarea v-model="newDescription">New home task description</textarea>
                <button type="button" @click="saveHomeTask(newDay, newState, newDescription )">Save</button>
                <button type="button" @click="closeMeModal('addHomeTaskModal')">Close</button>
            </div>
        </modal>

        <modal name="editHomeTaskModal"
            :classes="['v--modal']"
            :pivot-y="0.2"
            :width="240"
            :height="240"
            >
            <div class="editHomeTaskHead">Edit Home Task</div>
            <div class="editHomeTaskBody">
                <label> Select Data </label>
                <input type="datetime-local" v-model="currentlyEditingHomeTask.date">
                <label> Select State </label>
                <select required="true"  v-model="currentlyEditingHomeTask.state">
                    <option value="done">done 100%</option>
                    <option value="missed">missed</option>
                    <option value="partialy">done partialy</option>
                </select>
                <textarea v-model="currentlyEditingHomeTask.description">New home task description</textarea>
                <button type="button" @click="saveEditedHomeTask(newDay, newState, newDescription )">Save</button>
                <button type="button" @click="closeMeModal('editHomeTaskModal')">Close</button>
            </div>
        </modal>

        <div class="editModal" v-if="isModalDisplaying === true">
            <label>Full Name:</label>
                <input required v-model="fullName">

                <label>email:</label>
                <input required v-model="email">

                <p>
                    <label>School:</label>
                    <input required v-model="school">
                    <label>Class:</label>
                    <input v-model="schoolClass">
                </p>

                <label>Phone Number:</label>
                <input required v-model="phoneNumber">

                <p>
                    <label>Description</label>
                    <textarea v-model="description" ></textarea>
                </p>

                <table>
                    <button type="button" @click="addLesson">Add lesson</button>
                    <tr>
                        <td> Date </td>
                        <td> State </td>
                    </tr>
                    <tr v-for="lesson in currentlyEditingUser.lessons">
                        <td> {{lesson.date}} </td>
                        <td> {{lesson.state}} </td>
                        <button type="button" @click="editLesson(lesson)">Edit</button>
                    </tr>
                </table>

                <hr>
                <table>
                    <button type="button" @click="addHomeTask">Add Home Task</button>
                    <tr>
                        <td> Date </td>
                        <td> Task </td>
                        <td> State </td>
                    </tr>
                    <tr v-for="task in currentlyEditingUser.homeTasks">
                        <td> {{task.date}} </td>
                        <td> {{task.task}} </td>
                        <td> {{task.state}} </td>
                        <button type="button" @click="editHomeTask(task)">Edit</button>
                    </tr>
                </table>
                <p>
                    <label>Role</label>
                    <br>
                    <input type="radio" name="role" value="admin" id="radioAdmin" v-model="role">Admin
                    <br>
                    <input type="radio" name="role" value="user" id="radioUser" v-model="role">User
                </p>

                
                <hr>
                <button type="button"  @click="cancelEditButtonClicked">Cancel</button>
                <button type="button" @click="saveButtonClicked">Save</button>
                
                <div class="loader" v-if="submitStatus === 'PENDING'"></div>
        </div>
        <div class="adminPageList" v-if="!isModalDisplaying">
            <div class="loader" v-if="submitStatus === 'PENDING'"></div>
            <div v-else>
                <h1>Users</h1>
                <table>
                    <tr>
                        <td> id </td>
                        <td> full name </td>
                        <td> email </td>
                        <td> description </td>
                        <td> school <td>
                        <td> class </td>
                        <td> phoneNumber </td>
                        <td> role </td>
                    </tr>
                    <tr v-for="user in users">
                        <td> {{user._id}} </td>
                        <td> {{user.fullName}} </td>
                        <td> {{user.email}} </td>
                        <td> {{user.description}} </td>
                        <td> {{user.school}} </td>
                        <td> {{user.class}} </td>
                        <td> {{user.phoneNumber}} </td>
                        <td> {{user.role}} </td>
                        <p>
                            <button type="submit" @click="deleteButtonClicked(user.email)"> Delete </button>
                            <button type="submit" @click="editUserButtonClicked(user)"> Edit this </button>
                        </p>
                        <div class="loader" v-if="submitStatus === 'DELETING'"></div>
                    </tr>
                </table>
            </div>
        </div>
            
    </div>
</template>




<script>
import UsersService from '../services/UsersService'
import { checkTokensAndRefrsh } from '../sharedMethods/sharedMethods'
import { async, all } from 'q'
import DatePicker from 'vue2-datepicker'
import { registerModal, showModal, hideModal, getModalFromThis }  from '../sharedMethods/sharedModalMethods'
const md5 = require('js-md5')

export default {
    'name': 'AdmiPageList',
    comments: { DatePicker },
    data() {
        return{
            users: [],
            currentlyEditingUser: undefined,
            currentlyEditingLesson: {date: Date.now(), state: 'visited'},
            currentlyEditingHomeTask: {date: Date.now(), state: 'done', description: '_'},
            fullName: '',
            email: '',
            school: '',
            schoolClass: '',
            phoneNumber: '',
            description: '',
            role: '',
            isModalDisplaying: false,
            newDay: Date.now(),
            newState: 'visited',
            newDescription: '',
            submitStatus: 'OK'
        }

    },
    methods: {
        getUsers: async function() {
            this.submitStatus='PENDING'
            await checkTokensAndRefrsh(sessionStorage, this.$router)
            
            try{
                const response = await UsersService.getUsers(sessionStorage.getItem('token'))
                this.users = response.data.users
            }
            catch(e) {
                alert(e)
                if (e.response.status == 403) {
                    alert('Hey, you are not admin, watcha doin\' here?')
                    sessionStorage.clear()
                    this.$router.push({name: 'Login'})
                }
                else {
                    sessionStorage.clear()
                    this.$router.push({name: 'Login'})
                }
            }
            finally {
                this.submitStatus = 'OK'
            }
        },
        deleteButtonClicked: async function(targetEmail) {
            this.submitStatus='DELETING'
            await checkTokensAndRefrsh(sessionStorage, this.$router)

            try {
                await UsersService.deleteUser(sessionStorage.getItem('token'), targetEmail)
                
                await this.getUsers()   // refreshing page after user delition
            }
            catch(e) {
                if (e.response.status == 404) {
                    location.reload(true)
                }
                else{
                    alert(e)
                    //this.$router.push({name:'Login'})
                }
            }
        },
        modifyUser: async function(){
            await checkTokensAndRefrsh(sessionStorage, this.$router)
            this.submitStatus = 'PENDING'
            try {
                const response = await UsersService.putUser(sessionStorage.getItem('token'), this.email, this.fullName, this.school, 
                    this.schoolClass, this.phoneNumber, this.description, this.currentlyEditingUser.lessons, this.currentlyEditingUser.homeTasks,
                    this.role)
            }
            catch(e) {

            }
            finally {
                this.submitStatus = 'OK'
            }
        },
        editUserButtonClicked:  function(user) {
            this.isModalDisplaying = true

            this.fullName = user.fullName
            this.email = user.email
            this.school = user.school
            this.schoolClass = user.class
            this.phoneNumber = user.phoneNumber
            this.description = user.description
            this.role = user.role

            this.currentlyEditingUser = user
        },
        saveButtonClicked: async function() {
            await checkTokensAndRefrsh(sessionStorage, this.$router)

            await this.modifyUser()
            await this.getUsers()

            this.isModalDisplaying = false
        },
        cancelEditButtonClicked: async function() {
            this.isModalDisplaying = false
            await this.getUsers()
        },
        addLesson: function() {
            showModal('addLessonModal')
        },
        addHomeTask: function() {
            showModal('addHomeTaskModal')
        },
        editLesson: function(targetLesson) {
            this.currentlyEditingLesson = targetLesson
            showModal('editLessonModal')
        },
        editHomeTask: function(targetHomeTask) {
            this.currentlyEditingHomeTask = targetHomeTask
            showModal('editHomeTaskModal')
        },
        saveLesson: function(date, state) {
            this.currentlyEditingUser.lessons.push({date: date.toString(), state: state, id: md5(Date.now().toString())})
        },
        saveEditedLesson: function(id, lesson) {
            const index = this.findIndex(this.currentlyEditingUser.lessons, id)
            this.currentlyEditingUser.lessons[index] = lesson
        },
        saveHomeTask: function(date, state, description) {
            this.currentlyEditingUser.homeTasks.push({date: date.toString(), state: state, description: description, id: md5(Date.now().toString())})
        },
        saveEditedHomeTask: function(id, homeTask) {
            const index = this.findIndex(this.currentlyEditingUser.homeTasks, id)
            this.currentlyEditingUser.homeTasks[index] = homeTask
        },
        findIndex: function(arr, targetID) {
            let i
            for (i = 0; i < arr.length; i++) {
                if (arr[i].id === targetID) {
                    return i
                }
            }
            return -1
        },
        closeMeModal: function(modalNme) {
            hideModal(modalNme)
        }
    }, 

    async beforeMount() {
        registerModal(getModalFromThis(this))
        try {
            await this.getUsers()
        }
        catch(e) {
            this.$router.push({name: 'Login'})
        }
    }
}
</script>

<style>
    @import '../styles/loader.css';
    @import '../styles/defaultPageStyle.css';
</style>