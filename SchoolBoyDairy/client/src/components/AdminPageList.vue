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
                <input type="datetime-local" v-model="newLessonDay" id="newLessonDayPicker">
                <label> Select State </label>
                <select required="true" id='newLessonStateSelector'>
                    <option value="visited">visited (and paid)</option>
                    <option value="missed">missed</option>
                    <option value="unpaid">unpaid (but visited)</option>
                </select>
                <button type="button" v-on:click="saveLesson(newLessonDay, getNewLessonState() )">Save</button>
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
                    <button type="button" v-on:click="addLesson">Add lesson</button>
                    <tr>
                        <td> Date </td>
                        <td> State </td>
                    </tr>
                    <tr v-for="lesson in currentlyEditingUser.lessons">
                        <td> {{lesson.date}} </td>
                        <td> {{lesson.state}} </td>
                    </tr>
                </table>

                <hr>
                <table>
                    <tr>
                        <td> Date </td>
                        <td> Task </td>
                        <td> State </td>
                    </tr>
                    <tr v-for="task in currentlyEditingUser.homeTasks">
                        <td> {{task.date}} </td>
                        <td> {{task.task}} </td>
                        <td> {{task.state}} </td>
                    </tr>
                </table>
                <p>
                    <label>Role</label>
                    <br>
                    <input type="radio" name="role" value="admin" id="radioAdmin">Admin
                    <br>
                    <input type="radio" name="role" value="user" id="radioUser">User
                </p>

                
                <hr>
                <button type="button"  v-on:click="cancelEditButtonClicked">Cancel</button>
                <button type="button" v-on:click="saveButtonClicked">Save</button>
                
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
                            <button type="submit" v-on:click="deleteButtonClicked(user.email)"> Delete </button>
                            <button type="submit" v-on:click="editUserButtonClicked(user)"> Edit this </button>
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


export default {
    'name': 'AdmiPageList',
    comments: { DatePicker },
    data() {
        return{
            users: [],
            currentlyEditingUser: undefined,
            fullName: '',
            email: '',
            school: '',
            schoolClass: '',
            phoneNumber: '',
            description: '',
            role: '',
            isModalDisplaying: false,
            newLessonDay: new Date(2000, 12, 31, 12, 0, 0),
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
            this.role = this.getRole()
            this.submitStatus = 'PENDING'
            try {
                const response = await UsersService.putUser(sessionStorage.getItem('token'), this.email, this.fullName, this.school, 
                    this.schoolClass, this.phoneNumber, this.description, this.currentlyEditingUser.lessons, this.role)
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
        setRole: function() {
            if (this.role === 'admin' ) {
                document.getElementById('radioAdmin').checked = true
            }
            else {
                document.getElementById('radioUser').checked = true
            }
        },
        getRole: function() {
            if (document.getElementById('radioAdmin').checked) {
                return 'admin'
            }
            else {
                return 'user'
            }
        },
        addLesson: function() {
            showModal('addLessonModal')
        },
        getNewLessonState: function() {
            const e = document.getElementById('newLessonStateSelector')
            return e.options[e.selectedIndex].value
        },
        saveLesson: function(date, state) {
            this.currentlyEditingUser.lessons.push({date: date, state: state})
        },
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